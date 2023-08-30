import { useRouter } from "next/router";
import Layout from "../../components/layout";
import NewInvoiceView from "../../components/NewInvoiceView";

export default function NewInvoicePage() {
  const router = useRouter();
  const id = router.query?.id;
  return <NewInvoiceView selectedPatient={id} />;
}

NewInvoicePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
