"use client";

import Button from "./button";

interface IPaginationProps {
  page: number;
  setNext: () => void;
  setPrevious: () => void;
  setPer: (per: number) => void;
  perPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export const LIMITS = [10, 20, 50, 100];

export default function Pagination ({
  page,
  setNext,
  setPrevious,
  setPer,
  perPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
}: IPaginationProps) {
  return (
  <div className="mt-4">
    <span className="mr-2">Per Page</span>
    <select onChange={(e) => setPer(parseInt(e.target.value))} value={perPage} className="border border-gray-300 rounded-lg p-2 mr-2">
      {LIMITS.map((limit) => (
        <option value={limit} key={limit}>{limit}</option>
      ))}
    </select>
    <Button onClick={setPrevious} disabled={!hasPreviousPage}>{"<<"}</Button>
    <span className="mr-2 ml-2">{page} of {totalPages}</span>
    <Button onClick={setNext} disabled={!hasNextPage}>{">>"}</Button>
  </div>
);
}
