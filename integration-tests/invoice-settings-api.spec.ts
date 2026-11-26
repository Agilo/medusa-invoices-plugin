import { Modules } from "@medusajs/framework/utils";
import { generateJwtTokenForAuthIdentity } from "@medusajs/medusa/api/auth/utils/generate-jwt-token";
import { medusaIntegrationTestRunner } from "@medusajs/test-utils";
import InvoiceModuleService from "../src/modules/invoice/service";
import { INVOICE_MODULE } from "../src/modules/invoice";
import { InvoiceSettingsHeaderLogoType, InvoiceTemplateId } from "../src/constants/invoice";

medusaIntegrationTestRunner({
  testSuite: ({ api, getContainer }) => {
    describe("Invoice settings endpoints", () => {
      const headers: Record<string, string> = {};

      beforeEach(async () => {
        const container = getContainer();
        const userModuleService = container.resolve("user");
        const authModuleService = container.resolve("auth");
        const storeModuleService = container.resolve("store");
        const invoiceModuleService: InvoiceModuleService = container.resolve(INVOICE_MODULE);
        const link = container.resolve("link");

        const user = await userModuleService.createUsers({
          email: "admin@example.com",
        });

        const authIdentity = await authModuleService.createAuthIdentities({
          provider_identities: [
            {
              provider: "emailpass",
              entity_id: "admin@example.com",
              provider_metadata: {
                password: "supersecret",
              },
            },
          ],
          app_metadata: {
            user_id: user.id,
          },
        });

        const token = await generateJwtTokenForAuthIdentity(
          {
            authIdentity,
            actorType: "user",
            authProvider: "emailpass",
          },
          {
            secret: "supersecret",
            expiresIn: "1d",
          },
        );

        headers["authorization"] = `Bearer ${token}`;

        let store;

        const [retrievedStore] = await storeModuleService.listStores();
        store = retrievedStore;

        if (!store) {
          const [createdStore] = await storeModuleService.createStores([
            {
              name: "Test Store",
              supported_currencies: [{ currency_code: "eur", is_default: true }],
            },
          ]);

          store = createdStore;
        }

        const invoiceSettings = await invoiceModuleService.createInvoiceSettings({
          template_id: InvoiceTemplateId.CLEAN,
          template_version: "1.0.0",
          header_logo_type: InvoiceSettingsHeaderLogoType.NONE,
          header_logo_text: null,
          header_logo_url: null,
          header_content: null,
          footer_content: null,
          store_name: null,
          store_address: null,
          store_tax_id: null,
          bank_account_iban: null,
          bank_account_swift: null,
          auto_generate_on: [],
        });

        await link.create({
          [Modules.STORE]: {
            store_id: store.id,
          },
          invoice: {
            invoice_settings_id: invoiceSettings.id,
          },
        });
      });

      describe("GET /admin/invoice-settings", () => {
        it("returns invoice settings", async () => {
          const response = await api.get(`/admin/invoice-settings`, {
            headers: {
              Authorization: headers["authorization"],
              "Content-Type": "application/json",
            },
          });

          expect(response.status).toEqual(200);
          expect(response.data).toHaveProperty("settings");
          expect(response.data).toHaveProperty("templates");
          expect(response.data).toHaveProperty("availableTriggers");
          expect(response.data.settings).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              template_id: "clean",
              template_version: "1.0.0",
              header_logo_type: "none",
              header_logo_text: null,
              header_logo_url: null,
              header_content: null,
              footer_content: null,
              store_name: null,
              store_address: null,
              store_tax_id: null,
              bank_account_iban: null,
              bank_account_swift: null,
              auto_generate_on: [],
            }),
          );
          expect(response.data.templates).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: "clean",
                label: "Clean",
                version: "1.0.0",
              }),
              expect.objectContaining({
                id: "classic",
                label: "Classic",
                version: "1.0.0",
              }),
              expect.objectContaining({
                id: "compact",
                label: "Compact",
                version: "1.0.0",
              }),
            ]),
          );
          expect(response.data.availableTriggers).toBeInstanceOf(Array);

          const allowedTriggers = [
            "order.completed",
            "order.fulfillment_created",
            "payment.captured",
          ];

          response.data.availableTriggers.forEach((trigger: string) => {
            expect(allowedTriggers).toContain(trigger);
          });
        });
      });

      describe("POST /admin/invoice-settings", () => {
        it("upserts invoice settings", async () => {
          const payload = {
            template_id: "clean",
            template_version: "1.0.0",
            header_logo_type: "text",
            header_logo_url: null,
            header_logo_text: "josip",
            header_content: null,
            footer_content: null,
            store_name: null,
            store_address: null,
            store_tax_id: null,
            bank_account_iban: null,
            bank_account_swift: null,
            auto_generate_on: [],
          };

          const response = await api.post(`/admin/invoice-settings`, payload, {
            headers: {
              Authorization: headers["authorization"],
              "Content-Type": "application/json",
            },
          });

          expect(response.status).toEqual(200);
          expect(response.data).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              template_id: "clean",
              template_version: "1.0.0",
              header_logo_type: "text",
              header_logo_url: null,
              header_logo_text: "josip",
              header_content: null,
              footer_content: null,
              store_name: null,
              store_address: null,
              store_tax_id: null,
              bank_account_iban: null,
              bank_account_swift: null,
              auto_generate_on: [],
              created_at: expect.any(String),
              updated_at: expect.any(String),
              deleted_at: null,
            }),
          );
        });

        it("accepts rich text header and footer content", async () => {
          const headerContent = {
            type: "doc",
            content: [{ type: "paragraph", content: [{ type: "text", text: "Header" }] }],
          };
          const footerContent = {
            type: "doc",
            content: [{ type: "paragraph", content: [{ type: "text", text: "Footer" }] }],
          };

          const payload = {
            template_id: "clean",
            template_version: "1.0.0",
            header_logo_type: "none",
            header_logo_url: null,
            header_logo_text: null,
            header_content: headerContent,
            footer_content: footerContent,
            store_name: null,
            store_address: null,
            store_tax_id: null,
            bank_account_iban: null,
            bank_account_swift: null,
            auto_generate_on: [],
          };

          const response = await api.post(`/admin/invoice-settings`, payload, {
            headers: {
              Authorization: headers["authorization"],
              "Content-Type": "application/json",
            },
          });

          expect(response.status).toEqual(200);
          expect(response.data).toEqual(
            expect.objectContaining({
              header_content: JSON.stringify(headerContent),
              footer_content: JSON.stringify(footerContent),
            }),
          );
        });
      });
    });
  },
});

jest.setTimeout(60 * 1000);
