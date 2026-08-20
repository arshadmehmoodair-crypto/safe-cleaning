import floorCleaner from "../assets/products/floor-cleaner.png";
import glassCleaner from "../assets/products/glass-cleaner.png";
import disinfectant from "../assets/products/disinfectant.png";
import windowCleaningKit from "../assets/products/window-cleaning-kit.png";
import microfiberFlatMop from "../assets/products/microfiber-flat-mop.png";
import chenilleMopSlippers from "../assets/products/chenille-mop-slippers.png";
import spinMopBucketSet from "../assets/products/spin-mop-bucket-set.png";
import multiPurposeCleanerSpray from "../assets/products/multi-purpose-cleaner-spray.png";
import microfiberCleaningCloths from "../assets/products/microfiber-cleaning-cloths.png";
import telescopicWindowCleaningBrush from "../assets/products/telescopic-window-cleaning-brush.png";
import universalDisinfectantWipes from "../assets/products/universal-disinfectant-wipes.png";
import kennelDisinfectant from "../assets/products/kennel-disinfectant-5l.png";
import drBeckmann from "../assets/products/dr-beckmann-stain-removers.png";
import triangleMicrofiberMop from "../assets/products/triangle-microfiber-mop.png";
import carWindscreenCleaningBrush from "../assets/products/car-windscreen-cleaning-brush.png";
import professionalWindowSqueegee from "../assets/products/professional-window-squeegee.png";
import elbowGreaseScrubbingPads from "../assets/products/elbow-grease-scrubbing-pads.png";
import siliconeBottleCleaningBrush from "../assets/products/silicone-bottle-cleaning-brush.png";
import fairyProfessionalLiquid from "../assets/products/fairy-professional-washing-up-liquid.png";
import fairyLemonWipes from "../assets/products/fairy-lemon-cleaning-wipes.png";

const products = [
  {
    id: 1,
    name: "Floor Cleaner",
    category: "Floor Cleaners",
    image: floorCleaner,
    price: "£12.99",
    stock: 20,
    description:
      "Professional floor cleaner suitable for homes and commercial buildings.",
    features: [
      "Fast Drying",
      "Fresh Fragrance",
      "Safe on Most Floors",
    ],
  },

  {
    id: 2,
    name: "Glass Cleaner",
    category: "Glass Cleaners",
    image: glassCleaner,
    price: "£8.99",
    stock: 20,
    description:
      "Professional glass cleaner for windows, mirrors and glass surfaces.",
    features: [
      "Streak Free",
      "Quick Dry",
      "Professional Formula",
    ],
  },

  {
    id: 3,
    name: "Disinfectant",
    category: "Disinfectants",
    image: disinfectant,
    price: "£10.99",
    stock: 20,
    description:
      "Professional disinfectant that kills 99.9% of germs and bacteria while keeping surfaces hygienically clean.",
    features: [
      "99.9% Germ Protection",
      "Pleasant Fragrance",
      "Multi-Purpose Use",
    ],
  },

  {
    id: 4,
    name: "Window Cleaning Kit",
    category: "Cleaning Kits",
    image: windowCleaningKit,
    price: "£19.99",
    stock: 20,
    description:
      "Complete professional window cleaning kit with everything needed for streak-free cleaning.",
    features: [
      "Professional Quality",
      "Reusable Tools",
      "Easy to Use",
    ],
  },

  {
    id: 5,
    name: "Microfiber Flat Mop",
    category: "Cleaning Tools",
    image: microfiberFlatMop,
    price: "£24.99",
    stock: 20,
    description:
      "Professional microfiber flat mop designed for fast and effective cleaning on all hard floor surfaces.",
    features: [
      "360° Swivel Head",
      "Reusable Microfiber Pad",
      "Lightweight Design",
    ],
  },

  {
    id: 6,
    name: "Chenille Mop Slippers",
    category: "Cleaning Accessories",
    image: chenilleMopSlippers,
    price: "£9.99",
    stock: 20,
    description:
      "Reusable chenille microfiber mop slippers for effortless floor cleaning while walking.",
    features: [
      "Machine Washable",
      "Super Absorbent",
      "Reusable Design",
    ],
  },

  {
    id: 7,
    name: "360° Spin Mop Bucket Set",
    category: "Cleaning Tools",
    image: spinMopBucketSet,
    price: "£39.99",
    stock: 20,
    description:
      "Complete spin mop bucket system with built-in wringer for fast and efficient floor cleaning.",
    features: [
      "360° Rotating Mop Head",
      "Built-in Wringer",
      "Reusable Microfiber Mop",
    ],
  },

  {
    id: 8,
    name: "Multi Purpose Cleaner Spray",
    category: "Multi Purpose Cleaners",
    image: multiPurposeCleanerSpray,
    price: "£10.99",
    stock: 20,
    description:
      "Powerful multi-purpose cleaner that removes grease, dirt and stains from kitchen, bathroom and household surfaces.",
    features: [
      "Cuts Through Grease",
      "Fresh Fragrance",
      "Suitable for Multiple Surfaces",
    ],
  },

  {
    id: 9,
    name: "Microfiber Cleaning Cloths",
    category: "Cleaning Accessories",
    image: microfiberCleaningCloths,
    price: "£9.99",
    stock: 20,
    description:
      "Premium microfiber cleaning cloths for dusting, polishing and streak-free cleaning on all surfaces.",
    features: [
      "Ultra Soft",
      "Lint Free",
      "Machine Washable",
    ],
  },

  {
    id: 10,
    name: "Telescopic Window Cleaning Brush",
    category: "Window Cleaning",
    image: telescopicWindowCleaningBrush,
    price: "£18.99",
    stock: 20,
    description:
      "Extendable window cleaning brush designed for safely cleaning high windows and hard-to-reach glass surfaces.",
    features: [
      "Extendable Handle",
      "360° Cleaning Head",
      "Reusable Microfiber Pad",
    ],
  },

  {
    id: 11,
    name: "Universal Disinfectant Wipes",
    category: "Disinfectants",
    image: universalDisinfectantWipes,
    price: "£2.01",
    stock: 20,
    description:
      "Ready-to-use disinfectant wipes that effectively remove dirt, bacteria and viruses from everyday surfaces.",
    features: [
      "Kills 99.9% of Germs",
      "Multi-Surface Cleaning",
      "Fresh Fragrance",
    ],
  },

  {
    id: 12,
    name: "Kennel Disinfectant 5L",
    category: "Disinfectants",
    image: kennelDisinfectant,
    price: "£14.99",
    stock: 20,
    description:
      "Professional 5-litre disinfectant for kennels, veterinary clinics, animal housing and other commercial environments.",
    features: [
      "5 Litre Bottle",
      "Professional Grade",
      "Long-Lasting Protection",
    ],
  },

  {
    id: 13,
    name: "Dr. Beckmann Stain Removers",
    category: "Laundry Care",
    image: drBeckmann,
    price: "£2.99",
    stock: 20,
    description:
      "Specialist stain remover designed to tackle tough stains while remaining gentle on fabrics.",
    features: [
      "Powerful Stain Removal",
      "Fabric Safe",
      "Easy to Use",
    ],
  },

  {
    id: 14,
    name: "Triangle Microfiber Mop",
    category: "Cleaning Tools",
    image: triangleMicrofiberMop,
    price: "£22.99",
    stock: 20,
    description:
      "Triangular microfiber mop designed to clean corners, edges and hard-to-reach areas with ease.",
    features: [
      "360° Rotating Head",
      "Reusable Microfiber Pad",
      "Ideal for Corners",
    ],
  },

  {
    id: 15,
    name: "Car Windscreen Cleaning Brush",
    category: "Car Care",
    image: carWindscreenCleaningBrush,
    price: "£11.99",
    stock: 20,
    description:
      "Professional windscreen cleaning brush with a long handle for cleaning car windows and hard-to-reach areas.",
    features: [
      "Long Reach Handle",
      "Reusable Microfiber Head",
      "Streak-Free Finish",
    ],
  },

  {
    id: 16,
    name: "Professional Window Squeegee",
    category: "Window Cleaning",
    image: professionalWindowSqueegee,
    price: "£12.99",
    stock: 20,
    description:
      "Professional-grade window squeegee designed for streak-free cleaning of windows, mirrors and glass surfaces.",
    features: [
      "Streak-Free Finish",
      "Durable Rubber Blade",
      "Comfort Grip Handle",
    ],
  },

  {
    id: 17,
    name: "Elbow Grease Scrubbing Pads",
    category: "Cleaning Accessories",
    image: elbowGreaseScrubbingPads,
    price: "£9.99",
    stock: 20,
    description:
      "Heavy-duty scrubbing pads designed to remove stubborn grease, burnt-on food and tough stains without damaging most surfaces.",
    features: [
      "Powerful Cleaning",
      "Durable Material",
      "Suitable for Kitchen & Bathroom",
    ],
  },

  {
    id: 18,
    name: "Silicone Bottle Cleaning Brush",
    category: "Kitchen Accessories",
    image: siliconeBottleCleaningBrush,
    price: "£8.99",
    stock: 20,
    description:
      "Flexible silicone bottle cleaning brush designed for bottles, flasks, tumblers and other narrow containers.",
    features: [
      "Food Grade Silicone",
      "Flexible Design",
      "Easy to Clean",
    ],
  },

  {
    id: 19,
    name: "Fairy Professional Washing Up Liquid",
    category: "Kitchen Cleaners",
    image: fairyProfessionalLiquid,
    price: "£12.99",
    stock: 20,
    description:
      "Professional washing-up liquid that cuts through tough grease while leaving dishes and kitchenware sparkling clean.",
    features: [
      "Powerful Grease Removal",
      "Concentrated Formula",
      "Fresh Lemon Fragrance",
    ],
  },

  {
    id: 20,
    name: "Fairy Lemon Cleaning Wipes",
    category: "Cleaning Wipes",
    image: fairyLemonWipes,
    price: "£9.99",
    stock: 20,
    description:
      "Convenient lemon-scented cleaning wipes for fast and hygienic cleaning of kitchen, bathroom and household surfaces.",
    features: [
      "Fresh Lemon Scent",
      "Multi-Surface Use",
      "Kills Everyday Dirt & Grease",
    ],
  },
];

export default products;