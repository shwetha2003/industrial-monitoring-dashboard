export default function EquipmentCard({ equipmentId, status, value }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold">{equipmentId}</h3>
      <p>Status: {status}</p>
      <p>Value: {value}</p>
    </div>
  );
}
