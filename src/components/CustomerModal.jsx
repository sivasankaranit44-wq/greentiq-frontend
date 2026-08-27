import { useState, useEffect } from "react";

const getToday = () => {
  return new Date().toISOString().split("T")[0];
};

const getDateValue = (date) => {
  if (!date) return getToday();

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return getToday();
  }

  return parsedDate.toISOString().split("T")[0];
};

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  status: "Active",
  lastContactDate: getToday(),
  notes: "",
};

export default function CustomerModal({
  customer,
  onSave,
  onClose,
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  // Load customer data when editing
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        company: customer.company || "",
        status: customer.status || "Active",
        lastContactDate: getDateValue(
          customer.lastContactDate
        ),
        notes: customer.notes || "",
      });
    } else {
      setFormData({
        ...initialFormData,
        lastContactDate: getToday(),
      });
    }

    setErrors({});
  }, [customer]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error for the field being edited
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Validate form
  const validate = () => {
    const err = {};

    if (!formData.name.trim()) {
      err.name = "Name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      err.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      err.email = "Enter a valid email";
    }

    if (!formData.phone.trim()) {
      err.phone = "Phone is required";
    }

    if (!formData.company.trim()) {
      err.company = "Company is required";
    }

    return err;
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">

      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">
            {customer ? "Edit Customer" : "Add Customer"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* Name */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Name *
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.name && (
              <p className="text-red-400 text-xs mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Email *
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Yourname@gmail.com"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Phone *
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10 digit number"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.phone && (
              <p className="text-red-400 text-xs mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Company */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Company *
            </label>

            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Greentiq"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.company && (
              <p className="text-red-400 text-xs mt-1">
                {errors.company}
              </p>
            )}
          </div>

          {/* Status + Date */}
          <div className="flex gap-3">

            <div className="flex-1">
              <label className="block text-xs text-gray-400 mb-1">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-xs text-gray-400 mb-1">
                Last Contact Date
              </label>

              <input
                type="date"
                name="lastContactDate"
                value={formData.lastContactDate}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Notes
            </label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Meeting notes and follow-up items..."
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-sm py-2.5 rounded-lg transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2.5 rounded-lg transition font-medium"
            >
              {customer
                ? "Update Customer"
                : "Add Customer"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}