import SortTable from "./SortTable";
export default function InvoiceList({ invoices, patients }) {
  return (
    <div>
      <h1>Invoice list</h1>
      <p>Found {invoices.length} invoices</p>
      <SortTable />
    </div>
  );
}
