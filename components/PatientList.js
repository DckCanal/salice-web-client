export default function PatientList({ invoices, patients }) {
  return (
    <div>
      <h1>Patient list</h1>
      <p>Found {patients.length} patients</p>
    </div>
  );
}
