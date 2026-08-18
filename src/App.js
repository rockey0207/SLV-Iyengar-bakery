import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DeliveryInfo from "./pages/DeliveryInfo";
import { Toaster } from "sonner";
import "@/App.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { LocationProvider } from "@/context/LocationContext";
import { ProductProvider } from "@/context/ProductContext";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import CategoriesPage from "@/pages/CategoriesPage";
import BirthdayCake from "@/pages/BirthdayCake";
import Contact from "@/pages/Contact";
import Favorites from "@/pages/Favorites";
import Cart from "@/pages/Cart";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import VerifyEmail from "@/pages/VerifyEmail";
import Profile from "@/pages/Profile";
import MyOrders from "@/pages/MyOrders";
import OrderDetail from "@/pages/OrderDetail";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminForgotPassword from "@/pages/admin/AdminForgotPassword";
import AdminResetPassword from "@/pages/admin/AdminResetPassword";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminReports from "@/pages/admin/AdminReports";
import AdminCustomers from "@/pages/admin/AdminCustomers";
import AdminCustomCakes from "@/pages/admin/AdminCustomCakes";
import CustomCakeDetail from "./pages/CustomCakeDetail";

// ScrollToTop component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <CartProvider>
          <ProductProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Toaster richColors position="top-center" />
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/birthday-cake" element={<BirthdayCake />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                  <Route path="/orders/:id" element={<OrderDetail />} />
                  <Route path="/custom-cakes/:id" element={<CustomCakeDetail />} />
                  <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/delivery-info" element={<DeliveryInfo />} />
                </Route>
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
                <Route path="/admin/reset-password" element={<AdminResetPassword />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="reports" element={<AdminReports />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="custom-cakes" element={<AdminCustomCakes />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ProductProvider>
        </CartProvider>
      </LocationProvider>
    </AuthProvider>
  );
}