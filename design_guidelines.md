# Design Guidelines: OPPO Egypt Violations Management System

## Design Approach: Material Design System
**Justification**: This is a utility-focused admin application requiring clear hierarchy, RTL Arabic support, and efficient data management. Material Design provides excellent patterns for forms, tables, and data-heavy interfaces while supporting right-to-left layouts.

**Key Principles**:
- Clarity over decoration - every element serves a functional purpose
- Consistent, predictable interactions
- Strong visual hierarchy for Arabic text
- Professional aesthetic reflecting OPPO's brand standards

---

## Typography

**Primary Font**: 'Noto Sans Arabic' via Google Fonts (excellent Arabic rendering)
**Secondary Font**: 'Inter' for any English elements

**Type Scale**:
- H1 (Page Titles): 2.5rem (40px), bold
- H2 (Section Headers): 1.75rem (28px), semibold
- Body: 1rem (16px), regular
- Labels: 0.875rem (14px), medium
- Buttons: 0.9375rem (15px), medium

**RTL Considerations**: All text right-aligned, natural Arabic reading flow

---

## Layout System

**Spacing Units**: Tailwind units of 3, 4, 6, 8, 12, 16
- Standard padding: p-6 (component interiors)
- Section spacing: mb-8, mt-12
- Component gaps: gap-4
- Tight spacing: space-y-3 (form fields)

**Container Widths**:
- Max content width: max-w-6xl mx-auto
- Login box: max-w-md
- Full-width tables with horizontal scroll on mobile

---

## Component Library

### Splash Screen
- Full viewport gradient background (OPPO teal #00bfa5 to bright teal #1de9b6)
- Centered OPPO logo (large, white)
- Subtitle "نظام المخالفات" below in lighter weight
- Subtle fade-in animation (0.3s)
- Auto-dismiss after 2.5 seconds

### Login Form
- Centered card: white background, rounded-xl, shadow-lg
- OPPO brand gradient header bar (h-2)
- Form inputs: outlined style, rounded-lg, border-2 on focus
- Primary button: full-width, bg-[#00bfa5], hover brightness, rounded-lg, py-3
- Input fields with clear labels above (not placeholders)

### Violations Dashboard
**Header Section**:
- Page title (H1) with OPPO gradient text effect
- Add violation form: single row with input + button
- Input: flex-1, outlined, rounded-lg
- Button: bg-[#00bfa5], px-6, rounded-lg, white text

**Table Component**:
- White background, rounded-lg, shadow-md
- Headers: bg-[#00bfa5], white text, py-4, sticky on scroll
- Rows: hover:bg-gray-50, border-b border-gray-200
- Cell padding: px-6 py-4
- Action buttons: inline-flex gap-2
  - Edit: bg-amber-500, rounded-md, px-3 py-1.5
  - Delete: bg-red-500, rounded-md, px-3 py-1.5
- Mobile: stack actions vertically, reduce padding to px-4 py-3

### Input Fields
- Height: h-12
- Border: border-2 border-gray-300
- Focus state: border-[#00bfa5], ring-2 ring-[#00bfa5]/20
- Rounded: rounded-lg
- Padding: px-4
- RTL text alignment

### Buttons
- Primary: bg-[#00bfa5] hover:bg-[#009688], white text
- Secondary: bg-gray-200 hover:bg-gray-300, gray-800 text  
- Danger: bg-red-500 hover:bg-red-600, white text
- Height: h-12 (forms), h-10 (table actions), h-14 (primary CTAs)
- Rounded: rounded-lg
- Font weight: medium
- Transition: all 0.2s ease

---

## Responsive Behavior

**Desktop (1024px+)**:
- Max-width container: max-w-6xl
- Table shows all columns
- Actions in single row

**Tablet (768px-1023px)**:
- Max-width: max-w-4xl
- Table scrolls horizontally if needed
- Reduce padding slightly

**Mobile (<768px)**:
- Full-width layouts with px-4 margins
- Stack form inputs vertically
- Table: scrollable container, smaller text (0.875rem)
- Action buttons stack or use icon-only versions
- Login box: px-6 instead of px-10

---

## Interaction Patterns

**Modals/Dialogs**:
- Edit violation: use browser prompt() for simplicity (as in original)
- Delete confirmation: browser confirm() dialog
- Future: Replace with custom Material Design dialogs

**Form Submission**:
- Validate on submit, show error messages below inputs
- Success feedback: brief toast notification or inline message
- Clear input after successful add

**Loading States**:
- Button shows "جاري التحميل..." text during async operations
- Disable button during processing

---

## Data Display

**Empty State**:
- Centered message "لا توجد مخالفات" when table empty
- Light gray icon and text
- "إضافة مخالفة الأولى" CTA button

**Table Patterns**:
- Auto-numbered rows starting from 1
- Violation text: right-aligned, text wrapping allowed
- Actions column: left-aligned (start of RTL)

---

## Animation

Use sparingly:
- Splash screen fade-in: 0.3s ease
- Button hover: 0.2s ease transform and color
- Table row hover: 0.15s ease background
- NO scroll animations, parallax, or complex transitions

---

## Images

**No hero images needed** - This is a utility application focused on data management. The splash screen uses gradient background only with OPPO logo (icon/SVG).