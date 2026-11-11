// All AYRA site content lives here. Edit text, images and lists in this one file.

export const IMG = (name: string) => `/ayra/img/${name}`;

export const CONTACT = {
  phoneLabel: '+91 81792 59334',
  whatsapp: '918179259334',
};

export const COMPANY = {
  name: 'AYRA',
  legal: 'AYRA ASSOCIATES (OPC) PRIVATE LIMITED',
  architect: 'Chakilam Saketh Bharadwaj',
  role: 'Principal Architect',
  city: 'Hyderabad',
};

/** The AYRA eye, redrawn as single strokes from the logo so it can be drawn by a pencil. */
export const EYE_VIEWBOX = '0 6 1030 506';
export const EYE_PATHS = [
  'M24 216 Q28 250 46 254 Q200 118 362 56',
  'M362 56 C336 190 362 340 434 500',
  'M155 233 Q250 365 388 382',
  'M434 38 L394 52 C356 150 392 300 540 300',
  'M540 18 V406 Q470 404 428 394 L418 358',
  'M572 20 V410 H612',
  'M572 22 Q680 26 724 44 C780 150 730 296 572 300',
  'M580 300 Q620 386 672 402 L720 394',
  'M757 50 C786 190 762 320 690 500',
  'M757 50 Q900 128 1006 226',
  'M975 206 Q880 340 735 382',
];

export const NAV = [
  { label: 'Home', href: '#top' },
  { label: 'Work', href: '#reel' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Project 49', href: '#project-49' },
];

export const DOOR_WORDS = {
  ayra: ['Living rooms', 'Kitchens', 'Bedrooms', 'Facades', 'Courtyards', 'Gardens'],
  p49: ['Light', 'Air', 'Art', 'Roots', 'Earth', 'Silence', 'Future'],
};

/** Hero: the pencil colours each of these in, one after another. */
export const HERO_SCENES = [
  { img: 'p1-r16', code: 'P-01', label: 'Pooja hall — Teak, Brass & Light, Hyderabad' },
  { img: 'p1-r05', code: 'P-01', label: 'Kitchen — Teak, Brass & Light' },
  { img: 'facade', code: 'E-01', label: 'Facade at dusk' },
  { img: 'p1-r15', code: 'P-01', label: 'Painted coffered ceiling — Teak, Brass & Light' },
  { img: 'garden', code: 'E-02', label: 'Courtyard garden' },
];

/** AYRA's own projects. Add a new object here to add a project; photos go in public/ayra/img. */
export const PROJECTS = [
  {
    name: 'Teak, Brass & Light',
    place: 'Residence, Hyderabad',
    scope: 'Interior design · Kitchen, pooja hall, living',
    year: '2026',
    cover: 'p1-r16',
    text: 'A family home in teak, brass and white marble. An open kitchen with brass storage jars and black granite, and a pooja hall under a hand-painted coffered ceiling, with a carved teak mandapa at its centre.',
    gallery: [
      { img: 'p1-r16', cap: 'Pooja hall' },
      { img: 'p1-r15', cap: 'Painted coffered ceiling' },
      { img: 'p1-r12', cap: 'Hall and mandapa' },
      { img: 'p1-r10', cap: 'Sitting by the shrine' },
      { img: 'p1-r19', cap: 'Brass lamps' },
      { img: 'p1-r21', cap: 'Carved entrance' },
      { img: 'p1-r05', cap: 'Kitchen and brass jars' },
      { img: 'p1-r01', cap: 'Open kitchen' },
      { img: 'p1-r03', cap: 'Black granite island' },
      { img: 'p1-r07', cap: 'Herbs by the hob' },
      { img: 'p1-r14', cap: 'Teak columns' },
      { img: 'p1-r22', cap: 'Through to the stair' },
    ],
  },
  {
    name: 'Concept studies',
    place: 'Hyderabad',
    scope: 'Interiors & exteriors',
    year: '2026',
    cover: 'gallery',
    text: 'Rooms and facades drawn by the studio to test light, material and proportion before they are built.',
    gallery: [
      { img: 'gallery', cap: 'Gallery hall' },
      { img: 'day', cap: 'Daylight house' },
      { img: 'stone', cap: 'Stone courtyard' },
      { img: 'plaster', cap: 'Lime & light' },
      { img: 'atrium', cap: 'Timber atrium' },
      { img: 'glass', cap: 'City at night' },
    ],
  },
];

export const MARQUEE = {
  inside: ['Living rooms', 'Kitchens', 'Bedrooms', 'Pooja rooms', 'Lighting'],
  outside: ['Facades', 'Courtyards', 'Gardens', 'Terraces', 'Jaalis'],
};

export const NUMBERS = [
  { value: 2, text: 'Sides of the house, inside & out' },
  { value: '3D', text: 'Walk through it before it is built' },
  { value: 6, text: 'Stages, each signed off by you' },
  { value: 1, text: 'Studio from sketch to handover' },
];

/** The horizontal "walk through the house". */
export const ROOMS = [
  { id: 'interiors', img: 'living', title: 'Living room', side: 'Inside', note: 'jaali clerestory', text: 'A double-height hall, planned around a courtyard tree and light through the jaali.' },
  { img: 'kitchen', title: 'Kitchen', side: 'Inside', note: 'herb wall, east light', text: 'Terrazzo, steel and a herb wall that catches the morning sun.' },
  { img: 'lounge', title: 'Lounge', side: 'Inside', note: 'stone, cut low', text: 'A sunken room cut into stone, for long evenings.' },
  { id: 'exteriors', img: 'facade', title: 'Facade', side: 'Outside', note: 'board-formed concrete', text: 'Board-formed concrete that glows warm at dusk.' },
  { img: 'garden', title: 'Courtyard garden', side: 'Outside', note: 'skylight over planting', text: 'Planting under a skylight, so the garden lives inside.' },
  { img: 'jaali', title: 'Entrance', side: 'Outside', note: 'hand-carved jaali', text: 'A carved jaali that turns the first step into shade and pattern.' },
] as const;

export const MATERIALS = [
  { img: 'sw-stone', name: 'Basalt', use: 'Garden walls, plinths, steps' },
  { img: 'sw-carving', name: 'Sandstone', use: 'Feature walls, pooja rooms' },
  { img: 'sw-plaster', name: 'Lime plaster', use: 'Walls that stay cool' },
  { img: 'sw-teak', name: 'Rammed earth', use: 'Thick, warm walls' },
  { img: 'sw-terrazzo', name: 'Terrazzo', use: 'Kitchen and hall floors' },
  { img: 'sw-jaali', name: 'Jaali', use: 'Light, air and privacy' },
];

export const BELIEF = 'A home should look like the family who lives in it, not like the one next door.';

export const PROCESS = [
  { title: 'Design', text: 'We sit with you, plan the space and build a 3D walkthrough you can step through before anything is ordered.', steps: ['Brief & site visit', 'Concept & mood board', '3D walkthrough'] },
  { title: 'Detail', text: 'Working drawings for every wall, cabinet and light, with real samples and a cost you sign off.', steps: ['Working drawings', 'Materials & samples', 'Lighting & electrical'] },
  { title: 'Build', text: 'Our site team builds to the drawings, then styles the rooms and hands you the keys.', steps: ['Execution on site', 'Styling', 'Handover'] },
];

export const WORK = [
  { img: 'gallery', tag: 'Interior', title: 'Gallery hall' },
  { img: 'day', tag: 'Interior', title: 'Daylight house' },
  { img: 'stone', tag: 'Exterior', title: 'Stone courtyard' },
  { img: 'plaster', tag: 'Interior', title: 'Lime & light' },
];

export const BRIEF_CHIPS = {
  space: ['Whole home', 'Interiors', 'Exteriors & facade', 'A single room', 'Landscape'],
  timeline: ['Right away', '1–3 months', '3–6 months', 'Just exploring'],
};

/** The process film (2D plan → 3D model → finished home), made in Google Flow with Veo 3.1 Lite.
 *  File lives in public/ayra/video. Add more clips to the list and they play back to back. */
export const FILM = {
  poster: '/ayra/video/ayra-process-poster.jpg',
  clips: ['/ayra/video/ayra-process.mp4'],
};

/** Films made in Google Flow (Veo 3.1 Lite): each starts from the architect's sketch and ends on the real render.
 *  Files live in public/ayra/video. The first one is the full-screen opening film. */
const V = (n: string) => `/ayra/video/${n}`;
export const FILMS = [
  { src: V('ayra-film-pooja.mp4'), poster: IMG('p1-r16-sketch.jpg'), code: 'P-01', label: 'Pooja hall, Teak, Brass & Light', text: 'A pooja hall under a hand-painted coffered ceiling, with brass lamps and white marble.' },
  { src: V('ayra-film-kitchen.mp4'), poster: IMG('p1-r05-sketch.jpg'), code: 'P-01', label: 'The kitchen', text: 'Teak shelving, brass storage jars and black granite, planned around how the family cooks.' },
  { src: V('ayra-film-facade.mp4'), poster: IMG('facade-sketch.jpg'), code: 'E-01', label: 'A facade at dusk', text: 'Board-formed concrete, timber and glass, designed for how the house glows after sunset.' },
  { src: V('ayra-film-mandapa.mp4'), poster: IMG('p1-r12-sketch.jpg'), code: 'P-01', label: 'Hall and mandapa', text: 'A carved teak mandapa at the centre of the home, drawn first, then built by hand.' },
];

export const SERVICES = [
  { title: 'Interiors', text: 'Whole homes or single rooms, designed and detailed.', items: ['Living & dining', 'Kitchens', 'Bedrooms & wardrobes', 'Pooja rooms', 'Lighting design'] },
  { title: 'Exteriors & elevations', text: 'The front of the house, the way it meets the street.', items: ['Elevation design', 'Facade materials', 'Courtyards & gardens', 'Gates, jaalis & screens'] },
  { title: '3D walkthroughs', text: 'See and walk through the home before anything is ordered.', items: ['Photoreal renders', '3D walkthrough films', 'Material & colour options'] },
  { title: 'Design + build', text: 'Our site team builds to the drawings and hands you the keys.', items: ['Working drawings', 'Site supervision', 'Styling & handover'] },
];

export const FAQ = [
  { q: 'Where do you work?', a: 'We are based in Hyderabad and take on homes across Hyderabad and the Telugu states. For projects further away, call us and we will tell you honestly if we can serve you well.' },
  { q: 'How long does a design take?', a: 'A single room usually takes 2 to 4 weeks from brief to final drawings; a full home 6 to 10 weeks. Building time depends on the scope and is planned with you at the start.' },
  { q: 'Will I see the design before work starts?', a: 'Yes. You get hand sketches, then a 3D walkthrough and photoreal views, and you sign off each stage before anything is ordered.' },
  { q: 'Do you visit the site?', a: 'Always. We measure and see the light on site before drawing a single line.' },
  { q: 'How are fees worked out?', a: 'Fees depend on the scope and size of the project and are agreed in writing after the first meeting and site visit.' },
  { q: 'Can you only design, and let my contractor build?', a: 'Yes. We can hand over full working drawings and visit the site at key stages, or our own team can build it for you.' },
];
