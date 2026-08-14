import PolicyPage from './PolicyPage'

const sections = [
  {
    heading: 'Our promise',
    paragraphs: [
      'Every Faaperfumes bottle is sourced as authentic. If something is not right with your order, we will make it right under the terms below.',
    ],
  },
  {
    heading: 'Return window',
    paragraphs: [
      'You may request a return or refund within 7 days of delivery for eligible items purchased on faaperfumes.com or collected from a participating store.',
    ],
    list: [
      'Item must be unused, unopened, and in original sealed packaging',
      'All seals, shrink wrap, gift boxes, and batch codes must be intact',
      'Proof of purchase (order number or receipt) is required',
    ],
  },
  {
    heading: 'Items that cannot be returned',
    paragraphs: [
      'For hygiene and authenticity reasons, some products are final sale once opened or unsealed.',
    ],
    list: [
      'Opened, sprayed, or used fragrance bottles',
      'Products with broken seals, missing packaging, or damaged batch codes',
      'Personalised gift sets once assembled or wrapped at your request',
      'Sale items marked as final sale at checkout',
    ],
  },
  {
    heading: 'Damaged, incorrect, or defective items',
    paragraphs: [
      'If your order arrives damaged, incorrect, or defective, contact us within 48 hours of delivery with photos of the parcel and product. We will arrange a replacement or full refund, including return shipping where we are at fault.',
    ],
  },
  {
    heading: 'How to start a return',
    paragraphs: [
      'Email sales@faaperfumes.com or call +971 4 000 0000 with your order number and reason for return. Once approved, we will share return instructions for courier drop-off or store hand-back (click & collect).',
    ],
  },
  {
    heading: 'Refunds',
    paragraphs: [
      'Approved refunds are issued to the original payment method within 7–14 business days after we receive and inspect the returned item. Cash on Delivery orders are refunded by bank transfer once you provide account details. Shipping fees are refunded only when the return is due to our error.',
    ],
  },
  {
    heading: 'Exchanges',
    paragraphs: [
      'Where stock allows, we can exchange an eligible sealed product for another fragrance of equal or higher value. Any price difference must be paid at the time of exchange.',
    ],
  },
  {
    heading: 'Questions',
    paragraphs: [
      'For help with returns or refunds, reach our support team any day at sales@faaperfumes.com or +971 4 000 0000. We aim to respond within one business day.',
    ],
  },
]

export default function RefundPolicy() {
  return (
    <PolicyPage
      eyebrow="Legal"
      title="Refund Policy"
      summary="Returns, exchanges, and refunds for Faaperfumes orders across the UAE."
      updated="13 August 2026"
      sections={sections}
    />
  )
}
