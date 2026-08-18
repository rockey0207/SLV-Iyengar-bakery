import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Truck, CheckCircle2, Package, ChefHat, Download, XCircle, Phone, MapPin, Clock3, Sparkles, } from "lucide-react";

const STAGES = [
  {
    key: "placed",
    label: "Order Placed",
    icon: Package,
    desc: " Your order has been received."
  },
  {
    key: "confirmed",
    label: "Confirmed",
    icon: ChefHat,
    desc: "Bakery is preparing your order."
  },
  {
    key: "rider_assigned",
    label: "Rider Assigned",
    icon: Truck,
    desc: "Rider is on the way to pick up your order."
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: CheckCircle2,
    desc: "Order Delivered Successfully"
  },
];

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString();
};
export default function OrderDetail() {
  const { id } = useParams();
  const [o, setO] = useState(null);
  useEffect(() => {
    let interval;
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setO(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrder();
    interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [id]);
  function Row({ label, value, green }) {
    return (
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span
          className={`font-semibold ${green ? "text-green-600" : ""
            }`}
        >
          {value}
        </span>
      </div>
    );
  }
  function Info({ icon, title, value }) {
    return (
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          {icon}
        </div>
        <div>
          <div className="text-xs text-gray-500">{title}</div>
          <div className="font-medium">{value}</div>
        </div>
      </div>
    );
  }
  if (!o)
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-14 h-14 rounded-full border-4 border-blue-300 border-t-blue-600 animate-spin" />
        <p className="mt-5 text-gray-500">
          Loading your order...
        </p>
      </div>
    );
  const idx = STAGES.findIndex(
    (s) => s.key === o.status
  );
  const invoice = () => {
    const cancellationNote = o.cancellation_reason
      ? `<p><b>Cancellation Reason:</b> ${o.cancellation_reason}</p>`
      : "";
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
      <title>Tax Invoice - ${o.order_no}</title>
      
      <style>
      * {
        box-sizing: border-box;
      }
      
      body {
        font-family: Arial, Helvetica, sans-serif;
        margin: 0;
        padding: 30px;
        background: #fff;
        color: #333;
        font-size: 13px;
      }
      
      .invoice-container {
        max-width: 850px;
        margin: auto;
        border: 1px solid #ddd;
        padding: 30px;
      }
      .header {
        position: relative;
        min-height: 120px;
        border-bottom: 2px solid #06d2d9;
        padding-bottom: 18px;
        margin-bottom: 20px;
      }
      
      .company-details {
        position: absolute;
        left: 0;
        top: 0;
        width: 48%;
        line-height: 1.6;
      }
      
      .company-details h3 {
        margin: 0 0 8px 0;
        color: #06aeb4;
        font-size: 20px;
      }
      
      .invoice-title {
        position: absolute;
        right: 0;
        top: 0;
        width: 48%;
        text-align: right;
      }
      
      .invoice-title h1 {
        margin: 0;
        font-size: 28px;
        color: #06aeb4;
        letter-spacing: 1px;
      }
      
      .invoice-title p {
        margin: 5px 0;
        font-size: 12px;
      }
      .logo-section {
        text-align: center;
        margin-top: 5px;
      }
      
      .logo-section img {
        width: 75px;
        height: 75px;
        object-fit: contain;
        border-radius: 50%;
      }
      
      .logo-section h2 {
        margin: 5px 0 0;
        color: #06aeb4;
        font-size: 22px;
      }
      
      .logo-section p {
        margin: 3px 0;
        color: #777;
        font-size: 11px;
      }
      .section {
        margin-top: 20px;
      }
      
      .section-title {
        background: #06d2d9;
        color: white;
        padding: 8px 12px;
        font-weight: bold;
        font-size: 14px;
        border-radius: 4px 4px 0 0;
      }
      
      .info-table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #ddd;
      }
      
      .info-table td {
        padding: 9px 10px;
        border-bottom: 1px solid #eee;
        vertical-align: top;
      }
      
      .info-label {
        font-weight: bold;
        width: 18%;
        color: #555;
      }
      
      .info-value {
        width: 32%;
      }
      .items-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 0;
      }
      
      .items-table th {
        background: #f2fafa;
        color: #333;
        padding: 11px 8px;
        border: 1px solid #ddd;
        font-weight: bold;
      }
      
      .items-table td {
        padding: 10px 8px;
        border: 1px solid #ddd;
      }
      
      .items-table .center {
        text-align: center;
      }
      
      .items-table .right {
        text-align: right;
      }
      
      .items-table .item-name {
        font-weight: 500;
      }
      .summary-wrapper {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
      }
      
      .summary-table {
        width: 350px;
        border-collapse: collapse;
      }
      
      .summary-table td {
        padding: 7px 10px;
        border-bottom: 1px solid #eee;
      }
      
      .summary-label {
        text-align: left;
      }
      
      .summary-value {
        text-align: right;
      }
      
      .total-row td {
        background: #06d2d9;
        color: white;
        font-weight: bold;
        font-size: 16px;
      }
      .payment-box {
        margin-top: 20px;
        padding: 12px 15px;
        background: #f8ffff;
        border: 1px solid #bdeff0;
        border-radius: 5px;
      }
      
      .payment-box strong {
        color: #06aeb4;
      }
      .cancellation {
        margin-top: 15px;
        padding: 12px;
        background: #fff3f3;
        border: 1px solid #f0b5b5;
        color: #a33;
        border-radius: 5px;
      }
      .footer {
        margin-top: 45px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
      }
      
      .digital-sign {
        width: 220px;
        text-align: center;
      }
      .digital-sign img {
        width: 130px;
        height: 55px;
        object-fit: contain;
        margin-bottom: 3px;
      }
      .signature-line {
        border-top: 1px solid #333;
        padding-top: 6px;
        font-weight: bold;
      }
      .footer-note {
        font-size: 11px;
        color: #777;
        line-height: 1.6;
      }
      .thank-you {
        text-align: center;
        margin-top: 25px;
        color: #06aeb4;
        font-size: 14px;
        font-weight: bold;
      }
      @media print {
      
        body {
          padding: 0;
        }
        .invoice-container {
          border: none;
          max-width: 100%;
          padding: 20px;
        }
        @page {
          size: A4;
          margin: 10mm;
        }
      }
      </style>
      </head>
      <body>
      <div class="invoice-container">
        <div class="header">
          <div class="company-details">
            <h3>SLV Bakery</h3>
            <b>FSSAI:</b> 2026087689964578<br/>
            <b>GSTIN:</b> 29AARAK9898R<br/>
            <b>Email:</b> slviyengarbakery.com<br/>      
            <b>Address:</b>
            1st Block, Koramangala,<br/>
            Bangalore - 560095
          </div>
          <div class="invoice-title">
            <h1>TAX INVOICE</h1>
            <p>
              <b>Invoice No:</b>
              ${o.order_no}
            </p>
            <p>
              <b>Order Date:</b>
              ${formatDateTime(o.created_at)}
            </p>
            <p>
              <b>Status:</b>
              ${o.status}
            </p>
          </div>
          <div class="logo-section">
            <img
              src="/bakery-icon-logo.png"
              alt="SLV Bakery Logo"
            />
            <h2>SLV Bakery</h2>
            <p>
              Freshly Baked • Made With Love
            </p>
          </div>
        </div>
        <div class="section">
          <div class="section-title">
            CUSTOMER INFORMATION
          </div>
          <table class="info-table">
            <tr>
              <td class="info-label">
                Customer Name
              </td>
              <td class="info-value">
                ${o.user_name || "-"}
              </td>
              <td class="info-label">
                Phone
              </td>
              <td class="info-value">
                ${o.phone || "-"}
              </td>
            </tr>
            <tr>
              <td class="info-label">
                Delivery Address
              </td>
              <td colspan="3">
                ${o.address || "-"}
              </td>
            </tr>
          </table>
        </div>
        <div class="section">
          <div class="section-title">
            ORDER INFORMATION
          </div>
          <table class="info-table">
            <tr>
              <td class="info-label">
                Order Number
              </td>
              <td class="info-value">
                ${o.order_no}
              </td>
              <td class="info-label">
                Payment Method
              </td>
              <td class="info-value">
                ${o.payment_method || "-"}
              </td>
            </tr>
            <tr>
              <td class="info-label">
                Order Date
              </td>
              <td class="info-value">
                ${formatDateTime(o.created_at)}
              </td>
              <td class="info-label">
                Delivered Date
              </td>
              <td class="info-value">
                ${o.delivered_at
        ? formatDateTime(o.delivered_at)
        : "-"}
              </td>
            </tr>
            <tr>
              <td class="info-label">
                Order Status
              </td>
              <td colspan="3">
                <b>${o.status}</b>
              </td>
            </tr>
          </table>
        </div>
        ${cancellationNote || ""}
        <div class="section">
          <div class="section-title">
            ORDER ITEMS
          </div>
          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 8%;">
                  S.No
                </th>
                <th style="width: 42%;">
                  Item Description
                </th>
                <th style="width: 12%;" class="center">
                  Qty
                </th>
                <th style="width: 18%;" class="right">
                  Unit Price
                </th>
                <th style="width: 20%;" class="right">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              ${o.items
        .map(
          (i, index) => `
                    <tr>
      
                      <td class="center">
                        ${index + 1}
                      </td>
                      <td class="item-name">
                        ${i.name}
                      </td>
                      <td class="center">
                        ${i.quantity}
                      </td>
                      <td class="right">
                        ₹${Number(i.price).toFixed(2)}
                      </td>
                      <td class="right">
                        ₹${(
              Number(i.price) * Number(i.quantity)
            ).toFixed(2)}
                      </td>
                    </tr>
                  `
        )
        .join("")
      }
            </tbody>
          </table>
        </div>
        <div class="summary-wrapper">
          <table class="summary-table">
            <tr>
              <td class="summary-label">
                Subtotal
              </td>
              <td class="summary-value">
                ₹${Number(o.subtotal || 0).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td class="summary-label">
                Platform Fee
              </td>
              <td class="summary-value">
                ₹${Number(o.platform_fee || 0).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td class="summary-label">
                Delivery Charge
              </td>
              <td class="summary-value">
                ₹${Number(o.delivery_charge || 0).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td class="summary-label">
                Packaging
              </td>
              <td class="summary-value">
                ₹${Number(o.packaging || 0).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td class="summary-label">
                Discount
              </td>
              <td class="summary-value">
                -₹${Number(o.discount || 0).toFixed(2)}
              </td>
            </tr>
            <tr class="total-row">
              <td>
                TOTAL AMOUNT
              </td>
              <td class="summary-value">
                ₹${Number(o.total || 0).toFixed(2)}
              </td>
            </tr>
          </table>
        </div>
        <div class="payment-box">
          <strong>Payment Information</strong>
          <br/>
          Payment Method:
          <b>${o.payment_method || "-"}</b>
          &nbsp;&nbsp; | &nbsp;&nbsp;
          Payment Status:
          <b>
            ${o.payment_status ||
      (o.status === "delivered"
        ? "Paid"
        : "Pending")
      }
          </b>
        </div>
        <div class="footer">
          <div class="footer-note">
            <b>Order Date:</b>
            ${formatDateTime(o.created_at)}
            <br/>
            <b>Delivered Date:</b>
            ${o.delivered_at
        ? formatDateTime(o.delivered_at)
        : "Not Delivered"
      }
            <br/><br/>
            This is a computer-generated invoice.
            <br/>
            No physical signature is required.
          </div>
          <div class="digital-sign">
            <img
              src="/bakery_signature.png"
              alt="Digital Signature"
              onerror="this.style.display='none'"
            />
            <div class="signature-line">
              Authorized Signatory
            </div>
            <div style="font-size:11px; margin-top:4px;">
              SLV Bakery
            </div>
          </div>
        </div>
        <div class="thank-you">
          Thank you for choosing SLV Bakery ❤️
        </div>
      </div>
      </body>
      </html>
      `;
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    w.print();
  };
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-amber-50 min-h-screen">
      {/* Background Blur */}
      <div className="absolute -top-24 -left-20 w-80 h-80 rounded-full bg-blue-200 blur-[140px] opacity-25" />
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-yellow-200 blur-[120px] opacity-20" />
      <div className="relative max-w-5xl mx-auto px-4 py-10 animate-in fade-in duration-700">
        {/* Hero */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-500 to-amber-500 text-white shadow-xl p-4 mb-2">
          <div className="flex flex-wrap justify-between gap-5 items-center">
            <div>
              <p className="uppercase tracking-[0.25em] text-xs opacity-80">Order Details</p>
              <h1 className="text-3xl font-bold">{o.order_no}</h1>
              <div className="flex items-center gap-2">
                <Clock3 className="w-4 h-4" />
                <span className="text-sm">{formatDateTime(o.created_at)}</span>
              </div>
            </div>
            <div className="text-right">
              <Button
                onClick={invoice}
                className="mt-5 rounded-full bg-white text-blue-600 hover:bg-blue-100"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Invoice
              </Button>
            </div>
          </div>
        </div>
        {/* ======================= TRACKING CARD ======================= */}
        <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden mb-2">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-amber-500 px-6 py-3 text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Package className="w-6 h-6" />
              Live Order Tracking
            </h2>
            <p className="text-sm opacity-90">
              Track every stage of your bakery order.
            </p>
          </div>
          <div className="p-4">
            {/* ================= CANCELLED ================= */}
            {o.status === "cancelled" ? (
              <div className="text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="mt-2 text-3xl font-bold text-red-600">
                  Order Cancelled
                </h2>
                <p className=" text-gray-500 max-w-md mx-auto leading-7">
                  Unfortunately this order has been cancelled.
                  We hope to serve you again soon.
                </p>
                {o.cancellation_reason && (
                  <div className="mt-1 inline-flex rounded-2xl bg-red-50 px-5 py-3 text-red-700 font-medium border border-red-200">
                    Reason : {o.cancellation_reason}
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* ================= TIMELINE ================= */}
                <div className="grid grid-cols-4 relative">
                  {STAGES.map((stage, i) => {
                    const Icon = stage.icon;
                    const active = i <= idx;
                    const current = i === idx;
                    return (
                      <div
                        key={stage.key}
                        className="relative flex flex-col items-center"
                      >
                        {/* Connecting Line */}
                        {i !== STAGES.length - 1 && (
                          <div
                            className={`absolute top-6 left-1/2 w-full h-1 rounded-full transition-all duration-700
                    ${i < idx
                                ? "bg-blue-500"
                                : "bg-gray-200"
                              }
                    `}
                          />
                        )}
                        {/* Circle */}
                        <div
                          className={`
                  relative z-10
                  w-14
                  h-14
                  rounded-full
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-500
                  shadow-lg
                  ${active
                              ? "bg-gradient-to-br from-blue-500 to-amber-500 text-white"
                              : "bg-white border-2 border-gray-300 text-gray-400"
                            }
                  ${current
                              ? "animate-pulse scale-110"
                              : ""
                            }
                  `}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        {/* Label */}
                        <div className="mt-4 text-center">
                          <div
                            className={`text-sm font-semibold
                    ${active
                                ? "text-blue-600"
                                : "text-gray-500"
                              }
                    `}
                          >
                            {stage.label}
                          </div>
                          {stage.desc && current && (
                            <div className="text-xs text-gray-500 mt-1">
                              {stage.desc}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* ================= RIDER CARD ================= */}
                {(o.rider_name || o.rider_phone) && (
                  <div className=" rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-4 shadow">
                    <div className="flex items-center ">
                      <Truck className="w-7 h-7 text-blue-500" />
                      <h3 className="text-xl font-bold">
                        Delivery Partner
                      </h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {o.rider_name && (
                        <div className="rounded-xl bg-white border p-4">
                          <div className="text-xs text-gray-500">
                            Rider Name : <span className="font-semibold">{o.rider_name}</span>
                          </div>
                        </div>
                      )}
                      {o.rider_phone && (
                        <div className="rounded-xl bg-white border p-4">
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Contact : <span className="font-semibold">{o.rider_phone}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {/* ======================= ORDER DETAILS ======================= */}
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
          {/* ITEMS */}
          <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-amber-500 px-6 py-4 text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Package className="w-6 h-6" />
                Ordered Items
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {o.items.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-all duration-300 p-5 flex justify-between items-center"
                >
                  <div>
                    <div className="font-semibold text-lg">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Quantity : {item.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600 text-xl">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-500">
                      ₹{item.price} each
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* SUMMARY */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-amber-500 px-6 py-4 text-white">
                <h2 className="text-xl font-bold">
                  Payment Summary
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <Row
                  label="Subtotal"
                  value={`₹${o.subtotal}`}
                />
                <Row
                  label="Platform Fee"
                  value={`₹${o.platform_fee}`}
                />
                <Row
                  label="Delivery"
                  value={`₹${o.delivery_charge}`}
                />
                <Row
                  label="Packaging"
                  value={`₹${o.packaging}`}
                />
                {o.discount > 0 && (
                  <Row
                    label="Discount"
                    value={`- ₹${o.discount}`}
                    green
                  />
                )}
                <div className="border-t pt-5 flex justify-between items-center">
                  <span className="text-xl font-bold">
                    Grand Total
                  </span>
                  <span className="text-3xl font-bold text-blue-600 animate-pulse">
                    ₹{o.total}
                  </span>
                </div>
              </div>
            </div>
            {/* DELIVERY */}
            <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-6">
              <h3 className="font-bold text-xl mb-5">
                Delivery Information
              </h3>
              <div className="space-y-4">
                <Info
                  icon={<Clock3 className="w-5 h-5" />}
                  title="Ordered"
                  value={formatDateTime(o.created_at)}
                />
                {o.status === "delivered" && o.delivered_at && (
                  <Info
                    icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
                    title="Delivered"
                    value={formatDateTime(o.delivered_at)}
                  />
                )}
                <Info
                  icon={<MapPin className="w-5 h-5" />}
                  title="Delivery Address"
                  value={o.address}
                />
                <Info
                  icon={<Phone className="w-5 h-5" />}
                  title="Phone"
                  value={o.phone}
                />
                <Info
                  icon={<Package className="w-5 h-5" />}
                  title="Payment"
                  value={o.payment_method}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/my-orders"
            className="inline-flex items-center px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-amber-500 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
          >← Back to My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
