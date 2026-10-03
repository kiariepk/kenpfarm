# Add a Floating WhatsApp Chat Button

## Goal
A WhatsApp chat button that stays visible in the bottom corner of every page, so customers can message **0757 430 948** from anywhere on the site (desktop, tablet, mobile).

## What will be built

1. **New component** — `src/components/farm/FloatingWhatsApp.tsx`
   - Fixed circular button, bottom-right corner (bottom-left on the order/contact pages is NOT used — bottom-right is free everywhere, since forms scroll normally).
   - Green WhatsApp-style circle with the WhatsApp message icon, using the existing `--whatsapp` design token.
   - Taps open `https://wa.me/254757430948` in a new tab (standard `target="_blank" rel="noopener noreferrer"` link, no custom click handlers — same pattern as the fixed WhatsApp buttons).
   - Pre-filled message: *"Hello KENP Kienyeji Farm, I would like to make an enquiry."* (built with the existing `getWhatsAppUrl` helper so the number lives in one config place).
   - Subtle entrance animation consistent with the existing `animate-rise` utility; accessible `aria-label="Chat on WhatsApp"`; large touch target (56px+).

2. **Mount globally** — render `<FloatingWhatsApp />` once in `src/routes/__root.tsx` inside `RootComponent`, so it appears on every page (home, products, product details, order, contact, gallery, Product Finder, admin).

3. **No design or layout changes** — existing pages, prices, and buttons stay untouched.

## Technical notes
- Number comes only from `farmConfig.whatsapp` ("254757430948") via `getWhatsAppUrl()` — no new hardcoded numbers.
- Pure frontend change; no backend, database, or auth work.

## Verification
- Click-test the button in the preview on desktop and mobile viewports: it must open `https://wa.me/254757430948` in a new tab with the message pre-filled.
- Confirm no `api.whatsapp.com` reference is introduced.
- Check build output is clean and the button does not overlap the mobile navigation or order form buttons.
