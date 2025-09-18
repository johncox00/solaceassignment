"use client";

interface PaginationProps {
  page: number;
  setNext: () => void;
  setPrevious: () => void;
  setPer: (per: number) => void;
  perPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export default function Pagination ({
  page,
  setNext,
  setPrevious,
  setPer,
  perPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
}: PaginationProps) {
  const buttonStyle = "text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
  return (
  <div className="mt-4">
    <span className="mr-2">Per Page</span>
    <select onChange={(e) => setPer(parseInt(e.target.value))} value={perPage} className="border border-gray-300 rounded-lg p-2 mr-2">
      <option value="10">10</option>
      <option value="20">20</option>
      <option value="50">50</option>
      <option value="100">100</option>
    </select>
    <button onClick={setPrevious} disabled={!hasPreviousPage} className={buttonStyle}>{"<<"}</button>
    <span className="mr-2 ml-2">{page} of {totalPages}</span>
    <button onClick={setNext} disabled={!hasNextPage} className={buttonStyle}>{">>"}</button>
  </div>
);
}
