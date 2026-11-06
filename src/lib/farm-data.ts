import chickens from "@/assets/kenp-chickens.jpg";
import cockImage from "@/assets/kenp-cock.jpg";
import henImage from "@/assets/kenp-hen.jpg";
import oneMonthChicks from "@/assets/kenp-one-month-chicks.jpg";
import threeMonthChickens from "@/assets/kenp-three-month-chickens.png.asset.json";
import eggs from "@/assets/kenp-eggs.jpg";
import dairy from "@/assets/kenp-dairy.jpg";
import sheep from "@/assets/kenp-sheep.jpg";
import slaughteredChicken from "@/assets/kenp-slaughtered-chicken.png.asset.json";

export const farmConfig = {
  name: "KENP KIENYEJI FARM",
  phone: "0757 430 948",
  whatsapp: "254757430948",
  email: "kiariechulo@gmail.com",
  location: "Kenya",
  tagline: "Quality livestock. Fresh farm products. Trusted service.",
} as const;

export const getWhatsAppUrl = (message?: string) => {
  const baseUrl = `https://wa.me/${farmConfig.whatsapp}`;
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
};

export type Product = {
  slug: string;
  name: string;
  category: "Poultry" | "Dairy" | "Sheep";
  description: string;
  details: string[];
  unit: string;
  price?: number;
  wholesalePrice?: number;
  image: string;
  imageAlt: string;
  availability: string;
  featured?: boolean;
};

export const products: Product[] = [
  { slug: "one-month-kienyeji-chicks", name: "One-Month-Old Kienyeji Chicks", category: "Poultry", description: "Healthy, active one-month-old indigenous chicks for farmers starting or expanding poultry projects.", details: ["Age: 1 month", "Type: Kienyeji", "Healthy and active", "Suitable for growing poultry projects"], unit: "bird", image: oneMonthChicks, imageAlt: "Group of one-month-old Kienyeji chicks in a brooder with wood shavings", availability: "Contact to confirm", featured: true },
  { slug: "three-month-kienyeji-chicken", name: "Three-Month-Old Kienyeji Chickens", category: "Poultry", description: "Established, healthy three-month-old Kienyeji birds for customers who want a strong start.", details: ["Age: 3 months", "Naturally raised", "Healthy Kienyeji chickens", "Suitable for farmers"], unit: "bird", image: threeMonthChickens.url, imageAlt: "Large flock of healthy three-month-old Kienyeji chickens on a Kenyan farm", availability: "Contact to confirm" },
  { slug: "mature-kienyeji-cock", name: "Fully Grown Kienyeji Cock", category: "Poultry", description: "A mature, well-cared-for Kienyeji cock suitable for breeding or meat.", details: ["Mature Kienyeji cock", "Suitable for breeding or meat", "Healthy and well cared for"], unit: "bird", image: cockImage, imageAlt: "Fully grown Kienyeji cock with bright red comb in a farm coop", availability: "Contact to confirm", featured: true },
  { slug: "slaughtered-kienyeji-chicken", name: "Slaughtered & Packed Kienyeji Chicken", category: "Poultry", description: "Freshly slaughtered, cleaned and packed Kienyeji chicken, ready for the kitchen. Sold per kilogram.", details: ["Freshly slaughtered and cleaned", "Cleanly packed and ready to cook", "Price: KSh 750 per kg", "Weight confirmed at packing"], unit: "kg", price: 750, image: slaughteredChicken.url, imageAlt: "Freshly slaughtered Kienyeji chicken with yellow skin, cleaned and ready for packing", availability: "Available" },
  { slug: "mature-kienyeji-hen", name: "Fully Grown Kienyeji Hen", category: "Poultry", description: "A healthy, naturally raised mature hen suitable for breeding and egg production.", details: ["Mature Kienyeji hen", "Suitable for breeding", "Suitable for egg production", "Naturally raised"], unit: "bird", image: henImage, imageAlt: "Flock of mature Kienyeji hens roaming together on the farm", availability: "Contact to confirm" },
  { slug: "kienyeji-eggs", name: "Fresh Kienyeji Eggs", category: "Poultry", description: "Fresh Kienyeji eggs collected from healthy farm-raised hens, available for retail and wholesale customers.", details: ["Less than 5 trays: KSh 600 per tray", "Wholesale: KSh 550 per tray", "Collected from healthy farm-raised hens"], unit: "tray", price: 600, wholesalePrice: 550, image: eggs, imageAlt: "Fresh brown Kienyeji eggs in trays", availability: "Available", featured: true },
  { slug: "fresh-farm-milk", name: "Fresh Farm Milk", category: "Dairy", description: "Fresh farm milk from healthy, well-cared-for dairy cattle.", details: ["Fresh Milk — KSh 60/Litre", "Available in practical household and bulk quantities", "Collection or delivery confirmed with the farm"], unit: "litre", price: 60, image: dairy, imageAlt: "Fresh milk and dairy cattle on a Kenyan farm", availability: "Contact to confirm", featured: true },
  { slug: "dairy-cattle", name: "Quality Dairy Cattle", category: "Dairy", description: "Healthy quality cattle kept with attentive farm care. Enquire about current animals.", details: ["Healthy cattle", "Quality farm care", "Availability confirmed on enquiry"], unit: "animal", image: dairy, imageAlt: "Healthy dairy cattle grazing in Kenya", availability: "Contact to confirm" },
  { slug: "quality-sheep-breeds", name: "Quality Sheep Breeds", category: "Sheep", description: "Healthy, good-quality sheep suitable for farmers, breeding and livestock development.", details: ["Breed: Confirm on enquiry", "Age: Confirm on enquiry", "Sex: Confirm on enquiry", "Health status: Healthy", "Purpose: Breeding and livestock development"], unit: "animal", image: sheep, imageAlt: "Healthy sheep breeds on a Kenyan farm", availability: "Contact to confirm", featured: true },
];

export const categoryImages = { Poultry: chickens, Dairy: dairy, Sheep: sheep } as const;
export const formatKsh = (value: number) => `KSh ${value.toLocaleString("en-KE")}`;
export const getPrice = (product: Product, quantity: number, wholesale = false) => product.price ? (wholesale && product.wholesalePrice && quantity >= 5 ? product.wholesalePrice : product.price) * quantity : null;
export const getProduct = (slug: string) => products.find((product) => product.slug === slug);
