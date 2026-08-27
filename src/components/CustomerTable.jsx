import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

export default function CustomerTable({
  customers,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  onView,
  onReorder,
}) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(customers);

    const [reordered] = items.splice(
      result.source.index,
      1
    );

    items.splice(
      result.destination.index,
      0,
      reordered
    );

    onReorder(items);
  };

  const SortIcon = ({ column }) => {
    if (sortBy !== column) {
      return (
        <span className="text-gray-600 ml-1">
          ↕
        </span>
      );
    }

    return (
      <span className="text-blue-400 ml-1">
        {sortOrder === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  const statusColor = (status) =>
    status === "Active"
      ? "bg-green-500/20 text-green-400"
      : "bg-red-500/20 text-red-400";

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

      {/* Horizontal scroll on mobile */}
      <div className="overflow-x-auto">

        <table className="w-full min-w-[1000px] text-sm">

          <thead>
            <tr className="border-b border-gray-800 text-gray-400">

              <th className="px-4 py-3 text-left w-10">
                #
              </th>

              <th
                className="px-4 py-3 text-left cursor-pointer hover:text-white whitespace-nowrap"
                onClick={() => onSort("name")}
              >
                Name
                <SortIcon column="name" />
              </th>

              <th
                className="px-4 py-3 text-left cursor-pointer hover:text-white whitespace-nowrap"
                onClick={() => onSort("email")}
              >
                Email
                <SortIcon column="email" />
              </th>

              <th className="px-4 py-3 text-left whitespace-nowrap">
                Phone
              </th>

              <th className="px-4 py-3 text-left whitespace-nowrap">
                Company
              </th>

              <th className="px-4 py-3 text-left whitespace-nowrap">
                Status
              </th>

              <th
                className="px-4 py-3 text-left cursor-pointer hover:text-white whitespace-nowrap"
                onClick={() =>
                  onSort("lastContactDate")
                }
              >
                Last Contact
                <SortIcon column="lastContactDate" />
              </th>

              <th className="px-4 py-3 text-left whitespace-nowrap">
                Actions
              </th>

            </tr>
          </thead>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="customers">

              {(provided) => (
                <tbody
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >

                  {customers.map(
                    (customer, index) => {
                      const customerId =
                        String(customer._id);

                      return (
                        <Draggable
                          key={customerId}
                          draggableId={customerId}
                          index={index}
                        >
                          {(
                            provided,
                            snapshot
                          ) => (
                            <tr
                              ref={
                                provided.innerRef
                              }
                              {...provided.draggableProps}
                              className={`border-b border-gray-800 hover:bg-gray-800/50 transition cursor-pointer ${
                                snapshot.isDragging
                                  ? "bg-gray-800 opacity-80"
                                  : ""
                              }`}
                              onClick={() =>
                                onView(customer)
                              }
                            >

                              {/* Drag Handle */}
                              <td
                                className="px-4 py-3 text-gray-600"
                                {...provided.dragHandleProps}
                                onClick={(e) =>
                                  e.stopPropagation()
                                }
                              >
                                ⠿
                              </td>

                              {/* Name */}
                              <td className="px-4 py-3 font-medium whitespace-nowrap">
                                {customer.name ||
                                  "—"}
                              </td>

                              {/* Email */}
                              <td className="px-4 py-3 text-gray-400">
                                <span className="block max-w-[220px] truncate">
                                  {customer.email ||
                                    "—"}
                                </span>
                              </td>

                              {/* Phone */}
                              <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                                {customer.phone ||
                                  "—"}
                              </td>

                              {/* Company */}
                              <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                                {customer.company ||
                                  "—"}
                              </td>

                              {/* Status */}
                              <td className="px-4 py-3">

                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColor(
                                    customer.status
                                  )}`}
                                >
                                  {customer.status ||
                                    "Inactive"}
                                </span>

                              </td>

                              {/* Last Contact */}
                              <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                                {customer.lastContactDate
                                  ? new Date(
                                      customer.lastContactDate
                                    ).toLocaleDateString()
                                  : "—"}
                              </td>

                              {/* Actions */}
                              <td className="px-4 py-3">

                                <div
                                  className="flex items-center gap-2"
                                  onClick={(e) =>
                                    e.stopPropagation()
                                  }
                                >

                                  <button
                                    onClick={() =>
                                      onEdit(
                                        customer
                                      )
                                    }
                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-400 transition"
                                    title="Edit"
                                  >
                                    ✏️
                                  </button>

                                  <button
                                    onClick={() =>
                                      onDelete(
                                        customer._id
                                      )
                                    }
                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-400 transition"
                                    title="Delete"
                                  >
                                    🗑️
                                  </button>

                                </div>

                              </td>

                            </tr>
                          )}
                        </Draggable>
                      );
                    }
                  )}

                  {provided.placeholder}

                </tbody>
              )}

            </Droppable>
          </DragDropContext>

        </table>
      </div>

      {/* Empty state */}
      {customers.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          No customers found.
        </div>
      )}

    </div>
  );
}