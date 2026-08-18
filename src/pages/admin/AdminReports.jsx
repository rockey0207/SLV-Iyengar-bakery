import { useEffect, useState } from "react";
import api, { formatErr } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileSpreadsheet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function AdminReports() {
  const [period, setPeriod] = useState("daily");
  const [report, setReport] = useState(null);

  useEffect(() => {
    api.get(`/admin/reports?period=${period}`).then((r) => setReport(r.data));
  }, [period]);

  const exportFile = async (format) => {
    try {
      const { data } = await api.get(`/admin/reports/export?period=${period}&format=${format}`, {
        responseType: format === "excel" ? "blob" : "text",
      });
      if (format === "excel") {
        const url = URL.createObjectURL(new Blob([data], { type: "text/csv" }));
        const a = document.createElement("a");
        a.href = url;
        a.download = `slv_report_${period}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const w = window.open("", "_blank");
        w.document.write(data);
        w.document.close();
        w.print();
      }
    } catch (e) { toast.error(formatErr(e)); }
  };

  if (!report) return <div>Loading reports...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="font-display text-3xl font-bold">Report Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportFile("pdf")}><Download className="w-4 h-4 mr-1" /> Export PDF</Button>
          <Button variant="outline" onClick={() => exportFile("excel")}><FileSpreadsheet className="w-4 h-4 mr-1" /> Export Excel</Button>
        </div>
      </div>

      <Tabs value={period} onValueChange={setPeriod}>
        <TabsList>
          <TabsTrigger value="daily">Weeks</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>

        {["daily", "monthly", "yearly"].map((p) => (
          <TabsContent key={p} value={p}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Card><CardHeader><CardTitle className="text-sm text-[#5C4A3D]">Orders</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{report.summary?.orders || 0}</div></CardContent></Card>
              <Card><CardHeader><CardTitle className="text-sm text-[#5C4A3D]">Revenue</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">₹{(report.summary?.revenue || 0).toLocaleString()}</div></CardContent></Card>
              <Card><CardHeader><CardTitle className="text-sm text-[#5C4A3D]">Products Sold</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{report.summary?.products_sold || 0}</div></CardContent></Card>
            </div>

            <Card className="mb-6">
              <CardHeader><CardTitle>{p === "daily" ? "Daily" : p === "monthly" ? "Monthly Revenue Analysis" : "Yearly Revenue Summary"}</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={report.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#06d2d9" name="Revenue" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="orders" fill="#3E2A1F" name="Orders" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Top Products</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Sold</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {report.top_products?.map((p) => (
                        <TableRow key={p.name}><TableCell>{p.name}</TableCell><TableCell>{p.sold}</TableCell></TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>{p === "yearly" ? "Category Performance" : "Customer Growth"}</CardTitle></CardHeader>
                <CardContent>
                  {p === "yearly" ? (
                    <Table>
                      <TableHeader><TableRow><TableHead>Category</TableHead><TableHead>Sold</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {report.top_categories?.map((c) => (
                          <TableRow key={c.name}><TableCell>{c.name}</TableCell><TableCell>{c.sold}</TableCell></TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between text-lg"><span>New Customers</span><b>{report.customer_growth?.new || 0}</b></div>
                      <div className="flex justify-between text-lg"><span>Total Customers</span><b>{report.customer_growth?.total || 0}</b></div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
