import Layout from "../components/layout";
import NewPatientView from "../components/NewPatientView";

export default function NewPatientPage() {
  return <NewPatientView />;
}

NewPatientPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
