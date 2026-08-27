import { useState } from "react";

const EMPTY_FILTERS = {
  status: "All",
  company: "All",
  fromDate: "",
  toDate: "",
  phone: "",
  email: "",
};

const SAVED_FILTERS = [
  {
    name: "Active Customers",
    filters: {
      status: "Active",
      company: "All",
      fromDate: "",
      toDate: "",
      phone: "",
      email: "",
    },
  },
  {
    name: "Recent Contacts",
    filters: {
      status: "All",
      company: "All",
      fromDate: new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
      toDate: "",
      phone: "",
      email: "",
    },
  },
  {
    name: "Inactive Leads",
    filters: {
      status: "Inactive",
      company: "All",
      fromDate: "",
      toDate: "",
      phone: "",
      email: "",
    },
  },
];

export default function FilterPanel({
  filters = EMPTY_FILTERS,
  onFilterChange,
  onClose,
  companies = [],
}) {
  const [local, setLocal] = useState({
    ...EMPTY_FILTERS,
    ...filters,
  });

  const update = (key, value) => {
    setLocal((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const apply = () => {
    onFilterChange(local);
  };

  const clear = () => {
    const cleared = { ...EMPTY_FILTERS };

    setLocal(cleared);
    onFilterChange(cleared);
  };

  const applySavedFilter = (savedFilters) => {
    setLocal(savedFilters);
    onFilterChange(savedFilters);
  };

  return (
    <div className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 h-fit">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">

        <h3 className="font-semibold text-white">
          Filters
        </h3>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition w-8 h-8 flex items-center justify-center"
          type="button"
        >
          ✕
        </button>

      </div>

      {/* Status */}
      <div className="mb-4">

        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">
          Status
        </p>

        <div className="grid grid-cols-3 gap-2 sm:block">

          {["All", "Active", "Inactive"].map(
            (status) => (
              <label
                key={status}
                className="flex items-center gap-2 mb-1 cursor-pointer"
              >
                <input
                  type="radio"
                  name="customer-status"
                  value={status}
                  checked={
                    local.status === status
                  }
                  onChange={() =>
                    update(
                      "status",
                      status
                    )
                  }
                  className="accent-blue-500"
                />

                <span className="text-sm text-gray-300">
                  {status}
                </span>
              </label>
            )
          )}

        </div>
      </div>

      {/* Company */}
      <div className="mb-4">

        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">
          Company
        </p>

        <select
          value={local.company}
          onChange={(e) =>
            update(
              "company",
              e.target.value
            )
          }
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">
            All Companies
          </option>

          {companies.map((company) => (
            <option
              key={company}
              value={company}
            >
              {company}
            </option>
          ))}

        </select>
      </div>

      {/* Date Range */}
      <div className="mb-4">

        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">
          Date Range
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

          <input
            type="date"
            value={local.fromDate}
            onChange={(e) =>
              update(
                "fromDate",
                e.target.value
              )
            }
            className="w-full min-w-0 bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="date"
            value={local.toDate}
            onChange={(e) =>
              update(
                "toDate",
                e.target.value
              )
            }
            className="w-full min-w-0 bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>
      </div>

      {/* Phone */}
      <div className="mb-4">

        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">
          Phone Number
        </p>

        <input
          type="text"
          placeholder="(555) 123-4567"
          value={local.phone}
          onChange={(e) =>
            update(
              "phone",
              e.target.value
            )
          }
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {/* Email */}
      <div className="mb-4">

        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">
          Email Contains
        </p>

        <input
          type="text"
          placeholder="@gmail.com"
          value={local.email}
          onChange={(e) =>
            update(
              "email",
              e.target.value
            )
          }
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">

        <button
          type="button"
          onClick={apply}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition"
        >
          Apply Filters
        </button>

        <button
          type="button"
          onClick={clear}
          className="w-full bg-gray-800 hover:bg-gray-700 text-sm py-2 rounded-lg transition"
        >
          Clear All
        </button>

      </div>

      {/* Saved Filters */}
      <div>

        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">
          Saved Filters
        </p>

        {SAVED_FILTERS.map(
          (savedFilter) => (
            <button
              key={savedFilter.name}
              type="button"
              onClick={() =>
                applySavedFilter(
                  savedFilter.filters
                )
              }
              className="w-full text-left text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg mb-1 transition"
            >
              {savedFilter.name}
            </button>
          )
        )}

      </div>

    </div>
  );
}