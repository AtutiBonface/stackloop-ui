# @stackloop/ui

A modern, consistent, and animated React component library built with **Framer Motion**, **Lucide Icons**, and **Tailwind CSS v4**.

## Features

✨ **Consistent Design System** - Single primary color palette with automatic shade generation  
🎨 **Unified Styling** - Consistent borders, shadows, spacing, and border radius across all components  
🎭 **Smooth Animations** - Framer Motion animations on every component  
📱 **Mobile-First** - Touch-friendly interactions and responsive design  
🎯 **TypeScript** - Fully typed components with comprehensive props  
🎁 **Tree-Shakeable** - Import only what you need

## Installation

```bash
npm install @stackloop/ui
# or
yarn add @stackloop/ui
# or
pnpm add @stackloop/ui
```

**Peer Dependencies:**
```bash
npm install react react-dom framer-motion lucide-react clsx tailwind-merge
```

## Setup

Import the theme CSS file in your application's entry point:

```tsx
// main.tsx or App.tsx
import '@stackloop/ui/theme.css'
```

## Usage

```tsx
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Modal } from '@stackloop/ui'
import { useState } from 'react'

function App() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <Input 
          label="Email" 
          type="email" 
          placeholder="you@example.com" 
        />
        <Button onClick={() => setIsOpen(true)}>
          Open Modal
        </Button>
      </CardContent>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Hello World"
      >
        <p>This is a modal dialog</p>
      </Modal>
    </Card>
  )
}
```

## Components

### Form Components
- **Button** - Primary, secondary, ghost, and danger variants with loading states
- **Input** - Text inputs with icons, labels, and error states
- **Textarea** - Multi-line text input with validation
- **Checkbox** - Animated checkboxes with labels
- **Toggle** - Switch toggle with descriptions
- **Slider** - Single value range slider
- **DualSlider** - Range slider with min/max values
- **RadioPills** - Stylized radio button group
- **Dropdown** - Searchable dropdown with icons
- **DatePicker** - Calendar date picker

### Layout Components
- **Card** - Container with variants (default, outlined, elevated)
- **CardHeader, CardTitle, CardDescription, CardContent** - Card sub-components
- **Drawer** - Slide-in side panel (left/right)
- **Modal** - Centered overlay dialog
- **BottomSheet** - Mobile-friendly bottom slide-up panel
- **Table** - Sortable data table with loading states
- **Pagination** - Page navigation with item counts

### Display Components
- **Badge** - Status indicators with color variants
- **FloatingActionButton (FAB)** - Fixed positioned action button with expandable menu
- **StepProgress** - Multi-step progress indicator
- **ThumbnailGrid** - Image grid with selection
- **StatusBadges** - Offline badge and sync indicator

### Media Components
- **FileUpload** - Drag-and-drop file uploader
- **AudioRecorder** - Audio recording interface

## Usage Example

```tsx
import { Button, Card, CardHeader, CardTitle, Input } from './index'
import { Mail } from 'lucide-react'

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <Input 
        label="Email" 
        type="email" 
        leftIcon={<Mail />} 
        placeholder="you@example.com"
      />
      <Button variant="primary">Submit</Button>
    </Card>
  )
}
```

## Design System

### Color Palette
The library uses a **single primary color** (#2e7d32 green) with automatically generated shades:
- Primary: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
- Neutral: Consistent grayscale from 50-900
- Semantic: Success, Warning, Error, Info

### Design Tokens
- **Border Radius**: sm (0.375rem), md (0.5rem), lg (0.75rem), xl (1rem), full (9999px)
- **Shadows**: sm, md, lg, xl, card
- **Spacing**: xs (0.5rem), sm (0.75rem), md (1rem), lg (1.5rem), xl (2rem)

### Animations
All components include Framer Motion animations:
- **Fade in** - Opacity transitions
- **Scale** - Grow/shrink effects
- **Slide** - Directional entrance/exit
- **Spring** - Bouncy interactions

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## File Structure

```
src/
├── components/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── ... (all components)
├── index.ts          # Main export file
├── utils.ts          # Utility functions (cn helper)
├── theme.css         # Design tokens and global styles
├── App.tsx           # Component showcase
└── main.tsx          # Entry point
```

## License

MIT


Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
