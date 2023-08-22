import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import { usePatient } from "../../../lib/hooks";
export default function UpdatePatientPage() {
  const router = useRouter();
  const id = router.query.id;
}
UpdatePatientPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
