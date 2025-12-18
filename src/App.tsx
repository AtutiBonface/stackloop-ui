import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Button,
  Input,
  Textarea,
  Checkbox,
  Toggle,
  Slider,
  DualSlider,
  RadioPills,
  Dropdown,
  Select,
  DatePicker,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Drawer,
  Modal,
  ModalContent,
  ModalFooter,
  Table,
  Pagination,
  FloatingActionButton,
  StepProgress,
  BottomSheet,
  AudioRecorder,
  Spinner,
  ToastProvider,
  useToast,
  CreditBar
} from './index'

import {
  Plus,
  Trash2,
  Edit,
  Mail,
  Search,
  Settings,
  Lock,
  Globe,
} from 'lucide-react'

function AppContent() {
  const { addToast } = useToast()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [sliderValue, setSliderValue] = useState(50)
  const [_, setDualSliderValue] = useState<[number, number]>([20, 80])
  const [isToggled, setIsToggled] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [selectedRadio, setSelectedRadio] = useState('option1')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [dropdownValue, setDropdownValue] = useState('')
  const [selectValue, setSelectValue] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const dropdownOptions = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' }
  ]

  const selectOptions = [
    { label: 'United States', value: 'us', icon: <Globe className="w-4 h-4" /> },
    { label: 'United Kingdom', value: 'uk', icon: <Globe className="w-4 h-4" /> },
    { label: 'Canada', value: 'ca', icon: <Globe className="w-4 h-4" /> },
    { label: 'Australia', value: 'au', icon: <Globe className="w-4 h-4" />, disabled: true }
  ]

  const radioOptions = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' }
  ]

  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' }
  ]

  const tableColumns = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'role', header: 'Role', sortable: false }
  ]

  const steps = [
    { label: 'Account', description: 'Create your account' },
    { label: 'Profile', description: 'Complete your profile' },
    { label: 'Settings', description: 'Configure settings' },
    { label: 'Done', description: 'All set!' }
  ]

  return (
    <div className="min-h-screen bg-secondary p-4 sm:p-8">
      <div className="max-w-7xl w-full mx-auto space-y-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
            UI Components Library
          </h1>
          <p className="text-lg text-primary/70">
            A consistent, animated component library built with Framer Motion & Lucide Icons
          </p>
        </motion.header>

        {/* Buttons Section */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Various button variants and sizes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="lg" icon={<Plus />}>
                Primary Large
              </Button>
              <Button variant="primary" size="md" icon={<Settings />}>
                Primary Medium
              </Button>
              <Button variant="secondary" size="sm" icon={<Edit />}>
                Secondary Small
              </Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="danger" icon={<Trash2 />}>
                Delete
              </Button>
              <Button variant="primary" loading>
                Loading...
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Inputs Section */}
        <Card>
          <CardHeader>
            <CardTitle>Form Inputs</CardTitle>
            <CardDescription>Input fields with icons and validation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 w-full">
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                leftIcon={<Mail className="w-5 h-5" />}
              />
              <Input
                label="Search"
                placeholder="Search..."
                leftIcon={<Search className="w-5 h-5" />}
              />
              <Input
                label="With Error"
                error="This field is required"
                placeholder="Error state"
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter password"
                rightIcon={<Lock className="w-5 h-5" />}
                hint="Must be at least 8 characters"
              />
              <Textarea
                label="Message"
                placeholder="Enter your message"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Badges & Spinner Section */}
        <Card>
          <CardHeader>
            <CardTitle>Badges & Spinner</CardTitle>
            <CardDescription>Status indicators and loading states</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Badges</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="success" dot>
                    Success
                  </Badge>
                  <Badge variant="warning" dot>
                    Warning
                  </Badge>
                  <Badge variant="danger" dot>
                    Danger
                  </Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="primary" size="lg">
                    Large Badge
                  </Badge>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Spinners</h3>
                <div className="flex flex-wrap items-center gap-8">
                  <Spinner size="sm" />
                  <Spinner size="md" />
                  <Spinner size="lg" />
                  <Spinner size="xl" />
                  <Spinner label="Loading..." />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Toast Notifications Section */}
        <Card>
          <CardHeader>
            <CardTitle>Toast Notifications</CardTitle>
            <CardDescription>Trigger toast notifications with different variants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                onClick={() => {
                  addToast({
                    message: 'Successfully saved your changes!',
                    variant: 'success',
                    duration: 3000
                  })
                }}
              >
                Show Success
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  addToast({
                    message: 'Failed to connect to server',
                    variant: 'error',
                    duration: 4000
                  })
                }}
              >
                Show Error
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  addToast({
                    message: 'Your session will expire in 5 minutes',
                    variant: 'warning'
                  })
                }}
              >
                Show Warning
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  addToast({
                    message: 'New message received from John',
                    variant: 'info',
                    duration: 0,
                    action: {
                      label: 'View',
                      onClick: () => alert('Viewing message')
                    }
                  })
                }}
              >
                Show Info with Action
              </Button>
              <Button
                onClick={() => {
                  setIsLoading(true)
                  addToast({
                    message: 'Processing your request...',
                    variant: 'default',
                    duration: 2000
                  })
                  setTimeout(() => {
                    setIsLoading(false)
                    addToast({
                      message: 'Request completed successfully!',
                      variant: 'success'
                    })
                  }, 2000)
                }}
                disabled={isLoading}
              >
                {isLoading ? <Spinner size="sm" variant="white" /> : 'Simulate Process'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Toggle & Checkbox Section */}
        <Card>
          <CardHeader>
            <CardTitle>Toggle & Checkbox</CardTitle>
            <CardDescription>Interactive switches and checkboxes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Toggle
                label="Enable Notifications"
                description="Receive email notifications"
                checked={isToggled}
                onChange={(checked) => setIsToggled(checked)}
              />
              <Checkbox
                label="I agree to the terms and conditions"
                checked={isChecked}
                onChange={(checked) => setIsChecked(checked)}
              />
            </div>
          </CardContent>
        </Card>

        <AudioRecorder onRecordingComplete={(audioBlob) => console.log(audioBlob)} />

        {/* Sliders Section */}
        <Card>
          <CardHeader>
            <CardTitle>Sliders</CardTitle>
            <CardDescription>Range controls with animations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <Slider
                label="Volume"
                value={sliderValue}
                onChange={setSliderValue}
                showValue
              />
              <DualSlider
                label1="Price Range"
                label2="Units"
                value1={0}
                value2={60}
                onChange={(value1, value2) => setDualSliderValue([value1, value2])}
                min={0}
                max={100}
                unit="$"
              />
            </div>
          </CardContent>
        </Card>

        {/* Radio Pills Section */}
        <Card>
          <CardHeader>
            <CardTitle>Radio Pills</CardTitle>
            <CardDescription>Stylized radio button group</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioPills
              name="demo-radio"
              options={radioOptions}
              value={selectedRadio}
              onChange={setSelectedRadio}
            />
          </CardContent>
        </Card>

        {/* Dropdown & Select Section */}
        <Card>
          <CardHeader>
            <CardTitle>Dropdown & Select</CardTitle>
            <CardDescription>Selection controls for forms and general use</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Dropdown
                label="Dropdown (General)"
                options={dropdownOptions}
                value={dropdownValue}
                onChange={setDropdownValue}
                searchable
                placeholder="Choose an option"
              />
              <Select
                label="Country"
                options={selectOptions}
                value={selectValue}
                onChange={setSelectValue}
                searchable
                placeholder="Select your country"
                hint="Choose your country of residence"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* DatePicker Section */}
        <Card>
          <CardHeader>
            <CardTitle>DatePicker</CardTitle>
            <CardDescription>Date selection control</CardDescription>
          </CardHeader>
          <CardContent>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </CardContent>
        </Card>

        {/* Step Progress Section */}
        <Card>
          <CardHeader>
            <CardTitle>Step Progress</CardTitle>
            <CardDescription>Multi-step flow indicator</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <StepProgress steps={steps} currentStep={currentStep} />
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                  disabled={currentStep === steps.length}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table Section */}
        <Card>
          <CardHeader>
            <CardTitle>Data Table</CardTitle>
            <CardDescription>Sortable data display</CardDescription>
          </CardHeader>
          <CardContent>
            <Table
              data={tableData}
              columns={tableColumns}
              keyExtractor={(item) => item.id.toString()}
              
            />
          </CardContent>
        </Card>

        {/* Pagination Section */}
        <Card>
          <CardHeader>
            <CardTitle>Pagination</CardTitle>
            <CardDescription>Page navigation controls</CardDescription>
          </CardHeader>
          <CardContent>
            <Pagination
              currentPage={currentPage}
              totalPages={10}
              onPageChange={setCurrentPage}
              totalItems={100}
              itemsPerPage={10}
            />
          </CardContent>
        </Card>

        {/* Modal, Drawer & Bottom Sheet Section */}
        <Card>
          <CardHeader>
            <CardTitle>Overlays</CardTitle>
            <CardDescription>Modal, Drawer, and Bottom Sheet components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
              <Button onClick={() => setIsDrawerOpen(true)}>Open Drawer</Button>
              <Button onClick={() => setIsBottomSheetOpen(true)}>
                Open Bottom Sheet
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cards Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="elevated" hover>
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
              <CardDescription>With shadow effect</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-primary/70">
                This card has an elevated appearance with a shadow.
              </p>
            </CardContent>
          </Card>
          <Card variant="outlined" hover>
            <CardHeader>
              <CardTitle>Outlined Card</CardTitle>
              <CardDescription>With border</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-primary/70">
                This card has an outlined style with a border.
              </p>
            </CardContent>
          </Card>
          <Card hover onClick={() => alert('Card clicked!')}>
            <CardHeader>
              <CardTitle>Clickable Card</CardTitle>
              <CardDescription>Interactive</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-primary/70">This card is clickable!</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        actions={[
          {
            label: 'Create',
            icon: <Plus className="w-5 h-5" />,
            onClick: () => alert('Create clicked'),
            variant: 'primary',
            labelClassName: 'bg-primary/10 text-primary'
          },
          {
            label: 'Edit',
            icon: <Edit className="w-5 h-5" />,
            onClick: () => alert('Edit clicked'),
            variant: 'success'
          },
          {
            label: 'Delete',
            icon: <Trash2 className="w-5 h-5" />,
            onClick: () => alert('Delete clicked'),
            variant: 'danger'
          }
        ]}
      />

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Example Modal">
        <ModalContent>
          <p className="text-primary/70">
            This is a modal dialog with animations and backdrop blur.
          </p>
        </ModalContent>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
        </ModalFooter>
      </Modal>

      {/* Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Side Drawer">
        <div className="space-y-4">
          <p className="text-primary/70">
            This is a drawer that slides in from the side.
          </p>
          <Button onClick={() => setIsDrawerOpen(false)}>Close Drawer</Button>
        </div>
      </Drawer>

      {/* Bottom Sheet */}
      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        title="Bottom Sheet"
      >
        <div className="space-y-4">
          <p className="text-primary/70">
            This is a bottom sheet that slides up from the bottom.
          </p>
          <Button onClick={() => setIsBottomSheetOpen(false)}>Close Sheet</Button>
        </div>
      </BottomSheet>
      <CreditBar />
    </div>
  )
}

function App() {
  return (
    <ToastProvider position="top-right" maxToasts={5}>
      <AppContent />
    </ToastProvider>
  )
}

export default App
