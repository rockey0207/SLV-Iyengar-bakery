import { useEffect, useState } from "react";
import api, { formatErr } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";

const TAGS = ["just_arrived", "freshly_baked", "most_ordered", "recommended", "featured"];

const empty = () => ({
  name: "", category: "", description: "", ingredients: "",
  original_price: 0, discount_price: 0, weight: "500g", weight_options: ["500g"],
  images: [""], stock: 100, rating: 4.5, tags: [], in_stock: true,
});

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty());
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const [productsRes, categoriesRes] = await Promise.all([
      api.get("/products?limit=500"),
      api.get("/categories?all=true"),
    ]);
    setProducts(productsRes.data);
    setCategories(categoriesRes.data);
  };
  useEffect(() => { void load(); }, []);

  const openNew = () => { setForm(empty()); setEditId(null); setOpen(true); };
  const openEdit = (p) => {
    setForm({ ...p, images: p.images?.length ? p.images : [""], weight_options: p.weight_options || [p.weight] });
    setEditId(p.id);
    setOpen(true);
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleTag = (t) => setForm((f) => ({
    ...f, tags: f.tags.includes(t) ? f.tags.filter((x) => x !== t) : [...f.tags, t],
  }));

  const save = async () => {
    const payload = { ...form, images: form.images.filter(Boolean), original_price: +form.original_price, discount_price: +form.discount_price, stock: +form.stock, rating: +form.rating };
    try {
      if (editId) await api.put(`/products/${editId}`, payload);
      else await api.post("/products", payload);
      toast.success(editId ? "Product updated" : "Product created");
      setOpen(false);
      await load();
      window.localStorage.setItem("slv_products_updated", String(Date.now()));
      window.dispatchEvent(new Event("slv_products_updated"));
    } catch (e) { toast.error(formatErr(e)); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Deleted");
      await load();
      window.localStorage.setItem("slv_products_updated", String(Date.now()));
      window.dispatchEvent(new Event("slv_products_updated"));
    }
    catch (e) { toast.error(formatErr(e)); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl font-bold">Product Management</h1>
        <Button onClick={openNew} className="btn-primary rounded-full"><Plus className="w-4 h-4 mr-1" /> Add Product</Button>
      </div>
      <div className="bg-white border border-[#E6DFD5] rounded-xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {p.images?.[0] && <img src={p.images[0]} alt="" className="w-10 h-10 rounded object-cover" />}
                    <div><div className="font-medium">{p.name}</div><div className="text-xs text-[#5C4A3D]">{p.weight}</div></div>
                  </div>
                </TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell><span className="line-through text-[#5C4A3D] text-xs">₹{p.original_price}</span> ₹{p.discount_price}</TableCell>
                <TableCell><Badge variant={p.in_stock ? "success" : "destructive"}>{p.stock} / {p.in_stock ? "In Stock" : "Out"}</Badge></TableCell>
                <TableCell><div className="flex flex-wrap gap-1">{p.tags?.slice(0, 2).map((t) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}</div></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => openEdit(p)}><Pencil className="w-3 h-3" /></Button>
                    <Button size="sm" variant="outline" onClick={() => remove(p.id)}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? "Edit Product" : "Add Product"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="col-span-2"><Label>Name</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
            <div><Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => set("category", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Weight</Label><Input value={form.weight} onChange={(e) => set("weight", e.target.value)} /></div>
            <div><Label>Original Price</Label><Input type="number" value={form.original_price} onChange={(e) => set("original_price", e.target.value)} /></div>
            <div><Label>Discount Price</Label><Input type="number" value={form.discount_price} onChange={(e) => set("discount_price", e.target.value)} /></div>
            <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)} /></div>
            <div><Label>Rating</Label><Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => set("rating", e.target.value)} /></div>
            <div className="col-span-2 flex items-center gap-2"><Switch checked={form.in_stock} onCheckedChange={(v) => set("in_stock", v)} /><Label>In Stock</Label></div>
            <div className="col-span-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
            <div className="col-span-2"><Label>Ingredients</Label><Textarea value={form.ingredients} onChange={(e) => set("ingredients", e.target.value)} /></div>
            <div className="col-span-2"><Label>Image URL</Label><Input value={form.images[0] || ""} onChange={(e) => set("images", [e.target.value])} placeholder="https://..." /></div>
            <div className="col-span-2">
              <Label>Product Type Tags</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {TAGS.map((t) => (
                  <button key={t} type="button" onClick={() => toggleTag(t)}
                    className={`px-2 py-1 rounded-full text-xs border ${form.tags.includes(t) ? "bg-[#06d2d9] text-white border-[#06d2d9]" : "border-[#E6DFD5]"}`}>
                    {t.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <Button onClick={save} className="btn-primary w-full mt-4">{editId ? "Update Product" : "Create Product"}</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
