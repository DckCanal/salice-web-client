import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import { useInvoice, usePatients } from "../../../lib/hooks";

export default function UpdateInvoicePage() {
  const router = useRouter();
  const id = router.query.id;
}

UpdateInvoicePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
