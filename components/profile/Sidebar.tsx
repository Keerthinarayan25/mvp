export default function Sidebar() {
  return (
    <div className="space-y-6">

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-medium mb-2">Availability</h3>
        <p className="text-sm text-gray-600">More than 30 hrs/week</p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-medium mb-2">Languages</h3>
        <p className="text-sm text-gray-600">English - Conversational</p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-medium mb-2">Education</h3>
        <p className="text-sm text-gray-600">
          B.E - MIT Mysore (2022–2026)
        </p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-medium mb-2">Verification</h3>
        <p className="text-sm text-gray-600">ID: Unverified</p>
      </div>

    </div>
  );
}