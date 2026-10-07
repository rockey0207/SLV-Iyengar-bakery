import {
  Outlet,
  NavLink,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

import { useAuth } from "@/context/AuthContext";

import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderOpen,
  BarChart3,
  Users,
  Cake,
  LogOut,
  Shield,
  Menu,
  X,
} from "lucide-react";

const NAV = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/admin/orders",
    label: "Orders",
    icon: ShoppingBag,
  },
  {
    to: "/admin/custom-cakes",
    label: "Custom Cakes",
    icon: Cake,
  },
  {
    to: "/admin/products",
    label: "Products",
    icon: Package,
  },
  {
    to: "/admin/categories",
    label: "Categories",
    icon: FolderOpen,
  },
  {
    to: "/admin/customers",
    label: "Customers",
    icon: Users,
  },
  {
    to: "/admin/reports",
    label: "Reports",
    icon: BarChart3,
  },
];

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();

  const nav = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="text-[#3E2A1F] text-sm sm:text-base">
          Loading...
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    nav("/admin/login");
  };

  const handleNavigation = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">

      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}
      <aside
        className="
          hidden
          lg:flex
          fixed
          inset-y-0
          left-0
          z-40
          w-64
          bg-[#3E2A1F]
          text-white
          flex-col
        "
      >

        {/* Admin Header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">

            <div className="shrink-0">
              <Shield className="w-7 h-7 text-[#06d2d9]" />
            </div>

            <div className="min-w-0">
              <div className="font-display font-bold truncate">
                SLV Admin
              </div>

              <div className="text-xs text-white/60 truncate mt-0.5">
                {user.username || user.email}
              </div>
            </div>

          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">

          {NAV.map(
            ({
              to,
              label,
              icon: Icon,
              end,
            }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `
                    flex
                    items-center
                    gap-3
                    px-3
                    py-2.5
                    rounded-lg
                    text-sm
                    transition-colors
                    ${
                      isActive
                        ? "bg-[#06d2d9] text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }
                  `
                }
              >
                <Icon className="w-4 h-4 shrink-0" />

                <span className="truncate">
                  {label}
                </span>
              </NavLink>
            )
          )}

        </nav>

        {/* Desktop Logout */}
        <div className="p-3 border-t border-white/10">

          <button
            onClick={handleLogout}
            className="
              flex
              items-center
              gap-3
              px-3
              py-2.5
              rounded-lg
              text-sm
              text-white/70
              hover:bg-white/10
              hover:text-white
              w-full
              transition-colors
            "
          >
            <LogOut className="w-4 h-4 shrink-0" />

            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>


      {/* =====================================================
          MOBILE / TABLET TOP HEADER
      ====================================================== */}
      <header
        className="
          lg:hidden
          sticky
          top-0
          z-50
          bg-[#3E2A1F]
          text-white
          shadow-md
        "
      >

        <div
          className="
            min-h-[64px]
            px-4
            sm:px-5
            flex
            items-center
            justify-between
            gap-3
          "
        >

          {/* Logo */}
          <div className="flex items-center gap-3 min-w-0">

            <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-[#06d2d9] shrink-0" />

            <div className="min-w-0">
              <div className="font-display font-bold text-sm sm:text-base">
                SLV Admin
              </div>

              <div className="text-[10px] sm:text-xs text-white/60 truncate max-w-[180px]">
                {user.username || user.email}
              </div>
            </div>

          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen((value) => !value)
            }
            className="
              shrink-0
              w-10
              h-10
              rounded-lg
              flex
              items-center
              justify-center
              hover:bg-white/10
              active:bg-white/20
              transition-colors
            "
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

        </div>


        {/* Mobile / Tablet Navigation */}
        {mobileMenuOpen && (
          <div
            className="
              border-t
              border-white/10
              bg-[#3E2A1F]
              px-3
              py-3
              max-h-[calc(100vh-64px)]
              overflow-y-auto
            "
          >

            <nav className="space-y-1">

              {NAV.map(
                ({
                  to,
                  label,
                  icon: Icon,
                  end,
                }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={handleNavigation}
                    className={({ isActive }) =>
                      `
                        flex
                        items-center
                        gap-3
                        px-3
                        py-3
                        rounded-lg
                        text-sm
                        transition-colors
                        ${
                          isActive
                            ? "bg-[#06d2d9] text-white"
                            : "text-white/75 hover:bg-white/10 hover:text-white"
                        }
                      `
                    }
                  >

                    <Icon className="w-5 h-5 shrink-0" />

                    <span>
                      {label}
                    </span>

                  </NavLink>
                )
              )}

            </nav>


            {/* Mobile Logout */}
            <div className="border-t border-white/10 mt-3 pt-3">

              <button
                onClick={handleLogout}
                className="
                  flex
                  items-center
                  gap-3
                  px-3
                  py-3
                  rounded-lg
                  text-sm
                  text-white/75
                  hover:bg-white/10
                  hover:text-white
                  w-full
                  transition-colors
                "
              >

                <LogOut className="w-5 h-5" />

                <span>
                  Logout
                </span>

              </button>

            </div>

          </div>
        )}

      </header>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <main
        className="
          min-h-screen
          lg:ml-64
          overflow-x-hidden
        "
      >

        <div
          className="
            w-full
            max-w-7xl
            mx-auto
            px-3
            py-4
            sm:px-5
            sm:py-5
            md:px-6
            md:py-6
            lg:px-8
            lg:py-8
          "
        >

          <Outlet />

        </div>

      </main>

    </div>
  );
}