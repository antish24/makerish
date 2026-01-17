import { Template, BrochureContent } from '../types/brochure';

const createManguardContent = (): BrochureContent => ({
  themeColor: '#1A365D', // Slightly deeper blue for more professional look
  layout: 'flat',
  front: {
    panels: [
      {
        id: 'm-f-1', // Slide 1: Welcome & Intro
        blocks: [
          { id: 'm-f-1-1', type: 'logo', label: 'Logo', src: '', alt: 'MANGUARD' },
          { id: 'm-f-1-2', type: 'heading', label: 'Title', content: 'MANGUARD SECURITY SERVICE', fontSize: 22, fontWeight: 'black', textAlign: 'center' },
        ],
        verticalAlign: 'center',
      },
      {
        id: 'm-f-2', // Slide 2: Our Foundation (Who We Are, Vision, Mission)
        blocks: [
          { id: 'm-f-2-1', type: 'heading', label: 'Title', content: 'Our Foundation', fontSize: 20 },
          { id: 'm-f-2-2', type: 'subheading', label: 'Subtitle', content: 'Who We Are', icon: 'ShieldCheck', fontSize: 14 },
          { id: 'm-f-2-3', type: 'body', label: 'Description', fontSize: 13, content: 'Welcome to MANGUARD SECURITY SERVICE, a premier security agency dedicated to providing top-tier security services across South India. Established by Ex-Army officials and managed by a team of dynamic and experienced executives, we are built on a foundation of discipline and professionalism.' },
          { id: 'm-f-2-4', type: 'subheading', label: 'Subtitle', content: 'Our Vision', icon: 'Eye', fontSize: 14 },
          { id: 'm-f-2-5', type: 'body', label: 'Description', fontSize: 13, content: 'To be the leading security service provider in South India, known for our commitment to excellence, innovation, and customer satisfaction. We aim to set new standards through continuous improvement and adherence to the highest ethical standards.' },
          { id: 'm-f-2-6', type: 'subheading', label: 'Subtitle', content: 'Our Mission', icon: 'Target', fontSize: 14 },
          { id: 'm-f-2-7', type: 'body', label: 'Description', fontSize: 13, content: 'To deliver reliable and professional security services by employing well-trained personnel and leveraging the latest technologies. We strive to create a secure environment, protecting assets with utmost dedication and integrity.' }
        ],
        verticalAlign: 'center'
      },
      {
        id: 'm-f-3', // Slide 3: Our Services
        blocks: [
          { id: 'm-f-3-1', type: 'heading', label: 'Title', content: 'Our Services', fontSize: 18 },
          { id: 'm-f-3-2', type: 'subheading', label: 'Subtitle', content: 'Corporate & Office Security', icon: 'Building', fontSize: 14 },
          { id: 'm-f-3-3', type: 'body', label: 'Description', content: 'Protecting offices, factories, business centers, and commercial buildings.', fontSize: 13 },
          { id: 'm-f-3-4', type: 'subheading', label: 'Subtitle', content: 'VIP & Executive Protection', icon: 'UserCheck', fontSize: 14 },
          { id: 'm-f-3-5', type: 'body', label: 'Description', content: 'Close and discreet security for high-profile individuals and diplomats.', fontSize: 13 },
          { id: 'm-f-3-6', type: 'subheading', label: 'Subtitle', content: 'Event Security Management', icon: 'Users', fontSize: 14 },
          { id: 'm-f-3-7', type: 'body', label: 'Description', content: 'Comprehensive security for corporate events, weddings, and conferences.', fontSize: 13 },
          { id: 'm-f-3-8', type: 'subheading', label: 'Subtitle', content: 'Residential & Community', icon: 'Home', fontSize: 14 },
          { id: 'm-f-3-9', type: 'body', label: 'Description', content: 'Round-the-clock protection for apartments and gated communities.', fontSize: 13 },
          { id: 'm-f-3-10', type: 'subheading', label: 'Subtitle', content: 'Industrial & Construction', icon: 'Factory', fontSize: 14 },
          { id: 'm-f-3-11', type: 'body', label: 'Description', content: 'Specialized security for industrial facilities and construction sites.', fontSize: 13 }
        ],
        verticalAlign: 'center',
        background: { type: 'color', value: '#F8FAFC', opacity: 1 }
      },
    ]
  },
  back: {
    panels: [
      {
        id: 'm-b-1', // Slide 4: Why Choose Us
        blocks: [
          { id: 'm-b-1-1', type: 'heading', label: 'Title', content: 'Why Choose Us', fontSize: 18 },
          { id: 'm-b-1-2', type: 'subheading', label: 'Subtitle', content: 'Experienced Professionals', icon: 'Award', fontSize: 14 },
          { id: 'm-b-1-3', type: 'body', label: 'Description', content: 'Our team is comprised of Ex-Army personnel and seasoned technical experts.', fontSize: 13 },
          { id: 'm-b-1-4', type: 'subheading', label: 'Subtitle', content: 'Comprehensive Training', icon: 'GraduationCap', fontSize: 14 },
          { id: 'm-b-1-5', type: 'body', label: 'Description', content: 'We invest heavily in development to handle any security challenge effectively.', fontSize: 13 },
          { id: 'm-b-1-6', type: 'subheading', label: 'Subtitle', content: 'Advanced Technology', icon: 'Cpu', fontSize: 14 },
          { id: 'm-b-1-7', type: 'body', label: 'Description', content: 'Leveraging cutting-edge surveillance and access control technologies.', fontSize: 13 },
          { id: 'm-b-1-8', type: 'subheading', label: 'Subtitle', content: 'Customized Solutions', icon: 'Layout', fontSize: 14 },
          { id: 'm-b-1-9', type: 'body', label: 'Description', content: 'Tailored security solutions that align perfectly with your requirements.', fontSize: 13 },
          { id: 'm-b-1-10', type: 'subheading', label: 'Subtitle', content: 'Commitment to Excellence', icon: 'Star', fontSize: 14 },
          { id: 'm-b-1-11', type: 'body', label: 'Description', content: 'Highest standards reflected in our proactive approach and attention to detail.', fontSize: 13 },
          { id: 'm-b-1-12', type: 'subheading', label: 'Subtitle', content: '24/7 Support', icon: 'Clock', fontSize: 14 },
          { id: 'm-b-1-13', type: 'body', label: 'Description', content: 'Available round-the-clock to respond swiftly to any security incidents.', fontSize: 13 }
        ],
        verticalAlign: 'center'
      },
      {
        id: 'm-b-2', // Slide 5: Reviews & QR
        blocks: [
          { id: 'm-b-2-1', type: 'heading', label: 'Title', content: 'We are experienced in providing you with security', fontSize: 20, textAlign: 'center' },
          { id: 'm-b-2-3', type: 'qr', label: 'QR', value: 'https://manguardsecurity.com', fontSize: 100, textAlign: 'center' },
          { id: 'm-b-2-4', type: 'body', label: 'Description', content: 'Scan to verify our certificates and view our licenses.', textAlign: 'center', fontSize: 10 }
        ],
        verticalAlign: 'center',
      },
      {
        id: 'm-b-3', // Slide 6: Get In Touch
        blocks: [
          { id: 'm-b-3-1', type: 'heading', label: 'Title', content: 'MANGUARD SECURITY', fontSize: 22, textAlign: 'center' },
          { id: 'm-b-3-2', type: 'body', label: 'Description', content: 'Connect with Manguard Security Service for reliable and professional security solutions. Our team is ready to assist you safely.', textAlign: 'center', fontSize: 11 },
          { id: 'm-b-3-3', type: 'body', label: 'Description', content: 'contact@manguardsecurity.com', icon: 'Mail', iconAlign: 'center' },
          { id: 'm-b-3-4', type: 'body', label: 'Description', content: '+91 98765 43210', icon: 'Phone', iconAlign: 'center' },
          { id: 'm-b-3-5', type: 'body', label: 'Description', content: 'Licensed & Insured | South India HQ', icon: 'Shield', iconAlign: 'center' },
          { id: 'm-b-3-6', type: 'body', label: 'Description', content: '© 2026 Manguard Security Service - All Rights Reserved', fontSize: 9, textAlign: 'center' }
        ],
        verticalAlign: 'center',
        borderTop: { type: 'solid', color: '#1A365D', width: 4, display: 'center', widthPercent: 40 }
      },
    ]
  }
});

export const templates: Template[] = [
  {
    id: 'manguard-security',
    name: 'Manguard Security Service',
    category: 'Security',
    themeColor: '#1E40AF', // Professional Deep Blue
    layout: 'flat',
    content: createManguardContent()
  },
];
