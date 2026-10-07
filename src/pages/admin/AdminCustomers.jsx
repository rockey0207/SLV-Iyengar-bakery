import { useEffect, useState } from "react";

import api from "@/lib/api";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Eye, Search, X } from "lucide-react";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/admin/customers").then((r) => setCustomers(r.data));
  }, []);

  // Filter customers by name, email, or phone
  const filteredCustomers = customers.filter((c) => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) return true;

    return (
      String(c.name || "").toLowerCase().includes(searchText) ||
      String(c.email || "").toLowerCase().includes(searchText) ||
      String(c.phone || "").toLowerCase().includes(searchText)
    );
  });

  return (
    <div>
      {/* Header + Search */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="font-display text-3xl font-bold">
          Customer Management
        </h1>

        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A7A6A]" />

          <Input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-9"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7A6A] hover:text-[#3D2B1F]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Customer Table */}
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
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">
                    {c.name}
                  </TableCell>

                  <TableCell>
                    {c.email}
                  </TableCell>

                  <TableCell>
                    {c.phone}
                  </TableCell>

                  <TableCell>
                    {c.city}
                  </TableCell>

                  <TableCell className="text-xs">
                    {c.created_at
                      ? new Date(c.created_at).toLocaleDateString()
                      : "—"}
                  </TableCell>

                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelected(c)}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-[#8A7A6A]"
                >
                  {search
                    ? "No customers found matching your search."
                    : "No customers found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Customer Details Dialog */}
      <Dialog
        open={!!selected}
        onOpenChange={() => setSelected(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-2 text-sm">
              <div>
                <b>Name:</b> {selected.name}
              </div>

              <div>
                <b>Email:</b> {selected.email}
              </div>

              <div>
                <b>Phone:</b> {selected.phone}
              </div>

              <div>
                <b>Address:</b> {selected.address}
              </div>

              <div>
                <b>City:</b> {selected.city}, {selected.state} -{" "}
                {selected.pincode}
              </div>

              <div>
                <b>Verified:</b>{" "}
                {selected.verified ? "Yes" : "No"}
              </div>

              <div>
                <b>Member Since:</b>{" "}
                {selected.created_at
                  ? new Date(selected.created_at).toLocaleString()
                  : "—"}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}