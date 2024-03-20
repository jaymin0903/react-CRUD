import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { ProductService } from "../services/ProductService";

function ProductDatatable() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ProductService.getProductsMedium().then((data) => {
      setProducts(data);
      setLoading(false);
    });
    initFilters();
  }, []);

  const clearFilter = () => {
    initFilters();
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      title: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      category: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      brand: { value: null, matchMode: FilterMatchMode.IN },
    });
    setGlobalFilterValue("");
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
        </span>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <>
      <h2 style={{ textAlign: "center" }}>Products List</h2>
      <div className="card">
        <DataTable
          value={products}
          paginator
          sortMode="multiple"
          filters={filters}
          globalFilterFields={["title", "category", "brand"]}
          loading={loading}
          dataKey="id"
          header={header}
          emptyMessage="No products found."
          rows={5}
          rowsPerPageOptions={[5, 10, 20, 50]}
          tableStyle={{ minWidth: "50rem" }}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrePageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}">
          <Column field="id" sortable header="Sr. No." style={{ width: "10%" }}></Column>
          <Column field="title" sortable header="Title" filter filterPlaceholder="Search by title" style={{ width: "35%" }}></Column>
          <Column field="brand" sortable header="Brand" filter filterPlaceholder="Search by brand" style={{ width: "15%" }}></Column>
          <Column field="price" sortable header="Price" style={{ width: "10%" }}></Column>
          <Column field="category" sortable header="Category" filter filterPlaceholder="Search by category" style={{ width: "15%" }}></Column>
          <Column field="stock" header="Stock" style={{ width: "10%" }}></Column>
        </DataTable>
      </div>
    </>
  );
}

export default ProductDatatable;
