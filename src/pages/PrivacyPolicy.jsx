import PolicyPage from './PolicyPage'

const sections = [
  {
    heading: 'Who we are',
    paragraphs: [
      'Faaperfume (“we”, “us”, “our”) operates this online fragrance boutique and related store services across the UAE. This Privacy Policy explains what information we collect, how we use it, and the choices you have.',
    ],
  },
  {
    heading: 'Information we collect',
    paragraphs: [
      'We collect information you provide directly and information generated when you browse or place an order.',
    ],
    list: [
      'Account and contact details such as name, email, phone number, and delivery address',
      'Order history, payment confirmation status, and preferred delivery method',
      'Wishlist and cart activity while you shop on our site',
      'Device and usage data such as browser type, pages visited, and approximate location',
    ],
  },
  {
    heading: 'How we use your information',
    paragraphs: [
      'We use your information to fulfil orders, improve our store experience, and communicate with you about your purchases.',
    ],
    list: [
      'Process, deliver, and support your orders',
      'Provide click & collect, store locator, and customer care services',
      'Send order updates and, where you opt in, new-arrival or offer emails',
      'Detect fraud, secure our systems, and meet legal or accounting requirements',
    ],
  },
  {
    heading: 'Sharing and processors',
    paragraphs: [
      'We do not sell your personal information. We may share limited data with trusted partners who help us operate the shop — for example payment providers, delivery partners, and analytics tools — only as needed to provide those services.',
    ],
  },
  {
    heading: 'Cookies and preferences',
    paragraphs: [
      'We use essential cookies to keep your session and cart working. Optional analytics cookies help us understand which pages perform well. You can control cookies through your browser settings; disabling essential cookies may affect checkout.',
    ],
  },
  {
    heading: 'Data retention and security',
    paragraphs: [
      'We keep order and account records for as long as needed to complete purchases, handle returns, and meet UAE record-keeping obligations. We apply reasonable technical and organisational measures to protect your data against unauthorised access or loss.',
    ],
  },
  {
    heading: 'Your rights',
    paragraphs: [
      'You may request access to, correction of, or deletion of personal data we hold about you, subject to legal retention needs. To exercise these rights, or ask a privacy question, contact faaperfumess@gmail.com or call 055 238 3144. Our office is at THE BINARY BY OMNIYAT, Office 1912-191, Business Bay, Dubai, United Arab Emirates.',
    ],
  },
  {
    heading: 'Updates to this policy',
    paragraphs: [
      'We may update this Privacy Policy from time to time. The “Last updated” date at the top of this page will change when we do. Continued use of the site after an update means you accept the revised policy.',
    ],
  },
]

export default function PrivacyPolicy() {
  return (
    <PolicyPage
      eyebrow="Legal"
      title="Privacy Policy"
      summary="How Faaperfume collects, uses, and protects your information when you shop with us."
      updated="13 August 2026"
      sections={sections}
    />
  )
}
