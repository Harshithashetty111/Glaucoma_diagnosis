import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000"; // change if needed

type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";

interface SupportTicket {
  id: number;
  subject: string;
  description: string;
  created_at: string;
  updated_at: string;
  status: TicketStatus;
  patient_name?: string;
  doctor_name?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
}

const statusOptions: { label: string; value: TicketStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Resolved", value: "RESOLVED" },
];

const priorityBadgeStyle = (priority?: string) => {
  switch (priority) {
    case "HIGH":
      return "bg-red-100 text-red-700 border-red-300";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "LOW":
      return "bg-green-100 text-green-700 border-green-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

const statusBadgeStyle = (status: TicketStatus) => {
  switch (status) {
    case "OPEN":
      return "bg-red-100 text-red-700 border-red-300";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700 border-blue-300";
    case "RESOLVED":
      return "bg-green-100 text-green-700 border-green-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

// for now, doctors are view-only
const CAN_EDIT_STATUS = false;

const SupportTickets: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "ALL">("OPEN");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get<SupportTicket[]>(`${API_BASE}/api/support-tickets`);
      setTickets(res.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.detail || "Failed to load support tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesStatus =
        statusFilter === "ALL" ? true : ticket.status === statusFilter;

      const lowerSearch = search.toLowerCase();
      const matchesSearch =
        !lowerSearch ||
        ticket.subject.toLowerCase().includes(lowerSearch) ||
        ticket.description.toLowerCase().includes(lowerSearch) ||
        (ticket.patient_name &&
          ticket.patient_name.toLowerCase().includes(lowerSearch)) ||
        (ticket.doctor_name &&
          ticket.doctor_name.toLowerCase().includes(lowerSearch));

      return matchesStatus && matchesSearch;
    });
  }, [tickets, search, statusFilter]);

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      {/* Left list */}
      <div className="w-2/3 border-r border-slate-200 flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Support Tickets
            </h1>
            <p className="text-sm text-slate-500">
              View help requests submitted from the Contact page.
            </p>
          </div>
          <button
            onClick={fetchTickets}
            className="text-sm px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 transition"
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by subject, description, patient, or doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as TicketStatus | "ALL")
              }
              className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="px-6 py-3 bg-red-50 text-red-700 text-sm border-b border-red-200">
            {error}
          </div>
        )}

        {/* Tickets list */}
        <div className="flex-1 overflow-y-auto">
          {loading && tickets.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-slate-500">
              Loading tickets...
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-slate-500">
              No tickets found.
            </div>
          ) : (
            <ul className="divide-y divide-slate-200">
              {filteredTickets.map((ticket) => (
                <li
                  key={ticket.id}
                  className={`px-6 py-4 flex items-start gap-4 cursor-pointer hover:bg-slate-50 ${
                    selectedTicket?.id === ticket.id ? "bg-sky-50" : ""
                  }`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h2 className="font-medium text-slate-900 line-clamp-1">
                        {ticket.subject}
                      </h2>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${statusBadgeStyle(
                          ticket.status
                        )}`}
                      >
                        {ticket.status.replace("_", " ")}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                      {ticket.description}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      {ticket.patient_name && (
                        <span>Patient: {ticket.patient_name}</span>
                      )}
                      {ticket.doctor_name && (
                        <span>Doctor: {ticket.doctor_name}</span>
                      )}
                      {ticket.priority && (
                        <span
                          className={`px-2 py-0.5 rounded-full border ${priorityBadgeStyle(
                            ticket.priority
                          )}`}
                        >
                          Priority: {ticket.priority}
                        </span>
                      )}
                    </div>

                    <div className="mt-1 text-[11px] text-slate-400">
                      Created:{" "}
                      {new Date(ticket.created_at).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right details panel */}
      <div className="w-1/3 flex flex-col bg-white">
        {selectedTicket ? (
          <>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Ticket #{selectedTicket.id}
                </h2>
                <p className="text-xs text-slate-500 line-clamp-1">
                  {selectedTicket.subject}
                </p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 text-sm">
              <div>
                <div className="text-[11px] uppercase text-slate-400 mb-1">
                  Status
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full border ${statusBadgeStyle(
                      selectedTicket.status
                    )}`}
                  >
                    {selectedTicket.status.replace("_", " ")}
                  </span>
                </div>
                {!CAN_EDIT_STATUS && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    Status is managed by admin/developer. Doctors can only view
                    the current status.
                  </p>
                )}
              </div>

              <div>
                <div className="text-[11px] uppercase text-slate-400 mb-1">
                  Description
                </div>
                <p className="text-sm text-slate-800 whitespace-pre-line">
                  {selectedTicket.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
                {selectedTicket.patient_name && (
                  <div>
                    <div className="text-[11px] uppercase text-slate-400">
                      Patient
                    </div>
                    <div>{selectedTicket.patient_name}</div>
                  </div>
                )}
                {selectedTicket.doctor_name && (
                  <div>
                    <div className="text-[11px] uppercase text-slate-400">
                      Doctor
                    </div>
                    <div>{selectedTicket.doctor_name}</div>
                  </div>
                )}
                {selectedTicket.priority && (
                  <div>
                    <div className="text-[11px] uppercase text-slate-400">
                      Priority
                    </div>
                    <div
                      className={`inline-block mt-0.5 px-2 py-0.5 rounded-full border ${priorityBadgeStyle(
                        selectedTicket.priority
                      )}`}
                    >
                      {selectedTicket.priority}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-[11px] uppercase text-slate-400">
                    Created At
                  </div>
                  <div>
                    {new Date(selectedTicket.created_at).toLocaleString(
                      undefined,
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase text-slate-400">
                    Updated At
                  </div>
                  <div>
                    {new Date(selectedTicket.updated_at).toLocaleString(
                      undefined,
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-slate-400 px-6 text-center">
            Select a ticket from the list to view details.
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportTickets;
