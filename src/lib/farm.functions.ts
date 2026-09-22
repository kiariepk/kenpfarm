import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const orderSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  productSlug: z.string().trim().min(2).max(100),
  productName: z.string().trim().min(2).max(150),
  quantity: z.number().positive().max(10000),
  unitPrice: z.number().nonnegative().nullable(),
  estimatedTotal: z.number().nonnegative().nullable(),
  deliveryLocation: z.string().trim().min(2).max(200),
  preferredDeliveryDate: z.string().max(20).optional(),
  message: z.string().trim().max(1000).optional(),
});

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  subject: z.string().trim().min(2).max(150),
  message: z.string().trim().min(2).max(1000),
});

export const submitOrder = createServerFn({ method: "POST" })
  .inputValidator((data) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const orderId = crypto.randomUUID();
    const { error: orderError } = await supabaseAdmin.from("orders").insert({
      id: orderId, customer_name: data.customerName, phone: data.phone,
      email: data.email || null, delivery_location: data.deliveryLocation,
      preferred_delivery_date: data.preferredDeliveryDate || null,
      message: data.message || null, estimated_total: data.estimatedTotal,
    });
    if (orderError) throw new Error("We could not save your order. Please try again.");
    const { error: itemError } = await supabaseAdmin.from("order_items").insert({
      order_id: orderId, product_slug: data.productSlug, product_name: data.productName,
      quantity: data.quantity, unit_price: data.unitPrice, line_total: data.estimatedTotal,
    });
    if (itemError) throw new Error("Your order details could not be saved. Please contact the farm.");
    return { ok: true, orderId };
  });

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_messages").insert({
      name: data.name, phone: data.phone, email: data.email || null,
      subject: data.subject, message: data.message,
    });
    if (error) throw new Error("We could not send your message. Please try again.");
    return { ok: true };
  });
