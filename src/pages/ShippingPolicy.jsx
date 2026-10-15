import React from 'react';
import { Link } from 'react-router-dom';
import { PolicyLayout } from '../components/common/PolicyLayout.jsx';
import { BRAND, legalIdentity, fullAddress } from '../config/site.js';

const sections = [
  {
    id: 'order-processing',
    heading: 'Order processing',
    content: (
      <p>
        The orders for the user are shipped through registered domestic courier companies and/or speed post only. Orders are shipped and delivered within 7 – 10 business
        days from the date of the order and/or payment or as per the delivery date agreed at the time of order confirmation and delivering of the shipment, subject to
        courier company / post office norms. Platform Owner shall not be liable for any delay in delivery by the courier company / postal authority. Delivery of all orders
        will be made to the address provided by the buyer at the time of purchase. Delivery of our services will be confirmed on your email ID as specified at the time of
        registration. If there are any shipping cost(s) levied by the seller or the Platform Owner (as the case be), the same is not refundable.
      </p>
    ),
  },
  {
    id: 'locations',
    heading: 'Shipping locations',
    content: (
      <ul>
        <li>We currently ship across India.</li>
        <li>International shipping is not available at this time.</li>
      </ul>
    ),
  },
  {
    id: 'delivery-time',
    heading: 'Delivery time',
    content: (
      <ul>
        <li>Estimated delivery time is 7–10 business days from the date of shipment.</li>
        <li>Delivery timelines may vary depending on your location, courier partner, and local conditions.</li>
        <li>The expected delivery time for every product is shown on its product page and again at checkout.</li>
      </ul>
    ),
  },
  {
    id: 'perfumes',
    heading: 'Perfumes & other restricted items',
    content: (
      <ul>
        <li>
          Alcohol-based perfumes, deodorants and similar products are classified as flammable goods by courier companies. As per courier safety rules these items are
          shipped only by surface (road / rail) transport and cannot be sent by air.
        </li>
        <li>Orders containing such items may therefore take 2–3 additional business days; the product page and checkout show the updated estimate.</li>
        <li>A small number of remote PIN codes may not be serviceable for these items. If so, we will inform you and refund the amount in full.</li>
        <li>All fragrance bottles are packed with protective cushioning and sealed to prevent leakage during transit.</li>
      </ul>
    ),
  },
  {
    id: 'charges',
    heading: 'Shipping charges',
    content: (
      <ul>
        <li>Shipping charges (if applicable) will be clearly displayed at checkout before payment.</li>
        <li>Any promotional free shipping offers will be mentioned on the website at the time of purchase.</li>
      </ul>
    ),
  },
  {
    id: 'tracking',
    heading: 'Shipment confirmation & tracking',
    content: (
      <ul>
        <li>Once your order is shipped, you will receive a shipment confirmation email or SMS with tracking details.</li>
        <li>Tracking information may take 24–48 hours to become active after dispatch.</li>
        <li>
          You can also track any order on our <Link to="/track-order">Track Order</Link> page or from <Link to="/account/orders">My Orders</Link>.
        </li>
      </ul>
    ),
  },
  {
    id: 'damaged',
    heading: 'Damaged or lost shipments',
    content: (
      <ul>
        <li>
          If your order arrives damaged, leaking, or tampered, please contact us within 48 hours of delivery with photos of the product and packaging (an unboxing video
          helps us resolve it faster). You can also raise the request from <Link to="/account/orders">My Orders</Link>.
        </li>
        <li>{BRAND.name} is not responsible for delays or damage caused by courier partners beyond our control, but we will assist you in resolving the issue.</li>
      </ul>
    ),
  },
  {
    id: 'address',
    heading: 'Incorrect address or delivery failure',
    content: (
      <ul>
        <li>Please ensure that your shipping address and contact details are accurate at checkout.</li>
        <li>We are not responsible for delivery failures due to incorrect or incomplete address information provided by the customer.</li>
        <li>If an order is returned due to address issues, reshipping charges may apply.</li>
      </ul>
    ),
  },
  {
    id: 'rto',
    heading: 'Return to origin (RTO)',
    content: (
      <>
        <ul>
          <li>If an order is returned to us due to unsuccessful delivery attempts or refusal to accept delivery, the refund (if applicable) will be processed after deducting shipping charges.</li>
          <li>If your return is approved, please ship the product to the following address:</li>
        </ul>
        <div className="callout callout-info">
          <p>
            <strong>{BRAND.legalName}</strong> ({BRAND.tradeName})
            <br />
            {BRAND.address.line1}
            <br />
            {BRAND.address.line2}
            <br />
            {BRAND.address.city}, {BRAND.address.district}
            <br />
            {BRAND.address.state} – {BRAND.address.postalCode}
            <br />
            {BRAND.address.country}
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'contact',
    heading: 'Contact us',
    content: (
      <p>
        For any shipping-related questions or support, please contact us: <strong>{legalIdentity()}</strong>, {fullAddress()}. Email:{' '}
        <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a> · Phone:{' '}
        <a href={BRAND.phoneHref}>{BRAND.phone}</a>
      </p>
    ),
  },
];

export const ShippingPolicy = () => (
  <PolicyLayout
    title="Shipping Policy"
    path="/shipping-policy"
    updated="October 12, 2026"
    intro="Thank you for choosing Jayrup. We are committed to delivering your orders safely, efficiently, and on time. Please review our shipping policy to understand how we process and deliver orders."
    seoDescription="Jayrup ships across India via registered courier partners. Orders are delivered in 7–10 business days (perfumes travel by surface). Read about charges, tracking and damaged shipments."
    sections={sections}
  />
);
export default ShippingPolicy;
