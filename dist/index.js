"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoice = exports.init = exports.config = exports.host = exports.logAxios = void 0;
exports.parseErr = parseErr;
const invoice_1 = require("./invoice");
function parseErr(error) {
    var _a;
    if (typeof error === "string" && error.trim())
        return error;
    if (typeof error === "object" && error !== null) {
        const err = error;
        if (typeof err.response === "object" && err.response !== null) {
            const data = err.response.data;
            if (typeof data === "string" && data.trim())
                return data;
            if (typeof data === "object" && data !== null) {
                return (data.responseDesc ||
                    data.message ||
                    data.error ||
                    JSON.stringify(data));
            }
            return `HTTP ${(_a = err.response.status) !== null && _a !== void 0 ? _a : "error"}`;
        }
        if (err.code === "ECONNABORTED")
            return "Request timed out";
        if (err.code === "ERR_NETWORK" || err.message === "Network Error")
            return "Network error";
        if (typeof err.message === "string" && err.message.trim())
            return err.message;
    }
    return "Unexpected error";
}
const logAxios = (enabled, name) => (data) => {
    var _a, _b, _c, _d, _e, _f;
    if (!enabled)
        return;
    console.log(`[${name}]`, JSON.stringify({
        time: (_a = data === null || data === void 0 ? void 0 : data.json) === null || _a === void 0 ? void 0 : _a.time,
        request: (_b = data === null || data === void 0 ? void 0 : data.json) === null || _b === void 0 ? void 0 : _b.request,
        response: `${(_d = (_c = data === null || data === void 0 ? void 0 : data.json) === null || _c === void 0 ? void 0 : _c.response) !== null && _d !== void 0 ? _d : ""}`,
        responseBody: (_e = data === null || data === void 0 ? void 0 : data.json) === null || _e === void 0 ? void 0 : _e.responseBody,
        statusCode: (_f = data === null || data === void 0 ? void 0 : data.json) === null || _f === void 0 ? void 0 : _f.statusCode
    }, null, 2));
};
exports.logAxios = logAxios;
exports.host = {
    STAGING: "http://202.21.105.150:40652/resources/merch/v1.0",
    PROD: "https://j2me.mostmoney.mn:9092/resources/merch/v1.0"
};
exports.config = {
    apiKey: "",
    payeeCode: "",
    posNo: "1",
    host: exports.host.STAGING,
    lang: "MN",
    logger: true
};
/** MOST QR систем тохируулах — host тусдаа эхний параметр */
const init = (
/** "STAGING" | "PROD" эсвэл custom URL */
hostValue, body) => {
    exports.config.host =
        hostValue === "STAGING" || hostValue === "PROD"
            ? exports.host[hostValue]
            : hostValue;
    exports.config.apiKey = body.apiKey;
    exports.config.payeeCode = body.payeeCode;
    if (body.posNo)
        exports.config.posNo = body.posNo;
    if (body.lang)
        exports.config.lang = body.lang;
    if (body.logger !== undefined)
        exports.config.logger = body.logger;
};
exports.init = init;
exports.default = { init: exports.init, invoice: invoice_1.default };
var invoice_2 = require("./invoice");
Object.defineProperty(exports, "invoice", { enumerable: true, get: function () { return invoice_2.default; } });
