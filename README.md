
TRENA is a digital marketplace focused on:
- Selling construction materials
- Promoting and connecting service providers (bricklayers, electricians, plumbers, painters, etc.)

The app must be simple, fast, reliable and visually clean, inspired by:
- iFood (purchase flow and ordering experience)
- Facebook Marketplace (local discovery and listings)
- Nubank (minimalist UX, clarity and simplicity)

---

# 1. PRODUCT OVERVIEW
TRENA connects:
- People who need construction materials
- People who need construction services
- Construction material stores
- Independent service professionals

User goals:
- Find construction materials near their location
- Compare prices easily
- Buy or contact sellers quickly
- Discover reliable local service providers
- Contact providers with minimal friction

The app must feel practical, trustworthy and easy to use.

---

# 2. TECH STACK (REQUIRED)
Use modern, Replit-compatible technologies:

- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- UI Components: Shadcn/UI
- Icons: Lucide React
- Charts (if needed): Recharts
- Database: SQLite or Replit DB
- Authentication: Simple mock/local user

Code must be clean, modular and scalable.

---

# 3. VISUAL IDENTITY & DESIGN SYSTEM

## Colors
- Primary color: Pistachio Green (#C7E000 or close variation)
- Dark green for backgrounds and contrast
- White and light gray for cards and text

## Typography
- Font: Inter (or similar modern sans-serif)
- Clear hierarchy and excellent readability

## Branding
- App name: TRENA
- Use the provided logo (symbol + "TRENA" text)
- Visual style inspired by Nubank (minimal, elegant, calm)

## Layout
- Mobile-first
- Large clickable cards
- Bottom navigation on mobile
- Simple sidebar on desktop

---

# 4. CORE FEATURES (MVP SCOPE)

## A. Home Screen
- Search bar (materials or services)
- Category shortcuts:
  - Cement, Paint, Tools, Electrical, Plumbing
  - Service Providers
- Featured listings
- Nearby offers (mocked)

---

## B. Materials Marketplace
- Product listing screen
- Product card must include:
  - Image
  - Name
  - Price
  - Store name
  - Location
- Product details page
- Action button:
  - "Contact seller" or "Buy"

---

## C. Service Providers Marketplace
- Providers listing screen
- Provider card must include:
  - Name
  - Service type
  - Rating (mock data)
  - Location
- Provider profile page
- Action button:
  - "Contact via WhatsApp" or "Get in touch"

---

## D. Create Listing
- Users can create:
  - Product listings
  - Service listings
- Simple form:
  - Title
  - Category
  - Price (if applicable)
  - Description
  - Image upload (mock)
- Clear success feedback

---

## E. User Profile
- Basic user information
- My listings
- Favorites
- Simple settings
- Light/Dark mode toggle

---

# 5. UX RULES (VERY IMPORTANT)
- Clean and distraction-free interface
- Minimal number of clicks
- No empty screens (use realistic mock data)
- Immediate visual feedback
- If a feature is not fully implemented, show the UI with a label: "Coming soon"

---

# 6. DATA & MOCK CONTENT
- Initialize the app with realistic mock data:
  - Products
  - Stores
  - Service providers
  - Listings and ratings
- The app must feel alive from the first load

---

# 7. PROJECT STRUCTURE
Organize the project into:
- /app
- /components/ui
- /components/features
- /lib
- /db
- /styles

---

# 8. FINAL INSTRUCTION
Plan the architecture first.
Then generate the code.
Deliver a navigable, functional and visually coherent application.

TRENA must feel like a real marketplace app, ready to evolve into production.
The UI text should be in Brazilian Portuguese.

IMPORTANT UPDATE:

The application name has changed.

Replace **all occurrences** of the name **"Obrafacil"** with **"TRENA"** across the entire project, including but not limited to:
- App title
- UI texts
- Headers
- Navigation labels
- Metadata
- Constants
- Variables (when semantically related)
- Documentation or comments (if applicable)

Ensure that:
- The final app name displayed to users is **TRENA**
- Branding, titles and references are consistent
- No reference to "Obrafacil" remains anywhere in the codebase or UI
