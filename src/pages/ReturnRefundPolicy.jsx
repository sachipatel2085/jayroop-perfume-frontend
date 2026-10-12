import React from 'react';
import { Link } from 'react-router-dom';
import { PolicyLayout } from '../components/common/PolicyLayout.jsx';
import { BRAND } from '../config/site.js';

const sections = [
  {
    id: 'return-policy',
    heading: 'Return policy',
    content: (
      <>
        <p>
          We offer return / exchange within first 3 days from the date of your purchase. If 3 days have passed since your purchase, you will not be offered a return,
          exchange or refund of any kind. In order to become eligible for a return or an exchange, (i) the purchased item should be unused and in the same condition as you
          received it, (ii) the item must have original packaging, (iii) if the item that you purchased on a sale, then the item may not be eligible for a return /
          exchange. Further, only such items are replaced by us (based on an exchange request), if such items are found defective or damaged.
        </p>
        <p>All the exchanged/replaced/damaged product will be delivered within 5-7 business days.</p>
        <p>
          You agree that there may be a certain category of products / items that are exempted from returns or refunds. Such categories of the products would be identified
          to you at the item of purchase. For exchange / return accepted request(s) (as applicable), once your returned product / item is received and inspected by us, we
          will send you an email to notify you about receipt of the returned / exchanged product. Further, if the same has been approved after the quality check at our
          end, your request (i.e. return / exchange) will be processed in accordance with our policies.
        </p>
      </>
    ),
  },
  {
    id: 'refund-policy',
    heading: 'Refund & cancellation policy',
    content: (
      <>
        <p>
          This refund and cancellation policy outlines how you can cancel or seek a refund for a product / service that you have purchased through the Platform. Under this
          policy:
        </p>
        <ol>
          <li>
            Cancellations will only be considered if the request is made within 7 days of placing the order. However, cancellation requests may not be entertained if the
            orders have been communicated to such sellers / merchant(s) listed on the Platform and they have initiated the process of shipping them, or the product is out
            for delivery. In such an event, you may choose to reject the product at the doorstep. Orders that are not yet dispatched can be cancelled instantly from{' '}
            <Link to="/account/orders">My Orders</Link>.
          </li>
          <li>
            In case of receipt of damaged or defective items, please report to our customer service team. The request would be entertained once the seller/ merchant listed
            on the Platform, has checked and determined the same at its own end. This should be reported within 3 days of receipt of products.
          </li>
          <li>
            In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service
            within 3 days of receiving the product. The customer service team after looking into your complaint will take an appropriate decision.
          </li>
          <li>In case of complaints regarding the products that come with a warranty from the manufacturers, please refer the issue to them.</li>
          <li>
            In case of any refunds approved by Jayrup, it will take 15 days for the refund to be credited to the original payment mode (PhonePe UPI / card / net banking).
            Refunds for Cash on Delivery orders are made to your bank account or UPI ID.
          </li>
        </ol>
      </>
    ),
  },
  {
    id: 'how-to',
    heading: 'How to request a return or refund',
    content: (
      <ol>
        <li>
          E-mail <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a> or call <a href={BRAND.phoneHref}>{BRAND.phone}</a> with your order number.
        </li>
        <li>Attach clear photos of the product and the packaging (for damaged, leaking or incorrect items).</li>
        <li>Our team will confirm eligibility and share the pickup / return instructions.</li>
        <li>Once approved after quality check, the replacement is shipped or the refund is initiated, and you receive an e-mail confirmation.</li>
      </ol>
    ),
  },
];

export const ReturnRefundPolicy = () => (
  <PolicyLayout
    title="Refund & Return Policy"
    path="/refund-return-policy"
    seoTitle="Return & Refund Policy"
    seoDescription="Return or exchange within 3 days of delivery for damaged or defective items. Refunds are credited to the original payment method within 15 days."
    sections={sections}
  />
);

export default ReturnRefundPolicy;
