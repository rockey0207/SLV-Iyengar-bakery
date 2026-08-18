import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Cake, ChevronLeft, ChevronRight, Sparkles, Truck, Clock, Eye, EyeOff, } from "lucide-react";
const bakeryImages = [
  {
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
    title: "Freshly Baked Cakes",
    description: "Made fresh with love every single day.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85",
    title: "Delicious Pastries",
    description: "Crispy, creamy and perfect for every moment.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85",
    title: "Fresh Bakery",
    description: "Quality ingredients baked to perfection.",
  },
];
export default function Signup() {
  const [f, setF] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "Bangalore",
    state: "KA",
    pincode: "",
    password: "",
    confirm: "",
  });

  const { register } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [devToken, setDevToken] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bakeryImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bakeryImages.length);
  };
  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + bakeryImages.length) % bakeryImages.length
    );
  };
  const getImagePosition = (index) => {
    const total = bakeryImages.length;
    let position = index - currentSlide;
    if (position < 0) {
      position += total;
    }
    if (position === 0) return "center";
    if (position === 1) return "right";
    return "left";
  };
  const submit = async (e) => {
    e.preventDefault();
    if (f.password !== f.confirm) {
      toast.error("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      const { confirm, ...payload } = f;
      const r = await register(payload);
      if (r.ok) {
        if (r.verify_token) {
          setDevToken(r.verify_token);
        } else {
          nav("/login");
        }
      }
    } finally {
      setLoading(false);
    }
  };
  if (devToken) {
    return (
      <div className="min-h-screen bg-[#fff8ee] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center bg-white rounded-[30px] p-8 shadow-2xl border border-[#eee4d8]">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#06d2d9] flex items-center justify-center shadow-lg">
            <Cake className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-[#3e3028] mt-6">
            Check your inbox
          </h1>
          <p className="text-[#5C4A3D] mt-3">
            We've sent a verification link to{" "}
            <b className="text-[#06aeb4]">{f.email}</b>.
          </p>
          {process.env.NODE_ENV !== "production" && (
            <>
              <p className="text-xs text-[#5C4A3D] mt-5">
                Dev-mode: use this token to verify manually.
              </p>
              <Link
                to={`/verify-email?token=${devToken}`}
                className="inline-block mt-5 rounded-full px-7 py-3 bg-[#06aeb4] text-white text-sm font-semibold hover:bg-[#05979c] transition"
                data-testid="dev-verify-link"
              >
                Verify Now
              </Link>
            </>
          )}
          <div className="mt-6">
            <Link
              to="/login"
              className="text-sm text-[#06aeb4] font-semibold hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#fff8ee]">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#f5dfc3]/50" />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[300px] rounded-[50%] bg-[#f2d5b0]/40" />
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#f5eee4]/70" />
        <div className="absolute top-20 right-[45%] w-5 h-5 rounded-full bg-[#06d2d9]/20" />
        <div className="absolute bottom-20 right-[40%] w-3 h-3 rounded-full bg-[#b88b62]/30" />
      </div>
      <div className="relative min-h-screen flex items-center justify-center px-4 py-8 lg:px-8">
        <div className="w-full max-w-[1500px]">
          <div className="grid lg:grid-cols-[45%_55%] min-h-[720px] rounded-[35px] overflow-hidden shadow-2xl bg-white">
            <div className="bg-white flex items-center justify-center px-6 sm:px-10 lg:px-14 py-10 lg:py-12">
              <div className="w-full max-w-[540px]">
                <div className="text-center mb-2">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#06d2d9] flex items-center justify-center shadow-lg">
                    <Cake className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#3e3028] mt-2">
                    Create Account
                  </h1>
                  <p className="text-[#5C4A3D] text-sm">
                    Join the SLV Bakery family
                  </p>
                </div>
                <form
                  onSubmit={submit}
                  className="
                    bg-white
                    border
                    border-[#eee4d8]
                    rounded-[25px]
                    p-5
                    sm:p-7
                    shadow-[0_15px_45px_rgba(92,74,61,0.08)]
                    space-y-4
                  "
                  data-testid="signup-page"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="name"
                        className="text-[#3e3028] font-semibold"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={f.name}
                        onChange={(e) =>
                          setF({ ...f, name: e.target.value })
                        }
                        required
                        placeholder="Enter your name"
                        data-testid="signup-name"
                        className="
                          mt-1
                          h-10
                          rounded-xl
                          border-[#e6dfd5]
                          focus:border-[#06d2d9]
                          focus:ring-[#06d2d9]
                        "
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="email"
                        className="text-[#3e3028] font-semibold"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={f.email}
                        onChange={(e) =>
                          setF({ ...f, email: e.target.value })
                        }
                        required
                        placeholder="Enter your email"
                        data-testid="signup-email"
                        className="
                          mt-1
                          h-10
                          rounded-xl
                          border-[#e6dfd5]
                          focus:border-[#06d2d9]
                          focus:ring-[#06d2d9]
                        "
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="phone"
                        className="text-[#3e3028] font-semibold"
                      >
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={f.phone}
                        onChange={(e) =>
                          setF({ ...f, phone: e.target.value })
                        }
                        required
                        placeholder="Enter phone number"
                        className="
                          mt-1
                          h-10
                          rounded-xl
                          border-[#e6dfd5]
                          focus:border-[#06d2d9]
                          focus:ring-[#06d2d9]
                        "
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="pincode"
                        className="text-[#3e3028] font-semibold"
                      >
                        Pincode
                      </Label>
                      <Input
                        id="pincode"
                        value={f.pincode}
                        onChange={(e) =>
                          setF({ ...f, pincode: e.target.value })
                        }
                        required
                        placeholder="Enter pincode"
                        className="
                          mt-1
                          h-10
                          rounded-xl
                          border-[#e6dfd5]
                          focus:border-[#06d2d9]
                          focus:ring-[#06d2d9]
                        "
                      />
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="address"
                      className="text-[#3e3028] font-semibold"
                    >
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={f.address}
                      onChange={(e) =>
                        setF({ ...f, address: e.target.value })
                      }
                      required
                      placeholder="Enter your complete address"
                      className="
                        mt-1
                        h-10
                        rounded-xl
                        border-[#e6dfd5]
                        focus:border-[#06d2d9]
                        focus:ring-[#06d2d9]
                      "
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="city"
                        className="text-[#3e3028] font-semibold"
                      >
                        City
                      </Label>
                      <Input
                        id="city"
                        value={f.city}
                        onChange={(e) =>
                          setF({ ...f, city: e.target.value })
                        }
                        required
                        placeholder="City"
                        className="
                          mt-1
                          h-10
                          rounded-xl
                          border-[#e6dfd5]
                          focus:border-[#06d2d9]
                          focus:ring-[#06d2d9]
                        "
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="state"
                        className="text-[#3e3028] font-semibold"
                      >
                        State
                      </Label>
                      <Input
                        id="state"
                        value={f.state}
                        onChange={(e) =>
                          setF({ ...f, state: e.target.value })
                        }
                        required
                        placeholder="State"
                        className="
                          mt-1
                          h-10
                          rounded-xl
                          border-[#e6dfd5]
                          focus:border-[#06d2d9]
                          focus:ring-[#06d2d9]
                        "
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="password"
                        className="text-[#3e3028] font-semibold"
                      >
                        Password
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={f.password}
                          onChange={(e) =>
                            setF({ ...f, password: e.target.value })
                          }
                          required
                          placeholder="Create password"
                          data-testid="signup-password"
                          className="
                            h-10
                            pr-11
                            rounded-xl
                            border-[#e6dfd5]
                            focus:border-[#06d2d9]
                            focus:ring-[#06d2d9]
                          "
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword((prev) => !prev)
                          }
                          className="
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            text-[#918278]
                            hover:text-[#06d2d9]
                          "
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor="confirm"
                        className="text-[#3e3028] font-semibold"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id="confirm"
                          type={showConfirmPassword ? "text" : "password"}
                          value={f.confirm}
                          onChange={(e) =>
                            setF({ ...f, confirm: e.target.value })
                          }
                          required
                          placeholder="Confirm password"
                          className="
                            h-10
                            pr-11
                            rounded-xl
                            border-[#e6dfd5]
                            focus:border-[#06d2d9]
                            focus:ring-[#06d2d9]
                          "
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          className="
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            text-[#918278]
                            hover:text-[#06d2d9]
                          "
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="
                      w-full
                      h-13
                      rounded-full
                      bg-[#06aeb4]
                      hover:bg-[#05979c]
                      text-white
                      font-semibold
                      text-base
                      shadow-lg
                      shadow-[#06d2d9]/20
                      transition-all
                      mt-2
                    "
                    data-testid="signup-submit"
                  >
                    {loading ? "Creating..." : "Create Account"}
                  </Button>
                  <div className="text-center text-sm text-[#5C4A3D] pt-1">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-[#06aeb4] font-semibold hover:underline"
                    >
                      Login
                    </Link>
                  </div>
                </form>

                <p className="text-center text-xs text-[#9a8d83] mt-5">
                  Freshly baked with ❤️ by SLV Bakery
                </p>
              </div>
            </div>
            <div className="relative bg-gradient-to-br from-[#f9e7ce] via-[#fff0dc] to-[#f7dfc1] px-5 sm:px-10 lg:px-12 py-10 flex flex-col justify-center overflow-hidden">
              <div className="absolute -bottom-24 -right-20 w-[650px] h-[250px] bg-[#f1d2aa]/50 rounded-[50%]" />
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-[#9b5c2e]" />
                    <span className="font-semibold text-[#8a542e] tracking-widest text-sm">
                      SLV BAKERY
                    </span>
                    <Sparkles className="w-4 h-4 text-[#9b5c2e]" />
                  </div>
                  <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#73451f]">
                    Freshly Baked
                  </h2>
                  <h3 className="font-display text-3xl sm:text-4xl font-bold text-[#73451f] mt-1">
                    Happiness Delivered
                  </h3>
                  <p className="text-[#795548] text-sm sm:text-base max-w-md mx-auto">
                    Create your account and discover your favorite
                    bakery treats.
                  </p>
                </div>
                <div className="relative h-[390px] sm:h-[430px] max-w-[750px] mx-auto">
                  {bakeryImages.map((item, index) => {
                    const position = getImagePosition(index);
                    return (
                      <div
                        key={item.image}
                        className={`
                          absolute
                          top-1/2
                          transition-all
                          duration-700
                          ease-in-out
                          rounded-[25px]
                          overflow-hidden
                          border-4
                          border-white
                          shadow-xl
                          ${position === "center"
                            ? `
                                left-1/2
                                -translate-x-1/2
                                -translate-y-1/2
                                w-[260px]
                                sm:w-[310px]
                                h-[350px]
                                sm:h-[400px]
                                z-30
                              `
                            : position === "left"
                              ? `
                                left-[5%]
                                -translate-y-1/2
                                w-[200px]
                                sm:w-[240px]
                                h-[300px]
                                sm:h-[350px]
                                z-10
                                opacity-95
                              `
                              : `
                                right-[5%]
                                -translate-y-1/2
                                w-[200px]
                                sm:w-[240px]
                                h-[300px]
                                sm:h-[350px]
                                z-10
                                opacity-95
                              `
                          }
                        `}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        {position === "center" && (
                          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                            <h4 className="text-xl sm:text-2xl font-bold">
                              {item.title}
                            </h4>
                            <p className="text-sm text-white/90 mt-1">
                              {item.description}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="
                      absolute
                      left-0
                      top-1/2
                      -translate-y-1/2
                      z-40
                      w-11
                      h-11
                      rounded-full
                      bg-white
                      shadow-lg
                      flex
                      items-center
                      justify-center
                      hover:scale-110
                      transition
                    "
                  >
                    <ChevronLeft className="w-6 h-6 text-[#5c4a3d]" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    className="
                      absolute
                      right-0
                      top-1/2
                      -translate-y-1/2
                      z-40
                      w-11
                      h-11
                      rounded-full
                      bg-white
                      shadow-lg
                      flex
                      items-center
                      justify-center
                      hover:scale-110
                      transition
                    "
                  >
                    <ChevronRight className="w-6 h-6 text-[#5c4a3d]" />
                  </button>
                </div>
                <div className="flex justify-center gap-2 mt-2">
                  {bakeryImages.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentSlide(index)}
                      className={`
                        h-2.5
                        rounded-full
                        transition-all
                        duration-300
                        ${currentSlide === index
                          ? "w-8 bg-[#73451f]"
                          : "w-2.5 bg-[#73451f]/30"
                        }
                      `}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4 max-w-[600px] mx-auto mt-4">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-white flex items-center justify-center shadow-md">
                      <Cake className="w-5 h-5 text-[#73451f]" />
                    </div>
                    <h5 className="font-semibold text-[#5c4a3d] text-xs sm:text-sm mt-1">
                      Fresh Ingredients
                    </h5>
                    <p className="text-[10px] sm:text-xs text-[#8a7465]">
                      Premium quality
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-white flex items-center justify-center shadow-md">
                      <Clock className="w-5 h-5 text-[#73451f]" />
                    </div>
                    <h5 className="font-semibold text-[#5c4a3d] text-xs sm:text-sm mt-1">
                      Baked Daily
                    </h5>
                    <p className="text-[10px] sm:text-xs text-[#8a7465]">
                      Made fresh daily
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-white flex items-center justify-center shadow-md">
                      <Truck className="w-5 h-5 text-[#73451f]" />
                    </div>
                    <h5 className="font-semibold text-[#5c4a3d] text-xs sm:text-sm mt-1">
                      Fast Delivery
                    </h5>
                    <p className="text-[10px] sm:text-xs text-[#8a7465]">
                      To your doorstep
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}