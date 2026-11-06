import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatKsh, getWhatsAppUrl } from "@/lib/farm-data";

export function WhatsAppButton({ product, quantity, total, className = "" }: { product: string; quantity: number; total: number | null; className?: string }) {
  const message = `Hello, I would like to order:\n\nProduct: ${product}\nQuantity: ${quantity}\nEstimated total: ${total === null ? "Please confirm current price" : formatKsh(total)}\n\nPlease confirm availability and delivery details.`;
  return <Button asChild variant="whatsapp" className={className}><a href={getWhatsAppUrl(message)} target="_blank" rel="noopener noreferrer"><MessageCircle /> Order via WhatsApp</a></Button>;
}
