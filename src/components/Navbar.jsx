import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  MapPin,
  LogOut,
  Sparkles,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLocation } from "@/context/LocationContext";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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

    if (q.trim()) {
      nav(`/categories?q=${encodeURIComponent(q)}`);
      setOpen(false);
    }
  };

  const closeMobileMenu = () => {
    setOpen(false);
  };

  return (
    <header
      className="
        sticky top-0 z-50
        bg-white/90 backdrop-blur-xl
        border-b border-[#E9E1D8]
        shadow-[0_4px_25px_rgba(45,30,22,0.06)]
        transition-all duration-300
      "
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* MAIN NAVBAR */}
        <div className="flex items-center justify-between h-[72px] lg:h-[82px]">

          {/* LOGO */}
          <Link
            to="/"
            className="
              group flex items-center gap-2.5
              transition-all duration-300
              hover:-translate-y-[1px]
            "
            data-testid="logo-link"
          >
            <div
              className="
                relative
                flex items-center justify-center
                w-11 h-11
                sm:w-12 sm:h-12
                lg:w-14 lg:h-14
                rounded-2xl
                bg-[#FFF8EF]
                border border-[#F0E3D5]
                shadow-sm
                transition-all duration-500
                group-hover:scale-105
                group-hover:rotate-2
                group-hover:shadow-lg
              "
            >
              <img
                src="/bakery-icon-logo.png"
                alt="SLV Bakery Logo"
                className="
                  w-9 h-9
                  sm:w-10 sm:h-10
                  lg:w-12 lg:h-12
                  object-contain
                  transition-transform duration-500
                  group-hover:scale-110
                "
              />

              {/* Small sparkle */}
              <Sparkles
                className="
                  absolute
                  -top-1
                  -right-1
                  w-4 h-4
                  text-[#06C9D0]
                  opacity-0
                  scale-50
                  transition-all duration-300
                  group-hover:opacity-100
                  group-hover:scale-100
                "
              />
            </div>

            <div className="hidden sm:block">
              <div
                className="
                  font-display
                  text-xl lg:text-2xl
                  font-bold
                  tracking-tight
                  text-[#2D1E16]
                  leading-none
                "
              >
                SLV Bakery
              </div>

              <div
                className="
                  mt-1
                  text-[9px] lg:text-[10px]
                  uppercase
                  tracking-[0.18em]
                  text-[#7A685B]
                  font-medium
                "
              >
                Freshly Baked · 25 min
              </div>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) => `
                  group relative
                  py-2
                  text-[13px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  transition-all duration-300
                  ${
                    isActive
                      ? "text-[#06BFC7]"
                      : "text-[#49372C] hover:text-[#06BFC7]"
                  }
                `}
                data-testid={`nav-${l.label
                  .toLowerCase()
                  .replaceAll(" ", "-")}`}
              >
                {l.label}

                {/* Animated underline */}
                <span
                  className="
                    absolute
                    left-1/2
                    -bottom-1
                    h-[2px]
                    w-0
                    -translate-x-1/2
                    rounded-full
                    bg-[#06C9D0]
                    transition-all duration-300
                    group-hover:w-full
                  "
                />
              </NavLink>
            ))}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5">

            {/* SEARCH */}
            <form
              onSubmit={doSearch}
              className="
                hidden md:flex
                group
                items-center
                h-10
                w-48
                lg:w-56
                xl:w-64
                rounded-full
                bg-[#FAF7F2]
                border border-[#E8DED4]
                px-3.5
                transition-all duration-300
                focus-within:w-64
                lg:focus-within:w-72
                focus-within:bg-white
                focus-within:border-[#06C9D0]
                focus-within:shadow-[0_0_0_4px_rgba(6,201,208,0.08)]
              "
            >
              <Search
                className="
                  w-4 h-4
                  text-[#806F63]
                  shrink-0
                  transition-colors duration-300
                  group-focus-within:text-[#06C9D0]
                "
              />

              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search cakes, breads..."
                className="
                  bg-transparent
                  outline-none
                  focus:outline-none
                  focus:ring-0
                  text-sm
                  text-[#2D1E16]
                  placeholder:text-[#9B8D83]
                  w-full
                  ml-2
                "
                data-testid="search-input"
              />
            </form>

            {/* DELIVERY STATUS */}
            <div
              className="
                hidden xl:flex
                items-center gap-1.5
                px-3
                h-9
                rounded-full
                bg-[#F1FBF9]
                border border-[#D5F1ED]
                text-[11px]
                font-semibold
                text-[#32776F]
                whitespace-nowrap
                transition-all duration-300
                hover:bg-[#E7F8F5]
                hover:-translate-y-0.5
              "
              data-testid="delivery-status"
            >
              <MapPin className="w-3.5 h-3.5 text-[#06A9A8]" />

              <span>
                {status?.in_range
                  ? `Delivering · ${status?.distance_km} km`
                  : "Outside Radius"}
              </span>

              {status?.in_range && (
                <span className="relative flex h-2 w-2 ml-0.5">
                  <span
                    className="
                      absolute
                      inline-flex
                      h-full
                      w-full
                      rounded-full
                      bg-[#20B486]
                      opacity-60
                      animate-ping
                    "
                  />
                  <span
                    className="
                      relative
                      inline-flex
                      h-2
                      w-2
                      rounded-full
                      bg-[#20B486]
                    "
                  />
                </span>
              )}
            </div>

            {/* FAVORITES */}
            <Link
              to="/favorites"
              className="
                group
                relative
                flex items-center justify-center
                w-10 h-10
                rounded-full
                text-[#4D3B30]
                transition-all duration-300
                hover:bg-[#FFF4F1]
                hover:text-[#E75B62]
                hover:-translate-y-0.5
              "
              data-testid="nav-favorites"
            >
              <Heart
                className="
                  w-[19px] h-[19px]
                  transition-all duration-300
                  group-hover:scale-110
                  group-hover:fill-[#FFE2E0]
                "
                strokeWidth={1.8}
              />

              {favoriteCount > 0 && (
                <span
                  className="
                    absolute
                    -top-0.5
                    -right-0.5
                    min-w-[19px]
                    h-[19px]
                    px-1
                    bg-[#E85D64]
                    text-white
                    text-[9px]
                    rounded-full
                    flex items-center justify-center
                    font-bold
                    border-2 border-white
                    animate-[bounce_0.5s_ease-out]
                  "
                >
                  {favoriteCount > 99 ? "99+" : favoriteCount}
                </span>
              )}
            </Link>

            {/* CART */}
            <Link
              to="/cart"
              className="
                group
                relative
                flex items-center justify-center
                w-10 h-10
                rounded-full
                text-[#4D3B30]
                transition-all duration-300
                hover:bg-[#FFF8ED]
                hover:text-[#C98631]
                hover:-translate-y-0.5
              "
              data-testid="nav-cart"
            >
              <ShoppingCart
                className="
                  w-[19px] h-[19px]
                  transition-all duration-300
                  group-hover:scale-110
                "
                strokeWidth={1.8}
              />

              {count > 0 && (
                <span
                  className="
                    absolute
                    -top-0.5
                    -right-0.5
                    min-w-[19px]
                    h-[19px]
                    px-1
                    bg-[#06C9D0]
                    text-white
                    text-[9px]
                    rounded-full
                    flex items-center justify-center
                    font-bold
                    border-2 border-white
                    animate-[bounce_0.5s_ease-out]
                  "
                >
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="
                      group
                      flex items-center justify-center
                      w-10 h-10
                      rounded-full
                      bg-[#F8F4EF]
                      border border-[#E9DED2]
                      text-[#49372C]
                      transition-all duration-300
                      hover:bg-[#FFF8ED]
                      hover:border-[#06C9D0]
                      hover:text-[#06AEB5]
                      hover:shadow-md
                      hover:-translate-y-0.5
                      focus:outline-none
                    "
                    data-testid="user-menu"
                  >
                    <User
                      className="
                        w-[18px] h-[18px]
                        transition-transform duration-300
                        group-hover:scale-110
                      "
                      strokeWidth={1.8}
                    />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={10}
                  className="
                    w-60
                    rounded-2xl
                    border-[#E8DED4]
                    bg-white/95
                    backdrop-blur-xl
                    shadow-[0_15px_50px_rgba(45,30,22,0.14)]
                    p-2
                    animate-in
                    fade-in
                    zoom-in-95
                    slide-in-from-top-2
                    duration-200
                  "
                >
                  <DropdownMenuLabel className="px-3 py-2.5">
                    <div className="text-xs text-[#8B7B70] font-medium">
                      Welcome back
                    </div>

                    <div className="mt-0.5 text-sm font-bold text-[#2D1E16] truncate">
                      Hi, {user.name}
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-[#EFE7DE]" />

                  <DropdownMenuItem
                    onClick={() => nav("/profile")}
                    className="rounded-xl cursor-pointer py-2.5"
                    data-testid="menu-profile"
                  >
                    <User className="w-4 h-4 mr-2.5" />
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => nav("/my-orders")}
                    className="rounded-xl cursor-pointer py-2.5"
                    data-testid="menu-orders"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2.5" />
                    My Orders
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => nav("/favorites")}
                    className="rounded-xl cursor-pointer py-2.5"
                  >
                    <Heart className="w-4 h-4 mr-2.5" />
                    Favorites
                  </DropdownMenuItem>

                  {user.role === "admin" && (
                    <DropdownMenuItem
                      onClick={() => nav("/admin")}
                      className="rounded-xl cursor-pointer py-2.5"
                    >
                      <Sparkles className="w-4 h-4 mr-2.5 text-[#06BFC7]" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator className="bg-[#EFE7DE]" />

                  <DropdownMenuItem
                    onClick={logout}
                    className="
                      rounded-xl
                      cursor-pointer
                      py-2.5
                      text-[#D9534F]
                      focus:text-[#D9534F]
                      focus:bg-[#FFF1F0]
                    "
                    data-testid="menu-logout"
                  >
                    <LogOut className="w-4 h-4 mr-2.5" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login" className="hidden md:block">
                <Button
                  className="
                    h-10
                    px-5
                    rounded-full
                    bg-[#06C9D0]
                    hover:bg-[#05AEB5]
                    text-white
                    font-semibold
                    shadow-[0_5px_15px_rgba(6,201,208,0.22)]
                    hover:shadow-[0_7px_20px_rgba(6,201,208,0.32)]
                    hover:-translate-y-0.5
                    transition-all duration-300
                  "
                  data-testid="login-btn"
                >
                  Login
                </Button>
              </Link>
            )}

            {/* MOBILE MENU */}
            <button
              className="
                lg:hidden
                flex items-center justify-center
                w-10 h-10
                rounded-full
                text-[#49372C]
                hover:bg-[#F8F3ED]
                transition-all duration-300
              "
              onClick={() => setOpen(!open)}
              data-testid="mobile-menu-toggle"
              aria-label="Toggle menu"
            >
              {open ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`
            lg:hidden
            overflow-hidden
            transition-all duration-300 ease-out
            ${
              open
                ? "max-h-[500px] opacity-100 pb-5"
                : "max-h-0 opacity-0"
            }
          `}
        >
          <div className="pt-3 border-t border-[#E9E1D8]">

            {/* MOBILE SEARCH */}
            <form
              onSubmit={doSearch}
              className="
                flex items-center
                bg-[#FAF7F2]
                border border-[#E8DED4]
                rounded-2xl
                px-4
                h-11
                mb-4
                transition-all duration-300
                focus-within:bg-white
                focus-within:border-[#06C9D0]
                focus-within:shadow-[0_0_0_4px_rgba(6,201,208,0.08)]
              "
            >
              <Search className="w-4 h-4 text-[#806F63]" />

              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search cakes, breads..."
                className="
                  bg-transparent
                  outline-none
                  text-sm
                  w-full
                  ml-2
                  text-[#2D1E16]
                  placeholder:text-[#9B8D83]
                "
              />
            </form>

            {/* MOBILE NAV LINKS */}
            <div className="space-y-1">
              {links.map((l, index) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  onClick={closeMobileMenu}
                  className={({ isActive }) => `
                    flex items-center
                    px-4
                    py-3
                    rounded-xl
                    text-sm
                    font-semibold
                    transition-all duration-300
                    ${
                      isActive
                        ? "bg-[#EAFBFB] text-[#06AEB5] translate-x-1"
                        : "text-[#49372C] hover:bg-[#FAF5EF] hover:translate-x-1"
                    }
                  `}
                  style={{
                    transitionDelay: open ? `${index * 30}ms` : "0ms",
                  }}
                >
                  {l.label}
                </NavLink>
              ))}
            </div>

            {/* MOBILE DELIVERY */}
            <div
              className="
                flex items-center justify-between
                mt-3
                px-4
                py-3
                rounded-xl
                bg-[#F1FBF9]
                border border-[#D7EFEC]
              "
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#06A9A8]" />

                <span className="text-xs font-semibold text-[#32776F]">
                  {status?.in_range
                    ? `Delivering within ${status?.distance_km} km`
                    : "Outside delivery radius"}
                </span>
              </div>

              {status?.in_range && (
                <span className="w-2 h-2 rounded-full bg-[#20B486] animate-pulse" />
              )}
            </div>

            {/* MOBILE LOGIN */}
            {!user && (
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="block mt-3"
              >
                <Button
                  className="
                    w-full
                    h-11
                    rounded-xl
                    bg-[#06C9D0]
                    hover:bg-[#05AEB5]
                    text-white
                    font-semibold
                    shadow-md
                    transition-all duration-300
                    hover:-translate-y-0.5
                  "
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}