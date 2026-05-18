"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_master_1 = require("axios-master");
const _1 = require("./");
/** MOST API-н нийтлэг header үүсгэх */
const headers = () => ({
    APIKEY: _1.config.apiKey,
    "Content-Type": "application/json",
    Accept: "application/json, application/xml",
    LANG: _1.config.lang
});
/** QR нэхэмжлэх үүсгэх — qrCode (raw EMV) болон qrLink буцаана */
const CREATE = async (body) => {
    var _a, _b;
    try {
        const res = await (0, axios_master_1.axiosMasterMain)({
            method: "POST",
            url: `${_1.config.host}/createqr`,
            data: {
                payeeCode: _1.config.payeeCode,
                posNo: _1.config.posNo,
                tranAmnt: body.tranAmnt,
                tranCur: (_a = body.tranCur) !== null && _a !== void 0 ? _a : "MNT",
                tranDesc: body.tranDesc,
                invoiceId: body.invoiceId,
                paidLimit: (_b = body.paidLimit) !== null && _b !== void 0 ? _b : 1
            },
            headers: headers()
        }, {
            name: "MOST CREATE QR",
            timeout: 20000,
            logger: (0, _1.logAxios)(_1.config.logger, "MOST CREATE QR")
        });
        if (res.responseCode === 0 && res.qrCode) {
            return { success: true, message: "success", data: res };
        }
        return {
            success: false,
            message: res.responseDesc || `responseCode: ${res.responseCode}`
        };
    }
    catch (error) {
        return { success: false, message: (0, _1.parseErr)(error) };
    }
};
/** QR төлбөрийн төлөв шалгах — paymentId, tranId, tranAmnt буцаана */
const CHECK = async (qrCodes) => {
    try {
        const codes = Array.isArray(qrCodes) ? qrCodes : [qrCodes];
        const res = await (0, axios_master_1.axiosMasterMain)({
            method: "POST",
            url: `${_1.config.host}/checkqr`,
            data: {
                payeeCode: _1.config.payeeCode,
                posNo: _1.config.posNo,
                qrCode: codes
            },
            headers: headers()
        }, {
            name: "MOST CHECK QR",
            timeout: 20000,
            logger: (0, _1.logAxios)(_1.config.logger, "MOST CHECK QR")
        });
        if (res.responseCode === 0) {
            return { success: true, message: "success", data: res.qrList };
        }
        return {
            success: false,
            message: res.responseDesc || `responseCode: ${res.responseCode}`
        };
    }
    catch (error) {
        return { success: false, message: (0, _1.parseErr)(error) };
    }
};
/** QR код цуцлах */
const CANCEL = async (qrCodes) => {
    try {
        const codes = Array.isArray(qrCodes) ? qrCodes : [qrCodes];
        const res = await (0, axios_master_1.axiosMasterMain)({
            method: "POST",
            url: `${_1.config.host}/cancelqr`,
            data: {
                payeeCode: _1.config.payeeCode,
                posNo: _1.config.posNo,
                qrCode: codes
            },
            headers: headers()
        }, {
            name: "MOST CANCEL QR",
            timeout: 20000,
            logger: (0, _1.logAxios)(_1.config.logger, "MOST CANCEL QR")
        });
        if (res.responseCode === 0) {
            return { success: true, message: "success", data: res.qrList };
        }
        return {
            success: false,
            message: res.responseDesc || `responseCode: ${res.responseCode}`
        };
    }
    catch (error) {
        return { success: false, message: (0, _1.parseErr)(error) };
    }
};
exports.default = { CREATE, CHECK, CANCEL };
