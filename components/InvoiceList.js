import SortTable from "./SortTable";
import { Paper } from "@mui/material";
export default function InvoiceList({ invoices, patients }) {
  return (
    <div>
      <h1>Invoice list</h1>
      <p>Found {invoices.length} invoices</p>
      <SortTable invoices={invoices} patients={patients} />
    </div>
  );
}
