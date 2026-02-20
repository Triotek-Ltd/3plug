import React, { useState, useEffect, useMemo } from "react";
import TableTemplate from "@/components/pages/list/TableTemplate";
import Pagination from "@/components/pages/list/Pagination";
import { fetchData } from "@/utils/Api";
import { toast } from "react-toastify";
import { useData } from "@/contexts/DataContext";
import { useRouter } from "next/router";
import { extractFiltersAndFields } from "../utils/extractTableConfig";
import { useConfig } from "@/contexts/ConfigContext";
import { saveToDB, getFromDB, deleteFromDB } from "@/utils/indexedDB";
import { findDocDetails } from "@/utils/findDocDetails";

const DoctypeListTable = ({ tableConfig }) => {
  const { data: contextData, setData } = useData();
  const { localAppData, setLocalAppData } = useConfig();
  const router = useRouter();
  const { query, pathname } = router;

  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [filters, setFilters] = useState({});
  const [activeFilters, setActiveFilters] = useState({});
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);

  const extendedFilters = useMemo(() => {
    return {
      ...Object.fromEntries(
        Object.entries(activeFilters).flatMap(([key, { value, matchType }]) => {
          if (matchType === "equals" || key === "search") {
            return [[key, value]];
          }
          return [[`${key}${matchType}`, value]];
        })
      ),
      page: currentPage,
      page_length: itemsPerPage,
    };
  }, [activeFilters, currentPage, itemsPerPage]);

  useEffect(() => {
    const initializeData = async () => {
      const {
        filters: extractedFilters,
        fields,
        settings,
      } = extractFiltersAndFields(tableConfig);

      extractedFilters.id = { value: "", matchType: "equals" };

      setFilters(extractedFilters);
      setSettings(settings);

      try {
        const storedFilters = await getFromDB(pathname);

        // Merge query params, stored filters, and default filters
        const initializedFilters = Object.keys(extractedFilters).reduce(
          (acc, key) => {
            acc[key] = {
              value:
                query[key] ||
                storedFilters?.[key]?.value ||
                extractedFilters[key]?.value ||
                "",
              matchType:
                storedFilters?.[key]?.matchType ||
                extractedFilters[key]?.matchType ||
                "__icontains",
            };
            return acc;
          },
          {}
        );

        setActiveFilters(initializedFilters);
      } catch (error) {
        toast.error(`Failed to load filters: ${error.message}`);
      }

      setFilteredData(fields);
      setLoading(false);
    };

    if (tableConfig) {
      initializeData();
    }
  }, [tableConfig, pathname, query]);

  const docData = findDocDetails(query?.slug);

  const endpoint = query.slug
    ? `${docData?.app_id}/${query.slug}`
    : localAppData?.endpoint || null;

  // if (docData && endpoint) {
  //   setLocalAppData({ ...docData, endpoint });
  // }
  useEffect(() => {
    if (loading) return;

    const fetchDataAsync = async () => {
      try {
        const response = await fetchData(extendedFilters, endpoint);
        if (response?.data?.data) {
          setData(response.data.data);
          setFilteredData(response.data.data);
          setTotalEntries(response.data.total);
          setTotalPages(response.data.total_pages);
        }
      } catch (error) {
        toast.error(`Failed to fetch data: ${error.message || error}`);
      }
    };

    if (endpoint && !loading) {
      fetchDataAsync();
    }
  }, [extendedFilters, query.slug, currentPage, itemsPerPage, reload]);

  useEffect(() => {
    if (pathname && Object.keys(activeFilters).length) {
      saveToDB(pathname, activeFilters).catch((error) =>
        console.error(`Failed to save filters: ${error.message}`)
      );
    }
  }, [activeFilters]);

  const handleFilterChange = (name, type, value) => {
    setActiveFilters((prevFilters) => ({
      ...prevFilters,
      [name]: { value, matchType: type },
    }));
    setCurrentPage(1);
  };

  const applyAllFilters = (filterList) => {
    filterList.forEach((filter) => {
      handleFilterChange(filter.field, filter.matchOption, filter.value);
    });
  };

  const handleClearFilters = async () => {
    try {
      await deleteFromDB(pathname);
      setActiveFilters(
        Object.keys(filters).reduce((acc, key) => {
          acc[key] = { value: "", matchType: "__icontains" };
          return acc;
        }, {})
      );
      setCurrentPage(1);
    } catch (error) {
      toast.error(`Failed to clear filters: ${error.message}`);
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };
  const handleEdit = (item) => {};
  const refresh = () => {
    setReload((prev) => !prev);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setReload((prev) => !prev);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-4 md:px-8 py-2 w-full">
      <div className="w-full">
        <TableTemplate
          tableConfig={tableConfig}
          data={filteredData}
          onEdit={handleEdit}
          filters={filters}
          activeFilters={activeFilters}
          handleFilterChange={handleFilterChange}
          handleClearFilters={handleClearFilters}
          applyFilters={applyAllFilters}
          refresh={refresh}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          total_entries={totalEntries}
        />
      </div>
    </div>
  );
};

export default DoctypeListTable;
