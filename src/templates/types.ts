import type { DocumentProps } from "@react-pdf/renderer" with { "resolution-mode": "import" };
import { BigNumberValue } from "@medusajs/framework/types";
import { JSONContent } from "@tiptap/react";

export type TemplateOrderPropAddress = {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address_1?: string;
  city?: string;
};

export type TemplateOrderPropItem = {
  id: string;
  title: string;
  variant_sku?: string | null;
  unit_price: number;
  quantity: number;
  total: BigNumberValue | number;
};

export type TemplateOrderProp = {
  id: string;
  display_id?: number;
  currency_code: string;
  shipping_address?: TemplateOrderPropAddress | null;
  billing_address?: TemplateOrderPropAddress | null;
  items?: TemplateOrderPropItem[];
  created_at: Date | string;
  total: BigNumberValue | number;
  subtotal: BigNumberValue | number;
  tax_total: BigNumberValue | number;
  discount_total: BigNumberValue | number;
  shipping_total: BigNumberValue | number;
};

export type TemplateSettingsForTemplate = {
  template_id: "clean" | "classic" | "compact";
  template_version: string;
  header_logo: {
    url: string | null;
    text: string | null;
    type: "none" | "text" | "image";
  };
  header_content: JSONContent | null;
  footer_content: JSONContent | null;
  store_name: string | null;
  store_address: string | null;
  store_tax_id: string | null;
  bank_account_iban: string | null;
  bank_account_swift: string | null;
};

export type TemplateProps = {
  order: TemplateOrderProp;
  settings: TemplateSettingsForTemplate;
  invoice: {
    id: string;
    created_at: Date | string;
    display_number?: number;
  };
};

export type InvoiceDocumentElement = React.ReactElement<DocumentProps>;

export type TemplateRenderer = (props: TemplateProps) => Promise<InvoiceDocumentElement>;

export type InvoiceTemplate = {
  id: "clean" | "classic" | "compact";
  version: string;
  render: TemplateRenderer;
};
