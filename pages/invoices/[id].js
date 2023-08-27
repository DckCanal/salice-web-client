import { useRouter } from "next/router";
import Layout from "../../components/layout";
import InvoiceDetail from "../../components/InvoiceDetail";

export default function InvoicePage() {
  const router = useRouter();
  const invoiceId = router.query.id;

  return <InvoiceDetail id={invoiceId} />;
}

InvoicePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
