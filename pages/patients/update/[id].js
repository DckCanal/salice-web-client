import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import UpdatePatientView from "../../../components/UpdatePatientView";
// import { usePatient } from "../../../lib/hooks";
export default function UpdatePatientPage() {
  const router = useRouter();
  const id = router.query.id;
  // const { patient, isError, isLoading } = usePatient(id);
  // if (isLoading) return <p>Loading patient...</p>;
  // if (isError) return <p> Error loading patient! </p>;
  // if (patient) return <UpdatePatientView patient={patient} />;
  // else return <p>Something went wrong...</p>;
  return <UpdatePatientView patientId={id} />;
}
UpdatePatientPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
