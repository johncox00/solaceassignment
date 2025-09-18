"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "./components/pagination";
import { IAdvocate, IAdvocatesResponse } from "@/types";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [advocates, setAdvocates] = useState<IAdvocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<IAdvocate[]>([]);


  // Get initial values from URL params or defaults
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

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

    router.push(`/?${params.toString()}`, { scroll: false });
  };
  useEffect(() => {
    fetchAdvocates();
  }, [page, limit]);
  
  const fetchAdvocates = () => {
    const urlParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
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

  const onChange = (e) => {
    const searchTerm = e.target.value;

    document.getElementById("search-term").innerHTML = searchTerm;

    console.log("filtering advocates...");
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.includes(searchTerm) ||
        advocate.lastName.includes(searchTerm) ||
        advocate.city.includes(searchTerm) ||
        advocate.degree.includes(searchTerm) ||
        advocate.specialties.includes(searchTerm) ||
        advocate.yearsOfExperience.includes(searchTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input style={{ border: "1px solid black" }} onChange={onChange} />
        <button onClick={onClick}>Reset Search</button>
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
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
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
                  {advocate.specialties.map((s) => (
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
