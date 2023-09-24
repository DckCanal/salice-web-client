import Layout from "../components/layout";
import { useUser } from "../lib/hooks";

export default function Graphs() {
  const { user, error, isLoading } = useUser();
  return <h4>Work in progress...</h4>;
}

Graphs.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
