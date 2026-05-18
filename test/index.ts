import MOST from "../src/index";

// Тохиргоо
MOST.init("STAGING", {
  apiKey: "xWTLEMvSJqnYoTHHpJByNFpROWWAUl",
  payeeCode: "ME_402695",
  posNo: "1",
});

async function main() {
  // 1. QR үүсгэх
  const created = await MOST.invoice.CREATE({
    tranAmnt: 1000,
    tranCur: "MNT",
    tranDesc: "TEST",
    invoiceId: "123213",
    paidLimit: 1,
  });
  console.log("CREATE:", created);

  if (!created.data?.qrCode) return;

  const qrCode = created.data.qrCode;
  console.log("QR Link:", created.data.qrLink);

  // 2. Төлөв шалгах
  const checked = await MOST.invoice.CHECK(qrCode);
  console.log("CHECK:", checked);

  if (checked.data?.[0]) {
    const item = checked.data[0];
    console.log("Төлөв:", item.responseDesc);
    console.log("Төлбөрийн ID:", item.paymentId);
    console.log("Гүйлгээний дүн:", item.tranAmnt);
  }

  // 3. QR цуцлах (шаардлагатай үед)
  // const cancelled = await MOST.invoice.CANCEL(qrCode);
  // console.log("CANCEL:", cancelled);
}

main().catch(console.error);
