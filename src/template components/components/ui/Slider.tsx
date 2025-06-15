import React from "react";

type SliderProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
};

const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label
}) => {
  return (
    <div className="flex flex-col space-y-2 mb-4">
      {label && <label className="text-gray-700 font-semibold">{label}</label>}
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full appearance-none h-3 bg-gray-200 rounded-full outline-none slider-thumb transition-colors duration-200"
        style={{
          background: `linear-gradient(to right, #6B46C1 ${((value - min) / (max - min)) * 100}%, #E2E8F0 ${((value - min) / (max - min)) * 100}%)`,
        }}
      />
      <div className="text-right text-sm font-medium text-gray-600">
        {value}
      </div>
    </div>
  );
};

export default Slider;
