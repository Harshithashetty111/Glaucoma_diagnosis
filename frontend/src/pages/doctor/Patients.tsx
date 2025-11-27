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

export default function Patients() {
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
          "FETCH PATIENTS ERROR:",
          err.response?.data || err.message
        );
        setError("Failed to load patients.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [API, token, navigate]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto px-5 py-10">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-50 tracking-tight drop-shadow-lg">
              Patient Records
            </h1>
            <p className="text-slate-200 mt-1 text-sm max-w-xl">
              Review and manage registered patients, and launch glaucoma
              predictions directly from the table.
            </p>
          </div>

          <button
            onClick={() => navigate("/doctor/patients/new")}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white
                       text-sm font-semibold shadow-lg hover:opacity-90 transition-all"
          >
            + Add Patient
          </button>
        </div>

        {/* ERROR (if any) */}
        {error && (
          <div className="glass-card mb-6 border-red-200 bg-red-50/90 text-red-700">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* TABLE CARD */}
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-[13px] uppercase tracking-wide">
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Patient Code</th>
                <th className="px-6 py-3 text-left">Age</th>
                <th className="px-6 py-3 text-left">Gender</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-6 text-center text-slate-500"
                  >
                    Loading patients…
                  </td>
                </tr>
              )}

              {!loading && patients.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-6 text-center text-slate-500"
                  >
                    No patients yet. Click &quot;Add Patient&quot; to create one.
                  </td>
                </tr>
              )}

              {!loading &&
                patients.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-slate-200 hover:bg-slate-50/80 transition-all"
                  >
                    <td className="px-6 py-3 font-medium text-slate-900">
                      {p.full_name}
                    </td>
                    <td className="px-6 py-3 text-slate-600">
                      {p.mrn || "—"}
                    </td>
                    <td className="px-6 py-3">{p.age}</td>
                    <td className="px-6 py-3">{p.gender}</td>

                    <td className="px-6 py-3">
                      <div className="flex items-center gap-6">
                        <button
                          className="text-blue-700 font-semibold hover:underline"
                          onClick={() => navigate(`/doctor/patients/${p.id}`)}
                        >
                          View
                        </button>

                        <button
                          className="text-amber-600 font-semibold hover:underline"
                          onClick={() =>
                            navigate(`/doctor/patients/${p.id}/edit`)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="text-emerald-600 font-semibold hover:underline"
                          onClick={() =>
                            navigate(
                              `/doctor/new-prediction?patientId=${p.id}`
                            )
                          }
                        >
                          New Prediction ⟶
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
