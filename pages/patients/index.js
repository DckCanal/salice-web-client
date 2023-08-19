import { usePatients } from "../../lib/hooks";
import Layout from "../../components/layout";
import PatientList from "../../components/PatientList";
import LoadingError from "../../components/loadingError";

export default function PatientsPage() {
  const { patients, isError, isLoading } = usePatients();

  if (isError) return <LoadingError text="" />;
  if (isLoading) return <div>Loading patients...</div>;
  return <PatientList patients={patients} />;
}

PatientsPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
