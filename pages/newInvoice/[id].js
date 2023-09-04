import Layout from "../../components/layout";
import NewInvoiceView from "../../components/NewInvoiceView";

export default function NewInvoicePage() {
  return <NewInvoiceView />;
}

NewInvoicePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
