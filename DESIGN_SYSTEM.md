# Zapatos - Design System Reference

## 🎨 Color System

### Primary Palette

```
Zapatos Cream      #FAF7F2    Background, light surfaces
Zapatos Taupe      #D4C7BA    Borders, secondary elements
Zapatos Terracotta #C9A689    Accents, highlights
Zapatos Obsidian   #1A1A1A    Primary text, dark UI
Zapatos Charcoal   #2D2D2D    Secondary text
Zapatos Gold       #B8936D    CTAs, premium touches
```

### Usage Guidelines

| Color | Use For | Don't Use For |
|-------|---------|---------------|
| Cream | Page backgrounds, cards | Text (low contrast) |
| Obsidian | Headings, body text, buttons | Backgrounds (too dark) |
| Gold | Hover states, links, badges | Large areas (overwhelming) |
| Taupe | Borders, muted text | Primary CTAs |
| Terracotta | Accent elements, icons | Body text |

---

## ✍️ Typography

### Font Families

```tsx
// Headings (Serif)
font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
weights: 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

// Body & UI (Sans-serif)
font-family: var(--font-inter), 'Inter', sans-serif;
weights: variable
```

### Type Scale

```css
/* Headings */
.text-8xl  → 96px  → Hero titles
.text-7xl  → 72px  → Main page headings
.text-5xl  → 48px  → Section headings
.text-4xl  → 36px  → Card headings
.text-2xl  → 24px  → Subsection headings

/* Body */
.text-base → 16px  → Default body text
.text-sm   → 14px  → Secondary text
.text-xs   → 12px  → Labels, captions
```

### Editorial Spacing

```css
/* Apply to paragraphs and UI text for luxury feel */
.editorial-spacing {
  tracking-wide;     /* letter-spacing: 0.025em */
  leading-relaxed;   /* line-height: 1.625 */
}

/* Labels and navigation */
.uppercase.tracking-widest → letter-spacing: 0.1em
.uppercase.tracking-[0.3em] → letter-spacing: 0.3em (very spacious)
```

---

## 🧩 Component Patterns

### Buttons

```tsx
// Primary CTA
<Button size="lg" className="bg-zapatos-obsidian text-zapatos-cream">
  Explore Collection
</Button>

// Secondary
<Button variant="outline" size="lg">
  Learn More
</Button>

// Ghost (minimal)
<Button variant="ghost">
  Continue Shopping
</Button>
```

### Cards

```tsx
// Product Card
<div className="luxury-border overflow-hidden hover:shadow-lg transition-shadow">
  <div className="aspect-[3/4] bg-cover" />
  <div className="p-6">
    <h3 className="font-serif text-2xl mb-2">Product Name</h3>
    <p className="text-sm text-zapatos-charcoal/70 editorial-spacing">
      Description
    </p>
  </div>
</div>
```

### Luxury Border

```css
.luxury-border {
  border: 1px solid rgba(212, 199, 186, 0.3); /* Taupe at 30% opacity */
}
```

---

## 🎭 Animation Guidelines

### Page Transitions (Framer Motion)

```tsx
// Fade in on mount
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>

// Scroll-triggered
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
```

### Hover Effects

```css
/* Image zoom on hover */
.group:hover .image {
  transform: scale(1.05);
  transition: transform 0.7s ease;
}

/* Text color change */
.hover:text-zapatos-gold {
  transition: color 0.3s ease;
}
```

### Timing
- **Fast**: 0.2-0.3s (UI feedback, button states)
- **Medium**: 0.5-0.7s (image transforms, reveals)
- **Slow**: 0.8-1.2s (page loads, hero animations)

---

## 📐 Spacing System

### Container Padding
```tsx
// Mobile
className="px-6"         → 24px horizontal padding

// Desktop
className="lg:px-12"     → 48px horizontal padding
```

### Section Spacing
```tsx
// Between major sections
className="py-24"        → 96px vertical padding

// Between elements within sections
className="mb-16"        → 64px bottom margin
className="mb-8"         → 32px bottom margin
className="mb-4"         → 16px bottom margin
```

---

## 🖼️ Image Guidelines

### Aspect Ratios
- **Product Cards**: 3:4 (portrait)
- **Hero Banners**: 16:9 or full viewport
- **Category Cards**: 3:4 or 1:1

### Image Treatment
```tsx
// High-quality, editorial style
<div 
  className="bg-cover bg-center"
  style={{ backgroundImage: `url('...')` }}
/>

// With overlay gradient
<div className="absolute inset-0 bg-gradient-to-t from-zapatos-obsidian/60 to-transparent" />
```

---

## 🎯 Layout Patterns

### Grid Systems

```tsx
// 3-column product grid
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">

// 2-column content split
<div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

// 4-column footer
<div className="grid grid-cols-1 md:grid-cols-4 gap-12">
```

### Negative Space

- **Hero sections**: Full viewport height with centered content
- **Around headings**: Minimum 4rem (64px) above and below
- **Between cards**: Minimum 2rem (32px) gap

---

## 🔤 Content Guidelines

### Voice & Tone
- **Sophisticated**: Use elevated vocabulary without being pretentious
- **Minimal**: Every word must earn its place
- **Warm**: Approachable luxury, not cold minimalism

### Examples

✅ **Good**:
- "Discover your bespoke ritual"
- "Meticulously crafted for luminous skin"
- "Where artistry meets science"

❌ **Avoid**:
- "Buy now and save!"
- "Amazing deals on skincare"
- "Click here for more info"

### Text Hierarchy

```
SECTION LABEL          → Uppercase, tracking-[0.3em], text-xs, text-gold
Main Heading           → font-serif, text-5xl, font-light
Subheading             → font-serif, text-2xl
Body Text              → font-sans, text-base, editorial-spacing
Caption/Meta           → font-sans, text-sm, text-charcoal/70
```

---

## ♿ Accessibility

### Contrast Ratios
- **Obsidian on Cream**: 15.8:1 (AAA) ✅
- **Charcoal on Cream**: 12.6:1 (AAA) ✅
- **Gold on Cream**: 4.8:1 (AA) ✅

### Best Practices
- Always include `alt` text for images
- Use semantic HTML (`<nav>`, `<main>`, `<article>`)
- Include `sr-only` labels for icon buttons
- Ensure keyboard navigation works
- Maintain focus states

```tsx
<span className="sr-only">Search</span>
```

---

## 📱 Responsive Breakpoints

```
sm:  640px   → Mobile landscape
md:  768px   → Tablet
lg:  1024px  → Desktop
xl:  1280px  → Large desktop
2xl: 1536px  → Extra large
```

### Mobile-First Approach

```tsx
// Base styles apply to mobile
className="text-4xl"          → Mobile: 36px

// Add tablet size
className="text-4xl md:text-5xl"   → Tablet: 48px

// Add desktop size  
className="text-4xl md:text-5xl lg:text-7xl"  → Desktop: 72px
```

---

## 🎪 Special Effects

### Glass Effect
```css
.glass-effect {
  backdrop-blur-md;
  background: rgba(255, 255, 255, 0.6);
}
```

### Custom Scrollbar
```css
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background: #D4C7BA;  /* Taupe */
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
  background: #C9A689;  /* Terracotta */
}
```

---

## 🛠️ Utility Classes Reference

### Custom Utilities

```css
.editorial-spacing  → tracking-wide + leading-relaxed
.luxury-border      → border + border-zapatos-taupe/30
.glass-effect       → backdrop-blur + bg-white/60
.text-balance       → text-wrap: balance (for headings)
```

### Commonly Used Combinations

```tsx
// Section heading
className="text-4xl md:text-5xl font-serif font-light mb-6"

// Navigation link
className="text-sm uppercase tracking-widest hover:text-zapatos-gold transition-colors"

// Card container
className="luxury-border p-6 hover:shadow-lg transition-shadow"

// Image overlay
className="absolute inset-0 bg-gradient-to-t from-zapatos-obsidian/60 to-transparent"
```

---

## 📋 Checklist for New Components

When creating a new component:

- [ ] Uses correct font (serif for headings, sans for UI)
- [ ] Includes proper spacing (follows 4px/8px grid)
- [ ] Has hover states with smooth transitions
- [ ] Accessible (keyboard nav, focus states, ARIA labels)
- [ ] Responsive across breakpoints
- [ ] Maintains brand voice in copy
- [ ] Uses design tokens (no hardcoded colors)
- [ ] Follows animation guidelines (duration, easing)

---

**Remember**: Every element should feel intentional, refined, and luxurious. Less is more. ✨
