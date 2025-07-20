import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
  allowClear?: boolean;
  leadingIcon?: React.ReactNode;
}

const SelectInput: React.FC<SelectInputProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  error,
  placeholder,
  className,
  allowClear = false,
  leadingIcon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find(opt => opt.value === value);
  const displayValue = selectedOption?.label || '';
  const hasValue = !!value;
  const isLabelFloating = isFocused || hasValue || (placeholder && !isFocused && !hasValue);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => !disabled && setIsOpen(!isOpen);
  const handleSelectOption = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    containerRef.current?.focus(); 
  };
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
  };
  const handleBlur = () => setTimeout(() => !isOpen && setIsFocused(false), 150);
  const handleFocus = () => setIsFocused(true);
  const effectiveOptions = placeholder ? [{ value: '', label: placeholder, disabled: true }, ...options] : options;

  return (
    <div className={`relative ${className || ''} mb-2`} ref={containerRef}> 
      <div
        className={`
          relative border rounded-lg transition-all duration-200 ease-in-out group flex items-center
          ${disabled ? 'bg-slate-100 cursor-not-allowed' : 'bg-white hover:border-slate-400'}
          ${error ? 'border-red-500 hover:border-red-600' :
            (isFocused || isOpen) ? 'border-brand-500 ring-1 ring-brand-500 hover:border-brand-600' :
            'border-slate-300'}
        `}
      >
        {leadingIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 pr-2 flex items-center pointer-events-none text-slate-400 peer-focus:text-brand-500">
            {React.cloneElement(leadingIcon as React.ReactElement, { className: 'w-5 h-5' })}
          </div>
        )}
        <button
          type="button"
          id={id}
          onClick={handleToggle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`
            peer block w-full text-sm text-left appearance-none outline-none rounded-lg bg-transparent
            ${leadingIcon ? 'pl-11' : 'px-3.5'} pr-10
            ${isLabelFloating ? 'pt-6 pb-2' : 'py-3.5'} 
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            ${!hasValue && placeholder ? 'text-slate-400' : 'text-slate-800'}
          `}
          aria-labelledby={`${id}-label`}
        >
          {displayValue || <span className="text-slate-400">{placeholder || " "}</span>}
        </button>
         <label
          id={`${id}-label`}
          htmlFor={id}
          onClick={handleToggle}
          className={`
            absolute text-sm left-0 transition-all duration-200 ease-in-out pointer-events-none
            transform origin-[0]
            ${leadingIcon ? 'pl-11' : 'pl-3.5'}
            ${error ? 'text-red-500' : (isFocused || isOpen) ? 'text-brand-500' : 'text-slate-500'}
            ${isLabelFloating ? '-translate-y-3 scale-[0.8] top-3' : 'scale-100 top-1/2 -translate-y-1/2'}
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center"> 
          {allowClear && hasValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-slate-400 hover:text-slate-600 pointer-events-auto mr-1 rounded-full hover:bg-slate-100"
              aria-label="Clear selection" tabIndex={-1}
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 pointer-events-none ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && !disabled && (
        <ul
          ref={listboxRef} tabIndex={-1} role="listbox" aria-labelledby={`${id}-label`}
          className="absolute z-20 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none animate-fade-in-sm py-1"
        >
          {effectiveOptions.filter(opt => !opt.disabled || opt.value === '').map((option, index) => (
            <li
              key={option.value || `opt-${index}`} role="option" aria-selected={value === option.value}
              aria-disabled={option.disabled && option.value !== ''}
              onClick={() => !(option.disabled && option.value !== '') && handleSelectOption(option.value)}
              onMouseDown={(e) => e.preventDefault()}
              className={`px-3.5 py-2.5 text-sm ${option.disabled && option.value !== '' ? 'text-slate-400 cursor-not-allowed bg-slate-50' : value === option.value ? 'bg-brand-100 text-brand-700 font-medium' : 'text-slate-700 hover:bg-brand-50 hover:text-brand-600 cursor-pointer'}`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="mt-1.5 text-xs text-red-600 px-1">{error}</p>}
    </div>
  );
};
export default SelectInput;