import { useRouter } from "next/router";
import { usePatients } from "../../lib/hooks";
import Layout from "../../components/layout";
import LoadingError from "../../components/loadingError";
import NewInvoiceView from "../../components/NewInvoiceView";

export default function NewInvoicePage() {
  const { patients, isError, isLoading } = usePatients();
  const router = useRouter();

  if (isError) return <LoadingError text="" />;
  if (isLoading) return <div>loading...</div>;
  const id = router.query?.id;
  return <NewInvoiceView patients={patients} selectedPatient={id} />;
}

NewInvoicePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
