type MostRes<T> = T & {
    /** 0 = амжилттай, бусад = алдаа */
    responseCode: number;
    /** Хариуны тайлбар */
    responseDesc: string;
};
type CreateResT = MostRes<{
    /** Үүсгэсэн QR EMV code (raw текст) */
    qrCode: string;
    /** Happy Wallet deeplink URL */
    qrLink: string;
    qpayAccountId: string | null;
    qpayQrCode: string | null;
    shortUrl: string | null;
}>;
type QrItemT = {
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
};
type CancelItemT = {
    qrCode: string;
    responseCode: number;
    responseDesc: string;
};
declare const _default: {
    CREATE: (body: {
        /** Гүйлгээний дүн */
        tranAmnt: number;
        /** Гүйлгээний тайлбар */
        tranDesc: string;
        /** Мерчантын дотоод нэхэмжлэхийн дугаар */
        invoiceId: string;
        /** Валютийн код, default: "MNT" */
        tranCur?: string;
        /** Нэг QR-г хэдэн удаа төлөх боломжтой, default: 1 */
        paidLimit?: number;
    }) => Promise<{
        /** Хүсэлт амжилттай эсэх */
        success: boolean;
        /** Алдааны мэдэгдэл эсвэл "success" */
        message: string;
        /** qrCode (raw EMV), qrLink (deeplink URL) агуулсан объект */
        data?: CreateResT;
    }>;
    CHECK: (qrCodes: string | string[]) => Promise<{
        /** Хүсэлт амжилттай эсэх */
        success: boolean;
        /** Алдааны мэдэгдэл эсвэл "success" */
        message: string;
        /** QR бүрийн төлөв агуулсан жагсаалт */
        data?: QrItemT[];
    }>;
    CANCEL: (qrCodes: string | string[]) => Promise<{
        /** Хүсэлт амжилттай эсэх */
        success: boolean;
        /** Алдааны мэдэгдэл эсвэл "success" */
        message: string;
        /** Цуцлагдсан QR бүрийн үр дүн */
        data?: CancelItemT[];
    }>;
};
export default _default;
