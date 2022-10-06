import SortTable from "./SortTable";
export default function InvoiceList({
  invoices,
  patients,
  dataManager,
  openInvoiceDetail,
}) {
  return (
    <div>
      <SortTable
        invoices={invoices}
        patients={patients}
        dataManager={dataManager}
        openInvoiceDetail={openInvoiceDetail}
      />
    </div>
  );
}
