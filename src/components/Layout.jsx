import { Outlet, useLocation as useRouterLoc } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingCart from "./FloatingCart";
import OrderTrackingWidget from "./OrderTrackingWidget";
import LocationBanner from "./LocationBanner";

export default function Layout() {
  const { pathname } = useRouterLoc();
  const isCart = pathname === "/cart";
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <Navbar />
      <LocationBanner />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {!isCart && <FloatingCart />}
      <OrderTrackingWidget />
    </div>
  );
}
