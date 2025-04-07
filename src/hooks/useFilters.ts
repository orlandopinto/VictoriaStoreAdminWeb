import { FilterMatchMode } from "primereact/api";
import { DataTableFilterMeta } from "primereact/datatable";
import { useState } from "react";

export const useFilters = () => {
     const [filters, setFilters] = useState<DataTableFilterMeta>({
          global: { value: null, matchMode: FilterMatchMode.CONTAINS },
          name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          representative: { value: null, matchMode: FilterMatchMode.IN },
          status: { value: null, matchMode: FilterMatchMode.EQUALS },
          verified: { value: null, matchMode: FilterMatchMode.EQUALS }
     });
     const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
     return { filters, setFilters, globalFilterValue, setGlobalFilterValue };
};

export const onGlobalFilterChange = (
     e: React.ChangeEvent<HTMLInputElement>,
     filters: DataTableFilterMeta,
     setFilters: React.Dispatch<React.SetStateAction<DataTableFilterMeta>>,
     setGlobalFilterValue: React.Dispatch<React.SetStateAction<string>>
) => {
     e.preventDefault();
     const value = e.target.value;
     let _filters = { ...filters };
     // @ts-ignore
     _filters['global'].value = value;
     setFilters(_filters);
     setGlobalFilterValue(value);
};