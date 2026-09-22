# KENP Kienyeji Farm Website Plan

## Goal
Build a polished, mobile-first Kenyan livestock marketplace and farm website with real photography, transparent pricing, product search and filtering, order capture, WhatsApp enquiries, and a protected admin foundation.

## Customer Website
- Create shared navigation, mobile menu, search, footer, WhatsApp actions, and configurable farm identity/contact details.
- Build separate pages for Home, About, Kienyeji Chicken, Eggs, Cows & Milk, Sheep, Farm Products, Gallery, Contact, Order, and individual product details.
- Use a structured product catalogue so products, prices, availability, categories, and images are maintained in one place.
- Add responsive product cards, category/price/availability filters, quantity controls, and accessible forms.
- Implement the exact egg tiers and milk price calculations; show “Contact us for current price” everywhere else.
- Add the specified order confirmation without presenting payment as complete.
- Generate WhatsApp enquiry text from the selected product, quantity, and estimated total while retaining the placeholder number until a real one is provided.
- Add a categorized gallery with a larger-image viewer and authentic-looking Kenyan farm photography.

## Orders and Administration
- Enable Lovable Cloud for persistent products, inventory, customer orders, gallery entries, and admin authentication.
- Create tables with protected access rules, explicit role separation, and starter catalogue records matching the public site.
- Build protected administration pages for Dashboard, Products, Orders, Customers, Inventory, Gallery, and Settings.
- Support product creation/editing, pricing, availability, stock, order status, and core dashboard totals; leave advanced sales reporting ready for later expansion.
- Store customer orders and contact enquiries, with clear validation and success/error feedback.

## Visual Direction
- Use a distinctive East African farm identity: deep botanical green, warm earth neutrals, crisp white, and restrained maize-gold accents.
- Use editorial agricultural typography, realistic spacing and shadows, strong product photography, and tactile but restrained details.
- Prioritize large touch targets, compact mobile navigation, readable prices, and sticky/mobile-friendly order actions.
- Source or generate realistic photographic assets for every major product and farm category, then optimize and lazy-load them.

## SEO, Quality, and Delivery
- Add unique titles, descriptions, Open Graph data, semantic headings, descriptive image text, and natural Kenya-focused search wording on every public route.
- Verify all routes, links, search/filter behavior, calculators, order submission, WhatsApp message generation, image loading, and admin access.
- Test desktop and phone layouts for overflow, spacing, and tap usability.
- Keep contact details as explicit placeholders and centralize them for easy replacement.
- Prepare the site for publishing and provide the final publish action that creates the live URL.

## Technical Notes
- TanStack Start with React, TypeScript, Tailwind CSS v4, reusable feature components, and route-level metadata.
- Lovable Cloud-backed tables for products, orders, order items, inventory, gallery, settings, and user roles, with row-level access controls.
- Public catalogue reads remain safe and limited; customer submissions use validated server functions; admin mutations require authenticated role checks.
- The first release will be functional end-to-end. The placeholder WhatsApp number cannot open a real chat until replaced with the farm’s real number.
