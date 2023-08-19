import { useRouter } from "next/router";
import { useInvoice, usePatients } from "../../lib/hooks";
import Layout from "../../components/layout";
import InvoiceDetail from "../../components/InvoiceDetail";
import LoadingError from "../../components/loadingError";

export default function InvoicePage() {
  const router = useRouter();
  const invoiceId = router.query.id;
  const invoiceResponse = useInvoice(invoiceId);
  const patientsResponse = usePatients();

  if (invoiceResponse.isError || patientsResponse.isError)
    return <LoadingError text="" />;
  if (invoiceResponse.isLoading || patientsResponse.isLoading)
    return <div>loading...</div>;
  if (invoiceResponse.invoice !== undefined) {
    const patient = patientsResponse.patients.find(
      (p) => String(p._id) === String(invoiceResponse.invoice.paziente)
    );
    return (
      <InvoiceDetail invoice={invoiceResponse.invoice} patient={patient} />
    );
  }
}

InvoicePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
