import { useRouter } from "next/router";
import { usePatient, useInvoices } from "../../lib/hooks";
import Layout from "../../components/layout";
import PatientDetail from "../../components/PatientDetail";
import LoadingError from "../../components/loadingError";

export default function PatientPage() {
  const router = useRouter();
  const patientResponse = usePatient(router.query.id);
  const invoicesResponse = useInvoices();

  if (patientResponse.isError || invoicesResponse.isError)
    return <LoadingError text="" />;
  if (patientResponse.isLoading || invoicesResponse.isLoading)
    return <div>loading...</div>;

  return (
    <PatientDetail
      patient={patientResponse.patient}
      invoices={invoicesResponse.invoices}
    />
  );
}

PatientPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
