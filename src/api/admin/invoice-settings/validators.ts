import { z } from "zod";
import {
  InvoiceSettingsAutoGenerateTrigger,
  InvoiceSettingsHeaderLogoType,
  InvoiceTemplateId,
} from "../../../constants/invoice";

const invoiceTemplateIdSchema = z.nativeEnum(InvoiceTemplateId);
const invoiceSettingsHeaderLogoTypeSchema = z.nativeEnum(InvoiceSettingsHeaderLogoType);
const invoiceAutoGenerateTriggerSchema = z.nativeEnum(InvoiceSettingsAutoGenerateTrigger);

export const createInvoiceSettingsSchema = z.object({
  template_id: invoiceTemplateIdSchema,
  template_version: z.string(),
  header_logo_type: invoiceSettingsHeaderLogoTypeSchema,
  header_logo_url: z.string().nullable(),
  header_logo_text: z.string().nullable(),
  header_content: z.record(z.string(), z.any()).nullable(),
  footer_content: z.record(z.string(), z.any()).nullable(),
  store_name: z.string().nullable(),
  store_address: z.string().nullable(),
  store_tax_id: z.string().nullable(),
  bank_account_iban: z.string().nullable(),
  bank_account_swift: z.string().nullable(),
  auto_generate_on: z.array(invoiceAutoGenerateTriggerSchema).default([]),
});

export type CreateInvoiceInvoiceSettingsRequestBody = z.infer<typeof createInvoiceSettingsSchema>;
