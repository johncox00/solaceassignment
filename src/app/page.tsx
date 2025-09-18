"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "./components/pagination";
import { IAdvocate, IAdvocatesResponse } from "@/types";
import Button from "./components/button";
import UpArrowIcon from "./components/upArrow";
import DownArrowIcon from "./components/downArrow";

const HEADERS = ["First Name", "Last Name", "City", "Degree", "Specialties", "Years of Experience", "Phone Number"];
const NO_SORT_HEADERS = ["Specialties", "Phone Number"];

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [advocates, setAdvocates] = useState<IAdvocate[]>([]);


  // Get initial values from URL params or defaults
  const page: number = parseInt(searchParams.get("page") || "1");
  const limit:number = parseInt(searchParams.get("limit") || "10");
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
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>
          {
            searchTerm && !timer ?
              <span>Searching for: {searchTerm} | ({totalCount} results)</span>
            :
            <span>Search</span>
          }
        </p>
        <input style={{ border: "1px solid black" }} onChange={searchAdvoctes} value={searchTerm} />
        {timer ? 
          <>
            <Button onClick={() => clearTimeout(timer)}>Cancel</Button>
            <span>Searching...</span>
          </>
        : 
          <Button onClick={clearSearch}>Reset</Button>
        }
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
      <br />
      <br />
      <table>
        <thead>
          <tr>
          {renderHeaders()}
          </tr>
        </thead>
        <tbody>
          {advocates.map((advocate: IAdvocate) => {
            return (
              <tr key={`advocate-${advocate.id}`}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.sort().map((s) => (
                    <div key={`${advocate.id}-${s}`}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
