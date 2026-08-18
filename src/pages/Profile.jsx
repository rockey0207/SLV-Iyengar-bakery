import { useAuth } from "@/context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, MapPin, Phone, Mail, Package } from "lucide-react";

export default function Profile() {
  const { user, logout, loading } = useAuth();
  if (loading) return <div className="py-20 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return (
    <div className="max-w-3xl mx-auto px-4 py-10" data-testid="profile-page">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-6">My Profile</h1>
      <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 card-shadow">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#06d2d9] flex items-center justify-center text-white text-2xl font-bold">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-xl">{user.name}</div>
            <div className="text-sm text-[#5C4A3D] capitalize">{user.role}</div>
          </div>
        </div>
        <div className="mt-6 space-y-3 text-sm">
          <Row Icon={Mail} label="Email" value={user.email} />
          <Row Icon={Phone} label="Phone" value={user.phone} />
          <Row Icon={MapPin} label="Address" value={`${user.address}, ${user.city}, ${user.state} ${user.pincode}`} />
        </div>
        <div className="flex gap-3 mt-6">
          <Link to="/my-orders"><Button className="btn-primary rounded-full" data-testid="profile-orders"><Package className="w-4 h-4 mr-1" /> My Orders</Button></Link>
          <Button onClick={logout} variant="outline" className="rounded-full" data-testid="profile-logout">Logout</Button>
        </div>
      </div>
    </div>
  );
}
const Row = ({ Icon, label, value }) => (
  <div className="flex items-start gap-3"><Icon className="w-4 h-4 text-[#06d2d9] mt-1" /><div><div className="uppercase-tracked text-xs text-[#5C4A3D]">{label}</div><div>{value}</div></div></div>
);
