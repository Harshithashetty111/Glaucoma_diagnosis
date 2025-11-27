import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";

type PatientApi = {
  id: number;
  full_name: string;
  age: number;
  gender: string;
  mrn?: string | null;
  medical_history?: string | null;
  risk_factors?: string | null;
};

type PatientForm = {
  name: string;
  age: string;
  gender: string;
  patient_code: string;
  medical_history: string;
  risk_factors: string;
};

export default function EditPatient() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<PatientForm>({
    name: "",
    age: "",
    gender: "",
    patient_code: "",
    medical_history: "",
    risk_factors: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
  const token = localStorage.getItem("token");

  // load existing patient
  useEffect(() => {
    const fetchPatient = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get<PatientApi>(`${API}/api/patients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const p = res.data;
        setForm({
          name: p.full_name,
          age: String(p.age),
          gender: p.gender,
          patient_code: p.mrn || "",
          medical_history: p.medical_history || "",
          risk_factors: p.risk_factors || "",
        });
      } catch (err: any) {
        console.error(
          "FETCH PATIENT FOR EDIT ERROR:",
          err.response?.data || err.message
        );
        setError("Failed to load patient for editing.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPatient();
  }, [API, id, token, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!form.name || !form.age || !form.gender) {
      alert("Name, age and gender are required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        full_name: form.name,
        age: Number(form.age),
        gender: form.gender,
        medical_history: form.medical_history,
        risk_factors: form.risk_factors,
        mrn: form.patient_code || null,
      };

      await axios.put(`${API}/api/patients/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Patient updated successfully!");
      navigate(`/doctor/patients/${id}`);
    } catch (err: any) {
      console.error(
        "UPDATE PATIENT ERROR:",
        err.response?.data || err.message
      );
      setError("Failed to update patient. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <button
          className="text-xs text-slate-200 mb-4 hover:underline"
          onClick={() => navigate(`/doctor/patients/${id}`)}
        >
          ← Back to Patient
        </button>

        <h1 className="text-2xl font-bold text-slate-50 mb-2">
          Edit Patient
        </h1>
        <p className="text-sm text-slate-200 mb-6 max-w-xl">
          Update patient demographics and glaucoma risk information.
        </p>

        {error && (
          <div className="glass-card mb-4 border border-red-200 bg-red-50/90 text-red-700">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="glass-card space-y-4">
          {loading ? (
            <p className="text-sm text-slate-600">Loading patient…</p>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Patient Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    className="w-full border rounded-md p-2 text-sm"
                    placeholder="Full name"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Age
                  </label>
                  <input
                    name="age"
                    type="number"
                    value={form.age}
                    className="w-full border rounded-md p-2 text-sm"
                    placeholder="Age in years"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Gender
                  </label>
                  <input
                    name="gender"
                    value={form.gender}
                    className="w-full border rounded-md p-2 text-sm"
                    placeholder="M / F / Other"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Patient Code / MRN
                  </label>
                  <input
                    name="patient_code"
                    value={form.patient_code}
                    className="w-full border rounded-md p-2 text-sm"
                    placeholder="Hospital MRN or custom ID"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Medical History
                </label>
                <textarea
                  name="medical_history"
                  value={form.medical_history}
                  className="w-full border rounded-md p-2 text-sm"
                  rows={3}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Risk Factors
                </label>
                <textarea
                  name="risk_factors"
                  value={form.risk_factors}
                  className="w-full border rounded-md p-2 text-sm"
                  rows={3}
                  onChange={handleChange}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  className="px-4 py-2 rounded-md border text-sm text-slate-700 hover:bg-slate-100"
                  onClick={() => navigate(`/doctor/patients/${id}`)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
                  onClick={handleSubmit}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
