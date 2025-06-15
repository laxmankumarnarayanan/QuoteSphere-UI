import React, { useState } from 'react';
import Modal from '../layout/Modal';
import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';
import TextInput from './TextInput'; 

interface SampleModalFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const SampleModalForm: React.FC<SampleModalFormProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log({ name, email });
    alert('Form submitted! Check console.');
    onClose(); 
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Account">
      <form onSubmit={handleSubmit} className="space-y-6">
        <TextInput
          id="modal-name"
          label="Full Name"
          value={name}
          onChange={setName}
          placeholder="Enter your full name"
          required
        />
        <TextInput
          id="modal-email"
          label="Email Address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          required
        />
        <div className="flex flex-col sm:flex-row-reverse gap-3 pt-4">
          <PrimaryButton type="submit" className="w-full sm:w-auto">
            Create Account
          </PrimaryButton>
          <SecondaryButton type="button" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </SecondaryButton>
        </div>
      </form>
    </Modal>
  );
};

export default SampleModalForm;