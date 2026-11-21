import CleanTemplate from "./styles/CleanTemplate";
import ClassicTemplate from "./styles/ClassicTemplate";
import CompactTemplate from "./styles/CompactTemplate";
import { InvoiceTemplate } from "./types";

export const templates: Record<"clean" | "classic" | "compact", InvoiceTemplate> = {
  clean: {
    id: "clean",
    version: "1.0.0",
    render: async (props) => (await CleanTemplate)(props),
  },
  classic: {
    id: "classic",
    version: "1.0.0",
    render: async (props) => (await ClassicTemplate)(props),
  },
  compact: {
    id: "compact",
    version: "1.0.0",
    render: async (props) => (await CompactTemplate)(props),
  },
};

export function getTemplate(id: "clean" | "classic" | "compact"): InvoiceTemplate {
  const template = templates[id];

  if (!template) {
    console.log(`Template with id ${id} not found`);
  }

  return template;
}
