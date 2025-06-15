// /mnt/data/banking-ui-components/Showcase.tsx
import React, { useState } from "react";
import Alert from "./Alert";
import Warning from "./Warning";
import RadioButtonGroup from "./RadioButtonGroup";
import ModalForm from "./ModalForm";
import Slider from "./Slider";
import StatusBadge from "./StatusBadge";
import Table from "./Table";
import Tabs from "./Tabs";
import TextareaInput from "./TextareaInput";
import TextInput from "./TextInput";
import Toggle from "./Toggle";

const Showcase: React.FC = () => {
  // State for the Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [toggleState, setToggleState] = useState(false);
  const [textareaValue, setTextareaValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [radioValue, setRadioValue] = useState("option1");

  // Table Sample Data
  const tableColumns = ["Name", "Email", "Status"];
  const tableData = [
    { Name: "John Doe", Email: "john@example.com", Status: "active" },
    { Name: "Jane Doe", Email: "jane@example.com", Status: "inactive" },
  ];

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-purple-600">UI Components Showcase</h1>

      <section>
        <h2 className="font-semibold text-lg mb-2">Alerts</h2>
        <Alert type="success" message="This is a success alert!" />
        <Warning message="This is a warning alert!" />
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">Radio Buttons</h2>
        <RadioButtonGroup
          title="Choose an option"
          options={[
            { label: "Option 1", value: "option1" },
            { label: "Option 2", value: "option2" },
          ]}
          selectedValue={radioValue}
          onChange={setRadioValue}
        />
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">Modal Form</h2>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Open Modal
        </button>
        <ModalForm 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          title="Sample Modal Form" 
          onSubmit={() => alert("Form Submitted")}
        >
          <TextInput 
            label="Name" 
            value={textValue} 
            onChange={setTextValue} 
          />
        </ModalForm>
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">Slider</h2>
        <Slider value={sliderValue} onChange={setSliderValue} label="Volume" />
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">Status Badge</h2>
        <StatusBadge status="active" />
        <StatusBadge status="inactive" />
        <StatusBadge status="pending" />
        <StatusBadge status="error" />
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">Table</h2>
        <Table columns={tableColumns} data={tableData} />
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">Tabs</h2>
        <Tabs 
          tabs={[
            { label: "Tab 1", content: <p>This is Tab 1 content</p> },
            { label: "Tab 2", content: <p>This is Tab 2 content</p> }
          ]}
        />
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">Textarea Input</h2>
        <TextareaInput 
          label="Your Message" 
          value={textareaValue} 
          onChange={setTextareaValue} 
        />
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">Text Input</h2>
        <TextInput 
          label="Your Name" 
          value={textValue} 
          onChange={setTextValue} 
        />
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">Toggle</h2>
        <Toggle enabled={toggleState} onChange={setToggleState} label="Enable Notifications" />
      </section>
    </div>
  );
};

export default Showcase;
