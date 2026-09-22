/**
 * Every visible string and asset on the site.
 *
 * Project copy, titles, scopes and years are taken from Karma Morgan's own
 * 2023-2026 graphic design portfolio. The imagery in /public/work and
 * /public/brand is exported straight from that document.
 *
 * The email and Instagram are real. Behance and Are.na are still placeholders:
 * swap the `#` hrefs in `elsewhere` when those profiles exist.
 */

export const person = {
  name: "Karma Morgan",
  role: "Graphic designer",
  email: "kerminaemadmorgan@aucegypt.edu",
  years: "2023-2026",
  headline: ["Graphic design,", "mostly drawn", "by hand."],
  intro:
    "Illustration, editorial and brand identity. Five projects, built from research up.",
  about: [
    "I design publications, magazines, brand systems and posters, and I draw most of what goes inside them. Projects usually start in research and end in print.",
    "The work here runs from 2023 to 2026: an illustrated book on Upper Egyptian funeral poetry, an editorial issue on tiles, a wool shop identity, a poster series on child labour, and a set of characters from a forest that is not well.",
  ],
  mascot: {
    src: "/brand/mascot.jpg",
    alt: "Karma Morgan's self-portrait doodle, drawn in white line on black",
    width: 512,
    height: 576,
  },
  lettering: {
    src: "/brand/lettering.jpg",
    alt: "Hand-drawn PORTFOLIO lettering with airbrushed chrome stars",
    width: 1976,
    height: 1258,
  },
};

export const nav = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
];

/** One label per intent, reused in the nav, the hero and the contact block. */
export const cta = {
  contact: "Say hello",
  work: "See the work",
};

export type Plate = { src: string; alt: string };

export type Project = {
  slug: string;
  number: string;
  title: string;
  /** Shown next to the title where the original project carries one. */
  titleAlt?: string;
  scope: string;
  kind: string;
  year: string;
  /** One line for the index and the grid. */
  blurb: string;
  /** Her own project description, as written in the portfolio. */
  body: string[];
  span: "wide" | "narrow" | "full";
  cover: Plate;
  plates: Plate[];
};

export const projects: Project[] = [
  {
    slug: "al-adid",
    number: "1",
    title: "Al-'Adīd",
    titleAlt: "العديد",
    scope: "Illustration",
    kind: "Academic",
    year: "2026",
    blurb:
      "An illustrated publication on the Upper Egyptian lament, and the women who keep it.",
    body: [
      "This illustrated publication explores Al-'Adīd (العديد), a traditional oral lament practice from Upper Egypt, through the visualization of its poetic imagery and symbolism. Rooted in extensive research, the project examines how these funeral poems preserve memory, express grief, and reflect social identities within the community.",
      "By organizing the laments into four distinct personas and translating their metaphors into contemporary illustrations, the publication challenges the perception of Al-'Adīd as an outdated tradition and instead presents it as a rich cultural artifact worthy of preservation and appreciation.",
    ],
    span: "wide",
    cover: {
      src: "/work/p4.jpg",
      alt: "Three copies of the Al-'Adid book, cover illustrated with mourning women inside an ornamental frame",
    },
    plates: [
      {
        src: "/work/p5.jpg",
        alt: "Chapter spread in red and white with an illustrated mother and child",
      },
      {
        src: "/work/p6.jpg",
        alt: "Interior spreads with crimson illustrations and Arabic verse",
      },
      {
        src: "/work/p7.jpg",
        alt: "Blue chapter spread with a boat illustration and patterned border",
      },
      {
        src: "/work/p8.jpg",
        alt: "Pink chapter spread with paired lamb illustrations and a bride figure",
      },
      {
        src: "/work/p9.jpg",
        alt: "Green chapter spread with a rider illustration and a full ornament pattern",
      },
    ],
  },
  {
    slug: "object-magazine",
    number: "2",
    title: "Object Magazine",
    scope: "Editorial",
    kind: "Academic",
    year: "2025",
    blurb: "An editorial issue that follows one object, the tile, across cultures.",
    body: [
      "The Object Magazine is an editorial design project that explores the stories behind everyday objects through research-driven visual storytelling. For this issue, the focus is on tiles, examining their history, cultural significance, production methods, and diverse applications across architecture and design.",
      "The magazine combines informative content with a carefully crafted layout, using typography, imagery, and visual hierarchy to guide readers through the evolution of tiles and their impact on different places and cultures.",
    ],
    span: "narrow",
    cover: {
      src: "/work/p11.jpg",
      alt: "Object Magazine cover, issue one, The Tiles",
    },
    plates: [
      {
        src: "/work/p12.jpg",
        alt: "Yellow and blue spreads on Persian tile art across the Safavid and Qajar dynasties",
      },
      {
        src: "/work/p13.jpg",
        alt: "Spreads on mosaic tiles with warm orange and pink section colours",
      },
      {
        src: "/work/p14.jpg",
        alt: "Spread titled The tile culture around the world, opposite a section on azulejos",
      },
      {
        src: "/work/p15.jpg",
        alt: "Pages on Turkish, Spanish and Persian tile heritage laid out as a grid",
      },
    ],
  },
  {
    slug: "baa-cloth",
    number: "3",
    title: "BAA-Cloth",
    scope: "Branding",
    kind: "Academic",
    year: "2024",
    blurb: "A wool shop identity built from one drawing: a sheep that is also a ball of yarn.",
    body: [
      "BAA-CLOTH is a conceptual brand identity created for a wool fabric and textile shop. The logo combines the form of a sheep with a ball of yarn, creating a simple and memorable icon that directly reflects the brand's connection to wool and craftsmanship.",
      "The visual identity uses soft colors, clean lines, and approachable typography to communicate warmth, quality, and authenticity. The project focuses on developing a recognizable brand mark that captures the handmade nature of wool products while maintaining a modern and versatile appearance.",
    ],
    span: "narrow",
    cover: {
      src: "/work/p20.jpg",
      alt: "BAA-Cloth packaging: a patterned box, lid and sticker set",
    },
    plates: [
      {
        src: "/work/p17.jpg",
        alt: "Brand board showing the primary logo, secondary logo, brandmark, pattern and typography",
      },
      {
        src: "/work/p18.jpg",
        alt: "Business cards and pattern swatches in pink, cream and dark brown",
      },
      {
        src: "/work/p19.jpg",
        alt: "Printed wrapping paper covered in the sheep pattern",
      },
    ],
  },
  {
    slug: "who-made-your",
    number: "4",
    title: "Who made your..?",
    scope: "Typographic posters",
    kind: "Academic",
    year: "2024",
    blurb: "Three posters that ask who actually made the clothes you are wearing.",
    body: [
      "This project explores the global issue of child labor through a series of three typographic posters. The objective was to communicate a social issue visually by combining typography, photography, illustration, and collage.",
      "Centered around the rhetorical question, “Who Made Your…?”, the posters encourage viewers to reflect on the hidden labor behind the clothing and products they use every day. The series aims to raise awareness of child labor practices and prompt a more conscious consideration of production, consumption, and ethical responsibility.",
    ],
    span: "wide",
    cover: {
      src: "/work/p22.jpg",
      alt: "The three posters side by side: jeans in orange, shoes in blue, shirt in pink",
    },
    plates: [
      {
        src: "/work/p23.jpg",
        alt: "The posters pasted in a shop window",
      },
      {
        src: "/work/p24.jpg",
        alt: "Poster flyers and stickers arranged on an orange ground",
      },
      {
        src: "/work/p25.jpg",
        alt: "Booklet spread showing the jeans poster artwork",
      },
    ],
  },
  {
    slug: "cursed-forest",
    number: "5",
    title: "Cursed Forest",
    scope: "Illustration",
    kind: "Academic",
    year: "2023",
    blurb: "Three characters from a forest where human, animal and plant stopped being separate.",
    body: [
      "This illustration based project explores a fictional cursed forest through the creation of three original characters designed to exist within the same visual world. Drawing on themes of body horror, the designs distort the human form and blur the boundaries between human, animal, and plant life.",
      "Each character represents a different type of biological fusion, reflecting the forest's unnatural influence while maintaining a cohesive visual language. The project focuses on world-building and character design.",
    ],
    span: "full",
    cover: {
      src: "/work/p28.jpg",
      alt: "The three Cursed Forest character prints overlapping on a grey ground",
    },
    plates: [
      {
        src: "/work/p27.jpg",
        alt: "Character illustrations in teal, green and pink forest light",
      },
    ],
  },
];

/** Instagram is live; the other two are placeholders until the profiles exist. */
export const elsewhere = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/cooked5squirrel?stkn=MnVvbnBybW9zMGpn&utm_source=qr",
  },
  { label: "Behance", href: "#" },
  { label: "Are.na", href: "#" },
];
