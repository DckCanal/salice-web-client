import { useInvoices, usePatients } from "../../lib/hooks";
import Layout from "../../components/layout";
import InvoiceList from "../../components/InvoiceList";
import LoadingError from "../../components/loadingError";

export default function InvoicesPage() {
  const invoicesResponse = useInvoices();
  const patientsResponse = usePatients();

  if (invoicesResponse.isError || patientsResponse.isError)
    return <LoadingError text="" />;
  if (invoicesResponse.isLoading || patientsResponse.isLoading)
    return <div>loading...</div>;
  return (
    <InvoiceList
      invoices={invoicesResponse.invoices}
      patients={patientsResponse.patients}
    />
  );
}

InvoicesPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
