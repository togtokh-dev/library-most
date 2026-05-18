import { AxiosMasterLoggerType } from "axios-master";
import invoice from "./invoice";

export function parseErr(error: unknown): string {
  if (typeof error === "string" && error.trim()) return error;

  if (typeof error === "object" && error !== null) {
    const err = error as any;

    if (typeof err.response === "object" && err.response !== null) {
      const data = err.response.data;
      if (typeof data === "string" && data.trim()) return data;
      if (typeof data === "object" && data !== null) {
        return (
          data.responseDesc ||
          data.message ||
          data.error ||
          JSON.stringify(data)
        );
      }
      return `HTTP ${err.response.status ?? "error"}`;
    }

    if (err.code === "ECONNABORTED") return "Request timed out";
    if (err.code === "ERR_NETWORK" || err.message === "Network Error")
      return "Network error";

    if (typeof err.message === "string" && err.message.trim())
      return err.message;
  }

  return "Unexpected error";
}

export const logAxios =
  (enabled: boolean, name: string) => (data: AxiosMasterLoggerType) => {
    if (!enabled) return;
    console.log(
      `[${name}]`,
      JSON.stringify(
        {
          time: data?.json?.time,
          request: data?.json?.request,
          response: `${data?.json?.response ?? ""}`,
          responseBody: data?.json?.responseBody,
          statusCode: data?.json?.statusCode
        },
        null,
        2
      )
    );
  };

export const host: {
  STAGING: "http://202.21.105.150:40652/resources/merch/v1.0";
  PROD: "https://qrservice.mostmoney.mn/resources/merch/v1.0";
} = {
  STAGING: "http://202.21.105.150:40652/resources/merch/v1.0",
  PROD: "https://qrservice.mostmoney.mn/resources/merch/v1.0"
};

export const config: {
  /** MOST-оос олгосон APIKEY */
  apiKey: string;
  /** Мерчантын код, жишээ: "ME_402695" */
  payeeCode: string;
  /** POS дугаар, жишээ: "1" */
  posNo: string;
  /** API-н үндсэн хаяг */
  host: string;
  /** Хариуны хэл: "MN" | "EN" | "ZH" */
  lang: "MN" | "EN" | "ZH";
  logger: boolean;
} = {
  apiKey: "",
  payeeCode: "",
  posNo: "1",
  host: host.STAGING,
  lang: "MN",
  logger: true
};

/** MOST QR систем тохируулах — host тусдаа эхний параметр */
export const init = (
  /** "STAGING" | "PROD" эсвэл custom URL */
  hostValue: "STAGING" | "PROD" | string,
  body: {
    apiKey: string;
    payeeCode: string;
    posNo?: string;
    lang?: "MN" | "EN" | "ZH";
    logger?: boolean;
  }
): void => {
  config.host =
    hostValue === "STAGING" || hostValue === "PROD"
      ? host[hostValue]
      : hostValue;
  config.apiKey = body.apiKey;
  config.payeeCode = body.payeeCode;
  if (body.posNo) config.posNo = body.posNo;
  if (body.lang) config.lang = body.lang;
  if (body.logger !== undefined) config.logger = body.logger;
};

export default { init, invoice };
export { default as invoice } from "./invoice";
