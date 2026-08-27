import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import CustomerTable from "../components/CustomerTable";
import FilterPanel from "../components/FilterPanel";
import CustomerModal from "../components/CustomerModal";
import CustomerDetails from "../components/CustomerDetails";

const API = "http://localhost:5000/api/customers";

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    status: "All",
    company: "All",
    fromDate: "",
    toDate: "",
    phone: "",
    email: "",
  });

  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [editCustomer, setEditCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Fetch customers
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        search,
        ...filters,
        sortBy,
        sortOrder,
        page,
        limit,
      };

      const res = await axios.get(API, { params });

      const responseData = res.data || {};

      setCustomers(Array.isArray(responseData.data) ? responseData.data : []);
      setTotal(responseData.total || 0);
      setPages(responseData.pages || 1);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
      setError("Failed to fetch customers");
      setCustomers([]);
      setTotal(0);
      setPages(1);
    } finally {
      setLoading(false);
    }
  }, [search, filters, sortBy, sortOrder, page, limit]);

  // Fetch whenever search/filter/sort/page changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 400);

    return () => clearTimeout(timer);
  }, [fetchCustomers]);

  // Delete customer
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    try {
      await axios.delete(`${API}/${id}`);
      await fetchCustomers();
    } catch (err) {
      console.error("Failed to delete customer:", err);
      alert("Failed to delete customer");
    }
  };

  // Create / update customer
  const handleSave = async (formData) => {
    try {
      if (editCustomer) {
        await axios.put(`${API}/${editCustomer._id}`, formData);
      } else {
        await axios.post(API, formData);
      }

      setShowModal(false);
      setEditCustomer(null);

      await fetchCustomers();
    } catch (err) {
      console.error("Failed to save customer:", err);
      alert("Failed to save customer");
    }
  };

  // Edit customer
  const handleEdit = (customer) => {
    setEditCustomer(customer);
    setShowModal(true);
  };

  // Sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }

    setPage(1);
  };

  // Active filter count
  const activeFiltersCount = Object.entries(filters).filter(
    ([, val]) => val !== "All" && val !== ""
  ).length;

  // Active leads
  const activeLeads = customers.filter(
    (customer) => customer.status === "Active"
  ).length;

  // Contacted this week
  const contactedThisWeek = customers.filter((customer) => {
    if (!customer.lastContactDate) return false;

    const contactDate = new Date(customer.lastContactDate);

    if (Number.isNaN(contactDate.getTime())) return false;

    const diff =
      (new Date() - contactDate) / (1000 * 60 * 60 * 24);

    return diff >= 0 && diff <= 7;
  }).length;

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
            C
          </div>

          <span className="font-semibold text-lg">
            CRM Dashboard
          </span>
        </div>

        <input
          type="text"
          placeholder="Search CRM..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
      </div>

      <div className="flex">

        {/* Sidebar */}
        <div className="w-48 bg-gray-900 border-r border-gray-800 min-h-screen p-4">
          {["Dashboard", "Contacts", "Deals", "Tasks", "Settings"].map(
            (item) => (
              <div
                key={item}
                className={`px-3 py-2 rounded-lg text-sm mb-1 cursor-pointer ${
                  item === "Dashboard"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {item}
              </div>
            )
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              Customers
            </h1>

            <div className="flex items-center gap-3">

              <button
                onClick={() => setShowFilters((prev) => !prev)}
                className="relative flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-sm px-4 py-2 rounded-lg transition"
              >
                Filters

                {activeFiltersCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-gray-800 border border-gray-700 text-sm px-3 py-2 rounded-lg text-white focus:outline-none"
              >
                <option value={10}>10 / page</option>
                <option value={25}>25 / page</option>
                <option value={50}>50 / page</option>
              </select>

              <button
                onClick={() => {
                  setEditCustomer(null);
                  setShowModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition font-medium"
              >
                Add Customer
              </button>

            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">

            {[
              {
                label: "Total Customers",
                value: total,
                trend: "+3.2%",
                color: "text-green-400",
              },
              {
                label: "Active Leads",
                value: activeLeads,
                trend: "+5.8%",
                color: "text-green-400",
              },
              {
                label: "Contacted This Week",
                value: contactedThisWeek,
                trend: "-1.5%",
                color: "text-red-400",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4"
              >
                <p className="text-gray-400 text-xs mb-1">
                  {stat.label}
                </p>

                <p className="text-2xl font-bold">
                  {stat.value}
                </p>

                <p className={`text-xs ${stat.color} mt-1`}>
                  Trend: {stat.trend}
                </p>
              </div>
            ))}

          </div>

          {/* Main Area */}
          <div className="flex gap-4">

            <div className="flex-1">

              {loading ? (
                <div className="text-center py-20 text-gray-400">
                  Loading...
                </div>
              ) : error ? (
                <div className="text-center py-20 text-red-400">
                  {error}
                </div>
              ) : (
                <CustomerTable
                  customers={customers}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={setSelectedCustomer}
                  onReorder={setCustomers}
                />
              )}

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">

                <p className="text-gray-400 text-sm">
                  Showing{" "}
                  {total === 0 ? 0 : (page - 1) * limit + 1}{" "}
                  to{" "}
                  {Math.min(page * limit, total)}{" "}
                  of {total} entries
                </p>

                <div className="flex items-center gap-2">

                  <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="px-3 py-1.5 text-sm bg-gray-800 border border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-700 transition"
                  >
                    Previous
                  </button>

                  {Array.from(
                    { length: Math.min(pages, 5) },
                    (_, i) => i + 1
                  ).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition ${
                        page === p
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    disabled={page >= pages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-3 py-1.5 text-sm bg-gray-800 border border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-700 transition"
                  >
                    Next
                  </button>

                </div>
              </div>

            </div>

            {/* Filter Panel */}
            {showFilters && (
              <FilterPanel
                filters={filters}
                onFilterChange={(newFilters) => {
                  setFilters(newFilters);
                  setPage(1);
                }}
                onClose={() => setShowFilters(false)}
                companies={[
                  ...new Set(
                    customers
                      .map((customer) => customer.company)
                      .filter(Boolean)
                  ),
                ]}
              />
            )}

          </div>
        </div>
      </div>

      {/* Customer Modal */}
      {showModal && (
        <CustomerModal
          customer={editCustomer}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditCustomer(null);
          }}
        />
      )}

      {/* Customer Details */}
      {selectedCustomer && (
        <CustomerDetails
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onEdit={() => {
            handleEdit(selectedCustomer);
            setSelectedCustomer(null);
          }}
          onDelete={() => {
            handleDelete(selectedCustomer._id);
            setSelectedCustomer(null);
          }}
        />
      )}
    </div>
  );
}