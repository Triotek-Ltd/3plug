import React, { useState, useEffect } from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  total_entries,
}) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [paginationData, setPaginationData] = useState([]);
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsSmallScreen(width < 640);
      setIsMediumScreen(width >= 640 && width < 940);
    };

    handleResize(); // Initial check on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!totalPages || totalPages < 2) {
      setPaginationData([1]);
      return;
    }

    let pagination_data = [];

    // Define section sizes based on screen size
    const firstAndLastSize = isSmallScreen ? 1 : isMediumScreen ? 3 : 5;
    const expandedSize = isSmallScreen ? 2 : isMediumScreen ? 6 : 10;
    const middleSectionSize = isSmallScreen ? 2 : isMediumScreen ? 3 : 5;

    const firstSectionEnd = expandedSize;
    const lastSectionStart = totalPages - firstAndLastSize + 1;

    if (currentPage <= firstSectionEnd) {
      // Current page is in the first section
      for (let i = 1; i <= Math.min(expandedSize, totalPages); i++) {
        pagination_data.push(i);
      }

      if (totalPages > expandedSize + firstAndLastSize) {
        pagination_data.push("...");
      }

      for (let i = lastSectionStart; i <= totalPages; i++) {
        pagination_data.push(i);
      }
    } else if (currentPage >= lastSectionStart - middleSectionSize) {
      // Current page is in the last section
      for (let i = 1; i <= firstAndLastSize; i++) {
        pagination_data.push(i);
      }

      if (totalPages > expandedSize + firstAndLastSize) {
        pagination_data.push("...");
      }

      for (
        let i = Math.max(lastSectionStart - expandedSize + 1, 1);
        i <= totalPages;
        i++
      ) {
        pagination_data.push(i);
      }
    } else {
      // Middle section is shown with `middleSectionSize`
      for (let i = 1; i <= firstAndLastSize; i++) {
        pagination_data.push(i);
      }

      pagination_data.push("...");

      let start = Math.max(
        firstSectionEnd + 1,
        currentPage - Math.floor(middleSectionSize / 2)
      );
      let end = Math.min(lastSectionStart - 1, start + middleSectionSize - 1);

      for (let i = start; i <= end; i++) {
        pagination_data.push(i);
      }

      pagination_data.push("...");
      for (let i = lastSectionStart; i <= totalPages; i++) {
        pagination_data.push(i);
      }
    }

    setPaginationData(pagination_data);
  }, [currentPage, totalPages, isSmallScreen, isMediumScreen]);

  const renderPageNumbers = () => {
    return paginationData?.map((page, index) => {
      if (page === "...") {
        return (
          <li key={index}>
            <span className="relative flex items-center justify-center font-medium min-w-[2rem] px-1 py-2 rounded-md outline-none cursor-default">
              {isSmallScreen ? ".." : "...."}
            </span>
          </li>
        );
      }
      return (
        <li key={index}>
          <button
            type="button"
            onClick={() => onPageChange(page)}
            className={`relative flex items-center justify-center font-medium min-w-[1.5rem] px-1 py-1 mx-1 rounded-md outline-none transition ${
              currentPage === page
                ? "text-purple-900 bg-purple-500/10 ring-1 ring-purple-500"
                : "hover:bg-gray-500/5 bg-white focus:bg-purple-500/10 dark:hover:bg-gray-400/5 focus:text-purple-900"
            }`}
          >
            <span>{page}</span>
          </button>
        </li>
      );
    });
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 w-full py-2 pt-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-row gap-4 items-center">
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(parseInt(e.target.value, 10))}
            className="relative flex items-right text-center justify-center text-xs font-medium border-gray-400 border-[1.5px] min-w-[2rem] px-1 py-1 rounded-md outline-none hover:bg-gray-500/5 focus:bg-purple-500/10 focus:ring-2 focus:ring-purple-500 dark:hover:bg-gray-400/5 transition text-purple-900"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
            <option value={500}>500</option>
            <option value={1000}>1000</option>
            <option value={0}>All</option>
          </select>
          <span className="text-xs text-gray-700 dark:text-gray-400 md:hidden">
            Entries per page
          </span>
        </div>
        <div className="flex items-center">
          <div className="border rounded-lg dark:border-gray-600">
            <ol className="flex items-center text-xs text-gray-700 divide-x rtl:divide-x-reverse divide-gray-300 dark:text-gray-400 dark:divide-gray-600 space-x-1 p-[1px]">
              <li>
                <button
                  type="button"
                  onClick={() => onPageChange(currentPage - 1)}
                  className={`relative flex items-center justify-center font-medium min-w-[1rem] px-1 py-1 rounded-md outline-none bg-white hover:bg-gray-500/5 focus:bg-purple-500/10 dark:hover:bg-gray-400/5 transition text-purple-900 ${
                    currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  aria-label="Previous"
                  rel="prev"
                  disabled={currentPage === 1}
                >
                  <svg
                    className="w-5 h-5 rtl:scale-x-[-1]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </li>
              {renderPageNumbers()}
              <li>
                <button
                  type="button"
                  onClick={() => onPageChange(currentPage + 1)}
                  className={`relative flex items-center justify-center font-medium min-w-[1rem] px-1 mx-1 py-1 rounded-md outline-none bg-white hover:bg-gray-500/5 focus:bg-purple-500/10 focus:ring-2 focus:ring-purple-500 dark:hover:bg-gray-400/5 transition text-purple-900 ${
                    currentPage === totalPages
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                  aria-label="Next"
                  rel="next"
                  disabled={currentPage === totalPages}
                >
                  <svg
                    className="w-5 h-5 rtl:scale-x-[-1]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </li>
            </ol>
          </div>
        </div>
      </div>
      <div className="font-semibold text-xs italic md:text-center text-left w-full md:w-auto">
        Page {currentPage} of {totalPages} ({total_entries} entries)
      </div>
    </div>
  );
};

export default Pagination;
