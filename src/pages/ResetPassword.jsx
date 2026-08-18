import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Cake, ChevronLeft, ChevronRight, Sparkles, Lock, Eye, EyeOff, } from "lucide-react";

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
export default function ResetPassword() {
  const [params] = useSearchParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const nav = useNavigate();
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
    let position = index - currentSlide;
    if (position < 0) {
      position += bakeryImages.length;
    }
    if (position === 0) return "center";
    if (position === 1) return "right";
    return "left";
  };
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        token: params.get("token"),
        password,
      });
      toast.success("Password reset. Please login.");
      nav("/login");
    } catch (err) {
      toast.error(
        err?.response?.data?.detail || "Invalid or expired token"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="min-h-screen relative overflow-hidden bg-[#fff8ee]"
      data-testid="reset-page"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#f5dfc3]/50" />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[300px] rounded-[50%] bg-[#f2d5b0]/40" />
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#f5eee4]/70" />
        <div className="absolute top-20 right-[45%] w-5 h-5 rounded-full bg-[#06d2d9]/20" />
        <div className="absolute bottom-20 right-[40%] w-3 h-3 rounded-full bg-[#b88b62]/30" />
      </div>
      <div className="relative min-h-screen flex items-center justify-center px-4 py-8 lg:px-8">
        <div className="w-full max-w-[1200px]">
          <div className="grid lg:grid-cols-[45%_55%] min-h-[720px] rounded-[35px] overflow-hidden shadow-2xl bg-white">
            <div className="bg-white flex items-center justify-center px-6 sm:px-10 lg:px-16 py-12">
              <div className="w-full max-w-[470px]">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto rounded-full bg-[#06d2d9] flex items-center justify-center shadow-lg">
                    <Cake className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="font-display text-4xl font-bold text-[#3e3028] mt-2">
                    Reset Password
                  </h1>
                  <p className="text-[#5C4A3D] text-sm mt-2 leading-6">
                    Create a new password to secure your SLV Bakery account.
                  </p>
                </div>
                <form
                  onSubmit={submit}
                  className="
                    bg-white
                    border
                    border-[#eee4d8]
                    rounded-[25px]
                    p-6
                    sm:p-8
                    shadow-[0_15px_45px_rgba(92,74,61,0.08)]
                    space-y-5
                  "
                >
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-[#3e3028] mb-2"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#918278]" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        placeholder="Enter new password"
                        required
                        minLength={6}
                        data-testid="reset-pwd"
                        className="
                          h-14
                          pl-12
                          pr-12
                          rounded-xl
                          border-[#e6dfd5]
                          text-[#3e3028]
                          placeholder:text-[#aaa09a]
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
                          right-4
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
                    <p className="text-xs text-[#918278] mt-2">
                      Use at least 6 characters for your new password.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="
                      w-full
                      h-10
                      rounded-full
                      bg-[#06aeb4]
                      hover:bg-[#05979c]
                      text-white
                      font-semibold
                      text-base
                      shadow-lg
                      shadow-[#06d2d9]/20
                      transition-all
                    "
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>
                  <div className="flex items-center gap-4 py-2">
                    <div className="flex-1 h-px bg-[#e6dfd5]" />
                    <span className="text-sm text-[#918278]">
                      or
                    </span>
                    <div className="flex-1 h-px bg-[#e6dfd5]" />
                  </div>
                </form>
                <p className="text-center text-xs text-[#9a8d83] mt-6">
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
                  <p className="text-[#795548] mt-3 text-sm sm:text-base max-w-md mx-auto">
                    Enjoy delicious treats made fresh for you every day.
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}