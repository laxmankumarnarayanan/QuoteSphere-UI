import React, { useState, useEffect, useRef } from 'react';

import Alert, { ErrorAlert, WarningAlert, SuccessAlert, InfoAlert } from './Alert';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import Modal from './Modal';

import { useToast, ToastProvider } from './ToastContext'; 

import TextInput from './TextInput';
import SelectInput from './SelectInput';
import Checkbox from './Checkbox';
import RadioGroup from './RadioGroup';
import TextareaInput from './TextareaInput';
import Toggle from './Toggle';
import Slider from './Slider';
import Tabs, { Tab } from './Tabs'; 
import Table, { Column } from './Table'; 
import Dashboard from './Dashboard';
import WorkflowProgress from './WorkflowProgress';
import MetricCard from './MetricCard';
import StatusOverview from './StatusOverview';
import Tooltip from './Tooltip';

import { User, Mail, Phone, Home, Settings, BarChartHorizontalBig, Download, Edit3, Trash2, PlusCircle, Eye } from 'lucide-react'; 


interface Person {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  department: string;
  salary: number;
  startDate: string;
}

const sampleTableData: Person[] = [
  { id: 1, name: 'Alice Wonderland', email: 'alice@example.com', role: 'Software Engineer', status: 'Active', department: 'Engineering', salary: 95000, startDate: '2022-01-15' },
  { id: 2, name: 'Bob The Builder', email: 'bob@example.com', role: 'Project Manager', status: 'Active', department: 'Product', salary: 105000, startDate: '2021-05-20' },
  { id: 3, name: 'Charlie Chaplin', email: 'charlie@example.com', role: 'UX Designer', status: 'On Leave', department: 'Design', salary: 88000, startDate: '2023-03-01' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'QA Tester', status: 'Inactive', department: 'Engineering', salary: 76000, startDate: '2022-07-10' },
  { id: 5, name: 'Edward Scissorhands', email: 'edward@example.com', role: 'DevOps Engineer', status: 'Active', department: 'Operations', salary: 110000, startDate: '2020-11-05' },
  { id: 6, name: 'Fiona Gallagher', email: 'fiona@example.com', role: 'Product Owner', status: 'Active', department: 'Product', salary: 115000, startDate: '2019-08-12' },
  { id: 7, name: 'George Costanza', email: 'george@example.com', role: 'Marketing Specialist', status: 'On Leave', department: 'Marketing', salary: 72000, startDate: '2023-01-20' },
  { id: 8, name: 'Harry Potter', email: 'harry@example.com', role: 'Data Scientist', status: 'Active', department: 'Analytics', salary: 120000, startDate: '2022-09-01' },
];

const tableColumns: Column<Person>[] = [
  { key: 'name', header: 'Name', sortable: true, width: '200px' },
  { key: 'email', header: 'Email', sortable: true, width: '220px' },
  { key: 'department', header: 'Department', sortable: true, width: '150px' },
  { key: 'role', header: 'Role', sortable: true, width: '180px' },
  { key: 'status', header: 'Status', dataType: 'status', sortable: true, width: '120px', align: 'center' }, 
  { key: 'salary', header: 'Salary', dataType: 'number', sortable: true, align: 'right', width: '120px', accessor: (row) => `$${row.salary.toLocaleString()}`},
];


const sampleWorkflowStages = [
    { id: 's1', name: 'Application Received', status: 'completed' as const, approvedAt: '2024-05-01', notes: 'Initial documents verified.' },
    { id: 's2', name: 'Credit Check', status: 'completed' as const, approvedBy: 'AutoSystem', approvedAt: '2024-05-02', notes: 'Credit score: 750' },
    { id: 's3', name: 'Underwriting Review', status: 'current' as const, expectedDate: '2024-05-10', notes: 'Awaiting final review by underwriter.' },
    { id: 's4', name: 'Loan Offer Sent', status: 'pending' as const, expectedDate: '2024-05-15' },
    { id: 's5', name: 'Client Acceptance', status: 'pending' as const, expectedDate: '2024-05-20' },
    { id: 's6', name: 'Disbursement', status: 'pending' as const, expectedDate: '2024-05-25' },
];
const sampleDelayedWorkflowStages = [
    { ...sampleWorkflowStages[0] },
    { ...sampleWorkflowStages[1], status: 'delayed' as const, notes: 'System error, re-processing.' , expectedDate: '2024-05-05'},
    { ...sampleWorkflowStages[2], status: 'pending' as const },
];


const AllComponentsPageContent: React.FC = () => {
  const [isGenericModalOpen, setIsGenericModalOpen] = useState(false);
  const { addToast } = useToast();
  const nameInputRef = useRef<HTMLInputElement>(null); 

  
  const [textInputValue, setTextInputValue] = useState('John Doe');
  const [emailInputValue, setEmailInputValue] = useState('');
  const [phoneInputValue, setPhoneInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('ca');
  const countryOptions = [
    { value: '', label: 'Select a country', disabled: true },
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'gb', label: 'United Kingdom' },
    { value: 'au', label: 'Australia (Disabled)', disabled: true },
  ];
  const [isChecked, setIsChecked] = useState(true);
  const [radioValue, setRadioValue] = useState('premium');
  const radioOptions = [
    { id: 'r_prem', value: 'premium', label: 'Premium Plan', description: 'All features, priority support.' },
    { id: 'r_std', value: 'standard', label: 'Standard Plan', description: 'Core features, email support.' },
    { id: 'r_basic', value: 'basic', label: 'Basic (Disabled)', description: 'Limited access.', disabled: true },
  ];
  const [textareaValue, setTextareaValue] = useState('Initial text for the bio area.');
  const [isNotificationsToggled, setIsNotificationsToggled] = useState(false);
  const [isMarketingToggled, setIsMarketingToggled] = useState(true);
  const [loanAmount, setLoanAmount] = useState(25000);
  const [riskLevel, setRiskLevel] = useState(60);
  
  
  const handleEditRow = (row: Person) => addToast(`Editing ${row.name}`, 'info');
  const handleDeleteRow = (row: Person) => addToast(`Deleting ${row.name}`, 'error', 'Confirm Deletion?');


  useEffect(() => { 
    if (isGenericModalOpen) {
        setTimeout(() => nameInputRef.current?.focus(), 100); 
    }
  }, [isGenericModalOpen]);

  return (
    <div className="p-4 sm:p-6 md:p-10 bg-slate-100 min-h-screen">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-slate-800">UI Component Showcase</h1>
        <p className="text-lg text-slate-600 mt-2">A comprehensive suite of reusable React components for our application.</p>
      </header>

 
      <section className="mb-12 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-slate-700 mb-6 border-b pb-3">Alerts</h2>
        <div className="space-y-4">
          <SuccessAlert title="Success!" message="Your profile has been updated successfully." isDismissible/>
          <ErrorAlert title="Update Failed" message="Could not save changes. Please try again." isDismissible />
          <WarningAlert title="Attention Required" message="Your session is about to expire in 5 minutes." />
          <InfoAlert message="Our new mobile app is now available for download on iOS and Android." />
        </div>
      </section>

    
      <section className="mb-12 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-slate-700 mb-6 border-b pb-3">Buttons</h2>
        <div className="flex flex-wrap items-start gap-4">
          <PrimaryButton onClick={() => addToast('Primary button clicked!', 'success')}>Primary</PrimaryButton>
          <SecondaryButton onClick={() => addToast('Secondary button action.', 'info')}>Secondary</SecondaryButton>
          <PrimaryButton size="sm" isLoading>Loading SM</PrimaryButton>
          <SecondaryButton size="lg" disabled>Disabled LG</SecondaryButton>
          <PrimaryButton className="bg-red-600 hover:bg-red-700 focus:ring-red-500 from-red-500 to-rose-500"><Trash2 size={16} className="mr-2"/> Delete</PrimaryButton>
          <SecondaryButton className="border-green-500 text-green-500 hover:bg-green-50 hover:border-green-600"><PlusCircle size={16} className="mr-2"/> Add New</SecondaryButton>
        </div>
      </section>
      

       <section className="mb-12 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-slate-700 mb-6 border-b pb-3">Tooltips</h2>
        <div className="flex flex-wrap items-center gap-8 pt-4">
            <Tooltip content="View user details">
                <PrimaryButton size="sm" icon={<User size={16}/>}>User Profile</PrimaryButton>
            </Tooltip>
            <Tooltip content="This action is permanent!" position="right">
                <SecondaryButton className="border-red-500 text-red-500 hover:bg-red-50"><Trash2 size={16}/></SecondaryButton>
            </Tooltip>
             <Tooltip content={<span>Edit your <strong>account settings</strong>. Click here!</span>} position="bottom">
                <span className="text-brand-600 cursor-help border-b border-dashed border-brand-600">Hover for rich tooltip</span>
            </Tooltip>
             <Tooltip content="Download report (PDF)" position="top">
                <button className="p-2 rounded-full hover:bg-slate-100 text-slate-600"><Download size={20}/></button>
            </Tooltip>
        </div>
      </section>


      <section className="mb-12 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-slate-700 mb-6 border-b pb-3">Modals</h2>
        <PrimaryButton onClick={() => setIsGenericModalOpen(true)}>Open Form Modal</PrimaryButton>
        <Modal
            isOpen={isGenericModalOpen}
            onClose={() => setIsGenericModalOpen(false)}
            title="Create New User"
            size="lg"
            initialFocus={nameInputRef} 
        >
          <form onSubmit={(e) => {e.preventDefault(); addToast('Form Submitted (Demo)', 'success'); setIsGenericModalOpen(false);}} className="space-y-5">
            <TextInput ref={nameInputRef} id="modal-name" label="Full Name" value="" onChange={() => {}} placeholder="Enter full name" leadingIcon={<User size={16}/>} required/>
            <TextInput id="modal-email" type="email" label="Email Address" value="" onChange={() => {}} placeholder="you@example.com" leadingIcon={<Mail size={16}/>} required/>
            <SelectInput id="modal-role" label="Role" value="" onChange={() => {}} options={[{value: 'admin', label: 'Administrator'}, {value: 'editor', label: 'Editor'}, {value: 'viewer', label: 'Viewer'}]} placeholder="Select a role"/>
            <div className="flex justify-end space-x-3 pt-3">
              <SecondaryButton type="button" onClick={() => setIsGenericModalOpen(false)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit">Save User</PrimaryButton>
            </div>
          </form>
        </Modal>
      </section>


      <section className="mb-12 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-slate-700 mb-6 border-b pb-3">Form Inputs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
          <TextInput id="page-name" label="Full Name" value={textInputValue} onChange={setTextInputValue} placeholder="e.g., Jane Doe" leadingIcon={<User size={16}/>} required/>
          <TextInput id="page-email" type="email" label="Email" value={emailInputValue} onChange={setEmailInputValue} placeholder="you@company.com" leadingIcon={<Mail size={16}/>} error={emailInputValue && !emailInputValue.includes('@') ? "Invalid email" : undefined}/>
          <TextInput id="page-phone" type="tel" label="Phone Number" value={phoneInputValue} onChange={setPhoneInputValue} placeholder="(123) 456-7890" leadingIcon={<Phone size={16}/>} />
          <SelectInput id="page-country" label="Country of Residence" value={selectValue} onChange={setSelectValue} options={countryOptions} placeholder="Select your country" required allowClear/>
          
          <div className="md:col-span-2 mt-4">
            <TextareaInput id="page-bio" label="Brief Bio" value={textareaValue} onChange={setTextareaValue} placeholder="Tell us about yourself..." rows={3} maxLength={200} showCharCount/>
          </div>

          <div className="md:col-span-2 mt-4">
            <RadioGroup name="planType" label="Subscription Plan" options={radioOptions} selectedValue={radioValue} onChange={setRadioValue} layout="grid" gridCols={2} required/>
          </div>

          <div className="space-y-3 mt-4">
            <h3 className="text-sm font-medium text-slate-600 col-span-full">Preferences:</h3>
            <Checkbox id="page-terms" label={<span>I agree to the <a href="#" className="text-brand-600 hover:underline">Terms and Conditions</a></span>} checked={isChecked} onChange={setIsChecked} required/>
            <Toggle id="page-notifications" label="Enable Email Notifications" checked={isNotificationsToggled} onChange={setIsNotificationsToggled} />
            <Toggle id="page-marketing" label="Receive Marketing Updates" checked={isMarketingToggled} onChange={setIsMarketingToggled} size="sm" labelPosition="left"/>
          </div>
          <div className="space-y-1 mt-4">
             <Slider id="page-loan" label="Loan Amount" value={loanAmount} onChange={setLoanAmount} min={5000} max={100000} step={1000} valuePrefix="$" showMinMaxLabels/>
             <Slider id="page-risk" label="Investment Risk Tolerance" value={riskLevel} onChange={setRiskLevel} valueSuffix="%" warning={riskLevel > 80 ? "High risk selected" : undefined} showValueTooltip="always"/>
          </div>
        </div>
      </section>

      <section className="mb-12 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-slate-700 mb-6 border-b pb-3">Tabs</h2>
        <Tabs defaultTabId="profile" variant="pills">
          <Tab id="profile" label="Profile" icon={<User size={16}/>}>
            <p className="text-slate-600 p-4">Profile information goes here. Users can view and edit their personal details, preferences, and security settings.</p>
          </Tab>
          <Tab id="account" label="Account Settings" icon={<Settings size={16}/>}>
            <p className="text-slate-600 p-4">Account settings content. Manage billing, subscriptions, and connected accounts.</p>
          </Tab>
          <Tab id="notifications" label="Notifications (Disabled)" icon={<BarChartHorizontalBig size={16}/>} disabled>
            <p className="text-slate-600 p-4">Notification preferences and history.</p>
          </Tab>
        </Tabs>
      </section>
      
      
      <section className="mb-12 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-slate-700 mb-6 border-b pb-3">Dashboard Elements</h2>
          <Dashboard /> 
      </section>

      
      <section className="mb-12 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-slate-700 mb-6 border-b pb-3">Workflow Progress</h2>
        <h3 className="text-md font-medium text-slate-600 mb-4">Standard Workflow:</h3>
        <WorkflowProgress stages={sampleWorkflowStages} />
        <h3 className="text-md font-medium text-slate-600 mt-8 mb-4">Delayed Workflow Example:</h3>
        <WorkflowProgress stages={sampleDelayedWorkflowStages} />
      </section>
    
      <section className="mb-12">
        <Table<Person>
          title="Employee Directory"
          columns={tableColumns}
          data={sampleTableData}
          enableRowSelection
          enablePagination
          pageSize={5}
          renderTableActions={() => (
            <PrimaryButton size="sm" onClick={() => addToast('Exporting data...', 'info')}>
                <Download size={16} className="mr-2"/> Export
            </PrimaryButton>
          )}
          renderRowActions={(row) => (
            <div className="flex items-center justify-end space-x-2">
                <Tooltip content="View Details" position="top"><button className="p-1.5 text-slate-500 hover:text-brand-600 rounded-md hover:bg-brand-100"><Eye size={16}/></button></Tooltip>
                <Tooltip content="Edit User" position="top"><button onClick={() => handleEditRow(row)} className="p-1.5 text-slate-500 hover:text-green-600 rounded-md hover:bg-green-100"><Edit3 size={16}/></button></Tooltip>
                <Tooltip content="Delete User" position="top"><button onClick={() => handleDeleteRow(row)} className="p-1.5 text-slate-500 hover:text-red-600 rounded-md hover:bg-red-100"><Trash2 size={16}/></button></Tooltip>
            </div>
          )}
          onRowClick={(row) => addToast(`Clicked on ${row.name}`, 'info', 'Row Clicked')}
        />
      </section>

    </div>
  );
};


const AllComponentsPageWithToast: React.FC = () => (
  <ToastProvider>
    <AllComponentsPageContent />
  </ToastProvider>
);

export default AllComponentsPageWithToast;