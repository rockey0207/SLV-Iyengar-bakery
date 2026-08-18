import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, IndianRupee, Users, Package, AlertTriangle } from "lucide-react";

const Stat = ({ icon: Icon, label, value, color }) => (
  <Card>
    <CardContent className="p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <div className="text-sm text-[#5C4A3D]">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard").then((r) => setData(r.data));
  }, []);

  if (!data) return <div>Loading dashboard...</div>;

  const statusColor = { placed: "warning", confirmed: "secondary", rider_assigned: "default", delivered: "success", cancelled: "destructive" };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat icon={ShoppingBag} label="Total Orders" value={data.total_orders} color="bg-[#06d2d9]" />
        <Stat icon={IndianRupee} label="Revenue" value={`₹${data.revenue?.toLocaleString()}`} color="bg-[#4D7C0F]" />
        <Stat icon={Users} label="Customers" value={data.total_customers} color="bg-[#3E2A1F]" />
        <Stat icon={Package} label="Products" value={data.total_products} color="bg-[#BE123C]" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {data.recent_orders?.map((o) => (
              <div key={o.id} className="flex justify-between items-center text-sm border-b border-[#F3EEE4] pb-2">
                <div><div className="font-medium">{o.order_no}</div><div className="text-[#5C4A3D]">{o.user_name}</div></div>
                <div className="text-right">
                  <Badge variant={statusColor[o.status] || "outline"}>{o.status}</Badge>
                  <div className="mt-1">₹{o.total}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#06d2d9]" />
            <CardTitle>Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.low_stock?.length ? data.low_stock.map((p) => (
              <div key={p.id} className="flex justify-between text-sm">
                <span>{p.name}</span>
                <Badge variant="destructive">{p.stock} left</Badge>
              </div>
            )) : <p className="text-sm text-[#5C4A3D]">All products well stocked</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
