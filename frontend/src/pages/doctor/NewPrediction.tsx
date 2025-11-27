import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useNavigate, useSearchParams } from "react-router-dom";

type Patient = {
  id: number;
  full_name: string;
  mrn?: string | null;
};

type PredictionResult = {
  prediction: string;
  probabilities: Record<string, number>;
  explainability?: any;
};

export default function NewPrediction() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    searchParams.get("patientId") || ""
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const API = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
  const token = localStorage.getItem("token");

  // Fetch patients for dropdown
  useEffect(() => {
    const fetchPatients = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get<Patient[]>(`${API}/api/patients`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(res.data);
      } catch (err: any) {
        console.error(
          "FETCH PATIENTS FOR PREDICTION ERROR:",
          err.response?.data || err.message
        );
        setError("Failed to load patients for prediction.");
      }
    };

    fetchPatients();
  }, [API, token, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setResult(null);
    setUploadProgress(null);
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setImageFile(file);
      setResult(null);
      setUploadProgress(null);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setResult(null);

    if (!token) {
      navigate("/login");
      return;
    }

    if (!imageFile) {
      setError("Please upload an OCT image before running prediction.");
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();

      // ⚠️ Field name must match FastAPI route.
      // If your /docs shows "file" instead of "image", change "image" to "file".
      formData.append("image", imageFile);

      if (selectedPatientId) {
        formData.append("patient_id", selectedPatientId);
      }

      const res = await axios.post<PredictionResult>(
        `${API}/api/predict/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (event) => {
            if (event.total) {
              const percent = Math.round((event.loaded * 100) / event.total);
              setUploadProgress(percent);
            }
          },
        }
      );

      setResult(res.data);
    } catch (err: any) {
      console.error(
        "RUN PREDICTION ERROR:",
        err.response?.data || err.message
      );
      setError(
        err.response?.data?.detail ||
          "Failed to run prediction. Check console for details."
      );
    } finally {
      setSubmitting(false);
      // keep progress at 100% briefly if needed; we won’t reset here
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-4xl mx-auto px-5 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-50 drop-shadow-lg tracking-tight">
            New OCT Prediction
          </h1>
          <p className="text-sm text-slate-200 mt-1 max-w-xl">
            Upload an OCT scan, link it to a patient, and run the glaucoma
            staging model.
          </p>
        </div>

        {/* ERROR BANNER */}
        {error && (
          <div className="glass-card mb-6 border border-red-200 bg-red-50/90 text-red-700">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* MAIN CARD (like cPanel style) */}
        <div className="glass-card mb-8 space-y-5">
          {/* Patient selection */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Patient (optional but recommended)
            </label>
            <select
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
            >
              <option value="">Select a patient (optional)</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id.toString()}>
                  {p.full_name} {p.mrn ? `• ${p.mrn}` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* INFO BAR (max size like screenshot) */}
          <div className="w-full rounded-md bg-blue-50 border border-blue-100 px-3 py-2 text-xs text-blue-800">
            Maximum file size allowed for upload: 50 MB. OCT image formats
            (PNG, JPG) are recommended.
          </div>

          {/* UPLOAD AREA (drag & drop like screenshot) */}
          <div
            className={`w-full rounded-xl border-2 border-dashed px-6 py-8 text-center transition
            ${
              isDragging
                ? "border-blue-500 bg-blue-50/50"
                : "border-slate-300 bg-slate-50/70"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <p className="text-sm text-slate-700 mb-2 font-medium">
              Drop OCT image here to start uploading
            </p>
            <p className="text-xs text-slate-500 mb-4">
              or click the button below to choose a file from your device
            </p>

            <input
              id="octFile"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              type="button"
              onClick={() => document.getElementById("octFile")?.click()}
              className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 transition"
              disabled={submitting}
            >
              Select File
            </button>

            {imageFile && (
              <p className="text-xs text-slate-600 mt-4">
                Selected file:{" "}
                <span className="font-semibold">{imageFile.name}</span>
              </p>
            )}
          </div>

          {/* PROGRESS BAR (like cPanel green bar) */}
          {uploadProgress !== null && (
            <div className="mt-3 text-xs text-slate-600">
              <p className="mb-1">
                Upload progress:{" "}
                <span className="font-semibold">
                  {uploadProgress}
                  %
                </span>
              </p>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              className="px-4 py-2 rounded-md border text-sm text-slate-700 hover:bg-slate-100"
              onClick={() => navigate("/doctor/dashboard")}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Running Prediction…" : "Run Prediction"}
            </button>
          </div>
        </div>

        {/* RESULT CARD */}
        {result && (
          <div className="glass-card space-y-4">
            <h2 className="text-lg font-bold text-slate-800">
              Prediction Result
            </h2>

            <div>
              <p className="text-sm text-slate-600 mb-1">Predicted Stage</p>
              <p className="text-2xl font-extrabold text-blue-700">
                {result.prediction}
              </p>
            </div>

            {result.probabilities && (
              <div>
                <p className="text-sm text-slate-600 mb-2">
                  Class Probabilities
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {Object.entries(result.probabilities).map(
                    ([label, value]) => (
                      <div
                        key={label}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      >
                        <p className="font-semibold text-slate-800 capitalize">
                          {label}
                        </p>
                        <p className="text-slate-600">
                          {(value * 100).toFixed(1)}%
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
