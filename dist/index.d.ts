import { AxiosMasterLoggerType } from "axios-master";
export declare function parseErr(error: unknown): string;
export declare const logAxios: (enabled: boolean, name: string) => (data: AxiosMasterLoggerType) => void;
export declare const host: {
    STAGING: "http://202.21.105.150:40652/resources/merch/v1.0";
    PROD: "https://qrservice.mostmoney.mn/resources/merch/v1.0";
};
export declare const config: {
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
};
/** MOST QR систем тохируулах — host тусдаа эхний параметр */
export declare const init: (
/** "STAGING" | "PROD" эсвэл custom URL */
hostValue: "STAGING" | "PROD" | string, body: {
    apiKey: string;
    payeeCode: string;
    posNo?: string;
    lang?: "MN" | "EN" | "ZH";
    logger?: boolean;
}) => void;
declare const _default: {
    init: (hostValue: "STAGING" | "PROD" | string, body: {
        apiKey: string;
        payeeCode: string;
        posNo?: string;
        lang?: "MN" | "EN" | "ZH";
        logger?: boolean;
    }) => void;
    invoice: {
        CREATE: (body: {
            tranAmnt: number;
            tranDesc: string;
            invoiceId: string;
            tranCur?: string;
            paidLimit?: number;
        }) => Promise<{
            success: boolean;
            message: string;
            data?: {
                qrCode: string;
                qrLink: string;
                qpayAccountId: string | null;
                qpayQrCode: string | null;
                shortUrl: string | null;
            } & {
                responseCode: number;
                responseDesc: string;
            };
        }>;
        CHECK: (qrCodes: string | string[]) => Promise<{
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
                responseCode: number;
                responseDesc: string;
            }[];
        }>;
        CANCEL: (qrCodes: string | string[]) => Promise<{
            success: boolean;
            message: string;
            data?: {
                qrCode: string;
                responseCode: number;
                responseDesc: string;
            }[];
        }>;
    };
};
export default _default;
export { default as invoice } from "./invoice";
