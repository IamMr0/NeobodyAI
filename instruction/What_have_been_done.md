# IRON AI — What Has Been Done

This document summarizes all frontend and backend development work completed for the IRON AI Smart Fitness App.

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
- Wraps all pages with sidebar + top bar + bottom nav.
- Responsive: mobile uses `flex-col`, desktop uses `flex-row md:ml-64`.
- Adds `pb-16 md:pb-0` to prevent content hiding behind the mobile bottom navigation bar.
- Dynamically maps route paths to page titles for the top bar.
- **Admin/User Segregation:** If the logged in user is an admin (`is_staff: true`), the layout completely hides the navigation sidebar menu (`NavBar`) and mobile bottom nav. It renders a minimal admin header with a **Log Out** button, and restricts admins strictly to `/admin` routes. Regular users trying to access admin paths are redirected back to `/analysis`.

### `NavBar.jsx`
- Fixed left sidebar for desktop (visible `md:flex`, hidden on mobile).
- Neobrutalist navigation links with active-state highlight using `NavLink`.
- Contains: Analysis, Nutrition, Library, Builder, AI Chat, Settings, Help, Start Workout CTA.

### `TopAppBar.jsx`
- Sticky header with dynamic page title from `AppLayout`.
- Title is shown at all screen sizes (`text-headline-sm md:text-headline-md`).
- Contains notification icon, account icon, and "Upgrade Pro" button (visible on `lg`).
- Height scales: `h-16` on mobile, `h-20` on desktop.

### `BottomNavBar.jsx` *(Mobile-only)*
- Fixed bottom tab bar visible on `< md` screens (`md:hidden`).
- 5 navigation tabs with icons + labels: Stats, Fuel, Build, Lib, AI.
- Active state highlighted with `bg-primary-container` and top border accent.

---

## 4. Pages & Integrated AI Features

### `BodyAnalysis.jsx` (`/analysis`)
- **Metrics Row:** Weight, Body Fat, Muscle Mass cards in a responsive `lg:grid-cols-3` grid.
- **Metabolic Insight Panel:** AI insight card + Recovery Score card.
- **Metabolic Predictions & Data Science:** Fetches trends from the linear regression engine. Displays BMR and FFMI. Includes a 30-day weight forecast card.
- **SVG Weight history Trendline:** Renders a high-performance SVG line graph of logged weights. Hovering over data points shows interactive tooltips with the date and logged weight.
- **Physique & Posture Scan (Computer Vision):** Features a neobrutalist physique photo uploader card. Uploaded files are POSTed to `/api/fitness/body-scan/` for Groq Llama 4 Vision analysis (posture assessments, body fat estimation, and development recommendations), which is dynamically saved to the user's metabolic logs.

### `Nutrition.jsx` (`/nutrition`)
- **Fuel Level Banner:** Scrollable page with progress bar, kcal summary, and active status badge.
- **Macro Bento Grid:** Protein, Carbs, Fats in `md:grid-cols-3` cards.
- **Today's Meals:** Breakfast, Lunch, and Pending Dinner cards with food images.
- **AI Insight Sidebar:** Metabolic Status, Glycogen analysis, AI recommendations.
- **Hydration Tracker:** Water log progress bar + log button.

### `ExerciseLibrary.jsx` (`/library`)
- **Hero Section:** "The Vault" banner with icon, description.
- **Filter Bar:** Equipment filter buttons (`flex-wrap`) with full-width "More Filters" button on mobile.
- **Exercise Grid:** Dynamically queries and renders default movements seeded directly from the PostgreSQL database (Bench Press, Squats, Deadlifts, Pullups, Curls, etc.). Includes muscle group tags, AI technique guides, and technique CTAs.

### `WorkoutBuilder.jsx` (`/builder`)
- **Top Action Bar:** Responsive banner with "AI Generate Plan" button that opens an upgraded inputs modal.
- **Upgraded Inputs Modal:** Collects Target Goal, Experience Level, Gender, Fitness Status (Newbie, Active Athlete, Recovering from Injury), and Frequency.
- **ML Routine Generation Engine:** POSTs data to `/api/fitness/generate-plan/` running a decision-tree classifier. 
  - *Newbie:* Reduces sets, caps RPE at 6, and swaps heavy compound lifts for safe variations.
  - *Injury:* Restricts volume, caps RPE at 5, extends rest, and swaps heavy spine loaders.
  - *Female:* Adapts routine to highlight glutes/posterior balance and adjusts weight formulas.
- **1RM Calculator Widget:** Left sidebar widget that computes estimated 1-Rep Maxes based on lifter inputs.
- **AI Suggestion Sidebar:** Dynamic panel detailing compound/accessory volume balance and load recommendations.

### `AIChatbot.jsx` (`/chat`)
- **Active Session Preservation:** Preserves conversations on F5. Fetches previous sessions and lists them in a clickable history sidebar to recall old message logs.
- **Multimodal Form Checker (Computer Vision):** Features a hidden file upload trigger. Attached photos are sent to Groq Llama 4 Vision, which estimates joint angles, assigns safety statuses, and lists biomechanical corrections in the right-sidebar.

### `Profile.jsx` (`/profile`)
- **User Settings Card:** Details on account registration date and status.
- **PDF Progress Exporter:** Integrates an **Analytics & Progress Exporter** button card. Fetches historical weight logs, metabolic metrics (BMR, FFMI), forecasts, and posture scans. Compiles them into a print-friendly HTML document, triggering `window.print()` to generate a PDF report.

---

## 5. Backend Architecture & Integrations

- **Django Apps:** Structured into `users`, `fitness`, `nutrition`, and `chatbot` apps.
- **Database Schema:** Seeded default database movements using Django migration scripts.
- **Groq API Client Integration:** Migrated all AI integrations from Gemini to Groq. Instantiated the `groq.Groq` SDK in `rag/services.py`, running:
  - `meta-llama/llama-4-scout-17b-16e-instruct` for multimodal vision scans (chat form checkers and body analysis posture checks) with native JSON response formatting.
  - `llama-3.3-70b-versatile` for high-speed text generation tasks (chatbot, body insights, and nutrition checks).
- **Environment-Based Model Selection:** Allows configuring target model IDs (`GROQ_TEXT_MODEL` and `GROQ_VISION_MODEL`) directly in the `.env` configuration file without editing code files.
