import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

type Patient = {
  id: number;
  full_name: string;
  age: number;
  gender: string;
  mrn?: string | null;
  medical_history?: string | null;
  risk_factors?: string | null;
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPatients = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get<Patient[]>(`${API}/api/patients`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPatients(res.data);
      } catch (err: any) {
        console.error(
          "DASHBOARD FETCH PATIENTS ERROR:",
          err.response?.data || err.message
        );
        setError("Failed to load patients.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [API, token, navigate]);

  const totalPatients = patients.length;
  const totalPredictions = 78; // placeholder for now
  const todaysNewCases = 3; // placeholder for now

  const recentPatients = [...patients].reverse().slice(0, 3);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto px-5 py-10">
        {/* HEADER */}
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-50 tracking-tight drop-shadow-lg">
              Doctor Dashboard
            </h1>
            <p className="text-sm text-slate-200 mt-1 max-w-xl">
              Smart glaucoma assessment overview and patient metrics. Visualize
              your OCT-based glaucoma activity at a glance.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              className="px-4 py-2 rounded-lg bg-white/10 text-slate-50 text-sm font-semibold border border-slate-100/40 shadow-sm hover:bg-white/20 transition"
              onClick={() => navigate("/doctor/patients/new")}
            >
              + Add New Patient
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-semibold shadow-lg hover:opacity-90 transition"
              onClick={() => navigate("/doctor/new-prediction")}
            >
              + New Prediction
            </button>
          </div>
        </header>

        {/* ERROR (if any) */}
        {error && (
          <div className="glass-card mb-6 border-red-200 bg-red-50/90 text-red-700">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* KPI CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* TOTAL PATIENTS */}
          <div className="glass-card flex flex-col justify-between min-h-[120px]">
            <p className="text-[11px] font-semibold text-slate-500 tracking-wide">
              TOTAL PATIENTS
            </p>
            <div className="mt-1">
              <p className="text-4xl font-extrabold text-slate-900 leading-tight">
                {loading ? "…" : totalPatients}
              </p>
              <p className="text-[11px] mt-1 text-slate-500">
                Registered patients in your portal
              </p>
            </div>
          </div>

          {/* TOTAL PREDICTIONS */}
          <div className="glass-card flex flex-col justify-between min-h-[120px]">
            <p className="text-[11px] font-semibold text-slate-500 tracking-wide">
              TOTAL PREDICTIONS
            </p>
            <div className="mt-1">
              <p className="text-4xl font-extrabold text-slate-900 leading-tight">
                {totalPredictions}
              </p>
              <p className="text-[11px] mt-1 text-slate-500">
                Glaucoma assessments recorded (demo)
              </p>
            </div>
          </div>

          {/* TODAY'S NEW CASES */}
          <div className="glass-card flex flex-col justify-between min-h-[120px]">
            <p className="text-[11px] font-semibold text-slate-500 tracking-wide">
              TODAY&apos;S NEW CASES
            </p>
            <div className="mt-1">
              <p className="text-4xl font-extrabold text-slate-900 leading-tight">
                {todaysNewCases}
              </p>
              <p className="text-[11px] mt-1 text-slate-500">
                Patients added today (placeholder)
              </p>
            </div>
          </div>
        </section>

        {/* RECENT PREDICTIONS */}
        <section className="glass-card overflow-hidden">
          <div className="px-4 pb-3 border-b border-slate-200/80 mb-1">
            <h2 className="text-base font-semibold text-slate-800">
              Recent Predictions
            </h2>
          </div>

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wide">
                <th className="px-4 py-3 text-left">Patient</th>
                <th className="px-4 py-3 text-left">Date / Time</th>
                <th className="px-4 py-3 text-left">Stage</th>
                <th className="px-4 py-3 text-left">Probability</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    Loading recent predictions…
                  </td>
                </tr>
              )}

              {!loading && recentPatients.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    No predictions yet. Run your first OCT prediction to see it
                    here.
                  </td>
                </tr>
              )}

              {!loading &&
                recentPatients.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-slate-100 hover:bg-slate-50/80 transition"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {p.full_name}
                    </td>
                    <td className="px-4 py-3 text-slate-500">—</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-slate-200 text-slate-700 px-2 py-0.5 text-xs font-medium">
                        Pending
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">—</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
