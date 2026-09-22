import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { farmConfig, formatKsh } from "@/lib/farm-data";

export function WhatsAppButton({ product, quantity, total, className = "" }: { product: string; quantity: number; total: number | null; className?: string }) {
  const message = `Hello, I would like to order:\n\nProduct: ${product}\nQuantity: ${quantity}\nEstimated total: ${total === null ? "Please confirm current price" : formatKsh(total)}\n\nPlease confirm availability and delivery details.`;
  const placeholder = farmConfig.whatsapp.includes("X");
  const href = placeholder ? `mailto:${farmConfig.email}?subject=${encodeURIComponent(`Order enquiry: ${product}`)}&body=${encodeURIComponent(message)}` : `https://wa.me/${farmConfig.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
  return <Button asChild variant="whatsapp" className={className}><a href={href} target="_blank" rel="noreferrer"><MessageCircle /> Order via WhatsApp</a></Button>;
}
