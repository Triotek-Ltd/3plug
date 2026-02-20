import { fetchData } from "@/utils/Api";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const Search = () => {
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  // Extra options to append
  const extras = [{ name: "Settings", module: "core", type: "list" }];

  // Helper function to determine search type (new or list)
  const parseSearchTerm = (term) => {
    const trimmedTerm = term.trim().toLowerCase();
    let searchType = "";
    let searchQuery = trimmedTerm;

    // Check if the term starts with 'new' or 'list'
    if (trimmedTerm.startsWith("new ")) {
      searchType = "new";
      searchQuery = trimmedTerm.slice(4).trim(); // Remove 'new' from the search term
    } else if (trimmedTerm.endsWith(" list")) {
      searchType = "list";
      searchQuery = trimmedTerm.slice(0, -5).trim(); // Remove 'list' from the search term
    }

    return { searchType, searchQuery };
  };

  // Fetch data on component mount
  useEffect(() => {
    const loadOptions = async () => {
      const { searchType, searchQuery } = parseSearchTerm(searchTerm);

      // Proceed if there's a search query
      if (searchQuery) {
        const docResponse = await fetch(
          `/api/search-doc-link?keyword=${searchQuery}`
        );
        if (!docResponse.ok) {
          setOptions([]);
          return;
        }
        const linkresponse = await docResponse.json();

        // Process options: add 'List' and 'New' options
        const processedOptions = linkresponse
          ?.map((option) => [
            {
              name: `${option.name} List`,
              link: option.link,
              type: "list",
            },
            {
              name: `New ${option.name}`,
              link: option.link,
              module: option.module,
              type: "new",
            },
          ])
          .flat(); // Flatten nested arrays

        // Append extra options
        setOptions([...processedOptions, ...extras]);

        // Apply filtering based on searchType (new/list)
        const filteredByType = processedOptions.filter(
          (option) => !searchType || option.type === searchType
        );

        setFilteredOptions(filteredByType);
      } else {
        setFilteredOptions([]);
      }
    };

    loadOptions();
  }, [searchTerm]);

  // Handle click on an option
  const handleOptionClick = (option) => {
    const link =
      option.type === "new" ? `/${option.link}/new` : `/${option.link}`;
    router.push(link);
    setIsFocused(false); // Hide options after clicking
  };

  return (
    <div className="relative flex flex-wrap items-stretch w-full transition-all rounded-lg ease-soft w-80 xl:w-96">
      <span className="text-xs md:text-sm ease-soft leading-5.6 absolute z-50 -ml-px flex h-full items-center whitespace-nowrap rounded-lg rounded-tr-none rounded-br-none border border-r-0 border-transparent bg-transparent py-1 px-2.5 text-center font-normal text-slate-500 transition-all">
        {" "}
        <FontAwesomeIcon icon={faSearch} className="text-purple-500" />
      </span>
      <input
        type="text"
        className="pl-8.75 text-sm focus:shadow-soft-primary-outline ease-soft w-full leading-5.6 relative -ml-px block min-w-0 flex-auto rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-1 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
        placeholder="Type here..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {isFocused && searchTerm && filteredOptions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border space-y-2 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
          {filteredOptions?.map((option, index) => (
            <div
              key={index}
              className="px-2 py-1 text-left text-xs cursor-pointer hover:bg-gray-200 text-gray-700"
              onMouseDown={() => handleOptionClick(option)}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
