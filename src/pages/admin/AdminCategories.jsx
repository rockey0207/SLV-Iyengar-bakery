import { useEffect, useState } from "react";
import api, { formatErr } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", image: "", enabled: true });
  const [editId, setEditId] = useState(null);

  const load = () => api.get("/categories?all=true").then((r) => setCategories(r.data));
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm({ name: "", image: "", enabled: true }); setEditId(null); setOpen(true); };
  const openEdit = (c) => { setForm({ name: c.name, image: c.image || "", enabled: c.enabled !== false }); setEditId(c.id); setOpen(true); };

  const save = async () => {
    try {
      if (editId) await api.put(`/categories/${editId}`, form);
      else await api.post("/categories", form);
      toast.success(editId ? "Category updated" : "Category created");
      setOpen(false);
      load();
    } catch (e) { toast.error(formatErr(e)); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try { await api.delete(`/categories/${id}`); toast.success("Deleted"); load(); }
    catch (e) { toast.error(formatErr(e)); }
  };

  const toggleEnabled = async (c) => {
    try {
      await api.put(`/categories/${c.id}`, { name: c.name, image: c.image, enabled: !c.enabled });
      load();
    } catch (e) { toast.error(formatErr(e)); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl font-bold">Category Management</h1>
        <Button onClick={openNew} className="btn-primary rounded-full"><Plus className="w-4 h-4 mr-1" /> Add Category</Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {categories.map((c) => (
          <div key={c.id} className={`bg-white border rounded-xl overflow-hidden ${c.enabled === false ? "opacity-50 border-red-200" : "border-[#E6DFD5]"}`}>
            {c.image && <img src={c.image} alt={c.name} className="w-full h-28 object-cover" />}
            <div className="p-3">
              <div className="font-semibold">{c.name}</div>
              <Badge variant={c.enabled !== false ? "success" : "destructive"} className="mt-1">{c.enabled !== false ? "Enabled" : "Disabled"}</Badge>
              <div className="flex gap-1 mt-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(c)}><Pencil className="w-3 h-3" /></Button>
                <Button size="sm" variant="outline" onClick={() => toggleEnabled(c)}>{c.enabled !== false ? "Disable" : "Enable"}</Button>
                <Button size="sm" variant="outline" onClick={() => remove(c.id)}><Trash2 className="w-3 h-3" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Edit Category" : "Add Category"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Category Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Category Image URL</Label><Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." /></div>
            {form.image && <img src={form.image} alt="preview" className="w-full h-32 object-cover rounded-lg" />}
            <div className="flex items-center gap-2"><Switch checked={form.enabled} onCheckedChange={(v) => setForm({ ...form, enabled: v })} /><Label>Enabled</Label></div>
            <Button onClick={save} className="btn-primary w-full">{editId ? "Update" : "Create"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
