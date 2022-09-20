import SortTable from "./SortTable";
import { Paper } from "@mui/material";
import excelInvoice from "../lib/excelLib";
export default function InvoiceList({ invoices, patients, dataManager }) {
  return (
    <div>
      <h1>Invoice list</h1>
      <p>Found {invoices.length} invoices</p>
      <SortTable
        invoices={invoices}
        patients={patients}
        dataManager={dataManager}
      />
    </div>
  );
}
