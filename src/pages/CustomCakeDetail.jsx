// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import api from "@/lib/api";
// import { Button } from "@/components/ui/button";
// import { XCircle, Upload, Cake } from "lucide-react";

// const formatDateTime = (value) => {
//   if (!value) return "—";
//   const date = new Date(value);
//   return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
// };

// export default function CustomCakeDetail() {
//   const { id } = useParams();
//   const [cake, setCake] = useState(null);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await api.get(`/custom-cakes/${id}`);
//         setCake(res.data);
//       } catch (err) {
//         setError(err?.response?.data?.detail || "Unable to load request.");
//       }
//     };
//     load();
//   }, [id]);

//   if (error) {
//     return (
//       <div className="max-w-4xl mx-auto px-4 py-10 text-center text-red-600">{error}</div>
//     );
//   }

//   if (!cake) return <div className="py-20 text-center">Loading...</div>;

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-10" data-testid="custom-cake-detail">
//       <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
//         <div>
//           <div className="uppercase-tracked text-xs text-[#D97706]">Custom Cake Request</div>
//           <h1 className="font-display text-2xl md:text-3xl font-bold">{cake.cake_type} / {cake.cake_size}</h1>
//           <p className="text-sm text-[#5C4A3D] mt-1">Requested on {formatDateTime(cake.created_at)}</p>
//         </div>
//         <div className="text-right">
//           <div className="text-xs uppercase-tracked text-[#D97706]">Status</div>
//           <div className="font-semibold mt-1">{cake.status.replace("_", " ")}</div>
//         </div>
//       </div>

//       <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 space-y-6">
//         <div className="grid md:grid-cols-2 gap-4">
//           <div>
//             <div className="text-sm font-semibold mb-2">Flavor</div>
//             <div>{cake.flavor}</div>
//           </div>
//           <div>
//             <div className="text-sm font-semibold mb-2">Quantity</div>
//             <div>{cake.quantity}</div>
//           </div>
//           <div>
//             <div className="text-sm font-semibold mb-2">Delivery Date</div>
//             <div>{cake.delivery_date}</div>
//           </div>
//           <div>
//             <div className="text-sm font-semibold mb-2">Delivery Time</div>
//             <div>{cake.delivery_time}</div>
//           </div>
//           <div>
//             <div className="text-sm font-semibold mb-2">Contact Phone</div>
//             <div>{cake.phone}</div>
//           </div>
//           <div>
//             <div className="text-sm font-semibold mb-2">Address</div>
//             <div>{cake.address}</div>
//           </div>
//         </div>

//         {cake.message && (
//           <div>
//             <div className="text-sm font-semibold mb-2">Message</div>
//             <div>{cake.message}</div>
//           </div>
//         )}

//         {cake.reference_image && (
//           <div>
//             <div className="text-sm font-semibold mb-2">Reference Image</div>
//             <img src={cake.reference_image} alt="Reference" className="w-full h-60 object-cover rounded-xl border border-[#E6DFD5]" />
//           </div>
//         )}

//         <div className="grid md:grid-cols-2 gap-4 text-sm text-[#5C4A3D]">
//           <div>
//             <div className="font-semibold">Request ID</div>
//             <div>{cake.id}</div>
//           </div>
//           <div>
//             <div className="font-semibold">Name</div>
//             <div>{cake.user_name}</div>
//           </div>
//           <div>
//             <div className="font-semibold">Email</div>
//             <div>{cake.user_email}</div>
//           </div>
//           <div>
//             <div className="font-semibold">Custom Price</div>
//             <div>{cake.custom_price ? `₹${cake.custom_price}` : "Price pending"}</div>
//           </div>
//           <div>
//             <div className="font-semibold">Delivered at</div>
//             <div>{cake.delivered_at ? formatDateTime(cake.delivered_at) : "—"}</div>
//           </div>
//         </div>

//         {cake.status === "rejected" && (
//           <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-red-700">
//             <div className="flex items-center gap-2"><XCircle className="w-5 h-5" /> This request was rejected by the bakery. We will contact you if you'd like to submit a new request.</div>
//           </div>
//         )}
//       </div>

//       <div className="mt-6"><Link to="/my-orders" className="text-[#D97706] text-sm">← Back to my orders</Link></div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {Cake,Upload,CheckCircle2,XCircle,Clock3,CalendarDays,Phone,MapPin,User,Mail,IndianRupee,Image as ImageIcon,Package,} from "lucide-react";

const STAGES = [
  {
    key: "pending",
    label: "Pending",
    icon: Upload,
    desc: "Your custom cake request has been submitted.",
  },
  {
    key: "approved",
    label: "Approved",
    icon: Cake,
    desc: "Your custom cake request has been approved.",
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: CheckCircle2,
    desc: "Your custom cake has been delivered successfully.",
  },
];
const STATUS_META = {
  pending: {
    title: "Pending",
    color: "text-orange-800",
    bg: "bg-orange-50",
  },
  approved: {
    title: "Approved",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  delivered: {
    title: "Delivered",
    color: "text-green-800",
    bg: "bg-green-50",
  },
  rejected: {
    title: "Rejected",
    color: "text-red-600",
    bg: "bg-red-50",
  },
};
const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString();
};
export default function CustomCakeDetail() {
  const { id } = useParams();
  const [cake, setCake] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let interval;
    const load = async () => {
      try {
        const res = await api.get(`/custom-cakes/${id}`);
        setCake(res.data);
      } catch (err) {
        setError(
          err?.response?.data?.detail ||
            "Unable to load , Please reload once again....!."
        );
      }
    };
    load();
    interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [id]);
  if (error) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center text-red-600">
        {error}
      </div>
    );
  }
  if (!cake) {
    return (
      <div className="py-24 text-center text-lg">
        Loading...
      </div>
    );
  }
  const idx = STAGES.findIndex(
    (s) => s.key === cake.status
  );
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* HERO */}
      <div className="rounded-3xl overflow-hidden shadow-xl mb-2">
        <div className="bg-gradient-to-r from-blue-500 via-amber-500 to-blue-600 text-white p-5">
          <div className="flex flex-wrap justify-between gap-6 items-center">
            <div>
              <div className="uppercase tracking-[0.25em] text-xs opacity-90">Custom Cake Request</div>
              <h1 className="text-4xl font-bold">{cake.cake_type}</h1>
              <p className="opacity-90 flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                Requested on {formatDateTime(cake.created_at)}
              </p>
            </div>
            <div
              className={`rounded-2xl px-6 py-2 shadow-lg backdrop-blur-md bg-white/10 border border-white/20`}
            >
              <div className="text-xs uppercase tracking-widest">
                Current Status
              </div>
              <div
                className={`text-2xl font-bold mt-2 ${STATUS_META[cake.status]?.color || "text-white"
                  }`}
              >
                {STATUS_META[cake.status]?.title}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ================= STATUS TRACKER ================= */}
      <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-amber-500 px-6 py-5 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6" />
            Request Status
          </h2>
          <p className="text-sm opacity-90 mt-1">
            Track your custom cake request.
          </p>
        </div>
        <h2 className=" px-4">
            <Info
              icon={<Package className="w-5 h-5" />}
              title="Order ID"
              value={cake.id}
            />
          </h2>
        <div className="p-2">
          {cake.status === "rejected" ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                <XCircle className="w-7 h-7 text-red-600" />
              </div>
              <h2 className="mt-2 text-3xl font-bold text-red-600">
                Request Rejected
              </h2>
              <p className="mt-1 text-gray-500 text-center max-w-md leading-7">
                Unfortunately we couldn't accept your custom cake request.
              </p>
              {cake.rejection_reason && (
                <div className="mt-2 rounded-2xl bg-red-50 border border-red-200 px-6 py-4 text-red-700 font-medium">
                  Reason : {cake.rejection_reason}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Timeline */}
              <div className="grid grid-cols-3 relative">
                {STAGES.map((stage, index) => {
                  const Icon = stage.icon;
                  const active = index <= idx;
                  const current = index === idx;
                  return (
                    <div
                      key={stage.key}
                      className="relative flex flex-col items-center"
                    >
                      {index !== STAGES.length - 1 && (
                        <div
                          className={`absolute top-7 left-1/2 w-full h-1 rounded-full transition-all duration-700 ${
                            index < idx
                              ? "bg-blue-500"
                              : "bg-gray-200"
                          }`}
                        />
                      )}
                      <div
                        className={`
                        relative z-10
                        w-16
                        h-16
                        rounded-full
                        flex
                        items-center
                        justify-center
                        shadow-lg
                        transition-all
                        duration-500
                        ${
                          active
                            ? "bg-gradient-to-br from-blue-500 to-amber-500 text-white"
                            : "bg-white border-2 border-gray-300 text-gray-400"
                        }
                        ${
                          current
                            ? "scale-110 animate-pulse"
                            : ""
                        }
                        `}
                      >
                        <Icon className="w-7 h-7" />
                      </div>
                      <div className="mt-4 text-center">
                        <div
                          className={`font-semibold ${
                            active
                              ? "text-blue-600"
                              : "text-gray-500"
                          }`}
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
            </>
          )}
        </div>
      </div>
      {/* ================= MAIN CONTENT ================= */}
      <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          {/* Cake Details */}
          <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-amber-500 text-white px-6 py-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Cake className="w-6 h-6" />
                Cake Details
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 p-4">
              <Info icon={<Cake className="w-5 h-5" />} title="Cake Type" value={cake.cake_type} />
              <Info icon={<Package className="w-5 h-5" />} title="Cake Size" value={cake.cake_size} />
              <Info icon={<Cake className="w-5 h-5" />} title="Flavor" value={cake.flavor} />
              <Info icon={<Package className="w-5 h-5" />} title="Quantity" value={cake.quantity} />
              <Info icon={<CalendarDays className="w-5 h-5" />} title="Delivery Date" value={cake.delivery_date} />
              <Info icon={<Clock3 className="w-5 h-5" />} title="Delivery Time" value={cake.delivery_time} />
            </div>
            {cake.message && (
              <div className="border-t border-blue-100 p-3">
                <h3 className="font-semibold mb-1">
                  Special Message
                </h3>
                <div className="rounded-2xl bg-blue-50 border border-blue-100 p-3 leading-5">
                  {cake.message}
                </div>
              </div>
            )}
          </div>
          {/* Reference Image */}
          {cake.reference_image && (
            <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-amber-500 text-white px-6 py-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ImageIcon className="w-6 h-6" />
                  Reference Image
                </h2>
              </div>
              <div className="p-6">
                <img
                  src={cake.reference_image}
                  alt="Reference"
                  className="w-full rounded-2xl object-cover shadow-lg hover:scale-[1.02] transition duration-500"
                />
              </div>
            </div>
          )}
        </div>
        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-6">
            <h2 className="text-xl font-bold mb-5">
              Customer
            </h2>
            <Info icon={<User className="w-5 h-5" />} title="Name" value={cake.user_name} />
            <Info icon={<Mail className="w-5 h-5" />} title="Email" value={cake.user_email} />
            <Info icon={<Phone className="w-5 h-5" />} title="Phone" value={cake.phone} />
            <Info icon={<MapPin className="w-5 h-5" />} title="Address" value={cake.address} />
          </div>
          {/* Price */}
          <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-6">
            <h2 className="text-xl font-bold mb-5">Pricing</h2>
            <Info
              icon={<IndianRupee className="w-5 h-5" />}
              title="Custom Price"
              value={
                cake.custom_price
                  ? `₹${cake.custom_price}`
                  : "Price Pending"
              }
            />
          </div>
          {/* Request Info */}
          <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-6">
            <h2 className="text-xl font-bold mb-5">Request Details
            </h2>
            <Info
              icon={<Package className="w-5 h-5" />}
              title="Order ID"
              value={cake.id}
            />
            <Info
              icon={<Clock3 className="w-5 h-5" />}
              title="Requested On"
              value={formatDateTime(cake.created_at)}
            />
            {cake.delivered_at && (
              <Info
                icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
                title="Delivered On"
                value={formatDateTime(cake.delivered_at)}
              />
            )}
          </div>
        </div>
      </div>
      {/* BACK BUTTON */}
      <div className="mt-10 text-center">
        <Link
          to="/my-orders"
          className="inline-flex items-center px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-amber-500 text-white font-semibold shadow-lg hover:scale-105 transition duration-300"
        >
          ← Back to My Orders
        </Link>
      </div>
    </div>
  );
}
/* ================= Helper Component ================= */
function Info({ icon, title, value }) {
  return (
    <div className="flex gap-4 items-start py-3">
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-500 uppercase tracking-wide">
          {title}
        </div>
        <div className="font-medium mt-1 break-words">
          {value || "—"}
        </div>
      </div>
    </div>
  );
}