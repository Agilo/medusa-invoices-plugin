import type { InvoiceDocumentElement, TemplateProps } from "../templates/types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getTemplate } from "../templates/registry";

export const useTemplateComponent = (
  templateId: "clean" | "classic" | "compact",
  props: TemplateProps,
): UseQueryResult<InvoiceDocumentElement, Error> => {
  return useQuery<InvoiceDocumentElement, Error>({
    queryKey: ["invoices-plugin-template-component", templateId, JSON.stringify(props)],
    queryFn: async () => {
      const template = getTemplate(templateId);

      return template.render(props);
    },
  });
};
