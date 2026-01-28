# Welcome Page - Mobile App Interface Guide

## Component Layout

### For Logged-In Users

```
┌─────────────────────────────────────────┐
│  📄 HospitalHelp        [Dasbor Button] │  ← Sticky Header
├─────────────────────────────────────────┤
│                                         │
│  Halo, [User Name]! 👋                │
│  Kelola tiket Anda dan pantau progres │
│  perbaikan                             │
│                                         │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│  │  24  │ │  8   │ │  5   │ │  10  │ │  ← Stats Cards
│  │Total │ │Dikirim│ │Dikerjakan│Selesai│
│  └──────┘ └──────┘ └──────┘ └──────┘ │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  ➕  Buat Tiket Baru            │   │  ← CTA Button
│  └─────────────────────────────────┘   │
│                                         │
│  ⏱️  Tiket Aktif                       │
│  ┌─────────────────────────────────┐   │
│  │ #TK-001 [Dikirim] [Tinggi]  👁️  │   │
│  │ AC Kamar 302 Rusak              │   │  ← Ticket Cards
│  │ Sanitasi | 20/01/2026           │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ #TK-002 [Diproses] [Sedang] 👁️  │   │
│  │ Pembersihan Lantai Basement     │   │
│  │ Fasilitas | 19/01/2026          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Fitur Lainnya                          │
│  ┌──────────────┐ ┌──────────────┐    │
│  │ 📊 Dasbor    │ │ 👤 Profil    │    │  ← Feature Grid
│  │ Statistik    │ │ Pengaturan   │    │
│  └──────────────┘ └──────────────┘    │
│                                         │
│  [Padding for Mobile Nav]               │
│                                         │
├─────────────────────────────────────────┤
│ [Home] [➕ Buat] [📊 Stats] [👤 Profil] │  ← Bottom Nav (Mobile Only)
└─────────────────────────────────────────┘
```

### For Non-Logged-In Users

Original landing page with:

- Hero section
- Features showcase (6 cards)
- Call-to-action section
- Footer

---

## Component Behaviors

### Mobile Bottom Navigation Bar

**Visibility**: Only shown on screens < 768px (md breakpoint)

**Items**:

1. **Home** - Navigate to main home (stored in activeNav state)
    - Active: Blue background, blue text
    - Inactive: Gray text, hover blue

2. **Create (Buat)** - Links to `/tickets/create`
    - Always styled as active (blue)
    - Creates new ticket directly

3. **Stats** - Navigate to stats view (stored in activeNav state)
    - Active: Blue background, blue text
    - Inactive: Gray text, hover blue

4. **Profile (Profil)** - Links to `/user/settings/profile`
    - Inactive: Gray text, hover blue
    - No active state (external link)

### Ticket Card Styling

**Status Badges**:

- `submitted`: Gray background, gray text
- `processed`: Blue background, blue text
- `repairing`: Yellow background, yellow text
- `done`: Green background, green text
- `rejected`: Gray background, gray text

**Priority Badges**:

- `high`: Red background, red text + 🔴 emoji
- `medium`: Yellow background, yellow text + 🟡 emoji
- `low`: Green background, green text + 🟢 emoji

**Interactive**:

- Hover: Shadow effect appears
- Click: Navigate to `/user/tickets/{id}`
- Truncation: Title limited to 2 lines

### Stats Cards Grid

**Desktop (md+)**: 4 columns
**Mobile**: 2 columns

**Colors**:

- Total: Blue (#3b82f6)
- Submitted: Orange (#f97316)
- Pending: Yellow (#eab308)
- Done: Green (#22c55e)

---

## Responsive Breakpoints

| Screen Size             | Layout                       | Navigation           |
| ----------------------- | ---------------------------- | -------------------- |
| Mobile (< 768px)        | Full width, stacked          | Bottom bar (visible) |
| Tablet (768px - 1024px) | Max-width container, padding | Bottom bar (hidden)  |
| Desktop (> 1024px)      | Full width with margins      | Top nav (hidden)     |

---

## Data Flow

### Backend to Frontend

```
Route: GET /
│
├─ Unauthenticated User
│  └─ Return landing page
│
└─ Authenticated User
   ├─ Query active tickets (submitted, processed, repairing)
   ├─ Calculate stats (total, submitted, done, pending)
   └─ Pass data to React component
      ├─ activeTickets: Ticket[]
      └─ stats: StatsObject
```

### Props Structure

```typescript
interface Props {
    canRegister?: boolean;
    activeTickets?: Ticket[];
    stats?: {
        total_tickets: number;
        submitted: number;
        done: number;
        pending_response: number;
    };
}

interface Ticket {
    id: number;
    ticket_number: string;
    title: string;
    status: string;
    priority: string;
    category: {
        name: string;
    };
    created_at: string;
    updated_at: string;
}
```

---

## Styling Classes

### Layout

- `min-h-screen`: Full viewport height
- `flex flex-col`: Vertical flex layout
- `pb-24 md:pb-4`: Bottom padding (mobile 96px, desktop 16px)
- `max-w-2xl`: Max content width on desktop

### Sticky Header

- `sticky top-0 z-40`: Sticky positioning with high z-index
- `md:px-6`: Extra padding on desktop

### Bottom Navigation

- `md:hidden`: Hidden on tablet and desktop
- `fixed bottom-0`: Sticky to bottom
- `z-40`: Below header if stacked

### Cards

- `overflow-hidden`: Clip content
- `hover:shadow-md`: Shadow on hover
- `transition-shadow`: Smooth shadow animation
- `cursor-pointer`: Pointer on hover

### Text

- `line-clamp-2`: Limit title to 2 lines
- `text-xs`: Small text for labels
- `text-sm`: Regular small text

---

## Color Palette

```css
/* Primary */
--blue-600: #2563eb /* Stats */ --blue-600: #2563eb (total)
    --orange-600: #ea580c (submitted) --yellow-600: #ca8a04 (pending)
    --green-600: #16a34a (done) /* Status Badges */
    --gray-100/800: submitted/rejected --blue-100/800: processed
    --yellow-100/800: repairing --green-100/800: done /* Background */
    --gray-50: Main background --white: Cards and header --gray-200: Borders;
```

---

## Key Features

✅ **Mobile-First Design**: Optimized for phones, scales to desktop
✅ **Quick Stats**: At-a-glance ticket overview
✅ **Fast Access**: One-click to create ticket
✅ **Active Tickets**: See what needs attention
✅ **Easy Navigation**: Bottom bar on mobile, links on desktop
✅ **Visual Feedback**: Hover states, active states
✅ **Date Display**: Created date for each ticket
✅ **Empty State**: Helpful message when no active tickets
✅ **Responsive**: Works on all screen sizes

---

## Testing Checklist

- [ ] Verify authenticated user sees mobile app interface
- [ ] Verify unauthenticated user sees landing page
- [ ] Test stats card data displays correctly
- [ ] Test active tickets load and display
- [ ] Test bottom navigation on mobile (< 768px)
- [ ] Test navigation links work
- [ ] Test ticket click opens detail page
- [ ] Test create button link works
- [ ] Test responsive transitions at breakpoints
- [ ] Test empty state displays when no tickets
- [ ] Verify styling matches color scheme
- [ ] Check performance on slow networks
