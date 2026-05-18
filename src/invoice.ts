import { axiosMasterMain } from "axios-master";
import { config, logAxios, parseErr } from "./";

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

type CheckResT = MostRes<{ qrList: QrItemT[] }>;

type CancelItemT = {
  qrCode: string;
  responseCode: number;
  responseDesc: string;
};

type CancelResT = MostRes<{ qrList: CancelItemT[] }>;

/** MOST API-н нийтлэг header үүсгэх */
const headers = () => ({
  APIKEY: config.apiKey,
  "Content-Type": "application/json",
  Accept: "application/json, application/xml",
  LANG: config.lang
});

/** QR нэхэмжлэх үүсгэх — qrCode (raw EMV) болон qrLink буцаана */
const CREATE = async (body: {
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
}): Promise<{
  /** Хүсэлт амжилттай эсэх */
  success: boolean;
  /** Алдааны мэдэгдэл эсвэл "success" */
  message: string;
  /** qrCode (raw EMV), qrLink (deeplink URL) агуулсан объект */
  data?: CreateResT;
}> => {
  try {
    const res: CreateResT = await axiosMasterMain(
      {
        method: "POST",
        url: `${config.host}/createqr`,
        data: {
          payeeCode: config.payeeCode,
          posNo: config.posNo,
          tranAmnt: body.tranAmnt,
          tranCur: body.tranCur ?? "MNT",
          tranDesc: body.tranDesc,
          invoiceId: body.invoiceId,
          paidLimit: body.paidLimit ?? 1
        },
        headers: headers()
      },
      {
        name: "MOST CREATE QR",
        timeout: 20000,
        logger: logAxios(config.logger, "MOST CREATE QR")
      }
    );

    if (res.responseCode === 0 && res.qrCode) {
      return { success: true, message: "success", data: res };
    }
    return {
      success: false,
      message: res.responseDesc || `responseCode: ${res.responseCode}`
    };
  } catch (error) {
    return { success: false, message: parseErr(error) };
  }
};

/** QR төлбөрийн төлөв шалгах — paymentId, tranId, tranAmnt буцаана */
const CHECK = async (
  qrCodes: string | string[]
): Promise<{
  /** Хүсэлт амжилттай эсэх */
  success: boolean;
  /** Алдааны мэдэгдэл эсвэл "success" */
  message: string;
  /** QR бүрийн төлөв агуулсан жагсаалт */
  data?: QrItemT[];
}> => {
  try {
    const codes = Array.isArray(qrCodes) ? qrCodes : [qrCodes];
    const res: CheckResT = await axiosMasterMain(
      {
        method: "POST",
        url: `${config.host}/checkqr`,
        data: {
          payeeCode: config.payeeCode,
          posNo: config.posNo,
          qrCode: codes
        },
        headers: headers()
      },
      {
        name: "MOST CHECK QR",
        timeout: 20000,
        logger: logAxios(config.logger, "MOST CHECK QR")
      }
    );

    if (res.responseCode === 0) {
      return { success: true, message: "success", data: res.qrList };
    }
    return {
      success: false,
      message: res.responseDesc || `responseCode: ${res.responseCode}`
    };
  } catch (error) {
    return { success: false, message: parseErr(error) };
  }
};

/** QR код цуцлах */
const CANCEL = async (
  qrCodes: string | string[]
): Promise<{
  /** Хүсэлт амжилттай эсэх */
  success: boolean;
  /** Алдааны мэдэгдэл эсвэл "success" */
  message: string;
  /** Цуцлагдсан QR бүрийн үр дүн */
  data?: CancelItemT[];
}> => {
  try {
    const codes = Array.isArray(qrCodes) ? qrCodes : [qrCodes];
    const res: CancelResT = await axiosMasterMain(
      {
        method: "POST",
        url: `${config.host}/cancelqr`,
        data: {
          payeeCode: config.payeeCode,
          posNo: config.posNo,
          qrCode: codes
        },
        headers: headers()
      },
      {
        name: "MOST CANCEL QR",
        timeout: 20000,
        logger: logAxios(config.logger, "MOST CANCEL QR")
      }
    );

    if (res.responseCode === 0) {
      return { success: true, message: "success", data: res.qrList };
    }
    return {
      success: false,
      message: res.responseDesc || `responseCode: ${res.responseCode}`
    };
  } catch (error) {
    return { success: false, message: parseErr(error) };
  }
};

export default { CREATE, CHECK, CANCEL };
