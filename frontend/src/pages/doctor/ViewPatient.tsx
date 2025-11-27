import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";

type Patient = {
  id: number;
  full_name: string;
  age: number;
  gender: string;
  mrn?: string | null;
  medical_history?: string | null;
  risk_factors?: string | null;
};

export default function ViewPatient() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPatient = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get<Patient>(`${API}/api/patients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatient(res.data);
      } catch (err: any) {
        console.error(
          "FETCH PATIENT ERROR:",
          err.response?.data || err.message
        );
        setError("Failed to load patient details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPatient();
  }, [API, id, token, navigate]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("");
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-5 py-8">
        {/* Back link */}
        <button
          className="text-xs text-slate-200 mb-4 hover:underline"
          onClick={() => navigate("/doctor/patients")}
        >
          ← Back to Patient List
        </button>

        {error && (
          <div className="glass-card mb-4 border border-red-200 bg-red-50/90 text-red-700">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {loading && (
          <div className="glass-card">
            <p className="text-sm text-slate-600">Loading patient…</p>
          </div>
        )}

        {!loading && patient && (
          <div className="space-y-6">
            {/* ======= TOP HEADER – like dashboard card ======= */}
            <section className="glass-card flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Left: avatar + name + demographics */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                  {getInitials(patient.full_name)}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-extrabold text-slate-900">
                      {patient.full_name}
                    </h1>
                    {patient.mrn && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        MRN: {patient.mrn}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-600 mt-1">
                    {patient.gender} • {patient.age} years
                  </p>
                </div>
              </div>

              {/* Right: quick actions */}
              <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                <button
                  className="px-3 py-1.5 rounded-md border text-xs font-medium text-slate-700 hover:bg-slate-100"
                  onClick={() =>
                    navigate(`/doctor/patients/${patient.id}/edit`)
                  }
                >
                  Edit Details
                </button>
                <button
                  className="px-3 py-1.5 rounded-md bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700"
                  onClick={() =>
                    navigate(`/doctor/new-prediction?patientId=${patient.id}`)
                  }
                >
                  New Prediction
                </button>
              </div>
            </section>

            {/* ======= SUMMARY STRIP (like CVD / BP etc – we use simple placeholders) ======= */}
            <section className="glass-card">
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                Glaucoma Summary
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="border border-slate-200 rounded-lg px-3 py-2 flex flex-col gap-1">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">
                    Current Stage
                  </p>
                  <p className="text-lg font-bold text-slate-900">Pending</p>
                  <p className="text-[11px] text-slate-500">
                    Last OCT prediction not recorded in demo.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-lg px-3 py-2 flex flex-col gap-1">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">
                    Risk Profile
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {patient.risk_factors ? "Documented" : "Not documented"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Based on clinician-entered risk factors.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-lg px-3 py-2 flex flex-col gap-1">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">
                    Follow-up Status
                  </p>
                  <p className="text-lg font-bold text-slate-900">—</p>
                  <p className="text-[11px] text-slate-500">
                    Follow-up scheduling can be added later.
                  </p>
                </div>
              </div>
            </section>

            {/* ======= DETAIL PANELS ======= */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Medical History */}
              <div className="glass-card">
                <h3 className="text-sm font-semibold text-slate-800 mb-2">
                  Medical History
                </h3>
                <p className="text-sm text-slate-800 whitespace-pre-line">
                  {patient.medical_history && patient.medical_history.trim()
                    ? patient.medical_history
                    : "No medical history entered for this patient."}
                </p>
              </div>

              {/* Risk Factors */}
              <div className="glass-card">
                <h3 className="text-sm font-semibold text-slate-800 mb-2">
                  Glaucoma Risk Factors
                </h3>
                <p className="text-sm text-slate-800 whitespace-pre-line">
                  {patient.risk_factors && patient.risk_factors.trim()
                    ? patient.risk_factors
                    : "No specific glaucoma risk factors recorded."}
                </p>
              </div>
            </section>

            {/* ======= FUTURE: LATEST PREDICTIONS (placeholder) ======= */}
            <section className="glass-card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-800">
                  Recent OCT Predictions
                </h3>
                <span className="text-[11px] text-slate-500">
                  (Demo placeholder – not linked to model yet)
                </span>
              </div>
              <p className="text-sm text-slate-700">
                Prediction history will appear here once you start storing
                results per patient. For now, use the{" "}
                <span className="font-semibold">New Prediction</span> button
                above to run an OCT scan through the model.
              </p>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
