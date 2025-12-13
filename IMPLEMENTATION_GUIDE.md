# ITWrapped - Implementation Guide

## 🎯 Project Overview

**ITWrapped** is a "Spotify Wrapped for IT internships" - a beautiful, interactive platform that helps students discover where their peers interned and connect with them instantly.

### Core Features

- **Company Discovery**: Visual popularity rankings and interactive charts
- **Student Directory**: Browse all interns with full contact information
- **Smart Search**: Instant filtering by company, industry, or student name
- **Company Profiles**: Detailed views showing all students who interned at each company
- **One-Click Contact**: Copy emails and phone numbers instantly

---

## 📊 Data Model

### Student Entity

```typescript
interface Student {
  id: string; // Unique matriculation number
  name: string; // Full name
  matricNo: string; // e.g., "22CG031802"
  regNo: string; // Registration number
  level: number; // 300 (3rd year)
  department: string; // "Computer Science"
  companyId: string; // Normalized company slug
  companyName: string; // Display name
  companyAddress: string; // Full address
  email: string; // Student email
  phone: string; // Student phone
  parentPhone: string; // Parent/guardian phone
  hasInternship: boolean; // Whether assigned to company
}
```

### Company Entity

```typescript
interface Company {
  id: string; // Slug (e.g., "quidax")
  name: string; // Display name
  address: string; // Full address
  city: string; // Lagos, Abuja, etc.
  state: string; // State
  internCount: number; // Number of students
  studentIds: string[]; // Array of student IDs
  industry: string; // Industry category
  rank: number; // Popularity rank (1 = most popular)
  badge: "popular" | "validated" | "emerging";
}
```

---

## 🏗️ Architecture

### Project Structure

```
app/
  ├── (internships)/
  │   └── page.tsx           # Main internships dashboard
  ├── layout.tsx             # Root layout with Navbar
  └── globals.css            # Global styles with design tokens

components/
  ├── dashboard/
  │   ├── HeroStats.tsx      # Hero section with stats
  │   ├── PopularityChart.tsx # Company ranking chart
  │   └── QuickSearch.tsx    # Search component
  ├── company/
  │   ├── CompanyCard.tsx    # Company card + grid
  │   └── CompanyProfile.tsx # Company detail page
  ├── student/
  │   └── StudentCard.tsx    # Student card with contact
  ├── layout/
  │   └── NavBar.tsx         # Navigation bar
  └── ui/                    # shadcn/ui components

lib/
  ├── data/
  │   ├── csvParser.ts       # CSV parsing logic
  │   └── dataProcessor.ts   # Data aggregation
  ├── types/
  │   └── internship.ts      # TypeScript types
  └── hooks/
      └── useInternshipData.ts # Data management hook

public/
  └── data/
      └── internships.csv    # CSV data file
```

### Data Flow

```
CSV File (public/data/internships.csv)
  ↓
useInternshipData Hook (fetches & parses)
  ↓
parseCSVText (lib/data/csvParser.ts)
  ↓
aggregateCompanies (lib/data/dataProcessor.ts)
  ↓
React Components (display & interact)
```

---

## 🎨 Design System

### Colors (from tailwind.config.js)

- **Primary**: `#ff90e8` (Pink/Magenta) - Brand color
- **Brand Gold**: `#ffc900` - Accent color
- **Brand Neon**: `#f1f333` - Highlight color
- **Background**: `#f4f4f0` (light) / `#121212` (dark)
- **Card**: `#ffffff` (light) / `#1a1a1a` (dark)

### Typography

- **Font Family**: ABC Favorit (custom font)
- **Headings**: Bold, tracking-tight
- **Body**: Regular weight
- **Monospace**: ABC Favorit Mono (for emails/phones)

### Components

All components use **shadcn/ui** with the "new-york" style and neutral base color.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager

### Installation

```bash
cd "ITWrapped Data"
pnpm install
```

### Development

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

---

## 📝 Adding New Data

### Update CSV File

1. Replace `public/data/internships.csv` with new data
2. Ensure columns match:

   - NAME
   - MATRIC NO
   - REG. NO.
   - LEVEL
   - DEPARTMENT
   - COMPANY'S NAME
   - COMPANIES ADDRESS (column header may vary)
   - STUDENTS' GSM NO
   - PARENT GSM NO.
   - STUDENT EMAIL

3. Refresh the page - data updates automatically

### Data Quality Tips

- Remove duplicate students (by MATRIC NO)
- Normalize company names (e.g., "Quidax" vs "quidax")
- Ensure addresses include city/state for location detection
- Validate phone numbers are 10-11 digits

---

## 🎯 Key User Flows

### 1. Discover Popular Companies

1. Land on homepage
2. See hero stats (total students, companies)
3. Scroll to popularity chart
4. Click any company bar

### 2. Search for Specific Company

1. Type company name in search bar
2. See instant results
3. Click company card
4. View all students who interned there

### 3. Connect with a Student

1. On company profile, see student cards
2. Hover over contact info
3. Click copy button
4. Email/phone copied to clipboard

---

## 🧩 Component API

### HeroStats

```tsx
<HeroStats stats={stats} />
```

**Props:**

- `stats`: `DashboardStats` - Dashboard statistics

### PopularityChart

```tsx
<PopularityChart
  companies={companies}
  onCompanyClick={(id) => ...}
  maxDisplay={10}
/>
```

**Props:**

- `companies`: `Company[]` - All companies
- `onCompanyClick`: `(id: string) => void` - Click handler
- `maxDisplay?`: `number` - Max companies to show (default: 10)

### CompanyProfile

```tsx
<CompanyProfile
  company={company}
  students={students}
  onBack={() => ...}
/>
```

**Props:**

- `company`: `Company` - Company data
- `students`: `Student[]` - Students who interned there
- `onBack`: `() => void` - Back button handler

### StudentCard

```tsx
<StudentCard student={student} delay={0.1} />
```

**Props:**

- `student`: `Student` - Student data
- `onClick?`: `() => void` - Click handler
- `delay?`: `number` - Animation delay

---

## 🔍 Search & Filtering

### Search Algorithm

Searches across:

- Student names
- Company names
- Industries
- Cities
- Email addresses
- Matric numbers

### Filter Options

- **By Industry**: Banking & Fintech, IT & Consulting, etc.
- **By Location**: Lagos, Abuja, Port Harcourt, etc.
- **By Popularity**: Popular (5+), Validated (2+), Emerging (1)

---

## 📊 Metrics & Insights

### Company Rankings

- **Popular** (🔥): 5+ interns
- **Validated** (✓): 2-4 interns
- **Emerging**: 1 intern

### Industries Tracked

1. Banking & Fintech (~25%)
2. IT & Consulting (~20%)
3. Telecommunications (~8%)
4. Energy & Oil/Gas (~7%)
5. Government (~5%)
6. Manufacturing (~3%)
7. Education (~4%)
8. Other (~28%)

### Top Locations

1. Lagos (70%)
2. Abuja (9%)
3. Port Harcourt (7%)
4. Ibadan (5%)
5. Others (9%)

---

## 🎨 Customization

### Change Brand Colors

Edit `app/globals.css`:

```css
:root {
  --primary: 312 100% 78%; /* Pink */
  --brand-gold: 47 100% 50%; /* Gold */
  --brand-neon: 61 89% 58%; /* Neon Yellow */
}
```

### Add New Badge Type

1. Update `Company` type in `lib/types/internship.ts`
2. Add badge logic in `lib/data/dataProcessor.ts` (`rankCompanies`)
3. Update UI in `CompanyCard.tsx` and `CompanyProfile.tsx`

### Modify Industry Categories

Edit `detectIndustry()` in `lib/data/csvParser.ts`

---

## 🚨 Troubleshooting

### CSV Not Loading

- Check file exists at `public/data/internships.csv`
- Verify CSV format matches expected columns
- Check browser console for errors

### Companies Not Showing

- Ensure students have `COMPANY'S NAME` filled
- Check normalization in `csvParser.ts`

### Search Not Working

- Verify `useInternshipData` hook is initialized
- Check search query in browser console

### Styles Not Applying

- Run `pnpm dev` to rebuild
- Clear browser cache
- Check `globals.css` loaded correctly

---

## 🔮 Future Enhancements

### v1.5 Features

- [ ] Advanced filters (multi-select)
- [ ] Bookmark companies/students
- [ ] Export contact lists
- [ ] Dark mode toggle

### v2.0 Features

- [ ] User authentication
- [ ] Student profiles (add internship stories)
- [ ] Company comparison mode
- [ ] Salary insights (anonymous)
- [ ] Interview tips database
- [ ] Application tracking

### v3.0 Features

- [ ] AI-powered recommendations
- [ ] Mentorship matching
- [ ] Success rate predictions
- [ ] Alumni network integration

---

## 📦 Dependencies

### Core

- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety

### UI

- **shadcn/ui** - Component library
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Data

- **PapaParse** - CSV parsing

---

## 📄 License

This project is for educational purposes.

---

## 🤝 Contributing

### Adding Features

1. Create feature branch
2. Implement in appropriate module
3. Test thoroughly
4. Submit PR

### Reporting Issues

Use GitHub issues with:

- Description of problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

---

## 📞 Support

For questions or issues:

- Check this guide first
- Review code comments
- Open GitHub issue

---

**Built with ❤️ for IT students**
