import { Template, BrochureContent, Block } from '../types/brochure';

const createManguardContent = (): BrochureContent => ({
  themeColor: '#1A365D',
  layout: 'flat',
  front: {
    panels: [
      {
        id: 'm-f-1',
        blocks: [
          { id: 'm-f-1-1', type: 'logo', label: 'Logo', src: '', alt: 'MANGUARD' },
          { id: 'm-f-1-2', type: 'heading', label: 'Title', content: 'MANGUARD SECURITY SERVICE', fontSize: 22, fontWeight: 'black', textAlign: 'center' },
        ],
        verticalAlign: 'center',
      },
      {
        id: 'm-f-2',
        blocks: [
          { id: 'm-f-2-1', type: 'heading', label: 'Title', content: 'Our Foundation', fontSize: 20 },
          { id: 'm-f-2-2', type: 'subheading', label: 'Subtitle', content: 'Who We Are', icon: 'ShieldCheck', fontSize: 14 },
          { id: 'm-f-2-3', type: 'body', label: 'Description', fontSize: 13, content: 'Welcome to MANGUARD SECURITY SERVICE, a premier security agency dedicated to providing top-tier security services across South India. Established by Ex-Army officials and managed by a team of dynamic and experienced executives, we are built on a foundation of discipline and professionalism.' },
          { id: 'm-f-2-4', type: 'subheading', label: 'Subtitle', content: 'Our Vision', icon: 'Eye', fontSize: 14 },
          { id: 'm-f-2-5', type: 'body', label: 'Description', fontSize: 13, content: 'To be the leading security service provider in South India, known for our commitment to excellence, innovation, and customer satisfaction.' },
          { id: 'm-f-2-6', type: 'subheading', label: 'Subtitle', content: 'Our Mission', icon: 'Target', fontSize: 14 },
          { id: 'm-f-2-7', type: 'body', label: 'Description', fontSize: 13, content: 'To deliver reliable and professional security services by employing well-trained personnel and leveraging the latest technologies.' }
        ],
        verticalAlign: 'center'
      },
      {
        id: 'm-f-3',
        blocks: [
          { id: 'm-f-3-1', type: 'heading', label: 'Title', content: 'Our Services', fontSize: 18 },
          { id: 'm-f-3-2', type: 'subheading', label: 'Subtitle', content: 'Corporate & Office Security', icon: 'Building', fontSize: 14 },
          { id: 'm-f-3-3', type: 'body', label: 'Description', content: 'Protecting offices, factories, business centers, and commercial buildings.', fontSize: 13 },
          { id: 'm-f-3-4', type: 'subheading', label: 'Subtitle', content: 'VIP & Executive Protection', icon: 'UserCheck', fontSize: 14 },
          { id: 'm-f-3-6', type: 'subheading', label: 'Subtitle', content: 'Event Security Management', icon: 'Users', fontSize: 14 },
          { id: 'm-f-3-8', type: 'subheading', label: 'Subtitle', content: 'Residential & Community', icon: 'Home', fontSize: 14 },
        ],
        verticalAlign: 'center',
        background: { type: 'color', value: '#F8FAFC', opacity: 1 }
      },
    ]
  },
  back: {
    panels: [
      {
        id: 'm-b-1',
        blocks: [
          { id: 'm-b-1-1', type: 'heading', label: 'Title', content: 'Why Choose Us', fontSize: 18 },
          { id: 'm-b-1-2', type: 'subheading', label: 'Subtitle', content: 'Experienced Professionals', icon: 'Award', fontSize: 14 },
          { id: 'm-b-1-3', type: 'body', label: 'Description', content: 'Our team is comprised of Ex-Army personnel and seasoned technical experts.', fontSize: 13 },
          { id: 'm-b-1-4', type: 'subheading', label: 'Subtitle', content: 'Comprehensive Training', icon: 'GraduationCap', fontSize: 14 },
          { id: 'm-b-1-6', type: 'subheading', label: 'Subtitle', content: 'Advanced Technology', icon: 'Cpu', fontSize: 14 },
        ],
        verticalAlign: 'center'
      },
      {
        id: 'm-b-2',
        blocks: [
          { id: 'm-b-2-1', type: 'heading', label: 'Title', content: 'Professional Excellence', fontSize: 20, textAlign: 'center' },
          { id: 'm-b-2-3', type: 'qr', label: 'QR', value: 'https://manguardsecurity.com', fontSize: 100, textAlign: 'center' },
          { id: 'm-b-2-4', type: 'body', label: 'Description', content: 'Scan to verify our certificates.', textAlign: 'center', fontSize: 10 }
        ],
        verticalAlign: 'center',
      },
      {
        id: 'm-b-3',
        blocks: [
          { id: 'm-b-3-1', type: 'heading', label: 'Title', content: 'MANGUARD SECURITY', fontSize: 22, textAlign: 'center' },
          { id: 'm-b-3-2', type: 'body', label: 'Description', content: 'contact@manguardsecurity.com', icon: 'Mail', iconAlign: 'center' },
          { id: 'm-b-3-4', type: 'body', label: 'Description', content: '+91 98765 43210', icon: 'Phone', iconAlign: 'center' },
          { id: 'm-b-3-6', type: 'body', label: 'Description', content: '© 2026 Manguard Security Service', fontSize: 9, textAlign: 'center' }
        ],
        verticalAlign: 'center',
        borderTop: { type: 'solid', color: '#1A365D', width: 4, display: 'center', widthPercent: 40 }
      },
    ]
  }
});

const createCertificateSingleContent = (): BrochureContent => ({
  themeColor: '#846D1C', // Darkened Gold
  layout: 'flat',
  front: {
    panels: [
      {
        id: 'cert-1',
        blocks: [
          { id: 'c1-1', type: 'icon', label: 'Seal', icon: 'Award', textAlign: 'center', fontSize: 64, color: '#846D1C' },
          { id: 'c1-2', type: 'heading', label: 'Title', content: '🏆 CERTIFICATE OF ACHIEVEMENT', fontSize: 32, fontWeight: 'black', textAlign: 'center' },
          { id: 'c1-3', type: 'body', label: 'Intro', content: 'This Certificate is Proudly Presented to', fontSize: 18, textAlign: 'center' },
          { id: 'c1-4', type: 'heading', label: 'Recipient', content: '[Recipient Name]', fontSize: 42, fontWeight: 'bold', textAlign: 'center', color: '#846D1C' },
          { id: 'c1-5', type: 'body', label: 'Recognition', content: 'In recognition of outstanding achievement in\n[Achievement / Subject / Event Name]', fontSize: 16, textAlign: 'center' },
          { id: 'c1-6', type: 'body', label: 'Commendation', content: 'Your dedication, hard work, and commitment to excellence are truly commendable.\nThis accomplishment reflects your perseverance and determination.', fontSize: 13, textAlign: 'center', color: '#4B5563' },
          { id: 'c1-7', type: 'subheading', label: 'Date', content: 'Awarded this ___ day of _______, 20 ', fontSize: 14, textAlign: 'center' },
          { id: 'c1-8', type: 'logo', label: 'Signature', src: '', alt: 'Signature', fontSize: 100, textAlign: 'center' }
        ],
        verticalAlign: 'center',
        background: { type: 'pattern', value: 'custom', opacity: 0.08 }
      }
    ]
  }
});

const createCertificateSplitContent = (): BrochureContent => ({
  themeColor: '#1E3A8A', // Deep Blue
  layout: 'flat',
  front: {
    panels: [
      {
        id: 'cert-split-en', // English Side
        blocks: [
          { id: 'cs-en-7', type: 'logo', label: 'Signature', src: '', alt: 'Signature', fontSize: 100, textAlign: 'center' },
          { id: 'cs-en-1', type: 'heading', label: 'Title EN', content: '🏆 CERTIFICATE OF ACHIEVEMENT', fontSize: 22, fontWeight: 'black', color: '#000000', textAlign: 'center' },
          { id: 'cs-en-2', type: 'body', label: 'Intro EN', content: 'This Certificate is Proudly Presented to', fontSize: 14, color: '#DBEAFE', textAlign: 'center' },
          { id: 'cs-en-3', type: 'heading', label: 'Name EN', content: '[Recipient Name]', fontSize: 26, fontWeight: 'bold', color: '#000000', textAlign: 'center' },
          { id: 'cs-en-4', type: 'body', label: 'Recognition EN', content: 'In recognition of outstanding achievement in\n[Achievement / Subject / Event Name]', fontSize: 12, color: '#DBEAFE', textAlign: 'center' },
          { id: 'cs-en-5', type: 'body', label: 'Commendation EN', content: 'Your dedication, hard work, and commitment\nto excellence are truly commendable.', fontSize: 10, color: '#BFDBFE', textAlign: 'center' },
          { id: 'cs-en-6', type: 'subheading', label: 'Date EN', content: 'Awarded this ___ day of _______, 20 ', fontSize: 11, color: '#000000', textAlign: 'center' }
        ],
        verticalAlign: 'center',
        background: { type: 'color', value: '#1E3A8A', opacity: 1 }
      },
      {
        id: 'cert-split-fr', // French Side
        blocks: [
          { id: 'cs-fr-7', type: 'logo', label: 'Signature', src: '', alt: 'Signature', fontSize: 100, textAlign: 'center' },
          { id: 'cs-fr-1', type: 'heading', label: 'Titre FR', content: '🏆 CERTIFICAT DE RÉUSSITE', fontSize: 22, fontWeight: 'black', color: '#1E3A8A', textAlign: 'center' },
          { id: 'cs-fr-2', type: 'body', label: 'Intro FR', content: 'Ce certificat est fièrement présenté à', fontSize: 14, color: '#64748B', textAlign: 'center' },
          { id: 'cs-fr-3', type: 'heading', label: 'Nom FR', content: '[Nom du récipiendaire]', fontSize: 26, fontWeight: 'bold', textAlign: 'center', color: '#1E3A8A' },
          { id: 'cs-fr-4', type: 'body', label: 'Reconnaissance FR', content: 'En reconnaissance de réalisations exceptionnelles en\n[Réalisation / Sujet / Nom de l\'événement]', fontSize: 12, textAlign: 'center', color: '#64748B' },
          { id: 'cs-fr-5', type: 'body', label: 'Félicitations FR', content: 'Votre dévouement, votre dur labeur et votre\nengagement envers l\'excellence sont louables.', fontSize: 10, textAlign: 'center', color: '#94A3B8' },
          { id: 'cs-fr-6', type: 'subheading', label: 'Date FR', content: 'Décerné ce ___ jour de _______, 20 ', fontSize: 11, textAlign: 'center', color: '#1E3A8A' }
        ],
        verticalAlign: 'center',
        background: { type: 'color', value: '#FFFFFF', opacity: 1 }
      }
    ]
  }
});

const createCVContent = (): BrochureContent => ({
  themeColor: '#374151',
  layout: 'flat',
  front: {
    panels: [
      {
        id: 'cv-1',
        blocks: [
          { id: 'cv1-1', type: 'heading', label: 'Name', content: 'ALEX RIVERA', fontSize: 24, fontWeight: 'black' },
          { id: 'cv1-2', type: 'subheading', label: 'Title', content: 'Senior Software Engineer', fontSize: 14 },
          { id: 'cv1-3', type: 'body', label: 'Contact', content: 'alex.rivera@example.com | +1 234 567 890', fontSize: 12 },
          { id: 'cv1-4', type: 'heading', label: 'Profile', content: 'Profile', fontSize: 16, fontWeight: 'bold' },
          { id: 'cv1-5', type: 'body', label: 'Summary', content: 'Experienced developer with a passion for building scalable web applications and leading high-performing teams.', fontSize: 12 }
        ],
        verticalAlign: 'top',
        background: { type: 'color', value: '#F3F4F6', opacity: 1 }
      },
      {
        id: 'cv-2',
        blocks: [
          { id: 'cv2-1', type: 'heading', label: 'Experience', content: 'Work Experience', fontSize: 18, fontWeight: 'bold' },
          { id: 'cv2-2', type: 'subheading', label: 'Job 1', content: 'Tech Lead @ Future Systems', fontSize: 14, fontWeight: 'bold' },
          { id: 'cv2-3', type: 'body', label: 'Job 1 Desc', content: 'Led the development of a microservices-based architecture handling 1M+ requests daily.', fontSize: 12 },
          { id: 'cv2-4', type: 'subheading', label: 'Job 2', content: 'Software Engineer @ Cloud Scale', fontSize: 14, fontWeight: 'bold' },
          { id: 'cv2-5', type: 'body', label: 'Job 2 Desc', content: 'Reduced infrastructure costs by 40% through extensive containerization and optimization.', fontSize: 12 }
        ],
        verticalAlign: 'top'
      }
    ]
  }
});

export const templates: Template[] = [
  {
    id: 'manguard-security',
    name: 'Manguard Security Service',
    category: 'brochure',
    themeColor: '#1E40AF',
    layout: 'flat',
    content: createManguardContent()
  },
  {
    id: 'cert-modern-single',
    name: 'Modern Single Certificate',
    category: 'certificate',
    themeColor: '#B4941F',
    layout: 'flat',
    content: createCertificateSingleContent()
  },
  {
    id: 'cert-pro-split',
    name: 'Professional Split Certificate',
    category: 'certificate',
    themeColor: '#1E40AF',
    layout: 'flat',
    content: createCertificateSplitContent()
  },
  {
    id: 'cv-classic',
    name: 'Classic CV',
    category: 'cv',
    themeColor: '#374151',
    layout: 'flat',
    content: createCVContent()
  },
  {
    id: 'brothers-template',
    name: 'Brothers Special',
    category: 'brothers',
    themeColor: '#7C3AED',
    layout: 'flat',
    content: createCVContent() // Placeholder for now
  }
];
