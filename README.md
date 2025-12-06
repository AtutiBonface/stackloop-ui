## Installation

### NPM

```bash
npm install --save @stackloop/ui
```

### Peer Dependencies

Ensure `react` and `react-dom` (>=18) are installed.

### Next.js Setup

#### 1. Import Theme CSS

Import the library CSS in your root layout or `_app.tsx`:

```tsx
// app/layout.tsx (App Router)
import '@stackloop/ui/theme.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

```tsx
// pages/_app.tsx (Pages Router)
import '@stackloop/ui/theme.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

#### 2. Tailwind Configuration

If using Tailwind CSS v4 with `@theme`, the library's theme variables are already configured. If you need to customize colors:

```css
/* In your global CSS or theme.css */
@theme {
  /* Override library colors */
  --color-primary: #your-color;
  --color-primary-dark: #your-darker-color;
  --color-border: #your-border-color;
  --color-border-dark: #your-darker-border;
  --color-secondary: #your-secondary-bg;
  --color-background: #your-bg-color;
  --color-foreground: #your-text-color;
  
  /* Semantic colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}
```

### Usage with React (Vite/CRA)

```js
// In your main entry file (main.tsx or index.tsx)
import '@stackloop/ui/theme.css'
```

## Importing Components

Import components from the package root:

```tsx
import { Button, Modal, Input } from '@stackloop/ui'
```

All components are **client-side** components with `'use client'` directive, making them compatible with Next.js App Router.

## Theme Customization

The library uses a simplified color system with semantic variables:

### Color Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--color-primary` | `#525252` | Primary brand color |
| `--color-primary-dark` | `#404040` | Darker primary variant |
| `--color-border` | `#e5e5e5` | Default border color |
| `--color-border-dark` | `#d4d4d4` | Darker border variant |
| `--color-secondary` | `#fafafa` | Secondary background |
| `--color-background` | `#ffffff` | Main background |
| `--color-foreground` | `#171717` | Primary text color |
| `--color-success` | `#10b981` | Success state |
| `--color-warning` | `#f59e0b` | Warning state |
| `--color-error` | `#ef4444` | Error state |
| `--color-info` | `#3b82f6` | Info state |

### Customizing Colors

Create a custom theme file or extend the existing one:

```css
/* styles/custom-theme.css */
@import '@stackloop/ui/theme.css';

@theme {
  /* Brand colors */
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  
  /* Borders */
  --color-border: #e2e8f0;
  --color-border-dark: #cbd5e1;
  
  /* Backgrounds */
  --color-secondary: #f8fafc;
  --color-background: #ffffff;
  --color-foreground: #0f172a;
}
```

### Dark Mode Support

You can add dark mode variants:

```css
@theme {
  /* Light mode (default) */
  --color-background: #ffffff;
  --color-foreground: #171717;
  
  /* Dark mode */
  @media (prefers-color-scheme: dark) {
    --color-background: #0a0a0a;
    --color-foreground: #fafafa;
    --color-primary: #60a5fa;
    --color-border: #27272a;
  }
}
```

## Components Reference

- For each component below you'll find a short description, props (type, default, notes) and a minimal usage example.

**Checkbox**:
- **Description:** Accessible checkbox with optional label and description.
- **Props:**
  - **`label`**: `string` — optional.
  - **`description`**: `string` — optional.
  - **`onChange`**: `(checked: boolean) => void` — optional.
  - Inherits standard `input` props (e.g. `disabled`, `defaultChecked`, `checked`).
- **Usage:**

  ```jsx
  import { Checkbox } from '@stackloop/ui'

  <Checkbox label="Accept terms" onChange={(v) => console.log(v)} />
  ```

**Button**:
- **Description:** Animated button with variants, sizes, icons and loading state.
- **Props:**
  - **`variant`**: `'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'` — default: `'primary'`.
  - **`size`**: `'sm' | 'md' | 'lg'` — default: `'md'`.
  - **`loading`**: `boolean` — default: `false`.
  - **`icon`**: `ReactNode` — optional.
  - Inherits standard `button` props.
- **Usage:**

  ```jsx
  import { Button } from '@stackloop/ui'

  <Button variant="outline" size="lg" onClick={() => {}}>Save</Button>
  ```

**Input**:
- **Description:** Text input with label, error and optional icons.
- **Props:**
  - **`label`**: `string` — optional.
  - **`error`**: `string` — optional.
  - **`hint`**: `string` — optional.
  - **`leftIcon`** / **`rightIcon`**: `ReactNode` — optional.
  - Inherits `input` HTML attributes.
- **Usage:**

  ```jsx
  import { Input } from '@stackloop/ui'

  <Input label="Email" placeholder="you@example.com" />
  ```

**Modal**:
- **Description:** Centered modal with backdrop, title and Escape-to-close handling.
- **Props:**
  - **`isOpen`**: `boolean` — required.
  - **`onClose`**: `() => void` — required.
  - **`children`**: `ReactNode` — required.
  - **`title`**: `string` — optional.
  - **`size`**: `'sm'|'md'|'lg'|'xl'|'full'` — default: `'md'`.
  - **`className`**: `string` — optional.
- **Subcomponents:** `ModalContent`, `ModalFooter`.
- **Usage:**

  ```jsx
  import { Modal, ModalContent, ModalFooter } from '@stackloop/ui'

  <Modal isOpen={open} onClose={() => setOpen(false)} title="My Modal">
    <ModalContent>Body</ModalContent>
    <ModalFooter>
      <button onClick={() => setOpen(false)}>Close</button>
    </ModalFooter>
  </Modal>
  ```

**Table**:
- **Description:** Generic table with sortable columns and loading skeleton.
- **Props:**
  - **`data`**: `T[]` — required.
  - **`columns`**: `Column<T>[]` — required. Column: `{ key, header, sortable?, render?, width? }`.
  - **`loading`**: `boolean` — optional.
  - **`onRowClick`**: `(item: T) => void` — optional.
  - **`keyExtractor`**: `(item: T) => string` — required.
  - **`className`**: `string` — optional.
- **Usage:**

  ```jsx
  import { Table } from '@stackloop/ui'

  const columns = [{ key: 'id', header: 'ID' }, { key: 'name', header: 'Name' }]
  <Table data={items} columns={columns} keyExtractor={(i) => String(i.id)} />
  ```

**Dropdown**:
- **Description:** Select with optional search, clear and icons.
- **Props:**
  - **`options`**: `{ value: string; label: string; icon?: ReactNode }[]` — required.
  - **`value`**: `string` — optional.
  - **`onChange`**: `(value: string) => void` — required.
  - **`placeholder`**: `string` — default: `'Select an option'`.
  - **`label`**, **`error`**, **`searchable`** (default `false`), **`clearable`** (default `true`), **`disabled`**, **`className`**.
- **Usage:**

  ```jsx
  import { Dropdown } from '@stackloop/ui'

  <Dropdown options={[{value:'a',label:'A'}]} value={val} onChange={setVal} searchable />
  ```

**BottomSheet**:
- **Description:** Mobile bottom sheet with header and optional close button.
- **Props:**
  - **`isOpen`**: `boolean` — required.
  - **`onClose`**: `() => void` — required.
  - **`title`**: `string` — optional.
  - **`children`**: `ReactNode` — required.
  - **`showCloseButton`**: `boolean` — default: `true`.
  - **`className`**: `string` — optional.
- **Usage:**

  ```jsx
  import { BottomSheet } from '@stackloop/ui'

  <BottomSheet isOpen={open} onClose={() => setOpen(false)} title="Actions">...</BottomSheet>
  ```

**DatePicker**:
- **Description:** Date picker with month navigation and min/max options.
- **Props:**
  - **`value`**: `Date` — optional.
  - **`onChange`**: `(date: Date) => void` — required.
  - **`label`**, **`placeholder`** (default `'Select date'`), **`error`**, **`disabled`**, **`minDate`**, **`maxDate`**, **`className`**.
- **Usage:**

  ```jsx
  import { DatePicker } from '@stackloop/ui'

  <DatePicker value={date} onChange={setDate} />
  ```

**DualSlider**:
- **Description:** Two linked sliders showing relative portions.
- **Props:**
  - **`value1`**, **`value2`**: `number` — required.
  - **`onChange`**: `(v1:number, v2:number)=>void` — required.
  - **`label1`**, **`label2`**: `string` — required.
  - **`min`** (default `0`), **`max`** (default `100`), **`step`** (default `1`), **`unit`** (default `'%')`, **`disabled`**, **`className`**.
- **Usage:**

  ```jsx
  import { DualSlider } from '@stackloop/ui'

  <DualSlider value1={30} value2={70} onChange={(a,b)=>{}} label1="A" label2="B" />
  ```

**Pagination**:
- **Description:** Pagination with previous/next and numeric buttons.
- **Props:**
  - **`currentPage`**: `number` — required.
  - **`totalPages`**: `number` — required.
  - **`onPageChange`**: `(page:number)=>void` — required.
  - **`totalItems`**, **`itemsPerPage`**, **`className`** — optional.
- **Usage:**

  ```jsx
  import { Pagination } from '@stackloop/ui'

  <Pagination currentPage={1} totalPages={10} onPageChange={setPage} />
  ```

**Badge**:
- **Description:** Inline badge with color variants and optional dot.
- **Props:**
  - **`children`**: `ReactNode` — required.
  - **`variant`**: `'default'|'primary'|'success'|'warning'|'danger'|'info'` — default: `'default'`.
  - **`size`**: `'sm'|'md'|'lg'` — default: `'md'`.
  - **`dot`**: `boolean` — default: `false`.
  - **`className`**: `string` — optional.
- **Usage:**

  ```jsx
  import { Badge } from '@stackloop/ui'

  <Badge variant="primary">New</Badge>
  ```

**FloatingActionButton (FAB)**:
- **Description:** Floating action button with expanded action list support.
- **Props:**
  - **`icon`**, **`label`**, **`onClick`**, **`actions`** (array of `{label, icon, onClick, variant}`) — optional.
  - **`variant`**: `'primary'|'secondary'` — default: `'primary'`.
  - **`position`**: `'bottom-right'|'bottom-left'|'bottom-center'` — default: `'bottom-right'`.
  - **`disabled`**, **`className`**.
- **Usage:**

  ```jsx
  import { FloatingActionButton as FAB } from '@stackloop/ui'

  <FAB label="New" onClick={()=>{}} />
  ```

**AudioRecorder**:
- **Description:** Browser audio recorder component using MediaRecorder.
- **Props:**
  - **`onRecordingComplete`**: `(audioBlob: Blob) => void` — required.
  - **`label`**: `string` — default: `'Record Audio'`.
  - **`maxDuration`**: `number` — default: `300` seconds.
  - **`disabled`**, **`className`**.
- **Usage:**

  ```jsx
  import { AudioRecorder } from '@stackloop/ui'

  <AudioRecorder onRecordingComplete={(blob)=>{ /* handle */ }} />
  ```

**Drawer**:
- **Description:** Side drawer that slides in from the left or right.
- **Props:**
  - **`isOpen`**: `boolean` — required.
  - **`onClose`**: `() => void` — required.
  - **`children`**: `ReactNode` — required.
  - **`title`**: `string` — optional.
  - **`position`**: `'left'|'right'` — default: `'right'`.
  - **`className`**: `string` — optional.
- **Usage:**

  ```jsx
  import { Drawer } from '@stackloop/ui'

  <Drawer isOpen={open} onClose={()=>setOpen(false)} title="Menu">...</Drawer>
  ```

**Toggle**:
- **Description:** Switch control with label and description.
- **Props:**
  - **`label`**: `string` — optional.
  - **`description`**: `string` — optional.
  - **`onChange`**: `(checked:boolean)=>void` — optional.
  - Inherits input attributes such as `checked`, `disabled`.
- **Usage:**

  ```jsx
  import { Toggle } from '@stackloop/ui'

  <Toggle label="Enable" onChange={(v)=>console.log(v)} />
  ```

**StatusBadges** (OfflineBadge, SyncIndicator):
- **OfflineBadge Props:** `isOffline: boolean` (required), `className?: string`.
- **SyncIndicator Props:** `status: 'synced'|'syncing'|'unsynced'|'error'` (required), `count?: number`, `className?: string`.
- **Usage:**

  ```jsx
  import { OfflineBadge, SyncIndicator } from '@stackloop/ui'

  <OfflineBadge isOffline={true} />
  <SyncIndicator status="syncing" />
  ```

**Slider**:
- **Description:** Single-value slider with optional unit and label.
- **Props:**
  - **`value`**: `number` — required.
  - **`onChange`**: `(value:number)=>void` — required.
  - **`min`** (default `0`), **`max`** (default `100`), **`step`** (default `1`), **`label`**, **`showValue`** (default `true`), **`unit`** (default `'%')`, **`disabled`**, **`className`**.
- **Usage:**

  ```jsx
  import { Slider } from '@stackloop/ui'

  <Slider value={50} onChange={setValue} />
  ```

**RadioPills**:
- **Description:** Radio group styled as pill buttons.
- **Props:**
  - **`options`**: `{ value: string; label: string; icon?: ReactNode }[]` — required.
  - **`value`**: `string` — optional.
  - **`onChange`**: `(v:string)=>void` — optional.
  - **`name`**: `string` — required.
  - **`disabled`**, **`className`**.
- **Usage:**

  ```jsx
  import { RadioPills } from '@stackloop/ui'

  <RadioPills name="mode" options={[{value:'a',label:'A'}]} />
  ```

**Textarea**:
- **Description:** Multiline input with label, error and helper text.
- **Props:**
  - **`label`**, **`error`**, **`helperText`**, plus native `textarea` attributes.
- **Usage:**

  ```jsx
  import { Textarea } from '@stackloop/ui'

  <Textarea label="Message" helperText="Max 500 chars" />
  ```

**ThumbnailGrid**:
- **Description:** Grid to display thumbnails for images, documents, audio with optional remove/view actions.
- **Props:**
  - **`items`**: `{ id, name, url, type:'image'|'document'|'audio', size? }[]` — required.
  - **`onRemove`**: `(id:string)=>void` — optional.
  - **`onView`**: `(item)=>void` — optional.
  - **`columns`**: `2|3|4` — default: `3`.
  - **`className`**.
- **Usage:**

  ```jsx
  import { ThumbnailGrid } from '@stackloop/ui'

  <ThumbnailGrid items={items} onRemove={(id)=>{}} />
  ```

**Card**:
- **Description:** Generic card container with variants and content subcomponents.
- **Props:**
  - **`children`**: `ReactNode` — required.
  - **`variant`**: `'default'|'outlined'|'elevated'` — default: `'default'`.
  - **`padding`**: `'sm'|'md'|'lg'|'none'` — default: `'md'`.
  - **`onClick`**: `() => void` — optional.
  - **`hover`**: `boolean` — default: `false`.
- **Subcomponents:** `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`.
- **Usage:**

  ```jsx
  import { Card, CardTitle, CardContent } from '@stackloop/ui'

  <Card variant="elevated"> <CardTitle>Title</CardTitle> <CardContent>Body</CardContent> </Card>
  ```

**FileUpload (CameraCapture, FileUploader)**:
- **CameraCapture Props:** `onCapture(file:File) => void` (required), `onRemove?`, `preview?`, `label?`, `disabled?`, `className?`.
- **FileUploader Props:** `onUpload(files:File[]) => void` (required), `accept?` (default `'*/*'`), `multiple?` (default `false`), `label?`, `disabled?`, `className?`.
- **Usage:**

  ```jsx
  import { FileUploader, CameraCapture } from '@stackloop/ui'

  <FileUploader onUpload={(files)=>{}} multiple accept="image/*" />
  <CameraCapture onCapture={(file)=>{}} />
  ```

**StepProgress**:
- **Description:** Horizontal stepper (desktop) and compact dots view (mobile) showing progress.
- **Props:**
  - **`steps`**: `{ label: string; description?: string }[]` — required.
  - **`currentStep`**: `number` — required.
  - **`className`**: optional.
- **Usage:**

  ```jsx
  import { StepProgress } from '@stackloop/ui'

  <StepProgress steps={[{label:'One'},{label:'Two'}]} currentStep={1} />
  ```

---

## Next.js Best Practices

### App Router

All components work seamlessly with Next.js 13+ App Router. They include the `'use client'` directive:

```tsx
// app/page.tsx
import { Button, Card } from '@stackloop/ui'

export default function Page() {
  return (
    <div>
      <Card>
        <Button onClick={() => console.log('clicked')}>Click me</Button>
      </Card>
    </div>
  )
}
```

### Server Components

To use these components with Server Components, import them in client components:

```tsx
// components/ClientWrapper.tsx
'use client'
import { Button } from '@stackloop/ui'

export function ClientButton() {
  return <Button onClick={() => alert('Hello')}>Click</Button>
}
```

```tsx
// app/page.tsx (Server Component)
import { ClientButton } from '@/components/ClientWrapper'

export default function Page() {
  return <ClientButton />
}
```

### Styling Considerations

- The library uses Tailwind CSS v4 with `@theme` directive
- Ensure your Next.js project is configured for Tailwind CSS v4
- All animations use Framer Motion and are optimized for performance

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Audio recording requires MediaRecorder API support

## License

MIT

---

For questions, issues, or contributions, please visit the [GitHub repository](https://github.com/AtutiBonface/@stackloop/ui).
