import { useRouter } from "next/router";
import Layout from "../../components/layout";
import PatientDetail from "../../components/PatientDetail";

export default function PatientPage() {
  const router = useRouter();
  const patientId = router.query.id;

  return <PatientDetail id={patientId} />;
}

PatientPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
