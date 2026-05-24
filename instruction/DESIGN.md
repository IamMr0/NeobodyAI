---
name: Kinetic Logic
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1b1b1b'
  on-surface-variant: '#474832'
  inverse-surface: '#303030'
  inverse-on-surface: '#f1f1f1'
  outline: '#78795f'
  outline-variant: '#c9c8ab'
  surface-tint: '#5e6300'
  primary: '#5e6300'
  on-primary: '#ffffff'
  primary-container: '#f4ff00'
  on-primary-container: '#6f7400'
  inverse-primary: '#c6cf00'
  secondary: '#0040e0'
  on-secondary: '#ffffff'
  secondary-container: '#2e5bff'
  on-secondary-container: '#efefff'
  tertiary: '#006e27'
  on-tertiary: '#ffffff'
  tertiary-container: '#d7ffd3'
  on-tertiary-container: '#00812f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2ec00'
  primary-fixed-dim: '#c6cf00'
  on-primary-fixed: '#1b1d00'
  on-primary-fixed-variant: '#474a00'
  secondary-fixed: '#dde1ff'
  secondary-fixed-dim: '#b8c3ff'
  on-secondary-fixed: '#001356'
  on-secondary-fixed-variant: '#0035be'
  tertiary-fixed: '#6bff83'
  tertiary-fixed-dim: '#00e55b'
  on-tertiary-fixed: '#002107'
  on-tertiary-fixed-variant: '#00531b'
  background: '#f9f9f9'
  on-background: '#1b1b1b'
  surface-variant: '#e2e2e2'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.5'
  body-md:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
spacing:
  border-thick: 4px
  border-thin: 2px
  margin-mobile: 20px
  gutter-mobile: 12px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system is built on the principles of **Neubrutalism**, optimized for a high-energy, AI-driven fitness environment. It rejects the soft gradients and subtle blurs of contemporary SaaS design in favor of raw, high-contrast honesty. The brand personality is unapologetically energetic, high-tech, and motivational. It is designed to evoke a sense of "immediate action" and "data clarity," treating gym metrics not as suggestions, but as definitive engineering targets.

The aesthetic utilizes "hard" UI elements: thick black strokes, unshaded surfaces, and a flat depth model. This approach ensures maximum legibility during intense physical activity while conveying a modern, developer-adjacent sophistication that aligns with its AI core.

## Colors

The palette is anchored by a high-visibility **Vibrant Yellow** (Primary), used for core calls to action and critical fitness milestones. **Electric Blue** (Secondary) represents the AI integration and technical data layers, while **Neon Green** (Tertiary) is reserved for success states, "go" signals, and completed goals.

The system relies heavily on **Pure Black** (#000000) for all structural elements, including borders, shadows, and typography. This creates the "ink-on-paper" contrast required for the Neubrutalist style. Surfaces are kept white or very light gray to allow the vibrant accent colors to "pop" without visual vibration.

## Typography

The typography utilizes **Space Grotesk** across all levels. This choice provides a technical, geometric feel that balances high readability with a "hacker-aesthetic" quirkiness. 

Headlines are set with tight tracking and heavy weights to match the visual weight of the 4px borders. Body text remains spacious to ensure clarity during workouts. All labels and secondary data points should use medium-to-bold weights to prevent them from getting lost against the aggressive structural elements of the layout.

## Layout & Spacing

The layout follows a **fluid grid model** for mobile, utilizing a 4-column system with generous 20px outer margins. Elements are separated by a "Stack" rhythm (8px, 16px, 32px) to maintain a disciplined, geometric structure.

Borders are functional, not decorative. Use `border-thick` (4px) for primary containers, large buttons, and main cards. Use `border-thin` (2px) for inner elements like input fields or secondary chips. Components should not use "auto" padding; instead, they should adhere to fixed spacing units to maintain the rigid, architectural feel of the design system.

## Elevation & Depth

In this design system, depth is communicated through **Flat Hard Shadows** rather than blurs or Z-axis lighting. 

- **Shadow Style:** Use a 100% opaque black (#000000) offset shadow.
- **Direction:** Always offset to the bottom-right (e.g., 4px 4px or 8px 8px).
- **Interactive Depth:** When an element is pressed or "active," the shadow offset should decrease to 0px, and the element should translate by the same amount, simulating a physical button being pushed into the surface.
- **Layers:** Visual hierarchy is achieved by increasing the offset of the flat shadow. More important elements (like a "Start Workout" button) have a larger offset (8px) than standard cards (4px).

## Shapes

The shape language is strictly **Sharp (0)**. There are no rounded corners in this design system. This reinforces the Brutalist influence and ensures the bold black borders meet at crisp 90-degree angles, creating a sense of precision and technological "hardness." Every container, button, and input field must be a perfect rectangle or square.

## Components

### Bold Buttons
Buttons feature a `border-thick` black stroke and a primary color fill. They must have a hard shadow offset of 4px. On press, the shadow disappears and the button shifts 4px down and 4px right. Label text is always `label-bold`.

### Status & AI Cards
Cards use a white background with a `border-thick` stroke. For AI-generated insights, use a 2px Electric Blue inner border to signify machine-learning content. Status indicators (Rest, Active, Peak) should use full-bleed background fills of the Primary/Tertiary colors with black text.

### Input Fields
Inputs are rectangular with a `border-thin` stroke. On focus, the border thickens to `border-thick` and the background shifts from white to a very light tint of the primary color.

### Progress Bars
Progress bars are represented as segmented blocks rather than smooth lines. Each segment is a rectangle with a 1px border, filled with Neon Green as the user progresses.

### Chips & Tags
Used for muscle groups or equipment. These are small rectangles with a `border-thin` stroke, using `label-sm` typography. They do not have shadows to distinguish them from primary interactive elements.