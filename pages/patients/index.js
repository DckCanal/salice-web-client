import Layout from "../../components/layout";
import PatientList from "../../components/PatientList";

export default function PatientsPage() {
  return <PatientList />;
}

PatientsPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
