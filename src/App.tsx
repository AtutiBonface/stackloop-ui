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
  BottomSheet
} from './index'

import {
  Plus,
  Trash2,
  Edit,
  Mail,
  Search,
  Settings,
} from 'lucide-react'

function App() {
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
  const [currentStep, setCurrentStep] = useState(1)

  const dropdownOptions = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' }
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
    <div className="min-h-screen bg-neutral-50 p-4 sm:p-8">
      <div className="max-w-7xl w-full mx-auto space-y-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900">
            UI Components Library
          </h1>
          <p className="text-lg text-neutral-600">
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
              <Textarea
                label="Message"
                placeholder="Enter your message"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Badges Section */}
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>Status indicators and labels</CardDescription>
          </CardHeader>
          <CardContent>
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

        {/* Dropdown & DatePicker Section */}
        <Card>
          <CardHeader>
            <CardTitle>Dropdown & DatePicker</CardTitle>
            <CardDescription>Selection controls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Dropdown
                label="Select Option"
                options={dropdownOptions}
                value={dropdownValue}
                onChange={setDropdownValue}
                searchable
                placeholder="Choose an option"
              />
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={setSelectedDate}
              />
            </div>
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
              <p className="text-neutral-600">
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
              <p className="text-neutral-600">
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
              <p className="text-neutral-600">This card is clickable!</p>
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
            variant: 'primary'
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
          <p className="text-neutral-700">
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
          <p className="text-neutral-700">
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
          <p className="text-neutral-700">
            This is a bottom sheet that slides up from the bottom.
          </p>
          <Button onClick={() => setIsBottomSheetOpen(false)}>Close Sheet</Button>
        </div>
      </BottomSheet>
    </div>
  )
}

export default App

