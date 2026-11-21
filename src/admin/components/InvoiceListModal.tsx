import {
  Badge,
  createDataTableColumnHelper,
  createDataTableFilterHelper,
  DataTable,
  DataTableFilteringState,
  DataTablePaginationState,
  FocusModal,
  IconButton,
  Text,
  useDataTable,
} from "@medusajs/ui";
import React from "react";
import { InvoiceCreatedByEvent, InvoiceStatus } from "../../constants/invoice";
import { Link } from "@medusajs/icons";
import { useOrderInvoices, UseOrderInvoicesParams } from "../hooks/invoices";
import { GetInvoicesResponseInvoice } from "../../types/invoice";

const formatStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const formatCreatedByEvent = (event: string): string => {
  const eventMap: Record<string, string> = {
    [InvoiceCreatedByEvent.ORDER_COMPLETED]: "Order completed",
    [InvoiceCreatedByEvent.FULFILLMENT_CREATED]: "Fulfillment created",
    [InvoiceCreatedByEvent.PAYMENT_CAPTURED]: "Payment captured",
    [InvoiceCreatedByEvent.MANUAL]: "Manual",
  };

  return eventMap[event] || event;
};

const columnHelper = createDataTableColumnHelper<GetInvoicesResponseInvoice>();
const filterHelper = createDataTableFilterHelper<GetInvoicesResponseInvoice>();

const columns = [
  columnHelper.accessor("created_by_event", {
    header: "Created by event",
    enableSorting: true,
    cell: ({ getValue }) => formatCreatedByEvent(getValue()),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue();
      let badgeColor: "grey" | "green" | "red" | "blue" | "orange" | "purple" | undefined;

      if (status === InvoiceStatus.COMPLETED) {
        badgeColor = "green";
      } else if (status === InvoiceStatus.FAILED) {
        badgeColor = "red";
      } else if (status === InvoiceStatus.GENERATING) {
        badgeColor = "blue";
      }

      return (
        <Badge color={badgeColor} size="xsmall">
          {formatStatus(status)}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("template_version", {
    header: "Template version",
  }),
  columnHelper.accessor("created_at", {
    header: "Generated at",
    cell: ({ row }) => {
      const { created_at, completed_at } = row.original;

      const raw = completed_at ?? created_at;
      if (!raw) {
        return "-";
      }

      const date = new Date(raw);
      return date.toLocaleString();
    },
  }),
  columnHelper.accessor("pdf_url", {
    header: "PDF link",
    cell: ({ getValue }) => {
      const pdfUrl = getValue();

      if (!pdfUrl) {
        return "-";
      }

      return (
        <a href={pdfUrl}>
          <IconButton size="small" variant="transparent">
            <Link />
          </IconButton>
        </a>
      );
    },
  }),
  columnHelper.accessor("error_message", {
    header: "Error",
    cell: ({ getValue }) => {
      const error = getValue();
      return error ? error : "-";
    },
  }),
];

const filters = [
  filterHelper.accessor("created_by_event", {
    type: "select",
    label: "Created by event",
    options: [
      {
        label: "Order completed",
        value: InvoiceCreatedByEvent.ORDER_COMPLETED,
      },
      {
        label: "Fulfillment created",
        value: InvoiceCreatedByEvent.FULFILLMENT_CREATED,
      },
      {
        label: "Payment captured",
        value: InvoiceCreatedByEvent.PAYMENT_CAPTURED,
      },
      {
        label: "Manual",
        value: InvoiceCreatedByEvent.MANUAL,
      },
    ],
  }),
  filterHelper.accessor("status", {
    type: "select",
    label: "Status",
    options: [
      { label: "Completed", value: InvoiceStatus.COMPLETED },
      { label: "Failed", value: InvoiceStatus.FAILED },
      { label: "Generating", value: InvoiceStatus.GENERATING },
    ],
  }),
  filterHelper.accessor("template_version", {
    type: "select",
    label: "Template version",
    options: [{ label: "1.0.0", value: "1.0.0" }],
  }),
];

type InvoiceListModalProps = {
  orderId: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const PAGE_SIZE = 20;

const InvoiceListModal = ({ orderId, isOpen, setIsOpen }: InvoiceListModalProps) => {
  const [pagination, setPagination] = React.useState<DataTablePaginationState>({
    pageSize: PAGE_SIZE,
    pageIndex: 0,
  });
  const [filtering, setFiltering] = React.useState<DataTableFilteringState>({});

  const params: UseOrderInvoicesParams = {
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    filters: {
      status: Array.isArray(filtering.status) ? filtering.status : undefined,
      created_by_event: Array.isArray(filtering.created_by_event)
        ? filtering.created_by_event
        : undefined,
      template_version: Array.isArray(filtering.template_version)
        ? filtering.template_version
        : undefined,
    },
  };

  const { data, isLoading, refetch } = useOrderInvoices(orderId, params, {
    placeholderData: (previousData) => previousData,
  });

  const table = useDataTable({
    data: data?.invoices || [],
    columns,
    rowCount: data?.count || 0,
    getRowId: (invoice) => invoice.id,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
    isLoading,
    filtering: {
      state: filtering,
      onFilteringChange: setFiltering,
    },
    filters,
  });

  React.useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  return (
    <FocusModal open={isOpen} onOpenChange={setIsOpen}>
      <FocusModal.Content>
        <FocusModal.Header className="h-[50px]">
          <FocusModal.Title>Invoices</FocusModal.Title>
        </FocusModal.Header>
        <FocusModal.Body className="flex flex-col h-full overflow-hidden">
          <DataTable instance={table} className="flex flex-col h-full">
            <DataTable.Toolbar className="shrink-0 p-0 m-0"></DataTable.Toolbar>

            {data?.invoices && data.invoices.length > 0 ? (
              <>
                <div className="flex-1 overflow-y-auto min-h-0">
                  <DataTable.Table />
                </div>

                <div className="shrink-0">
                  <DataTable.Pagination />
                </div>
              </>
            ) : (
              <Text className="text-ui-fg-subtle text-center mt-4" size="small">
                There are no invoices for the selected filters
              </Text>
            )}
          </DataTable>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};

export default InvoiceListModal;
