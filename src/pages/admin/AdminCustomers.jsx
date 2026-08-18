import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get("/admin/customers").then((r) => setCustomers(r.data));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Customer Management</h1>
      <div className="bg-white border border-[#E6DFD5] rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{c.city}</TableCell>
                <TableCell className="text-xs">{c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => setSelected(c)}><Eye className="w-3 h-3" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Customer Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-2 text-sm">
              <div><b>Name:</b> {selected.name}</div>
              <div><b>Email:</b> {selected.email}</div>
              <div><b>Phone:</b> {selected.phone}</div>
              <div><b>Address:</b> {selected.address}</div>
              <div><b>City:</b> {selected.city}, {selected.state} - {selected.pincode}</div>
              <div><b>Verified:</b> {selected.verified ? "Yes" : "No"}</div>
              <div><b>Member Since:</b> {selected.created_at ? new Date(selected.created_at).toLocaleString() : "—"}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
