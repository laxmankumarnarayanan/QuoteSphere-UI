export interface SelectOption {
  value: string;
  label: string;
}

export interface InputBaseProps {
  label: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  className?: string;
  id?: string;
}