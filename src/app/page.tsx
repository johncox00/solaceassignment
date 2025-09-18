"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "./components/pagination";
import { IAdvocate, IAdvocatesResponse } from "@/types";
import UpArrowIcon from "./components/upArrow";
import DownArrowIcon from "./components/downArrow";
import EmptyState from "./components/emptyState";
import parsePhoneNumber from 'libphonenumber-js'
import { LIMITS } from "./components/pagination";

const HEADERS = ["First Name", "Last Name", "City", "Degree", "Specialties", "Years of Experience", "Phone Number"];
const NO_SORT_HEADERS = ["Specialties", "Phone Number"];

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [advocates, setAdvocates] = useState<IAdvocate[]>([]);


  // Get initial values from URL params or defaults
  const page: number = parseInt(searchParams.get("page") || "1");
  let limit:number = parseInt(searchParams.get("limit") || "10");
  limit = limit > 100 ? 100 : limit;
  limit = limit < 10 ? 10 : limit;
  limit = LIMITS.includes(limit) ? limit : 10;
  const search: string = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "lastName";
  const sortOrder = searchParams.get("sortOrder") || "asc";

  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(search);

  // Update URL parameters
  const updateURL = (newParams: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    if (newParams.search !== undefined || newParams.sortBy !== undefined || newParams.sortOrder !== undefined) {
      params.set("page", "1");
    }

    router.push(`/?${params.toString()}`, { scroll: false });
  };
  useEffect(() => {
    fetchAdvocates();
  }, [page, limit, search, sortBy, sortOrder]);
  
  const fetchAdvocates = () => {
    const urlParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search: searchTerm,
      sortBy: sortBy,
      sortOrder: sortOrder,
    });

    fetch(`/api/advocates?${urlParams.toString()}`).then((response: Response) => {
      response.json().then((jsonResponse: IAdvocatesResponse) => {
        setAdvocates(jsonResponse.data);
        setTotalCount(jsonResponse.totalCount);
        setTotalPages(jsonResponse.totalPages);
        setHasNextPage(jsonResponse.hasNextPage);
        setHasPreviousPage(jsonResponse.hasPreviousPage);
      });
    });
  };

  const setPage = (newPage: number) => {
    updateURL({ page: newPage });
  };

  const setLimit = (newLimit: number) => {
    updateURL({ limit: newLimit });
  };

  const searchAdvoctes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchTerm(q);
    if (q === "") {
      clearSearch();
    } else {
      if (timer) {
        clearTimeout(timer);
      }
      setTimer(setTimeout(() => {
        updateURL({ search: q });
        setTimer(null);
      }, 1500));
    }
  };

  const clearSearch = () => {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setSearchTerm("");
    updateURL({ search: "" });
  };

  const sortAdvocates = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newSortBy = e.currentTarget.value;
    const newSortOrder = newSortBy === sortBy 
      ? (sortOrder === "asc" ? "desc" : "asc")
      : "asc";

    updateURL({ sortBy: newSortBy, sortOrder: newSortOrder });
  };

  const camelize = (str: string) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  };

  const renderHeaders = () => {
    return HEADERS.map((header) => {
      if (NO_SORT_HEADERS.includes(header)) {
        return <th key={header}>{header}</th>;
      }
      if (sortBy === camelize(header)) {
        return (
          <th key={header}>
            <button onClick={sortAdvocates} value={camelize(header)} className="flex flex-row items-center gap-1">
                <span>{header}</span>
                {sortOrder === "asc" ? <UpArrowIcon /> : <DownArrowIcon />}
            </button>
          </th>
        );
      }
      return (
        <th key={header}>
          <button onClick={sortAdvocates} value={camelize(header)}>
            {header}
          </button>
        </th>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Solace Advocates</h1>
          <p className="mt-2 text-gray-600">Find and connect with someone that can help.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700">
        {
              searchTerm && !timer ?
                <span>Searching for: {searchTerm} | ({totalCount} results)</span>
              :
              <span>
                {timer? "Searching..." : "Search"}
              </span>
            }
        </label>
        <div className="relative">
          
          <input
            type="text"
            name="search"
            id="search"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md border-gray-500 border-4 p-2"
            value={searchTerm}
            onChange={searchAdvoctes}
          />
          {searchTerm && (
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={clearSearch}>
              &times;
            </button>
          )}
        </div>
        
        <Pagination 
          setNext={() => setPage(page + 1)} 
          setPrevious={() => setPage(page - 1)} 
          page={page} 
          setPer={setLimit} 
          perPage={limit} 
          totalPages={totalPages} 
          hasNextPage={hasNextPage} 
          hasPreviousPage={hasPreviousPage}
        />
      </div>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
            {renderHeaders()}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {advocates.map((advocate: IAdvocate) => {
              return (
                <tr className="border-b border-gray-200" key={advocate.id}>
                  <td className="p-4">{advocate.firstName}</td>
                  <td className="p-4">{advocate.lastName}</td>
                  <td className="p-4">{advocate.city}</td>
                  <td className="p-4">{advocate.degree}</td>
                  <td className="p-4">
                    {advocate.specialties.sort().map((s) => (
                      <div key={`${advocate.id}-${s}`}>{s}</div>
                    ))}
                  </td>
                  <td className="p-4">{advocate.yearsOfExperience}</td>
                  <td className="p-4">
                    {
                      advocate.phoneNumber && parsePhoneNumber(advocate.phoneNumber, 'US') ? 
                      parsePhoneNumber(advocate.phoneNumber, 'US')!.formatNational(): 
                      advocate.phoneNumber
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {advocates.length == 0 && !timer && <EmptyState title="No advocates found" message="Try adjusting your search criteria." />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Pagination 
            setNext={() => setPage(page + 1)} 
            setPrevious={() => setPage(page - 1)} 
            page={page} 
            setPer={setLimit} 
            perPage={limit} 
            totalPages={totalPages} 
            hasNextPage={hasNextPage} 
            hasPreviousPage={hasPreviousPage}
          />
        </div>
    </div>
  );
}
