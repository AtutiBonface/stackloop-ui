**Installation**

- **NPM:**

  ```bash
  npm install --save stackloop-ui
  ```

- **Peer deps:** ensure `react` and `react-dom` (>=18) are installed.

- **CSS:** import the library CSS where you bootstrap your app:

  ```js
  import 'stackloop-ui/theme.css'
  ```

**Importing components**

- Import components from the package root:

  ```js
  import { Button, Modal, Input } from 'stackloop-ui'
  ```

**Components Reference**

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
  import { Checkbox } from 'stackloop-ui'

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
  import { Button } from 'stackloop-ui'

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
  import { Input } from 'stackloop-ui'

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
  import { Modal, ModalContent, ModalFooter } from 'stackloop-ui'

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
  import { Table } from 'stackloop-ui'

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
  import { Dropdown } from 'stackloop-ui'

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
  import { BottomSheet } from 'stackloop-ui'

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
  import { DatePicker } from 'stackloop-ui'

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
  import { DualSlider } from 'stackloop-ui'

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
  import { Pagination } from 'stackloop-ui'

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
  import { Badge } from 'stackloop-ui'

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
  import { FloatingActionButton as FAB } from 'stackloop-ui'

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
  import { AudioRecorder } from 'stackloop-ui'

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
  import { Drawer } from 'stackloop-ui'

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
  import { Toggle } from 'stackloop-ui'

  <Toggle label="Enable" onChange={(v)=>console.log(v)} />
  ```

**StatusBadges** (OfflineBadge, SyncIndicator):
- **OfflineBadge Props:** `isOffline: boolean` (required), `className?: string`.
- **SyncIndicator Props:** `status: 'synced'|'syncing'|'unsynced'|'error'` (required), `count?: number`, `className?: string`.
- **Usage:**

  ```jsx
  import { OfflineBadge, SyncIndicator } from 'stackloop-ui'

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
  import { Slider } from 'stackloop-ui'

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
  import { RadioPills } from 'stackloop-ui'

  <RadioPills name="mode" options={[{value:'a',label:'A'}]} />
  ```

**Textarea**:
- **Description:** Multiline input with label, error and helper text.
- **Props:**
  - **`label`**, **`error`**, **`helperText`**, plus native `textarea` attributes.
- **Usage:**

  ```jsx
  import { Textarea } from 'stackloop-ui'

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
  import { ThumbnailGrid } from 'stackloop-ui'

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
  import { Card, CardTitle, CardContent } from 'stackloop-ui'

  <Card variant="elevated"> <CardTitle>Title</CardTitle> <CardContent>Body</CardContent> </Card>
  ```

**FileUpload (CameraCapture, FileUploader)**:
- **CameraCapture Props:** `onCapture(file:File) => void` (required), `onRemove?`, `preview?`, `label?`, `disabled?`, `className?`.
- **FileUploader Props:** `onUpload(files:File[]) => void` (required), `accept?` (default `'*/*'`), `multiple?` (default `false`), `label?`, `disabled?`, `className?`.
- **Usage:**

  ```jsx
  import { FileUploader, CameraCapture } from 'stackloop-ui'

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
  import { StepProgress } from 'stackloop-ui'

  <StepProgress steps={[{label:'One'},{label:'Two'}]} currentStep={1} />
  ```

---

If you'd like, I can:

- generate a `docs/` folder with a separate file per component and richer examples, or
- create Storybook stories or a small demo page that mounts each component for visual testing.

Which would you prefer as the next step?
