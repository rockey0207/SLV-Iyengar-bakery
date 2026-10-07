import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Cake,
  Upload,
  CalendarDays,
  Clock3,
  MapPin,
  Phone,
  MessageCircle,
  Sparkles,
  Image as ImageIcon,
  Minus,
  Plus,
  X,
  CheckCircle2,
  Heart,
} from "lucide-react";

export default function BirthdayCake() {
  const { user } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({
    cake_type: "Chocolate",
    cake_size: "1kg",
    flavor: "Chocolate",
    quantity: 1,
    message: "",
    delivery_date: "",
    delivery_time: "10:00",
    reference_image: "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [imgErr, setImgErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const upd = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const cakeTypes = [
    "Chocolate",
    "Vanilla",
    "Red Velvet",
    "Fruit",
    "Cheesecake",
    "Photo Cake",
    "Fondant",
  ];

  const cakeSizes = [
    "500g",
    "1kg",
    "1.5kg",
    "2kg",
    "3kg",
    "5kg",
  ];

  const flavors = [
    "Chocolate",
    "Vanilla",
    "Strawberry",
    "Butterscotch",
    "Blackforest",
    "Pineapple",
    "Coffee",
  ];

  const onFile = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImgErr("Only image files are allowed.");
      return;
    }

    if (file.size > 600 * 1024) {
      setImgErr("File must be under 600KB.");
      return;
    }

    setImgErr("");

    const reader = new FileReader();

    reader.onloadend = () => {
      upd("reference_image", reader.result);
    };

    reader.readAsDataURL(file);
  };

  const removeImage = (e) => {
    e.preventDefault();
    e.stopPropagation();

    upd("reference_image", "");
    setImgErr("");
  };

  const decreaseQuantity = () => {
    setForm((prev) => ({
      ...prev,
      quantity: Math.max(1, prev.quantity - 1),
    }));
  };

  const increaseQuantity = () => {
    setForm((prev) => ({
      ...prev,
      quantity: Math.min(20, prev.quantity + 1),
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error(
        "Please login to submit a custom cake request."
      );
      nav("/login");
      return;
    }

    if (!form.delivery_date) {
      toast.error("Please select a delivery date.");
      return;
    }

    if (!form.phone.trim()) {
      toast.error("Please enter your contact phone number.");
      return;
    }

    if (!form.address.trim()) {
      toast.error("Please enter your delivery address.");
      return;
    }

    if (form.quantity < 1) {
      toast.error("Quantity must be at least 1.");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/custom-cakes", form);

      toast.success(
        "Cake request submitted successfully! Our team will review and confirm shortly."
      );

      nav("/my-orders");
    } catch (err) {
      toast.error(
        err?.response?.data?.detail ||
          "Failed to submit cake request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-b
        from-[#FFFDF9]
        via-[#FAF7F2]
        to-[#F7F0E7]
      "
      data-testid="birthday-cake-page"
    >
      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="relative overflow-hidden">
        {/* Decorative Background */}
        <div
          className="
            absolute -top-24 -left-24
            w-64 h-64
            rounded-full
            bg-[#06C9D0]/10
            blur-3xl
          "
        />

        <div
          className="
            absolute -top-20 -right-20
            w-72 h-72
            rounded-full
            bg-[#BE123C]/10
            blur-3xl
          "
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 sm:pt-14 sm:pb-10">
          <div className="text-center">
            {/* Label */}
            <div
              className="
                inline-flex
                items-center gap-2
                px-4 py-2
                rounded-full
                bg-white
                border border-[#E9E1D7]
                shadow-sm
                text-[10px] sm:text-xs
                uppercase
                tracking-[0.16em]
                font-bold
                text-[#06AEB5]
              "
            >
              <Cake className="w-4 h-4" />
              Custom Cakes
              <Sparkles className="w-3.5 h-3.5" />
            </div>

            {/* Heading */}
            <h1
              className="
                mt-5
                text-3xl sm:text-4xl md:text-5xl
                font-extrabold
                tracking-tight
                text-[#2D1E16]
                leading-tight
              "
            >
              Design Your
              <span className="block text-[#06AEB5]">
                Dream Birthday Cake
              </span>
            </h1>

            <p
              className="
                mt-4
                max-w-2xl
                mx-auto
                text-sm sm:text-base
                leading-relaxed
                text-[#6B5A4D]
              "
            >
              Tell us your idea and let our expert bakers
              turn your celebration into something
              deliciously memorable.
            </p>

            {/* Feature Pills */}
            <div
              className="
                flex flex-wrap
                items-center justify-center
                gap-2
                mt-6
              "
            >
              {[
                "Freshly Baked",
                "Custom Design",
                "Made With Love",
              ].map((item) => (
                <div
                  key={item}
                  className="
                    flex items-center gap-1.5
                    px-3 py-1.5
                    rounded-full
                    bg-white/80
                    border border-[#E9E1D7]
                    text-[10px] sm:text-xs
                    font-semibold
                    text-[#5C4A3D]
                  "
                >
                  <CheckCircle2
                    className="w-3.5 h-3.5 text-[#0D9488]"
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <form
          onSubmit={submit}
          className="
            grid
            lg:grid-cols-[1fr_320px]
            gap-6
            items-start
          "
        >
          {/* =================================================
              FORM CARD
          ================================================= */}
          <div
            className="
              bg-white
              rounded-2xl sm:rounded-3xl
              border border-[#E9E1D7]
              shadow-[0_12px_40px_rgba(45,30,22,0.07)]
              overflow-hidden
            "
          >
            {/* Card Header */}
            <div
              className="
                px-5 sm:px-7
                py-5
                border-b border-[#EEE6DD]
                bg-gradient-to-r
                from-[#FFFDF9]
                to-[#FAF7F2]
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    w-10 h-10
                    rounded-xl
                    bg-[#06C9D0]/10
                    flex items-center justify-center
                  "
                >
                  <Cake className="w-5 h-5 text-[#06AEB5]" />
                </div>

                <div>
                  <h2 className="font-bold text-[#2D1E16]">
                    Customize Your Cake
                  </h2>

                  <p className="text-xs text-[#7A695D] mt-0.5">
                    Choose your preferences below
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-7 space-y-7">
              {/* =================================================
                  CAKE DETAILS
              ================================================= */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="
                      w-7 h-7
                      rounded-full
                      bg-[#06C9D0]
                      text-white
                      flex items-center justify-center
                      text-xs font-bold
                    "
                  >
                    1
                  </span>

                  <h3 className="font-bold text-[#2D1E16]">
                    Cake Details
                  </h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Cake Type */}
                  <div className="space-y-2">
                    <Label>Cake Type</Label>

                    <Select
                      value={form.cake_type}
                      onValueChange={(value) =>
                        upd("cake_type", value)
                      }
                    >
                      <SelectTrigger
                        className="
                          h-11
                          rounded-xl
                          border-[#E6DFD5]
                          hover:border-[#06C9D0]
                          transition-colors
                        "
                        data-testid="cake-type"
                      >
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {cakeTypes.map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                          >
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Cake Size */}
                  <div className="space-y-2">
                    <Label>Cake Size</Label>

                    <Select
                      value={form.cake_size}
                      onValueChange={(value) =>
                        upd("cake_size", value)
                      }
                    >
                      <SelectTrigger
                        className="
                          h-11
                          rounded-xl
                          border-[#E6DFD5]
                          hover:border-[#06C9D0]
                          transition-colors
                        "
                        data-testid="cake-size"
                      >
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {cakeSizes.map((size) => (
                          <SelectItem
                            key={size}
                            value={size}
                          >
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Flavor */}
                  <div className="space-y-2">
                    <Label>Flavor</Label>

                    <Select
                      value={form.flavor}
                      onValueChange={(value) =>
                        upd("flavor", value)
                      }
                    >
                      <SelectTrigger
                        className="
                          h-11
                          rounded-xl
                          border-[#E6DFD5]
                          hover:border-[#06C9D0]
                          transition-colors
                        "
                      >
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {flavors.map((flavor) => (
                          <SelectItem
                            key={flavor}
                            value={flavor}
                          >
                            {flavor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label>Quantity</Label>

                    <div
                      className="
                        h-11
                        flex items-center
                        justify-between
                        rounded-xl
                        border border-[#E6DFD5]
                        bg-white
                        px-1
                      "
                    >
                      <button
                        type="button"
                        onClick={decreaseQuantity}
                        disabled={form.quantity <= 1}
                        className="
                          w-9 h-9
                          rounded-lg
                          flex items-center justify-center
                          text-[#2D1E16]
                          hover:bg-[#FAF7F2]
                          active:scale-90
                          transition-all
                          disabled:opacity-30
                        "
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="font-bold text-sm">
                        {form.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={increaseQuantity}
                        disabled={form.quantity >= 20}
                        className="
                          w-9 h-9
                          rounded-lg
                          flex items-center justify-center
                          bg-[#06C9D0]
                          text-white
                          hover:bg-[#05B8BE]
                          active:scale-90
                          transition-all
                          disabled:opacity-30
                        "
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* =================================================
                  MESSAGE
              ================================================= */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="
                      w-7 h-7
                      rounded-full
                      bg-[#06C9D0]
                      text-white
                      flex items-center justify-center
                      text-xs font-bold
                    "
                  >
                    2
                  </span>

                  <h3 className="font-bold text-[#2D1E16]">
                    Personalize Your Cake
                  </h3>
                </div>

                <div className="space-y-2">
                  <Label>Message on Cake</Label>

                  <div className="relative">
                    <MessageCircle
                      className="
                        absolute
                        left-3
                        top-3
                        w-4 h-4
                        text-[#A89586]
                      "
                    />

                    <Input
                      value={form.message}
                      onChange={(e) =>
                        upd("message", e.target.value)
                      }
                      placeholder="e.g., Happy Birthday Riya!"
                      className="
                        h-11
                        pl-10
                        rounded-xl
                        border-[#E6DFD5]
                        focus:border-[#06C9D0]
                      "
                    />
                  </div>

                  <p className="text-[10px] text-[#8A786A]">
                    Leave it blank if you don't need a
                    message.
                  </p>
                </div>
              </section>

              {/* =================================================
                  DELIVERY
              ================================================= */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="
                      w-7 h-7
                      rounded-full
                      bg-[#06C9D0]
                      text-white
                      flex items-center justify-center
                      text-xs font-bold
                    "
                  >
                    3
                  </span>

                  <h3 className="font-bold text-[#2D1E16]">
                    Delivery Details
                  </h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Date */}
                  <div className="space-y-2">
                    <Label>Delivery Date</Label>

                    <div className="relative">
                      <CalendarDays
                        className="
                          absolute
                          left-3 top-3
                          w-4 h-4
                          text-[#8A786A]
                          pointer-events-none
                        "
                      />

                      <Input
                        type="date"
                        value={form.delivery_date}
                        min={
                          new Date()
                            .toISOString()
                            .split("T")[0]
                        }
                        onChange={(e) =>
                          upd(
                            "delivery_date",
                            e.target.value
                          )
                        }
                        required
                        className="
                          h-11
                          pl-10
                          rounded-xl
                          border-[#E6DFD5]
                          focus:border-[#06C9D0]
                        "
                        data-testid="delivery-date"
                      />
                    </div>
                  </div>

                  {/* Time */}
                  <div className="space-y-2">
                    <Label>Delivery Time</Label>

                    <div className="relative">
                      <Clock3
                        className="
                          absolute
                          left-3 top-3
                          w-4 h-4
                          text-[#8A786A]
                          pointer-events-none
                        "
                      />

                      <Input
                        type="time"
                        value={form.delivery_time}
                        onChange={(e) =>
                          upd(
                            "delivery_time",
                            e.target.value
                          )
                        }
                        required
                        className="
                          h-11
                          pl-10
                          rounded-xl
                          border-[#E6DFD5]
                          focus:border-[#06C9D0]
                        "
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div
                  className="
                    mt-4
                    flex items-start gap-2
                    rounded-xl
                    bg-[#F0FDFA]
                    border border-[#CCFBF1]
                    px-3.5 py-3
                  "
                >
                  <Clock3
                    className="
                      w-4 h-4
                      text-[#0D9488]
                      mt-0.5
                      flex-shrink-0
                    "
                  />

                  <p className="text-[10px] sm:text-xs text-[#47756F]">
                    Please select a delivery date and time
                    when you would like your custom cake
                    delivered.
                  </p>
                </div>
              </section>

              {/* =================================================
                  ADDRESS
              ================================================= */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="
                      w-7 h-7
                      rounded-full
                      bg-[#06C9D0]
                      text-white
                      flex items-center justify-center
                      text-xs font-bold
                    "
                  >
                    4
                  </span>

                  <h3 className="font-bold text-[#2D1E16]">
                    Contact & Address
                  </h3>
                </div>

                <div className="space-y-5">
                  {/* Address */}
                  <div className="space-y-2">
                    <Label>Delivery Address</Label>

                    <div className="relative">
                      <MapPin
                        className="
                          absolute
                          left-3 top-3
                          w-4 h-4
                          text-[#8A786A]
                        "
                      />

                      <Textarea
                        value={form.address}
                        onChange={(e) =>
                          upd(
                            "address",
                            e.target.value
                          )
                        }
                        required
                        placeholder="Enter complete delivery address"
                        className="
                          min-h-[95px]
                          pl-10
                          rounded-xl
                          border-[#E6DFD5]
                          focus:border-[#06C9D0]
                          resize-none
                        "
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label>Contact Phone</Label>

                    <div className="relative">
                      <Phone
                        className="
                          absolute
                          left-3 top-3
                          w-4 h-4
                          text-[#8A786A]
                        "
                      />

                      <Input
                        value={form.phone}
                        onChange={(e) =>
                          upd("phone", e.target.value)
                        }
                        required
                        type="tel"
                        placeholder="Enter contact number"
                        className="
                          h-11
                          pl-10
                          rounded-xl
                          border-[#E6DFD5]
                          focus:border-[#06C9D0]
                        "
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* =================================================
                  REFERENCE IMAGE
              ================================================= */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="
                      w-7 h-7
                      rounded-full
                      bg-[#06C9D0]
                      text-white
                      flex items-center justify-center
                      text-xs font-bold
                    "
                  >
                    5
                  </span>

                  <div>
                    <h3 className="font-bold text-[#2D1E16]">
                      Reference Image
                    </h3>

                    <p className="text-[10px] text-[#8A786A]">
                      Optional • Maximum 600KB
                    </p>
                  </div>
                </div>

                {!form.reference_image ? (
                  <label
                    className="
                      group
                      relative
                      flex flex-col
                      items-center justify-center
                      min-h-[170px]
                      rounded-2xl
                      border-2 border-dashed
                      border-[#DDD3C8]
                      bg-[#FFFCF8]
                      cursor-pointer
                      transition-all duration-300
                      hover:border-[#06C9D0]
                      hover:bg-[#F7FEFE]
                    "
                  >
                    <div
                      className="
                        w-12 h-12
                        rounded-2xl
                        bg-[#06C9D0]/10
                        flex items-center justify-center
                        transition-transform duration-300
                        group-hover:scale-110
                      "
                    >
                      <Upload
                        className="
                          w-5 h-5
                          text-[#06AEB5]
                        "
                      />
                    </div>

                    <span
                      className="
                        mt-3
                        text-sm
                        font-semibold
                        text-[#4A392F]
                      "
                    >
                      Upload cake reference
                    </span>

                    <span
                      className="
                        mt-1
                        text-[10px] sm:text-xs
                        text-[#8A786A]
                      "
                    >
                      PNG, JPG or JPEG • Max 600KB
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={onFile}
                      className="hidden"
                      data-testid="upload-ref-image"
                    />
                  </label>
                ) : (
                  <div
                    className="
                      relative
                      rounded-2xl
                      overflow-hidden
                      border border-[#E6DFD5]
                      bg-[#FAF7F2]
                      p-2
                    "
                  >
                    <img
                      src={form.reference_image}
                      alt="Cake reference"
                      className="
                        w-full
                        max-h-64
                        rounded-xl
                        object-cover
                      "
                    />

                    <button
                      type="button"
                      onClick={removeImage}
                      className="
                        absolute
                        top-4 right-4
                        w-9 h-9
                        rounded-full
                        bg-black/70
                        text-white
                        flex items-center justify-center
                        hover:bg-[#BE123C]
                        active:scale-90
                        transition-all
                      "
                      aria-label="Remove reference image"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div
                      className="
                        absolute
                        bottom-4
                        left-4
                        flex items-center gap-2
                        bg-white/95
                        rounded-full
                        px-3 py-1.5
                        text-[10px]
                        font-semibold
                        text-[#2D1E16]
                        shadow-md
                      "
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-[#06AEB5]" />
                      Reference image added
                    </div>
                  </div>
                )}

                {imgErr && (
                  <p
                    className="
                      mt-2
                      text-xs
                      font-medium
                      text-[#BE123C]
                    "
                  >
                    {imgErr}
                  </p>
                )}
              </section>

              {/* Mobile Submit */}
              <div className="lg:hidden pt-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="
                    w-full
                    h-12
                    rounded-full
                    bg-[#06C9D0]
                    hover:bg-[#05B8BE]
                    text-white
                    font-bold
                    shadow-lg
                    hover:shadow-xl
                    hover:-translate-y-0.5
                    transition-all
                    disabled:opacity-60
                  "
                  data-testid="submit-cake"
                >
                  {submitting ? (
                    <>
                      <span
                        className="
                          w-4 h-4
                          border-2
                          border-white/40
                          border-t-white
                          rounded-full
                          animate-spin
                          mr-2
                        "
                      />
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      <Cake className="w-4 h-4 mr-2" />
                      Submit Cake Request
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* =================================================
              ORDER SUMMARY / SIDEBAR
          ================================================= */}
          <aside className="lg:sticky lg:top-24 space-y-4">
            {/* Preview Card */}
            <div
              className="
                bg-[#2D1E16]
                text-white
                rounded-2xl
                overflow-hidden
                shadow-[0_15px_40px_rgba(45,30,22,0.18)]
              "
            >
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      w-11 h-11
                      rounded-xl
                      bg-white/10
                      flex items-center justify-center
                    "
                  >
                    <Cake className="w-5 h-5 text-[#06D2D9]" />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-white/50">
                      Your Cake
                    </p>

                    <h3 className="font-bold mt-0.5">
                      Custom Cake Request
                    </h3>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-white/60">
                      Type
                    </span>
                    <span className="font-semibold text-right">
                      {form.cake_type}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-white/60">
                      Size
                    </span>
                    <span className="font-semibold">
                      {form.cake_size}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-white/60">
                      Flavor
                    </span>
                    <span className="font-semibold text-right">
                      {form.flavor}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-white/60">
                      Quantity
                    </span>
                    <span className="font-semibold">
                      {form.quantity}
                    </span>
                  </div>

                  {form.message && (
                    <div className="pt-3 border-t border-white/10">
                      <p className="text-[10px] uppercase tracking-wider text-white/40">
                        Message
                      </p>

                      <p className="text-sm mt-1 text-white/85">
                        "{form.message}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="
                  px-5 py-4
                  bg-white/5
                  border-t border-white/10
                  flex items-center gap-2
                "
              >
                <Heart className="w-4 h-4 text-[#06D2D9]" />

                <span className="text-xs text-white/65">
                  Made specially for your celebration
                </span>
              </div>
            </div>

            {/* Delivery Summary */}
            <div
              className="
                bg-white
                rounded-2xl
                border border-[#E9E1D7]
                p-5
                shadow-sm
              "
            >
              <h3 className="font-bold text-[#2D1E16]">
                Delivery Summary
              </h3>

              <div className="mt-4 space-y-3">
                <div className="flex gap-3">
                  <div
                    className="
                      w-8 h-8
                      rounded-lg
                      bg-[#06C9D0]/10
                      flex items-center justify-center
                      flex-shrink-0
                    "
                  >
                    <CalendarDays className="w-4 h-4 text-[#06AEB5]" />
                  </div>

                  <div>
                    <p className="text-[10px] text-[#8A786A]">
                      Delivery Date
                    </p>

                    <p className="text-xs font-semibold text-[#2D1E16] mt-0.5">
                      {form.delivery_date ||
                        "Not selected"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div
                    className="
                      w-8 h-8
                      rounded-lg
                      bg-[#06C9D0]/10
                      flex items-center justify-center
                      flex-shrink-0
                    "
                  >
                    <Clock3 className="w-4 h-4 text-[#06AEB5]" />
                  </div>

                  <div>
                    <p className="text-[10px] text-[#8A786A]">
                      Delivery Time
                    </p>

                    <p className="text-xs font-semibold text-[#2D1E16] mt-0.5">
                      {form.delivery_time}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div
                    className="
                      w-8 h-8
                      rounded-lg
                      bg-[#06C9D0]/10
                      flex items-center justify-center
                      flex-shrink-0
                    "
                  >
                    <MapPin className="w-4 h-4 text-[#06AEB5]" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] text-[#8A786A]">
                      Delivery Address
                    </p>

                    <p className="text-xs font-semibold text-[#2D1E16] mt-0.5 line-clamp-2">
                      {form.address ||
                        "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Submit */}
            <div className="hidden lg:block">
              <Button
                type="submit"
                disabled={submitting}
                className="
                  w-full
                  h-12
                  rounded-full
                  bg-[#06C9D0]
                  hover:bg-[#05B8BE]
                  text-white
                  font-bold
                  shadow-lg
                  hover:shadow-xl
                  hover:-translate-y-0.5
                  transition-all
                  disabled:opacity-60
                "
                data-testid="submit-cake"
              >
                {submitting ? (
                  <>
                    <span
                      className="
                        w-4 h-4
                        border-2
                        border-white/40
                        border-t-white
                        rounded-full
                        animate-spin
                        mr-2
                      "
                    />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <Cake className="w-4 h-4 mr-2" />
                    Submit Cake Request
                  </>
                )}
              </Button>
            </div>

            {/* Help */}
            <div
              className="
                flex items-start gap-3
                bg-[#F0FDFA]
                border border-[#CCFBF1]
                rounded-xl
                p-3.5
              "
            >
              <Sparkles
                className="
                  w-4 h-4
                  text-[#0D9488]
                  mt-0.5
                  flex-shrink-0
                "
              />

              <p className="text-[10px] sm:text-xs text-[#47756F] leading-relaxed">
                Our team will review your custom cake
                request and contact you to confirm the
                details.
              </p>
            </div>
          </aside>
        </form>
      </main>
    </div>
  );
}
