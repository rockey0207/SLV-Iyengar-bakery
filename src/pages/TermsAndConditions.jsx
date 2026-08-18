import { Link } from "react-router-dom";

export default function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-[#2D1E16]">
      <Link to="/" className="text-[#06d2d9] font-semibold">
        ← Back to Home
      </Link>

      <h1 className="font-display text-3xl font-bold mt-4">
        Terms & Conditions
      </h1>

      <p className="mt-2 text-sm text-[#7A665A]">
        Last updated: August 2026
      </p>

      <div className="mt-6 space-y-6 text-sm leading-7 text-[#5C4A3D]">

        <section>
          <h2 className="text-lg font-bold text-[#2D1E16] mb-2">
            1. Introduction
          </h2>
          <p>
            Welcome to SLV Bakery. By accessing our website or mobile
            application and placing an order, you agree to comply with these
            Terms & Conditions. Please read these terms carefully before using
            our services.
          </p>
          <p className="mt-2">
            These terms are intended to ensure a safe, transparent, and
            convenient ordering experience for all our customers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D1E16] mb-2">
            2. Orders & Availability
          </h2>
          <p>
            By placing an order with SLV Bakery, you agree to these terms and
            conditions. All orders are subject to product availability.
          </p>
          <p className="mt-2">
            We reserve the right to cancel, modify, or reject an order if a
            requested product is unavailable, incorrectly priced, or if payment
            verification fails.
          </p>
          <p className="mt-2">
            Product images are provided for reference. The actual appearance,
            decoration, size, or presentation of bakery products may vary
            slightly from the displayed image.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D1E16] mb-2">
            3. Customer Information
          </h2>
          <p>
            Customers are responsible for providing accurate delivery details,
            including their name, phone number, address, city, state, and
            pincode.
          </p>
          <p className="mt-2">
            SLV Bakery will not be responsible for failed or delayed deliveries
            caused by incorrect or incomplete information provided by the
            customer.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D1E16] mb-2">
            4. Pricing & Payment
          </h2>
          <p>
            Product prices displayed on the platform are subject to change
            without prior notice. The price applicable at the time of placing
            the order will normally be considered the order price.
          </p>
          <p className="mt-2">
            Customers must provide valid payment information when using online
            payment services. Orders may be cancelled if payment is
            unsuccessful or cannot be verified.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D1E16] mb-2">
            5. Delivery
          </h2>
          <p>
            SLV Bakery aims to deliver orders within the estimated delivery
            time shown during checkout. Delivery times may vary depending on
            order volume, product preparation time, traffic, weather, and
            other external conditions.
          </p>
          <p className="mt-2">
            Customers should ensure that someone is available at the provided
            delivery address to receive the order.
          </p>
          <p className="mt-2">
            SLV Bakery is not liable for delays caused by weather, traffic,
            road conditions, public events, technical issues, or other
            circumstances beyond our reasonable control.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D1E16] mb-2">
            6. Cancellation & Refunds
          </h2>
          <p>
            Orders may be cancelled by the customer before preparation begins.
            Once preparation has started, cancellation may not be possible.
          </p>
          <p className="mt-2">
            Where a refund is applicable, the refund amount and processing time
            may depend on the payment method and the status of the order.
          </p>
          <p className="mt-2">
            Refunds will not normally be provided for orders that cannot be
            delivered due to an incorrect address or the customer's
            unavailability to receive the order.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D1E16] mb-2">
            7. Product Quality
          </h2>
          <p>
            SLV Bakery takes reasonable care to maintain the freshness and
            quality of its products. Customers should consume bakery products
            according to the recommended storage and consumption instructions.
          </p>
          <p className="mt-2">
            If you receive an incorrect, damaged, or significantly defective
            product, please contact us as soon as possible with the relevant
            order details so that we can review the issue.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D1E16] mb-2">
            8. Offers & Coupons
          </h2>
          <p>
            Promotional offers, discounts, and coupons may have specific
            eligibility requirements, validity periods, minimum order values,
            or product restrictions.
          </p>
          <p className="mt-2">
            Coupons cannot be exchanged for cash and may be withdrawn or
            modified at any time unless otherwise stated.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D1E16] mb-2">
            9. Customer Responsibility
          </h2>
          <p>
            Customers agree not to misuse the website or application, provide
            false information, attempt unauthorized access, or interfere with
            the normal operation of our services.
          </p>
          <p className="mt-2">
            Customers are also responsible for keeping their account
            credentials secure and should immediately notify us if they
            suspect unauthorized access to their account.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D1E16] mb-2">
            10. Privacy
          </h2>
          <p>
            We may collect information required to process orders, provide
            delivery services, communicate with customers, and improve our
            services. Customer information will be handled in accordance with
            our Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D1E16] mb-2">
            11. Changes to These Terms
          </h2>
          <p>
            SLV Bakery may update these Terms & Conditions from time to time
            to reflect changes to our services, policies, or applicable
            requirements.
          </p>
          <p className="mt-2">
            Updated terms will be posted on this page. Continued use of our
            services after changes are posted indicates acceptance of the
            updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D1E16] mb-2">
            12. Contact Us
          </h2>
          <p>
            If you have any questions, concerns, or complaints regarding these
            Terms & Conditions or an order, please contact SLV Bakery through
            the contact information provided on our website.
          </p>
          <p className="mt-2">
            We will make reasonable efforts to review and resolve customer
            concerns as quickly as possible.
          </p>
        </section>

        <div className="border-t border-[#E5D8CF] pt-5">
          <p className="font-semibold text-[#2D1E16]">
            Thank you for choosing SLV Bakery.
          </p>
          <p className="mt-1">
            We appreciate your trust and look forward to serving you with
            freshly baked products.
          </p>
        </div>

      </div>
    </div>
  );
}