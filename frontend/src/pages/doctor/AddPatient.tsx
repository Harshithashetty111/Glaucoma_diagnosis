import { useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

type PatientForm = {
  name: string;
  age: string;
  gender: string;
  patient_code: string;
  medical_history: string;
  risk_factors: string;
};

export default function AddPatient() {
  const navigate = useNavigate();

  const [form, setForm] = useState<PatientForm>({
    name: "",
    age: "",
    gender: "",
    patient_code: "",
    medical_history: "",
    risk_factors: "",
  });

  const API = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
  const token = localStorage.getItem("token");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!token) {
      alert("Please login again.");
      navigate("/login");
      return;
    }

    if (!form.name || !form.age || !form.gender) {
      alert("Name, age and gender are required.");
      return;
    }

    try {
      const payload = {
        // 👇 EXACTLY what FastAPI expects
        full_name: form.name,
        age: Number(form.age),
        gender: form.gender,
        medical_history: form.medical_history,
        risk_factors: form.risk_factors,
        mrn: form.patient_code || null,
      };

      console.log("SENDING PATIENT PAYLOAD:", payload);

      const res = await axios.post(`${API}/api/patients`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("PATIENT CREATED:", res.data);
      alert("Patient added successfully!");
      navigate("/doctor/patients");
    } catch (err: any) {
      console.error("ADD PATIENT ERROR:", err.response?.data || err.message);
      alert("Failed to add patient. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-medicalBlue mb-2">
          Add New Patient
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Register a new patient and capture key risk factors relevant for
          glaucoma.
        </p>

        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
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
              placeholder="E.g. prior ocular surgery, high IOP, myopia…"
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
              placeholder="E.g. family history, diabetes, steroid use…"
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              className="px-4 py-2 rounded-md border text-sm text-slate-700 hover:bg-slate-100"
              onClick={() => navigate("/doctor/patients")}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-md bg-medicalBlue text-white text-sm font-medium hover:bg-blue-700"
              onClick={handleSubmit}
            >
              Save Patient
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
