/**
 * TestInputs.tsx
 * A showcase page demonstrating various form input components with a clean, modern design.
 * Updated: Fixed adjacent JSX elements by wrapping them in a React Fragment
 */
import React, { useState } from 'react';
import TextInput from '../components/form/TextInput';
import SelectInput from '../components/form/SelectInput';
import Checkbox from '../components/form/Checkbox';
import RadioGroup from '../components/form/RadioGroup';
import TextareaInput from '../components/form/TextareaInput';
import Toggle from '../components/form/Toggle';
import Slider from '../components/form/Slider';
import Tabs from '../components/form/Tabs';
import Table from '../components/form/Table';
import Dashboard from '../components/dashboard/Dashboard';
import WorkflowProgress from '../components/workflow/WorkflowProgress';

const workflowStages = [
  {
    id: '1',
    name: 'Initial Review',
    approvedBy: 'John Smith',
    approvedAt: '2024-03-10',
  },
  {
    id: '2',
    name: 'Technical Check',
    approvedBy: 'Sarah Johnson',
    approvedAt: '2024-03-12',
  },
  {
    id: '3',
    name: 'Quality Review',
    isDelayed: true,
    expectedDate: '2024-03-15',
  },
  {
    id: '4',
    name: 'Final Approval',
    expectedDate: '2024-03-18',
  },
  {
    id: '5',
    name: 'Deployment',
    expectedDate: '2024-03-20',
  },
  {
    id: '6',
    name: 'Post-deployment Analysis',
    expectedDate: '2024-04-07'
  },
  {
    id: '7',
    name: 'Post Deployment Review',
    expectedDate: '2024-04-14'
  },
];

const TestInputs: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: '',
    gender: '',
    bio: '',
    age: 30,
    notifications: true,
    marketing: false,
    termsAccepted: false
  });

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [warnings, setWarnings] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Country options
  const countries = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' }
  ];

  // Gender options
  const genderOptions = [
    { id: 'male', value: 'male', label: 'Male' },
    { id: 'female', value: 'female', label: 'Female' },
    { id: 'other', value: 'other', label: 'Other' }
  ];

  // Update form data
  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Handle age warning
    if (field === 'age') {
      if (value > 50) {
        setWarnings(prev => ({ ...prev, age: 'Warning: you are selecting an age above 50 years' }));
      } else {
        setWarnings(prev => ({ ...prev, age: '' }));
      }
    }
    
    // Clear error when terms are accepted
    if (field === 'termsAccepted' && value === true) {
      setErrors(prev => ({ ...prev, terms: '' }));
    }
    // Show error when terms are unchecked
    else if (field === 'termsAccepted' && value === false) {
      setErrors(prev => ({ ...prev, terms: 'You must accept the terms' }));
    }
    // Clear other field errors on change
    else if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Email validation function
  const validateEmail = (email: string): string => {
    if (!email.trim()) {
      return 'Email is required';
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return 'Invalid email format';
    }
    return '';
  };

  // Handle blur for email field
  const handleEmailBlur = () => {
    setTouchedFields(prev => ({ ...prev, email: true }));
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors(prev => ({ ...prev, email: emailError }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.termsAccepted) {
      newErrors.terms = 'You must accept the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      alert('Form submitted successfully!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto min-h-[calc(100vh-4rem)]">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Dashboard</h1>
      <Dashboard />
      
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-12 mb-6">Form Components</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <Tabs
          tabs={[
            {
              id: 'personal',
              label: 'Personal Information',
              content: (
                <form onSubmit={handleSubmit} className="py-4">
                  <div className="space-y-4">
                    <TextInput
                      id="name"
                      label="Full Name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(value) => updateForm('name', value)}
                      error={errors.name}
                      required
                    />

                    <TextInput
                      id="email"
                      label="Email"
                      placeholder="Enter your email address"
                      type="email"
                      value={formData.email}
                      onChange={(value) => updateForm('email', value)}
                      onBlur={handleEmailBlur}
                      error={errors.email}
                      required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput
                        id="password"
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                        value={formData.password}
                        onChange={(value) => updateForm('password', value)}
                        error={errors.password}
                        required
                      />
                      
                      <TextInput
                        id="confirmPassword"
                        label="Confirm Password"
                        placeholder="Reenter your password"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(value) => updateForm('confirmPassword', value)}
                        error={errors.confirmPassword}
                        required
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-orange-500 text-white rounded-md hover:from-purple-600 hover:to-orange-600 transition-colors duration-200"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </form>
              ),
            },
            {
              id: 'contact',
              label: 'Contact Details',
              content: (
                <div className="py-4 space-y-4">
                  <TextInput
                    id="phone"
                    label="Phone"
                    placeholder="Enter your phone number"
                    type="tel"
                    value={formData.phone}
                    onChange={(value) => updateForm('phone', value)}
                    error={errors.phone}
                  />

                  <SelectInput
                    id="country"
                    label="Country"
                    value={formData.country}
                    onChange={(value) => updateForm('country', value)}
                    options={countries}
                    placeholder="Select your country"
                  />

                  <RadioGroup
                    name="gender"
                    label="Gender"
                    options={genderOptions}
                    selectedValue={formData.gender}
                    onChange={(value) => updateForm('gender', value)}
                    required
                  />
                </div>
              ),
            },
            {
              id: 'preferences',
              label: 'Preferences',
              content: (
                <div className="py-4 space-y-6">
                  <TextareaInput
                    id="bio"
                    label="Bio"
                    value={formData.bio}
                    onChange={(value) => updateForm('bio', value)}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />

                  <Slider
                    id="age"
                    label="Age"
                    value={formData.age}
                    onChange={(value) => updateForm('age', value)}
                    min={18}
                    max={100}
                    warning={warnings.age}
                    valueSuffix=" years"
                  />

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Notification Settings
                    </h3>

                    <Toggle
                      id="notifications"
                      label="Enable notifications"
                      checked={formData.notifications}
                      onChange={(checked) => updateForm('notifications', checked)}
                    />

                    <Toggle
                      id="marketing"
                      label="Receive marketing emails"
                      checked={formData.marketing}
                      onChange={(checked) => updateForm('marketing', checked)}
                      size="sm"
                    />
                  </div>

                  <div>
                    <Checkbox
                      id="terms"
                      label="I accept the terms and conditions"
                      checked={formData.termsAccepted}
                      onChange={(checked) => updateForm('termsAccepted', checked)}
                    />
                    {errors.terms && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.terms}</p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-orange-500 text-white rounded-md hover:from-purple-600 hover:to-orange-600 transition-colors duration-200"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
      
      <>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Personal Information
              </h2>

              <TextInput
                id="name"
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(value) => updateForm('name', value)}
                error={errors.name}
                required
              />

              <TextInput
                id="email"
                label="Email"
                placeholder="Enter your email address"
                type="email"
                value={formData.email}
                onChange={(value) => updateForm('email', value)}
                onBlur={handleEmailBlur}
                error={errors.email}
                required
              />

              <TextInput
                id="password"
                label="Password"
                placeholder="Enter your password"
                type="password"
                value={formData.password}
                onChange={(value) => updateForm('password', value)}
                error={errors.password}
                required
              />
              
              <TextInput
                id="confirmPassword"
                label="Confirm Password"
                placeholder="Reenter your password"
                type="password"
                value={formData.confirmPassword}
                onChange={(value) => updateForm('confirmPassword', value)}
                error={errors.confirmPassword}
                required
              />

              <TextInput
                id="phone"
                label="Phone"
                placeholder="Enter your phone number"
                type="tel"
                value={formData.phone}
                onChange={(value) => updateForm('phone', value)}
                error={errors.phone}
              />

              <SelectInput
                id="country"
                label="Country"
                value={formData.country}
                onChange={(value) => updateForm('country', value)}
                options={countries}
                placeholder="Select your country"
              />

              <div className="pt-2">
                <RadioGroup
                  name="gender"
                  label="Gender"
                  options={genderOptions}
                  selectedValue={formData.gender}
                  onChange={(value) => updateForm('gender', value)}
                  required
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Additional Information
              </h2>

              <TextareaInput
                id="bio"
                label="Bio"
                value={formData.bio}
                onChange={(value) => updateForm('bio', value)}
                placeholder="Tell us about yourself"
                rows={4}
              />

              <Slider
                id="age"
                label="Age"
                value={formData.age}
                onChange={(value) => updateForm('age', value)}
                min={18}
                max={100}
                warning={warnings.age}
                valueSuffix=" years"
              />

              <div className="space-y-2 pt-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferences
                </h3>

                <Toggle
                  id="notifications"
                  label="Enable notifications"
                  checked={formData.notifications}
                  onChange={(checked) => updateForm('notifications', checked)}
                />

                <Toggle
                  id="marketing"
                  label="Receive marketing emails"
                  checked={formData.marketing}
                  onChange={(checked) => updateForm('marketing', checked)}
                  size="sm"
                />
              </div>

              <div className="pt-2">
                <Checkbox
                  id="terms"
                  label="I accept the terms and conditions"
                  checked={formData.termsAccepted}
                  onChange={(checked) => updateForm('termsAccepted', checked)}
                />
                {errors.terms && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.terms}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-orange-500 text-white rounded-md hover:from-purple-600 hover:to-orange-600 transition-all duration-200"
            >
              Submit
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-white dark:bg-gray-800 rounded-md text-gray-700 dark:text-gray-200 border-2 border-transparent bg-gradient-to-r from-purple-500 to-orange-500 [background-clip:padding-box,border-box] [background-origin:border-box,border-box] [background-image:linear-gradient(white,white),linear-gradient(to_right,#6D28D9,#EA580C)] dark:[background-image:linear-gradient(#1f2937,#1f2937),linear-gradient(to_right,#6D28D9,#EA580C)] hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Secondary Action
            </button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8">
          <Tabs
            tabs={[
              {
                id: 'personal',
                label: 'Personal Information',
                content: (
                  <form onSubmit={handleSubmit} className="py-4">
                    <div className="space-y-4">
                      <TextInput
                        id="name"
                        label="Full Name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(value) => updateForm('name', value)}
                        error={errors.name}
                        required
                      />

                      <TextInput
                        id="email"
                        label="Email"
                        placeholder="Enter your email address"
                        type="email"
                        value={formData.email}
                        onChange={(value) => updateForm('email', value)}
                        onBlur={handleEmailBlur}
                        error={errors.email}
                        required
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextInput
                          id="password"
                          label="Password"
                          placeholder="Enter your password"
                          type="password"
                          value={formData.password}
                          onChange={(value) => updateForm('password', value)}
                          error={errors.password}
                          required
                        />
                        
                        <TextInput
                          id="confirmPassword"
                          label="Confirm Password"
                          placeholder="Reenter your password"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(value) => updateForm('confirmPassword', value)}
                          error={errors.confirmPassword}
                          required
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-orange-500 text-white rounded-md hover:from-purple-600 hover:to-orange-600 transition-all duration-200"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </form>
                ),
              },
              {
                id: 'contact',
                label: 'Contact Details',
                content: (
                  <div className="py-4 space-y-4">
                    <TextInput
                      id="phone"
                      label="Phone"
                      placeholder="Enter your phone number"
                      type="tel"
                      value={formData.phone}
                      onChange={(value) => updateForm('phone', value)}
                      error={errors.phone}
                    />

                    <SelectInput
                      id="country"
                      label="Country"
                      value={formData.country}
                      onChange={(value) => updateForm('country', value)}
                      options={countries}
                      placeholder="Select your country"
                    />

                    <RadioGroup
                      name="gender"
                      label="Gender"
                      options={genderOptions}
                      selectedValue={formData.gender}
                      onChange={(value) => updateForm('gender', value)}
                      required
                    />
                  </div>
                ),
              },
              {
                id: 'preferences',
                label: 'Preferences',
                content: (
                  <div className="py-4 space-y-6">
                    <TextareaInput
                      id="bio"
                      label="Bio"
                      value={formData.bio}
                      onChange={(value) => updateForm('bio', value)}
                      placeholder="Tell us about yourself"
                      rows={4}
                    />

                    <Slider
                      id="age"
                      label="Age"
                      value={formData.age}
                      onChange={(value) => updateForm('age', value)}
                      min={18}
                      max={100}
                      warning={warnings.age}
                      valueSuffix=" years"
                    />

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Notification Settings
                      </h3>

                      <Toggle
                        id="notifications"
                        label="Enable notifications"
                        checked={formData.notifications}
                        onChange={(checked) => updateForm('notifications', checked)}
                      />

                      <Toggle
                        id="marketing"
                        label="Receive marketing emails"
                        checked={formData.marketing}
                        onChange={(checked) => updateForm('marketing', checked)}
                        size="sm"
                      />
                    </div>

                    <div>
                      <Checkbox
                        id="terms"
                        label="I accept the terms and conditions"
                        checked={formData.termsAccepted}
                        onChange={(checked) => updateForm('termsAccepted', checked)}
                      />
                      {errors.terms && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.terms}</p>
                      )}
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-orange-500 text-white rounded-md hover:from-purple-600 hover:to-orange-600 transition-all duration-200"
                      >
                        Submit
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 bg-white dark:bg-gray-800 rounded-md text-gray-700 dark:text-gray-200 border-2 border-transparent bg-gradient-to-r from-purple-500 to-orange-500 [background-clip:padding-box,border-box] [background-origin:border-box,border-box] [background-image:linear-gradient(white,white),linear-gradient(to_right,#6D28D9,#EA580C)] dark:[background-image:linear-gradient(#1f2937,#1f2937),linear-gradient(to_right,#6D28D9,#EA580C)] hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                      >
                        Secondary Action
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 bg-white dark:bg-gray-800 rounded-md text-gray-700 dark:text-gray-200 border-2 border-transparent bg-gradient-to-r from-purple-500 to-orange-500 [background-clip:padding-box,border-box] [background-origin:border-box,border-box] [background-image:linear-gradient(white,white),linear-gradient(to_right,#6D28D9,#EA580C)] dark:[background-image:linear-gradient(#1f2937,#1f2937),linear-gradient(to_right,#6D28D9,#EA580C)] hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                      >
                        Secondary Action
                      </button>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8">
          <Table
            title="Employee Data"
            tabs={[
              {
                id: 'personal',
                label: 'Personal Info',
                columns: [
                  { key: 'id', header: 'ID', width: 100 },
                  { key: 'name', header: 'Name', width: 200 },
                  { key: 'email', header: 'Email', width: 250 },
                  { key: 'phone', header: 'Phone', width: 150 },
                  { key: 'department', header: 'Department', width: 200 },
                  { key: 'position', header: 'Position', width: 200 },
                  { key: 'startDate', header: 'Start Date', width: 150 },
                  { key: 'status', header: 'Status', width: 120, type: 'status' }
                ],
                data: Array(10).fill(null).map((_, i) => ({
                  id: `EMP${1000 + i}`,
                  name: `Employee ${i + 1}`,
                  email: `employee${i + 1}@example.com`,
                  phone: `+1 555-${100 + i}`,
                  department: ['Engineering', 'Marketing', 'Sales', 'HR'][i % 4],
                  position: ['Developer', 'Manager', 'Analyst', 'Specialist'][i % 4],
                  startDate: '2024-03-01',
                  status: ['Active', 'On Leave', 'Inactive', 'Maternity Leave', 'Remote'][i % 5]
                }))
              },
              {
                id: 'performance',
                label: 'Performance',
                columns: [
                  { key: 'id', header: 'ID', width: 100 },
                  { key: 'name', header: 'Name', width: 200 },
                  { key: 'q1Score', header: 'Q1 Score', width: 120 },
                  { key: 'q2Score', header: 'Q2 Score', width: 120 },
                  { key: 'q3Score', header: 'Q3 Score', width: 120 },
                  { key: 'q4Score', header: 'Q4 Score', width: 120 },
                  { key: 'avgScore', header: 'Average', width: 120 },
                  { key: 'rating', header: 'Rating', width: 150 }
                ],
                data: Array(10).fill(null).map((_, i) => ({
                  id: `EMP${1000 + i}`,
                  name: `Employee ${i + 1}`,
                  q1Score: Math.floor(Math.random() * 30 + 70),
                  q2Score: Math.floor(Math.random() * 30 + 70),
                  q3Score: Math.floor(Math.random() * 30 + 70),
                  q4Score: Math.floor(Math.random() * 30 + 70),
                  avgScore: Math.floor(Math.random() * 30 + 70),
                  rating: ['Excellent', 'Good', 'Average', 'Needs Improvement'][i % 4]
                }))
              }
            ]}
          />
        </div>
      </>
      
      <div className="mt-8 mb-16">
        <WorkflowProgress
          stages={workflowStages}
          currentStage={2}
        />
      </div>
    </div>
  );
};

export default TestInputs;