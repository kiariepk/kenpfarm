-- Orders and enquiries are written only through trusted server code (service role),
-- so remove the public insert paths that allowed tampering with other customers' orders.
DROP POLICY IF EXISTS "Customers submit orders" ON public.orders;
DROP POLICY IF EXISTS "Customers submit order items" ON public.order_items;
DROP POLICY IF EXISTS "Customers send contact messages" ON public.contact_messages;

REVOKE INSERT ON public.orders FROM anon;
REVOKE INSERT ON public.order_items FROM anon;
REVOKE INSERT ON public.contact_messages FROM anon;