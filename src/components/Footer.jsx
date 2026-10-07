import { Link } from "react-router-dom";
import { Cake, Facebook, Instagram, Twitter, Mail, Phone, MapPin, Sparkles, ArrowRight, Heart, Croissant, Cookie, CupSoda, } from "lucide-react";

export default function Footer() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#f8f5f1] py-16 sm:py-20 lg:py-24">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#06d2d9]/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#e8a98f]/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative">
              <span className="absolute -left-4 -top-12 select-none font-serif text-[120px] leading-none text-[#06d2d9]/10">
                “
              </span>
              <div className="mb-5 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#06b8bf] animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#06aeb5]">
                  A Little Something From SLV
                </span>
              </div>
              <h2 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-[#302a27] sm:text-5xl lg:text-6xl">
                Don't just satisfy
                <span className="block text-[#06aeb5]">your cravings.</span>
                <span className="block">Make every bite</span>
                <span className="block font-serif italic text-[#98796b]">a memory.</span>
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-[#756b65] sm:text-lg">
                Freshly baked treats, delicious cakes and everyday favourites,
                made with quality ingredients and a whole lot of love.
              </p>
              <div className="mt-8">
                <Link
                  to="/categories"
                  className="group inline-flex items-center gap-3 rounded-full bg-[#06d2d9] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#06d2d9]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#05b9bf] hover:shadow-xl"
                >
                  Explore Our Fresh Bakes
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
            <div className="relative flex min-h-[360px] items-center justify-center">
              <div className="relative w-full max-w-md">
                <div className="rounded-[2rem] border border-white bg-white p-8 shadow-[0_20px_60px_rgba(60,45,35,0.10)]">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#fff1eb]">
                    <Cake
                      className="h-12 w-12 text-[#d68c70]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="mt-7 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#06aeb5]">
                      SLV Bakery
                    </p>
                    <h3 className="mt-3 text-2xl font-bold text-[#302a27]">
                      Freshly Baked.
                    </h3>
                    <p className="mt-1 font-serif text-xl italic text-[#98796b]">
                      Made With Love.
                    </p>
                    <div className="mx-auto mt-6 h-px w-16 bg-[#06d2d9]/30" />
                    <div className="mt-6 flex justify-center gap-6">
                      <div className="group flex h-12 w-12 items-center justify-center rounded-full bg-[#f8f3ed] transition-all duration-300 hover:-translate-y-2 hover:bg-[#06d2d9]/10">
                        <Croissant
                          className="h-5 w-5 text-[#c58b6e]"
                        />
                      </div>
                      <div className="group flex h-12 w-12 items-center justify-center rounded-full bg-[#f8f3ed] transition-all duration-300 hover:-translate-y-2 hover:bg-[#06d2d9]/10">
                        <Cookie
                          className="h-5 w-5 text-[#c58b6e]"
                        />
                      </div>
                      <div className="group flex h-12 w-12 items-center justify-center rounded-full bg-[#f8f3ed] transition-all duration-300 hover:-translate-y-2 hover:bg-[#06d2d9]/10">
                        <CupSoda
                          className="h-5 w-5 text-[#c58b6e]"
                        />
                      </div>
                      <div className="group flex h-12 w-12 items-center justify-center rounded-full bg-[#f8f3ed] transition-all duration-300 hover:-translate-y-2 hover:bg-[#06d2d9]/10">
                        <Heart
                          className="h-5 w-5 text-[#d68c70]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -left-7 top-8 flex h-14 w-14 animate-bounce items-center justify-center rounded-2xl bg-white shadow-lg">
                  <Croissant className="h-6 w-6 text-[#c58b6e]" />
                </div>
                <div className="absolute -right-5 top-20 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff4d9] shadow-md">
                  <Cookie className="h-5 w-5 text-[#c58b6e]" />
                </div>
                <div className="absolute -bottom-6 left-10 flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-[#ffe9e3] shadow-lg">
                  <Cake className="h-6 w-6 text-[#d68c70]" />
                </div>
                <div className="absolute -bottom-4 right-12">
                  <Sparkles className="h-7 w-7 animate-spin text-[#06d2d9]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-[#211d1b] text-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <img
                  src="/bakery-icon-logo.png"
                  alt="SLV Bakery Logo"
                  className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 object-contain"
                />
                <span className="text-xl font-bold">
                  SLV Bakery
                </span>
              </div>
              <p className="max-w-sm text-sm leading-6 text-[#D4C7BB]">
                Artisan bakery serving fresh cakes, breads and desserts
                from the heart of Koramangala, Bangalore.
              </p>
              <div className="mt-6 flex gap-3">
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition hover:bg-[#06d2d9] hover:text-white"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition hover:bg-[#06d2d9] hover:text-white"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition hover:bg-[#06d2d9] hover:text-white"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#06d2d9]">
                Quick Links
              </h4>
              <ul className="space-y-2 text-sm text-[#D4C7BB]">
                <li>
                  <Link to="/" className="transition hover:text-white">Home</Link>
                </li>
                <li>
                  <Link to="/categories" className="transition hover:text-white">Categories</Link>
                </li>
                <li>
                  <Link to="/birthday-cake" className="transition hover:text-white">Birthday Cake</Link>
                </li>
                <li>
                  <Link to="/contact" className="transition hover:text-white">Contact</Link>
                </li>
                <li>
                  <Link to="/admin/login" className="transition hover:text-white"> Admin</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#06d2d9]">
                Policies
              </h4>
              <ul className="space-y-2 text-sm text-[#D4C7BB]">
                <li>
                  <Link
                    to="/terms-and-conditions"
                    className="transition hover:text-white"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy-policy"
                    className="transition hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/delivery-info"
                    className="transition hover:text-white"
                  >
                    Delivery Info
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#06d2d9]">
                Contact
              </h4>
              <ul className="space-y-3 text-sm text-[#D4C7BB]">
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#06d2d9]" />
                  <span>
                    1st Block, Koramangala,
                    <br />
                    Bangalore 560095
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#06d2d9]" />
                  +91 98987 69879
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#06d2d9]" />
                  slvbakery@gmail.com
                </li>
                <li className="pt-2 text-xs">
                  Open 11:00 AM – 11:00 PM
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-[#D4C7BB]">
            © {new Date().getFullYear()} SLV Bakery. Freshly baked with love in Bangalore.
          </div>
        </div>
      </footer>
    </>
  );
}