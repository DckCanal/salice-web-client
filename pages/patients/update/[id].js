import Layout from "../../../components/layout";
import UpdatePatientView from "../../../components/UpdatePatientView";
export default function UpdatePatientPage() {
  return <UpdatePatientView />;
}
UpdatePatientPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
