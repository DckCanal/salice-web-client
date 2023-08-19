import { usePatients } from "../../lib/hooks";
import Layout from "../../components/layout";
import LoadingError from "../../components/loadingError";
import NewInvoiceView from "../../components/NewInvoiceView";

export default function NewInvoicePage() {
  const { patients, isError, isLoading } = usePatients();

  if (isError) return <LoadingError text="" />;
  if (isLoading) return <div>loading...</div>;
  return <NewInvoiceView patients={patients} />;
}

NewInvoicePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
