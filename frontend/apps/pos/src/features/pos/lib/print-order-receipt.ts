import type { PosBusinessOrder } from "@/features/pos/api/pos-orders-api"
import type { PosSettingsOverview } from "@/features/pos/api/pos-settings-api"
import { formatVnd } from "@/features/pos/lib/format"

type PrintOrderReceiptInput = {
  businessName: string
  order: PosBusinessOrder
  settings?: PosSettingsOverview
}

const paymentMethodLabels: Record<string, string> = {
  cash: "ເງິນສົດ",
  "bank-transfer": "ໂອນເງິນ",
  "qr-code": "QR",
}

export function printOrderReceipt({
  businessName,
  order,
  settings,
}: PrintOrderReceiptInput) {
  const receipt = settings?.receipt
  const business = settings?.business
  const displayBusinessName = business?.name?.trim() || businessName
  const logoUrl = receipt?.showLogo
    ? resolveAssetUrl(business?.logoUrl || business?.coverImageUrl || "")
    : ""
  const qrImageUrl =
    receipt?.showQr && receipt.qrImageUrl ? resolveAssetUrl(receipt.qrImageUrl) : ""
  const footer = receipt?.footer?.trim() || "ຂອບໃຈທີ່ໃຊ້ບໍລິການ"
  const showTax = receipt?.showTax ?? true
  const receiptPaperSize = receipt?.paperSize ?? "80mm"
  const receiptWidth = getReceiptPaperWidth(receipt?.paperSize)
  const receiptOrderNo = formatReceiptOrderNo(order.orderNo, receipt?.prefix)
  const taxLabel = getTaxLabel(settings)
  const discountLabel = order.discountLabel
  const printWindow = window.open("", "_blank", getPrintPopupFeatures())

  if (!printWindow) {
    return false
  }

  printWindow.document.write(`
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>ໃບບິນ ${escapeHtml(receiptOrderNo)}</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: #fbf7ef;
        color: #2f2419;
        font-family: "Saysettha OT", "Phetsarath OT", "Noto Sans Lao", Arial, sans-serif;
        padding: 24px;
      }
      .receipt {
        width: ${receiptWidth}px;
        margin: 0 auto;
        background: #fff;
        border: 1px solid #e4d7c7;
        border-radius: 8px;
        padding: 16px 20px;
        font-size: 12px;
        line-height: 20px;
        box-shadow: 0 16px 30px rgba(80, 54, 27, 0.1);
      }
      .center { text-align: center; }
      .logo {
        width: 48px;
        height: 48px;
        margin: 0 auto 8px;
        border-radius: 999px;
        object-fit: cover;
      }
      .brand { color: #3b2511; font-size: 15px; font-weight: 900; }
      .business-line { margin-top: 4px; font-size: 11px; color: #7c6448; }
      .divider {
        border: 0;
        border-top: 1px dashed #bfa98e;
        margin: 12px 0;
      }
      .row {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        margin: 4px 0;
        font-size: 12px;
      }
      .row strong { flex-shrink: 0; font-weight: 700; }
      .muted { color: #6f5a43; }
      .items { display: grid; gap: 8px; }
      .item {
        display: grid;
        grid-template-columns: 1fr 32px 82px;
        column-gap: 8px;
        row-gap: 2px;
        font-size: 12px;
      }
      .item-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 700; }
      .item-qty, .item-total { text-align: right; white-space: nowrap; }
      .item-note { grid-column: 1 / -1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #7c6448; font-size: 11px; font-weight: 700; }
      .total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 8px;
        font-size: 14px;
        font-weight: 900;
      }
      .qr {
        display: block;
        width: 96px;
        height: 96px;
        margin: 0 auto;
        object-fit: contain;
        border: 1px solid #eadfce;
        border-radius: 8px;
        padding: 4px;
      }
      .qr-label {
        margin-top: 4px;
        text-align: center;
        font-size: 10px;
        color: #7c6448;
        font-weight: 700;
      }
      .footer {
        text-align: center;
        white-space: pre-line;
        font-size: 11px;
        color: #5f4a35;
        font-weight: 700;
      }
      @media print {
        body {
          background: #fbf7ef;
          padding: 24px 0;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .receipt {
          width: ${receiptWidth}px;
          max-width: ${receiptWidth}px;
          min-height: auto;
          margin: 0 auto;
          border: 1px solid #e4d7c7;
          border-radius: 8px;
          padding: 16px 20px;
          box-shadow: 0 16px 30px rgba(80, 54, 27, 0.1);
        }
        @page { size: ${receiptPaperSize} auto; margin: 0; }
      }
    </style>
  </head>
  <body>
    <main class="receipt">
      <section class="center">
        ${logoUrl ? `<img class="logo" src="${escapeHtml(logoUrl)}" alt="" />` : ""}
        <div class="brand">${escapeHtml(displayBusinessName)}</div>
        ${business?.phone ? `<div class="business-line">${escapeHtml(business.phone)}</div>` : ""}
        ${business?.address ? `<div class="business-line">${escapeHtml(business.address)}</div>` : ""}
      </section>

      <hr class="divider" />

      <section>
        <div class="row"><span class="muted">ເລກບິນ</span><strong>${escapeHtml(receiptOrderNo)}</strong></div>
        <div class="row"><span class="muted">ວັນທີ</span><strong>${escapeHtml(formatDateTime(order.updatedAt))}</strong></div>
        <div class="row"><span class="muted">ພະນັກງານ</span><strong>${escapeHtml(order.cashierName || "ເຈົ້າຂອງຮ້ານ")}</strong></div>
      </section>

      <hr class="divider" />

      <section class="items">
        ${order.items
          .map(
            (line) => `
          <section class="item">
            <div class="item-name">${escapeHtml(line.name)}</div>
            <div class="item-qty">x${line.quantity}</div>
            <div class="item-total">${escapeHtml(formatVnd(line.lineTotal))}</div>
            ${line.note ? `<div class="item-note">ໝາຍເຫດ: ${escapeHtml(line.note)}</div>` : ""}
          </section>
        `,
          )
          .join("")}
      </section>

      <hr class="divider" />

      <div class="row">
        <span class="muted">ລວມ</span>
        <strong>${escapeHtml(formatVnd(order.subtotal))}</strong>
      </div>
      ${
        order.discountAmount
          ? `<div class="row">
              <span class="muted">${escapeHtml(discountLabel ? `ສ່ວນຫຼຸດ (${discountLabel})` : "ສ່ວນຫຼຸດ")}</span>
              <strong>${escapeHtml(formatVnd(order.discountAmount))}</strong>
            </div>`
          : ""
      }
      ${
        showTax && order.taxAmount
          ? `<div class="row">
              <span class="muted">${escapeHtml(taxLabel)}</span>
              <strong>${escapeHtml(formatVnd(order.taxAmount))}</strong>
            </div>`
          : ""
      }
      <div class="total">
        <span>ລວມທັງໝົດ</span>
        <span>${escapeHtml(formatVnd(order.total))}</span>
      </div>

      <hr class="divider" />

      ${order.payments
        .map(
          (payment) => `
          <div class="row">
            <span class="muted">${escapeHtml(paymentMethodLabels[payment.method] ?? payment.method)}</span>
            <strong>${escapeHtml(formatVnd(payment.amountPaid))}</strong>
          </div>
        `,
        )
        .join("")}

      ${
        qrImageUrl
          ? `<hr class="divider" />
             <img class="qr" src="${escapeHtml(qrImageUrl)}" alt="QR" />
             <div class="qr-label">QR ຊຳລະເງິນ</div>`
          : ""
      }

      <div class="footer">${escapeHtml(footer)}</div>
    </main>
    <script>
      window.addEventListener("load", () => {
        window.focus();
        window.print();
      });
    </script>
  </body>
</html>
  `)
  printWindow.document.close()

  return true
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("lo-LA", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value))
}

function resolveAssetUrl(value: string) {
  if (!value) return ""

  try {
    return new URL(value, window.location.origin).href
  } catch {
    return value
  }
}

function getTaxLabel(settings: PosSettingsOverview | undefined) {
  const tax = settings?.tax

  if (!tax) return "ອາກອນ / ຄ່າບໍລິການ"

  return [
    tax.serviceFeeRate > 0 ? `ຄ່າບໍລິການ ${tax.serviceFeeRate}%` : null,
    tax.vatRate > 0 ? `ອາກອນ ${tax.vatRate}%` : null,
  ].filter(Boolean).join(" + ") || "ອາກອນ / ຄ່າບໍລິການ"
}

function getReceiptPaperWidth(paperSize: PosSettingsOverview["receipt"]["paperSize"] | undefined) {
  return paperSize === "58mm" ? 220 : 280
}

function formatReceiptOrderNo(orderNo: string, prefix: string | undefined) {
  const cleanPrefix = prefix?.trim().replace(/\s+/g, "-")

  if (!cleanPrefix) return orderNo

  const match = orderNo.match(/^[^-]+-(\d+)$/)

  return match ? `${cleanPrefix}-${match[1]}` : orderNo
}

function getPrintPopupFeatures() {
  const screen = window.screen as Screen & { availLeft?: number; availTop?: number }
  const width = Math.max(960, Math.round(screen.availWidth * 0.96))
  const height = Math.max(720, Math.round(screen.availHeight * 0.96))
  const left = Math.max(0, Math.round((screen.availLeft ?? 0) + (screen.availWidth - width) / 2))
  const top = Math.max(0, Math.round((screen.availTop ?? 0) + (screen.availHeight - height) / 2))

  return `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
