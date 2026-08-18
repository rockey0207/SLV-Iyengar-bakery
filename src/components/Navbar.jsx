import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart, Heart, User, Search, Menu, X, MapPin, Cake, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLocation } from "@/context/LocationContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count, favorites } = useCart();
  const { status } = useLocation();
  const favoriteCount = favorites?.length || 0;
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const links = [
    { to: "/", label: "Home" },
    { to: "/categories", label: "Categories" },
    { to: "/birthday-cake", label: "Birthday Cake" },
    { to: "/contact", label: "Contact" },
  ];

  const doSearch = (e) => {
    e.preventDefault();
    if (q.trim()) nav(`/categories?q=${encodeURIComponent(q)}`);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 glass border-b border-[#E6DFD5]" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2" data-testid="logo-link">
            <img
              src="/bakery-icon-logo.png"
              alt="SLV Bakery Logo"
              className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 object-contain"
            />
            <div>
              <div className="font-display text-xl lg:text-2xl font-bold leading-none">
                SLV Bakery
              </div>
              <div className="text-[10px] uppercase-tracked text-[#5C4A3D] leading-none">
                Freshly Baked · 25 min
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"}
                className={({ isActive }) =>
                  `text-sm uppercase-tracked transition-colors ${isActive ? "text-[#06d2d9]" : "text-[#2D1E16] hover:text-[#06d2d9]"}`
                }
                data-testid={`nav-${l.label.toLowerCase().replaceAll(" ", "-")}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 lg:gap-3">
            <form onSubmit={doSearch} className="hidden md:flex items-center bg-white border border-[#E6DFD5] rounded-full px-4 h-10 w-56">
              <Search className="w-4 h-4 text-[#5C4A3D]" />
              <input value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="Search cakes, breads..."
                className="bg-transparent outline-none focus:outline-none focus:ring-0 text-sm w-full ml-2"
                data-testid="search-input" />
            </form>

            <div className="hidden md:flex items-center gap-1.5 text-xs text-[#5C4A3D]" data-testid="delivery-status">
              <MapPin className="w-3.5 h-3.5" />
              <span>{status?.in_range ? `Delivering (${status?.distance_km}km)` : "Outside Radius"}</span>
            </div>

            <Link to="/favorites" className="p-2 rounded-full hover:bg-[#FBF5EA] relative" data-testid="nav-favorites">
              <Heart className="w-5 h-5" />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#06d2d9] text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {favoriteCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="p-2 rounded-full hover:bg-[#FBF5EA] relative" data-testid="nav-cart">
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#06d2d9] text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {count}
                </span>
              )}
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-[#FBF5EA]" data-testid="user-menu">
                    <User className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Hi, {user.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => nav("/profile")} data-testid="menu-profile">Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => nav("/my-orders")} data-testid="menu-orders">My Orders</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => nav("/favorites")}>Favorites</DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem onClick={() => nav("/admin")}>Admin Panel</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} data-testid="menu-logout">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button className="btn-primary rounded-full hidden md:inline-flex" data-testid="login-btn">Login</Button>
              </Link>
            )}

            <button className="lg:hidden p-2" onClick={() => setOpen(!open)} data-testid="mobile-menu-toggle">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden py-4 border-t border-[#E6DFD5] space-y-2">
            <form onSubmit={doSearch} className="flex items-center bg-white border border-[#E6DFD5] rounded-full px-4 h-10 mb-3">
              <Search className="w-4 h-4 text-[#5C4A3D]" />
              <input value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="Search..." className="bg-transparent outline-none text-sm w-full ml-2" />
            </form>
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}
                className="block py-2 text-sm uppercase-tracked">
                {l.label}
              </NavLink>
            ))}
            {!user && <Link to="/login" onClick={() => setOpen(false)}><Button className="btn-primary w-full rounded-full">Login</Button></Link>}
          </div>
        )}
      </div>
    </header>
  );
}
