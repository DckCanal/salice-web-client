import * as React from "react";
import Home from "./Home";
import UpdateInvoiceView from "./UpdateInvoiceView";
import UpdatePatientView from "./UpdatePatientView";

function DashboardContent({ invoices, patients, dataManager, d }) {
  const [view, setView] = React.useState({
    page: "Home",
    selectedPatient: undefined,
    selectedInvoice: undefined,
  });
  const [lightTheme, setLightTheme] = React.useState(false);

  // /invoices/[id] -> modal Window
  const openUpdateInvoice = (invoice, patient) => {
    setView({
      page: "UpdateInvoice",
      selectedInvoice: invoice,
      selectedPatient: patient,
    });
  };

  // /patients/[id] -> modal Window
  const openUpdatePatient = (patient) => {
    setView({
      page: "UpdatePatient",
      selectedInvoice: undefined,
      selectedPatient: patient,
    });
  };

  // /newInvoice
  const switchContent = () => {
    if (view.page === "Home")
      return (
        <Home
          lightTheme={lightTheme}
          invoices={invoices}
          patients={patients}
          d={d}
        />
      );
    if (view.page === "UpdateInvoice")
      return (
        <UpdateInvoiceView
          invoice={view.selectedInvoice}
          patient={view.selectedPatient}
          updateInvoice={dataManager.updateInvoice}
          deleteInvoice={dataManager.removeInvoice}
          openNextView={() =>
            setView({
              page: "InvoiceList",
              selectedInvoice: undefined,
              selectedPatient: undefined,
            })
          }
          d={d}
        />
      );

    if (view.page === "UpdatePatient")
      return (
        <UpdatePatientView
          patient={view.selectedPatient}
          openNextView={() =>
            setView({
              page: "PatientList",
              selectedInvoice: undefined,
              selectedPatient: undefined,
            })
          }
          updatePatient={dataManager.updatePatient}
          deletePatient={dataManager.removePatient}
        />
      );
  };

  return switchContent();
}

export default function Dashboard({
  invoices,
  patients,
  dataManager,
  switchd,
  d,
}) {
  return (
    <DashboardContent
      invoices={invoices}
      patients={patients}
      dataManager={dataManager}
      switchd={switchd}
      d={d}
    />
  );
}
