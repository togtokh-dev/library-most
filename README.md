# MOST

MOST Money QR payment gateway client for Node.js & TypeScript — create QR invoices and check payment status against the Mongolian MOST Money merchant API.

## Install

```bash
npm i @togtokh.dev/most
```

## Features

- **Configure once** — `init(host, config)` sets the API base URL, API key, merchant (payee) code, POS number, response language and logging for all subsequent calls.
- **Built-in environments** — `STAGING` and `PROD` hosts are predefined; a custom base URL is also accepted.
- **QR invoice create** — generate a MOST Money EMV QR code and Happy Wallet deeplink for a transaction.
- **Payment status check** — query the status of one or many QR codes (payment id, transaction details, loyalty and bank info).
- **QR cancel** — cancel one or many previously created QR codes.
- **Helpers** — `parseErr` for normalizing errors into a message string and `logAxios` for optional request/response logging.
- Fully typed, with every response following one consistent `{ success, message, data? }` envelope.

## Quick start

```ts
import MOST from "@togtokh.dev/most";

// 1. Configure (host is the first argument: "STAGING" | "PROD" | custom URL)
MOST.init("STAGING", {
  apiKey: "YOUR_API_KEY",
  payeeCode: "ME_000000",
  posNo: "1",
  lang: "MN",
  logger: false,
});

async function run() {
  // 2. Create a QR invoice
  const created = await MOST.invoice.CREATE({
    tranAmnt: 5000,
    tranDesc: "Order #1234",
    invoiceId: "ORDER_1234",
    tranCur: "MNT", // optional, default "MNT"
    paidLimit: 1, // optional, default 1
  });

  if (!created.success || !created.data) {
    console.error(created.message);
    return;
  }

  console.log("QR code:", created.data.qrCode); // raw EMV text
  console.log("Deeplink:", created.data.qrLink); // Happy Wallet URL

  // 3. Check payment status (accepts a single qrCode or an array)
  const checked = await MOST.invoice.CHECK(created.data.qrCode);
  const item = checked.data?.[0];

  if (item?.responseCode === 0) {
    console.log("Paid, paymentId:", item.paymentId);
  } else {
    console.log("Status:", item?.responseDesc);
  }
}

run();
```

## API

The default export bundles `init` and `invoice`. The named exports `init`, `invoice`, `config`, `parseErr`, `logAxios` and `host` are also available individually.

```ts
import MOST, { init, invoice, config, parseErr, logAxios, host } from "@togtokh.dev/most";
```

### `init(hostValue, body)`

```ts
init(
  hostValue: "STAGING" | "PROD" | string,
  body: {
    apiKey: string;      // MOST-issued API key
    payeeCode: string;   // merchant code, e.g. "ME_402695"
    posNo?: string;      // POS number, e.g. "1"
    lang?: "MN" | "EN" | "ZH"; // response language
    logger?: boolean;    // enable request/response logging
  }
): void;
```

Configures the client. `hostValue` is the first argument and may be the string `"STAGING"`, `"PROD"`, or a custom base URL. The settings are stored on the shared `config` object.

### `config`

The mutable shared configuration object, populated by `init`.

```ts
config: {
  apiKey: string;              // MOST-issued API key
  payeeCode: string;           // merchant code, e.g. "ME_402695"
  posNo: string;               // POS number, e.g. "1"
  host: string;                // API base URL
  lang: "MN" | "EN" | "ZH";    // response language
  logger: boolean;
};
```

### `host`

Predefined API base URLs.

```ts
host: {
  STAGING: "http://202.21.105.150:40652/resources/merch/v1.0";
  PROD: "https://j2me.mostmoney.mn:9092/resources/merch/v1.0";
};
```

### `invoice.CREATE(body)`

Creates a QR invoice.

```ts
invoice.CREATE(body: {
  tranAmnt: number;    // transaction amount
  tranDesc: string;    // transaction description
  invoiceId: string;   // merchant internal invoice id
  tranCur?: string;    // currency code, default "MNT"
  paidLimit?: number;  // how many times the QR may be paid, default 1
}): Promise<{
  success: boolean;
  message: string;
  data?: {
    qrCode: string;              // generated EMV QR code (raw text)
    qrLink: string;              // Happy Wallet deeplink URL
    qpayAccountId: string | null;
    qpayQrCode: string | null;
    shortUrl: string | null;
    responseCode: number;        // 0 = success
    responseDesc: string;
  };
}>;
```

### `invoice.CHECK(qrCodes)`

Checks the payment status of one QR code or an array of QR codes.

```ts
invoice.CHECK(qrCodes: string | string[]): Promise<{
  success: boolean;
  message: string;
  data?: {
    qrCode: string;
    paymentId: string | null;
    tranId: string | null;
    tranDate: string | null;
    tranAmnt: number | null;
    invoiceId: string | null;
    wallet: string | null;
    loyaltyType: string | null;
    loyaltyAmt: number | null;
    custTkn: string | null;
    loyaltyAcntCode: string | null;
    bankCode: string | null;
    bankTxnId: string | null;
    responseCode: number;        // 0 = paid
    responseDesc: string;
  }[];
}>;
```

### `invoice.CANCEL(qrCodes)`

Cancels one QR code or an array of QR codes.

```ts
invoice.CANCEL(qrCodes: string | string[]): Promise<{
  success: boolean;
  message: string;
  data?: {
    qrCode: string;
    responseCode: number;        // 0 = successfully cancelled
    responseDesc: string;
  }[];
}>;
```

### `parseErr(error)`

```ts
parseErr(error: unknown): string;
```

Normalizes any thrown value into a human-readable message string.

### `logAxios(enabled, name)`

```ts
logAxios(enabled: boolean, name: string): (data: AxiosMasterLoggerType) => void;
```

Returns a logger function (from `axios-master`) used internally for request/response logging when `enabled` is true.

## Response

Every `invoice` method resolves to the same envelope:

```ts
Promise<{
  success: boolean;   // whether the request succeeded
  message: string;    // error message, or "success"
  data?: ...;         // method-specific payload (see each method above)
}>;
```

Within `data`, a `responseCode` of `0` indicates success; any other value is an error described by `responseDesc`.

## License

ISC
