export default function CustomerDetails({
  customer,
  onClose,
  onEdit,
  onDelete,
}) {
  if (!customer) return null;

  const statusColor =
    customer.status === "Active"
      ? "bg-green-500/20 text-green-400"
      : "bg-red-500/20 text-red-400";

  const name = customer.name || "Unknown Customer";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formattedDate = customer.lastContactDate
    ? new Date(customer.lastContactDate).toLocaleDateString()
    : "Not available";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">
            Customer Details
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Customer Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold text-white">
            {initials}
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">
              {name}
            </h3>

            <p className="text-gray-400 text-sm">
              {customer.company || "No company"}
            </p>
          </div>

          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => onDelete(customer._id)}
              className="px-3 py-1.5 text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition"
            >
              Delete
            </button>

            <button
              type="button"
              onClick={() => onEdit(customer)}
              className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Edit Customer
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">

          {/* Contact Information */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
              Contact Information
            </p>

            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">
                  Email
                </p>

                <p className="text-sm text-white break-all">
                  {customer.email || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Phone
                </p>

                <p className="text-sm text-white">
                  {customer.phone || "Not available"}
                </p>
              </div>
            </div>
          </div>

          {/* Company & Status */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
              Company & Status
            </p>

            <div className="space-y-2">

              <div>
                <p className="text-xs text-gray-500">
                  Company
                </p>

                <p className="text-sm text-white">
                  {customer.company || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Status
                </p>

                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
                >
                  {customer.status || "Unknown"}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Last Contact
                </p>

                <p className="text-sm text-white">
                  {formattedDate}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Notes */}
        {customer.notes && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
              Notes & Interactions
            </p>

            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-300 leading-relaxed">
                {customer.notes}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}