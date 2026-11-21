<p align="center">
  <a href="https://www.medusajs.com">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
  </a>
</p>
<h1 align="center">
  Medusa Invoices Plugin
</h1>

<p align="center">
  Professional invoice generation for MedusaJS with customizable templates and automatic PDF creation.
</p>
<br />
<br />

## Compatibility

This version targets Medusa 2.23 and its React 19 Admin.
<br />
<br />

## Description

A comprehensive invoice generation plugin for MedusaJS that automatically generates PDF invoices for orders with customizable templates.
<br />
<br />

## Features

- 🧾 Automatic invoice generation on selected triggers (e.g. Order completed)
- 📄 PDF generation with customizable templates
- 🎨 Template management with versioning
- 📁 Integration with MedusaJS File Module
- 🔧 Admin UI for configuration and manual generation
- 🔔 Event-based architecture
- 📊 Invoice status tracking
  <br />

## Installation

### Prerequisites

- MedusaJS server
- Configured File Module (S3, local, or other provider)
- Node.js 22.22.0+

Visit the [Quickstart Guide](https://docs.medusajs.com/learn/installation) to set up a server.
<br />
Visit the [Plugins documentation](https://docs.medusajs.com/learn/fundamentals/plugins) to learn more about plugins.
<br />
Visit the [Docs](https://docs.medusajs.com/learn/installation#get-started) to learn more about medusa system requirements.
<br />
<br />

### Install the plugin

```bash
npm install @agilo/medusa-invoices-plugin
```

or with yarn:

```bash
yarn add @agilo/medusa-invoices-plugin
```

<br />

### Add to medusa-config.ts

```typescript
import { defineConfig } from "@medusajs/framework";

export default defineConfig({
  projectConfig: {
    // ... other config
  },
  plugins: [
    {
      resolve: "@agilo/medusa-invoices-plugin",
      options: {
        // Additional options can be configured here
      },
    },
  ],
});
```

<br />
<br />

## Configuration

### 1. Configure File Module

The plugin requires a configured File Module to store generated PDF invoices. If not already configured, add one of the following to your `medusa-config.ts`:

#### Example: Local File Storage

```typescript
// medusa-config.ts
import { defineConfig } from "@medusajs/framework";

export default defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-local",
            id: "local",
            options: {
              // provider options...
            },
          },
        ],
      },
    },
  ],
});
```

<br />

#### Example: AWS S3 Storage

```typescript
// medusa-config.ts
import { defineConfig } from "@medusajs/framework";

export default defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              file_url: process.env.S3_FILE_URL,
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              region: process.env.S3_REGION,
              bucket: process.env.S3_BUCKET,
              endpoint: process.env.S3_ENDPOINT,
              // other options...
            },
          },
        ],
      },
    },
  ],
});
```

Visit the [File Module documentation](https://docs.medusajs.com/resources/infrastructure-modules/file) to learn more about file module.
<br />
<br />

### 2. Run Database Migrations

After installing the plugin, run migrations to create necessary database tables:

```bash
npx medusa db:migrate
```

or with yarn:

```bash
yarn medusa db:migrate
```

<br />

This will create tables for:

- Invoice settings
- Invoice records
- Store and invoice settings link
- Order and invoice link
  <br />
  <br />

### 3. Configure Invoice Settings

Access the Admin UI at `/app/settings/invoices` to:

- Set up default invoice template
- Configure company information
- Select auto-generation triggers

<br />
<br />

## API Documentation

### Admin Endpoints

All admin endpoints require authentication with admin privileges.
<br />
<br />

#### Get Invoice Settings

```http
GET /admin/invoice-settings
```

Response:

```json
{
  "settings": {
    "id": "invset_01",
    "template_id": "clean",
    "template_version": "1.0.0",
    "header_logo_type": "text",
    "header_logo_text": "Agilo",
    "header_logo_url": null,
    "header_content": {},
    "footer_content": {},
    "store_name": "Store1",
    "store_address": "Some Street 218",
    "store_tax_id": "1",
    "bank_account_iban": "12345678910",
    "bank_account_swift": "25",
    "auto_generate_on": [],
    "created_at": "2025-12-17T12:30:24.315Z",
    "updated_at": "2026-01-27T08:20:43.756Z",
    "deleted_at": null
  },
  "templates": [
    {
      "id": "clean",
      "label": "Clean",
      "version": "1.0.0"
    },
    {
      "id": "classic",
      "label": "Classic",
      "version": "1.0.0"
    },
    {
      "id": "compact",
      "label": "Compact",
      "version": "1.0.0"
    }
  ],
  "availableTriggers": ["order.completed", "order.fulfillment_created", "payment.captured"]
}
```

<br />

#### Update Invoice Settings

```http
POST /admin/invoice-settings
```

Body:

```typescript
{
  template_id: "clean",
  template_version: "1.0.0",
  header_logo_type: "text",
  header_logo_url: null,
  header_logo_text: "Agilo",
  header_content: {},
  footer_content: {},
  store_name: "Store2",
  store_address: "Some Street 118",
  store_tax_id: "2",
  bank_account_iban: "10987654321",
  bank_account_swift: "24",
  auto_generate_on: []
}
```

Response:

```json
{
  "id": "invset_01",
  "template_id": "clean",
  "template_version": "1.0.0",
  "header_logo_type": "text",
  "header_logo_text": "Agilo",
  "header_logo_url": null,
  "header_content": {},
  "footer_content": {},
  "store_name": "Store2",
  "store_address": "Some Street 118",
  "store_tax_id": "2",
  "bank_account_iban": "10987654321",
  "bank_account_swift": "24",
  "auto_generate_on": [],
  "created_at": "2025-12-17T12:30:24.315Z",
  "updated_at": "2026-01-27T08:20:43.756Z",
  "deleted_at": null,
  "store_id": "store_01"
}
```

<br />

#### Get Invoices by Order ID

```http
GET /admin/invoices/{order_id}
```

Response:

```json
{
  "invoices": [
    {
      "id": "inv_01",
      "status": "completed",
      "completed_at": "2026-01-26T10:27:31.450Z",
      "pdf_url": "http://inv_01.pdf",
      "template_id": "compact",
      "template_version": "1.0.0",
      "error_message": null,
      "order_display_id": 1,
      "created_by_event": "manual",
      "created_at": "2026-01-26T10:27:30.580Z"
    },
    {
      "id": "inv_02",
      "status": "completed",
      "completed_at": "2026-01-26T09:04:05.957Z",
      "pdf_url": "http://inv_02.pdf",
      "template_id": "compact",
      "template_version": "1.0.0",
      "error_message": null,
      "order_display_id": 2,
      "created_by_event": "manual",
      "created_at": "2026-01-26T09:04:05.620Z"
    }
  ],
  "count": 2,
  "offset": 0,
  "limit": 20
}
```

<br />

#### Get Invoice by Order ID

```http
GET /admin/invoices/{order_id}/recent
```

Response:

```json
{
  "status": "completed",
  "completed_at": "2026-01-26T13:43:15.758Z",
  "pdf_url": "http://inv_01.pdf",
  "template_id": "compact",
  "template_version": "1.0.0",
  "error_message": null,
  "order_display_id": 1,
  "created_by_event": "manual",
  "created_at": "2026-01-26T13:43:15.514Z"
}
```

<br />

#### Generate Invoice

```http
POST /admin/invoices/{order_id}/generate
```

Body:

```typescript
{
  created_by_event: "manual";
  template_id: "clean"; // Optional
}
```

Response:

```json
{
  "id": "inv_01",
  "order_id": "order_01",
  "order_display_id": 1,
  "status": "completed",
  "completed_at": "2026-01-27T09:32:12.233Z",
  "pdf_url": "http://inv_01.pdf",
  "template_id": "clean",
  "template_version": "1.0.0",
  "settings_snapshot": {
    "store_name": "Store1",
    "header_logo": {
      "url": null,
      "text": "Agilo",
      "type": "text"
    },
    "template_id": "clean",
    "store_tax_id": "1",
    "store_address": "Some Street 218",
    "footer_content": {},
    "header_content": {},
    "template_version": "1.0.0",
    "bank_account_iban": "12345678910",
    "bank_account_swift": "25"
  },
  "error_message": null,
  "created_by_event": "manual",
  "created_at": "2026-01-27T09:32:11.896Z",
  "updated_at": "2026-01-27T09:32:12.234Z",
  "deleted_at": null
}
```

<br />

### Store Endpoint

Customers can access and download their own invoice PDFs.
<br />
<br />

#### Get Customer Invoice PDF

```http
GET /store/invoices/{order_id}.pdf
```

Response:

- returns a PDF file stream

<br />

**Note:** Customers can only access invoices for their own orders. Authentication is required.
<br />
<br />

## Admin UI Guide

### Invoice Settings

#### Accessing Invoice Settings

Navigate to **Settings → Invoices** in the Medusa Admin dashboard.
<br />
<br />

#### Settings Page Features

The settings page allows you to:

1. **Select Active Template**
   - Choose which template to use for invoice generation
   - Preview templates before activating (with dummy or selected order data)

    ![Invoice Settings - Select Active Template](https://github.com/user-attachments/assets/1cc308c4-f904-444b-b118-1fba83f568ff)

2. **Input Company Information**
   - Configure store name, address, header, footer...
   - This information appears on all generated invoices

  ![Invoice Settings - Company Information](https://github.com/user-attachments/assets/239e5283-9086-44df-a0f4-af8be7270139)

3. **Select Active Auto Generation Triggers**
   - Choose the trigger on which the invoice is generated
   - Possible triggers: Order completed, Fulfillment created, Payment captured

### Invoice Widget

#### Accessing Invoice Widget

Navigate to **Orders → Select one order** in Medusa Admin dashboard.
<br />
<br />

#### Invoice Widget Features

The widget allows you to:

1. View latest invoice data
2. Manually generate invoice
3. View invoice status
   - Queued (waiting for invoice generation)
   - Generating (invoice is being generated)
   - Completed (invoice was successfully generated)
   - Failed (invoice generation was unsuccessful)

  ![Invoice Widget - Invoice Status](https://github.com/user-attachments/assets/4066e873-62f0-4ed3-af64-279252fe0013)

4. View invoice history
   - List of all invoices generated for that order
   - Possible to filter by particular attributes

  ![Invoice Widget - Invoice History](https://github.com/user-attachments/assets/5c6f87e4-ed8b-4fdc-a9f6-763131c7aa33)

## Events

The plugin emits events that you can subscribe to for custom workflows.
<br />
<br />

### invoice.generated

Emitted when an invoice is successfully generated.

**Payload (`event.data`):**

```typescript
{
  invoice_id: string,
  order_id: string,
  order_display_id: number,
  pdf_url: string,
  template_id: "clean" | "classic" | "compact",
  template_version: string,
  completed_at: Date | string
}
```

<br />

### invoice.failed

Emitted when invoice generation fails.

**Payload (`event.data`):**

```typescript
{
  order_id: string,
  error_message: string
}
```

<br />

### How to Subscribe to Events

Create a subscriber in your Medusa project:

```typescript
// src/subscribers/invoice.ts
import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework";

type InvoiceGeneratedPayload = {
  invoice_id: string;
  order_id: string;
  order_display_id: number;
  pdf_url: string;
  template_id: string;
  template_version: string;
  completed_at: string;
};

export default async function invoiceHandler({
  event,
  container,
}: SubscriberArgs<InvoiceGeneratedPayload>) {
  const { name, data } = event;
  console.log(`invoices: subscriber triggered for event ${name}`);

  // Your custom logic here
}

export const config: SubscriberConfig = {
  event: ["invoice.generated"],
};
```

<br />

## Contributing

We welcome contributions and feedback.
To get involved, [open an issue](https://github.com/Agilo/medusa-invoices-plugin/issues) or [submit a pull request](https://github.com/Agilo/medusa-invoices-plugin/pulls) on [GitHub →](https://github.com/Agilo/medusa-invoices-plugin)
