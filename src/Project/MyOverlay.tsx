import { OverlayPanel } from "primereact/overlaypanel";
import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

interface MyOverlayProps {
  data: Artwork[];
  selectedRows: Artwork[];
  onAutoSelect: (count: number) => void;
}

export default function MyOverlay({ data, onAutoSelect }: MyOverlayProps) {
  const op = useRef<OverlayPanel>(null);
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    const count = parseInt(inputValue);
    if (!isNaN(count) && count > 0 && count <= data.length) {
      onAutoSelect(count);
      op.current?.hide();
    }
  };

  return (
    <>
     <div className="mb-4 p-3 border rounded bg-white shadow-sm">
        <h2 className="text-lg font-semibold">About Me</h2>
        <p><strong>Name:</strong> Vikash Sharma</p>
        <p><strong>Email:</strong> vikash.sharma1761@gmail.com</p>
        <p><strong>Portfolio:</strong> <a href="https://vikash-dev" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">vikash-dev</a></p>
      </div>

      <div className="flex items-center gap-2">
        <span
          onClick={(e) => op.current?.toggle(e)}
          className="cursor-pointer text-gray-600 hover:text-black"
        >
          <FontAwesomeIcon icon={faChevronDown} />
        </span>

        <OverlayPanel ref={op} className="z-50">
          <div className="flex flex-col gap-2 w-[200px] p-2">
            <input
              type="number"
              className="border px-2 py-1 rounded"
              placeholder="Enter number of rows"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button label="Submit" onClick={handleSubmit} />
          </div>
        </OverlayPanel>
        </div>
    </>
  );
}