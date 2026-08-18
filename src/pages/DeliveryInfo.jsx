import { Link } from "react-router-dom";

export default function DeliveryInfo() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-[#2D1E16]">
      <Link to="/" className="text-[#06d2d9] font-semibold">
        ← Back to Home
      </Link>

      <h1 className="font-display text-3xl font-bold mt-4">
        Delivery Information
      </h1>

      <p className="mt-2 text-sm text-[#7A665A]">
        Last updated: August 2026
      </p>

      <div className="mt-6 space-y-6 text-sm leading-7 text-[#5C4A3D]">

        <section>
          <h2 className="text-lg font-bold text-[#2D1E16] mb-2">
            1. Delivery Service
          </h2>
          <p>
            SLV Bakery is committed to delivering freshly prepared bakery
            products safely and conveniently to our customers. We currently
            deliver within our designated service area in and around Bangalore.
          </p>
          <p className="mt-2">
            Delivery availability may depend on the customer's location,
            distance from the bakery, product availability, and delivery
            capacity at the time of placing the order.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D1E16] mb-2">
            2. Delivery Hours
          </h2>
          <p>
            Delivery is available daily between <strong>11:00 AM and 11:00 PM</strong>.
          </p>
          <p className="mt-2">
            Delivery timings may occasionally change due to holidays, special
            events, weather conditions, operational requirements, or other
            circumstances.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D1E16] mb-2">
            3. Estimated Delivery Time
          </h2>
          <p>
            Our estimated delivery time is usually around <strong>25 minutes</strong>,
            depending on the customer's location, order size, product
            preparation time, traffic, and current order volume.
          </p>
          <p className="mt-2">
            The estimated time displayed during checkout is only an
            approximation and is not a guaranteed delivery time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D1E16] mb-2">
            4. Delivery Area
          </h2>
          <p>
            We currently provide delivery services within our supported
            delivery area in and around Bangalore.
          </p>
          <p className="mt-2">
            Delivery availability is determined based on the address entered
            during checkout. If your location is outside our service area, the
            order may not be available for delivery.
          </p>
          <p className="mt-2">
            Service areas may be expanded, reduced, or changed depending on
            operational availability.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D1E16] mb-2">
            5. Delivery Address
          </h2>
          <p>
            Customers are responsible for providing a complete and accurate
            delivery address, including house or building number, street,
            locality, city, and pincode.
          </p>
          <p className="mt-2">
            SLV Bakery will not be responsible for delays or failed deliveries
            caused by incorrect, incomplete, or outdated delivery information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D1E16] mb-2">
            6. Receiving Your Order
          </h2>
          <p>
            Please ensure that you or an authorized person is available at the
            delivery address during the expected delivery period.
          </p>
          <p className="mt-2">
            Our delivery team may contact you by phone if they have difficulty
            locating the delivery address or need additional information.
          </p>
          <p className="mt-2">
            Please ensure that the phone number provided with your order remains
            active and reachable until the order has been delivered.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D1E16] mb-2">
            7. Delivery Delays
          </h2>
          <p>
            While we make every reasonable effort to deliver orders within the
            estimated time, delays may occur because of traffic, weather,
            unexpected order volumes, road conditions, technical issues, or
            other circumstances outside our reasonable control.
          </p>
          <p className="mt-2">
            We appreciate your patience and understanding during unexpected
            delays.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D1E16] mb-2">
            8. Order Changes & Cancellation
          </h2>
          <p>
            If you need to change your delivery address or other order details,
            please contact us as soon as possible.
          </p>
          <p className="mt-2">
            Changes may not be possible once the order has entered preparation
            or has already been dispatched for delivery.
          </p>
          <p className="mt-2">
            Orders may also be subject to cancellation restrictions depending
            on their preparation and delivery status.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D1E16] mb-2">
            9. Product Handling
          </h2>
          <p>
            Our bakery products are prepared with care and packed appropriately
            before dispatch. Customers should follow any storage or consumption
            instructions provided with the products.
          </p>
          <p className="mt-2">
            Since many bakery products are freshly prepared, we recommend
            consuming them as soon as reasonably possible after delivery for
            the best taste and quality.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D1E16] mb-2">
            10. Delivery Charges
          </h2>
          <p>
            Applicable delivery charges, if any, will be displayed during the
            ordering or checkout process before the order is confirmed.
          </p>
          <p className="mt-2">
            Delivery charges may vary depending on location, order value,
            promotional offers, or other applicable conditions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D1E16] mb-2">
            11. Incorrect or Missing Items
          </h2>
          <p>
            If you receive an incorrect, missing, or significantly damaged
            item, please contact us as soon as possible with your order details.
          </p>
          <p className="mt-2">
            Our support team will review the issue and determine the
            appropriate resolution based on the circumstances.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#2D1E16] mb-2">
            12. Contact Us
          </h2>
          <p>
            For delivery-related questions, order updates, or assistance,
            please contact SLV Bakery.
          </p>

          <div className="mt-3 space-y-1">
            <p>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:slvbakery@gmail.com"
                className="text-[#06d2d9] font-semibold"
              >
                slvbakery@gmail.com
              </a>
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              <a
                href="tel:+918105652158"
                className="text-[#06d2d9] font-semibold"
              >
                +91 98987 69879
              </a>
            </p>
          </div>
        </section>

        <div className="border-t border-[#E5D8CF] pt-5">
          <p className="font-semibold text-[#2D1E16]">
            Thank you for choosing SLV Bakery.
          </p>
          <p className="mt-1">
            We appreciate your order and will do our best to deliver your
            freshly baked products safely, quickly, and conveniently.
          </p>
        </div>

      </div>
    </div>
  );
}