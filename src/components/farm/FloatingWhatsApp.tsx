import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/farm-data";

export function FloatingWhatsApp() {
  return (
    <a
      href={getWhatsAppUrl("Hello KENP Kienyeji Farm, I would like to make an enquiry.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="animate-rise fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="size-7" />
    </a>
  );
}
