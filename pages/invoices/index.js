import Layout from "../../components/layout";
import InvoiceList from "../../components/InvoiceList";

export default function InvoicesPage() {
  return <InvoiceList />;
}

InvoicesPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
