import { useRouter } from "next/router";
import Layout from "../../../components/layout";
// import { useInvoice, usePatients } from "../../../lib/hooks";
import UpdateInvoiceView from "../../../components/UpdateInvoiceView";

export default function UpdateInvoicePage() {
  const router = useRouter();
  const id = router.query.id;
  // const {
  //   invoice,
  //   isLoading: invoiceLoading,
  //   isError: invoiceError,
  // } = useInvoice(id);
  // const {
  //   patients,
  //   isLoading: patientsLoading,
  //   isError: patientsError,
  // } = usePatients();

  // if (invoiceLoading || patientsLoading) return <p>Loading...</p>;
  // if (invoiceError || patientsError) return <p>Error loading invoice!</p>;
  // const patient = patients.find(
  //   (p) => String(p._id) === String(invoice.paziente)
  // );
  return <UpdateInvoiceView invoiceId={id} />;
}

UpdateInvoicePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
