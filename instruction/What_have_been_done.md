# IRON AI — What Has Been Done

This document summarizes all frontend development work completed for the IRON AI Smart Fitness App.

---

## 1. Frontend Project Setup

- **Framework:** React + Vite (in `src/frontend/`)
- **Styling:** Tailwind CSS v4 with a custom `@theme` configuration in `index.css`
- **Fonts:** Space Grotesk (via Google Fonts, loaded in `index.html`)
- **Icons:** Material Symbols Outlined (via Google Fonts)
- **Routing:** React Router DOM v6 with nested routes via `AppLayout`

---

## 2. Design System (`src/frontend/src/index.css`)

A complete design token system was built using Tailwind v4's `@theme` block:

- **Color Palette:**
  - **Primary:** Soft Electric Blue `#3B82F6`
  - **Secondary:** Graphite `#18181B`
  - **Tertiary:** Cyan Mint `#22D3EE`
  - Full suite of container, surface, outline, and error variants
- **Spacing tokens:** `stack-sm`, `stack-md`, `stack-lg`, `margin-mobile`, `gutter-mobile`
- **Border tokens:** `border-thick` (4px), `border-thin` (2px)
- **Typography scale:** `headline-xl`, `headline-lg`, `headline-md`, `body-lg`, `body-md`, `label-bold`, `label-sm`
- **Neobrutalist visual style:** 4px solid black borders, flat offset shadows (`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`), no rounded corners

---

## 3. Core Layout Components

### `AppLayout.jsx`
- Wraps all pages with sidebar + top bar + bottom nav
- Responsive: mobile uses `flex-col`, desktop uses `flex-row md:ml-64`
- Adds `pb-16 md:pb-0` to prevent content hiding behind the mobile bottom navigation bar
- Dynamically maps route paths to page titles for the top bar

### `NavBar.jsx`
- Fixed left sidebar for desktop (visible `md:flex`, hidden on mobile)
- Neobrutalist navigation links with active-state highlight using `NavLink`
- Contains: Analysis, Nutrition, Library, Builder, AI Chat, Settings, Help, Start Workout CTA

### `TopAppBar.jsx`
- Sticky header with dynamic page title from `AppLayout`
- Title is shown at all screen sizes (`text-headline-sm md:text-headline-md`)
- Contains notification icon, account icon, and "Upgrade Pro" button (visible on `lg`)
- Height scales: `h-16` on mobile, `h-20` on desktop

### `BottomNavBar.jsx` *(Mobile-only)*
- Fixed bottom tab bar visible on `< md` screens (`md:hidden`)
- 5 navigation tabs with icons + labels: Stats, Fuel, Build, Lib, AI
- Active state highlighted with `bg-primary-container` and top border accent

---

## 4. Pages Built

### `BodyAnalysis.jsx` (`/analysis`)
- **Metrics Row:** Weight, Body Fat, Muscle Mass cards in a responsive `lg:grid-cols-3` grid
- **Metabolic Insight Panel:** AI insight card + Recovery Score card
- **Body 3D Section:** 3-panel responsive layout (Control panel → Anatomical Viewer canvas → Tissue Distribution data panel)
  - On mobile: stacks vertically with horizontal button tabs, fixed canvas height of `350px`
  - On desktop: full `600px` height, left/right data panels shown side by side

### `Nutrition.jsx` (`/nutrition`)
- **Fuel Level Banner:** Scrollable `h-full overflow-y-auto` page with progress bar, kcal summary, and active status badge
- **Macro Bento Grid:** Protein, Carbs, Fats in `md:grid-cols-3` cards
- **Today's Meals:** Breakfast, Lunch, and Pending Dinner cards with food images
- **AI Insight Sidebar:** Metabolic Status, Glycogen analysis, AI recommendations
- **Hydration Tracker:** Water log progress bar + log button
- *Fixed:* Scroll bug corrected (`min-h-full` → `h-full`)

### `ExerciseLibrary.jsx` (`/library`)
- **Hero Section:** "The Vault" banner with icon, description
- **Filter Bar:** Equipment filter buttons (`flex-wrap`) with full-width "More Filters" button on mobile
- **Exercise Grid:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` cards with grayscale-to-color hover effect
- Cards include: exercise image, muscle group tags, AI insight, "View Technique" CTA
- **AI Insight Banner:** Full-width insight card with skew decoration and recommendation button
- **Footer:** Library version and navigation links

### `WorkoutBuilder.jsx` (`/builder`)
- **Top Action Bar:** Responsive `flex-col sm:flex-row` banner with "AI Generate Plan" button
  - Button uses neobrutalist flat-shadow + active click animation (`active:translate-x-[4px] active:translate-y-[4px]`)
- **3-Column Content Grid:**
  - **Left:** Equipment tags + Recent Templates (visible `md:col-span-4`)
  - **Center:** Draggable Routine list with thumbnail, set/rep info, edit/delete hover actions
  - **Right:** AI Suggestions + Optimization Insight + Plan Intensity bar chart

### `AIChatbot.jsx` (`/chat`)
- **3-Panel Layout:**
  - **Left Panel (History):** Visible on `md+` only — previous chat sessions list
  - **Center Panel (Chat):** Always visible — AI greeting, user/AI message bubbles with insight cards
  - **Right Panel (Live Analysis):** Visible on `lg+` only — Strength Plateau card, Biomechanic Scan image, Quick Fix tip
- **Command Input Bar:** Responsive flex bar with add attachment button, text input, and send button
  - "SEND" label hidden on mobile, shows only icon

---

## 5. Routing (`App.jsx`)

| Route | Component |
|---|---|
| `/` | Redirects to `/analysis` |
| `/analysis` | `BodyAnalysis` |
| `/nutrition` | `Nutrition` |
| `/library` | `ExerciseLibrary` |
| `/builder` | `WorkoutBuilder` |
| `/chat` | `AIChatbot` |

---

## 6. Mobile-First Responsive Design

All pages support mobile screens from `320px` wide:

- Sidebar navigation replaced by fixed bottom tab bar on mobile
- All grid layouts default to `grid-cols-1` and scale up at `md`/`lg` breakpoints
- Top bar adapts height and font size
- Fixed panels (sidebars, multi-column layouts) collapse on small screens
- Scrolling is consistent across all pages using `h-full overflow-y-auto` on page wrappers

---

## 7. What Remains To Be Done

- [x] Backend API development (Django Rest Framework) - *Schema and Auth done*
- [ ] AI Chatbot integration (LLM API connection)
- [ ] Real data wiring (replace mock data with API calls)
- [x] Authentication (Login / Register screens) - *JWT Auth Context integrated*
- [ ] 3D Body Mapping (Computer Vision integration)
- [ ] Wearable sensor sync
- [ ] User settings and profile management

---

## 8. Docker & Backend Infrastructure Setup

A complete multi-container Docker development environment has been established:
- **Orchestration:** `docker-compose.yaml` coordinates the three main tiers: frontend, backend, and database.
- **Database:** PostgreSQL 15 (`neobody_db`) service configured with local storage volume persistence.
- **Backend:** Django application containerized using Python 3.11-slim, pre-configured with:
  - PostgreSQL database connection adapter (`psycopg2-binary`)
  - Django REST Framework (`djangorestframework`)
  - CORS policies (`django-cors-headers`) to allow cross-origin API requests from Vite.
- **Frontend:** React/Vite application containerized with Node 20-alpine. Updated `vite.config.js` to enable filesystem polling to guarantee Hot Module Replacement (HMR) syncs properly across Windows host volume mounts.

---

## 9. Authentication System & Backend Schema

- **Backend Architecture**: Structured into 4 distinct Django apps (`users`, `fitness`, `nutrition`, `chatbot`).
- **Database Schema**:
  - `users`: Custom `User` model.
  - `fitness`: `Exercise`, `WorkoutTemplate`, `WorkoutExercise`, `BodyMetrics`.
  - `nutrition`: `DailyNutrition`, `HydrationLog`.
  - `chatbot`: `ChatSession`, `ChatMessage`.
- **JWT Authentication**: Integrated `djangorestframework-simplejwt` for secure API token exchange.
- **Frontend Auth Guards**: Implemented React `AuthContext` with `localStorage` token management and a `ProtectedRoute` component wrapping the main application layout to prevent unauthorized access.
- **Auth UI**: Built Neubrutalist `Login.jsx` and `Register.jsx` pages directly hooked up to the Django REST APIs.

