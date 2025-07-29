// MainWork.tsx
import { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

const PAGE_SIZE = 12;

export default function MainWork() {
  const [data, setData] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [first, setFirst] = useState(0);
  const [selectedRows, setSelectedRows] = useState<{ [id: number]: Artwork }>({});
  const [inputValue, setInputValue] = useState("");
  const op = useRef<OverlayPanel>(null);

  const currentPage = first / PAGE_SIZE + 1;

  useEffect(() => {
    fetchPage(currentPage);
  }, [first]);

  const fetchPage = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${PAGE_SIZE}&fields=id,title,place_of_origin,artist_display,inscriptions,date_start,date_end`
      );
      const json = await res.json();
      setData(json.data);
      setTotalRecords(json.pagination.total);
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    const count = parseInt(inputValue);
    if (!isNaN(count) && count > 0) {
      const newSelected = { ...selectedRows };
      let remaining = count;

      const selectRows = async (page: number) => {
        const res = await fetch(
          `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${PAGE_SIZE}&fields=id,title,place_of_origin,artist_display,inscriptions,date_start,date_end`
        );
        const json = await res.json();
        for (const item of json.data) {
          if (remaining <= 0) break;
          newSelected[item.id] = item;
          remaining--;
        }
        if (remaining > 0 && json.pagination.current_page < json.pagination.total_pages) {
          await selectRows(page + 1);
        } else {
          setSelectedRows(newSelected);
        }
      };

      selectRows(1);
      op.current?.hide();
    }
  };

  const ArrowWithOverlay = (
    <span
      className="cursor-pointer mr-2"
      onClick={(e) => op.current?.toggle(e)}
    >
      <FontAwesomeIcon icon={faChevronDown} />
    </span>
  );

  const overlayContent = (
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
  );

  return (
    <div className="p-4">

      <div className="mb-4 p-3 border rounded bg-white shadow-sm">
        <h2 className="text-lg font-semibold">About Me</h2>
        <p><strong>Name:</strong> Vikash Sharma</p>
        <p><strong>Email:</strong> vikash.sharma1761@gmail.com</p>
        <p><strong>Portfolio:</strong> <a href="https://vikash-dev-h39y.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">vikash-dev</a></p>
      </div>

      <OverlayPanel ref={op} className="z-50">
        {overlayContent}
      </OverlayPanel>

      <DataTable
        value={data}
        paginator
        lazy
        rows={PAGE_SIZE}
        first={first}
        totalRecords={totalRecords}
        loading={loading}
        onPage={(e) => setFirst(e.first ?? 0)}
        dataKey="id"
        selectionMode="multiple"
        selection={Object.values(selectedRows)}
        onSelectionChange={(e) => {
          const selected = e.value as Artwork[];
          const updated: { [id: number]: Artwork } = {};
          selected.forEach((item) => (updated[item.id] = item));
          setSelectedRows(updated);
        }}
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3em" }} />
        <Column
          field="title"
          header={
            <div className="flex items-center">
              {ArrowWithOverlay}
              Title
            </div>
          }
        />
        <Column field="place_of_origin" header="Place of Origin" />
        <Column field="artist_display" header="Artist Display" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Date" />
        <Column field="date_end" header="End Date" />
      </DataTable>
    </div>
  );
}
