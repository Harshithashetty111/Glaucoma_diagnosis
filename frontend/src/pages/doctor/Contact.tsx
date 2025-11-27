import { useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";   // <-- 🚀 important

type SupportForm = {
  name: string;
  email: string;
  issueType: string;
  message: string;
};

type FaqItem = {
  category: string;
  title: string;
  body: string;
};

const FAQS: FaqItem[] = [
  { category: "Getting Started", title: "How do I add a new patient?", body: "Go to the Patients tab and click on “Add Patient”..." },
  { category: "Getting Started", title: "How do I run a glaucoma prediction?", body: "From Dashboard click 'New Prediction'..." },
  { category: "OCT Upload", title: "What image formats are supported?", body: "JPG, PNG recommended..." },
  { category: "OCT Upload", title: "Upload keeps failing or slow.", body: "Resize image or raise ticket below..." },
  { category: "Prediction & XAI", title: "Prediction looks wrong", body: "Submit sample case via support..." },
  { category: "Prediction & XAI", title: "What do probabilities mean?", body: "Confidence score for decision support..." },
];

export default function Contact() {
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<SupportForm>({ name: "", email: "", issueType: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

  const filteredFaqs = FAQS.filter(f =>
    !search ? true : f.title.toLowerCase().includes(search) || f.body.toLowerCase().includes(search) || f.category.toLowerCase().includes(search)
  );

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setSubmitted(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitted(false);
    setError(null);

    try {
      await axios.post(`${API}/api/support-tickets`, {
        name: form.name,
        email: form.email,
        issue_type: form.issueType,
        message: form.message,
      });

      setSubmitted(true);
      setForm({ name: "", email: "", issueType: "", message: "" });
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to submit support ticket ❌");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto px-5 py-10 space-y-8">

        {/* HEADER */}
        <section className="glass-card overflow-hidden p-0">
          <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr]">

            {/* Left */}
            <div className="px-6 py-6 md:py-8 flex flex-col justify-center">
              <p className="text-xs font-semibold text-blue-300 uppercase tracking-wide mb-1">Glaucoma XAI Support</p>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-50 mb-1 drop-shadow">Help & Support Center</h1>
              <p className="text-sm text-slate-200 mb-4 max-w-xl">
                Search FAQs or submit an internal support ticket for technical issues.
              </p>

              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search here..."
                className="w-full rounded-full bg-white border px-4 py-2 shadow focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="glass-card">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Browse FAQ</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-800">
            {filteredFaqs.map(f => (
              <div key={f.title}>
                <p className="font-semibold">{f.title}</p>
                <p className="text-xs text-slate-600 mt-1">{f.body}</p>
              </div>
            ))}
          </div>
          {filteredFaqs.length === 0 && <p className="text-xs text-slate-500 mt-2">No FAQ match found.</p>}
        </section>

        {/* SUPPORT FORM */}
        <section className="glass-card">

          {/* 🔥 NEW BUTTON SO YOU CAN OPEN SUPPORT PAGE WITHOUT TYPING URL */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900">Submit a Ticket</h2>
            
            <Link
              to="/doctor/support-tickets"
              className="px-4 py-2 text-xs border rounded-md hover:bg-slate-100">
              🔍 View Support Tickets
            </Link>
          </div>

          {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
          {submitted && <p className="text-xs text-emerald-600 mb-2">✔ Ticket submitted successfully</p>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 gap-4">
              <input name="name" value={form.name} onChange={handleFormChange} className="border px-3 py-2 rounded" placeholder="Your Name" required />
              <input name="email" type="email" value={form.email} onChange={handleFormChange} className="border px-3 py-2 rounded" placeholder="Email" required />
            </div>

            <select name="issueType" value={form.issueType} onChange={handleFormChange} className="border px-3 py-2 rounded" required>
              <option value="">Select Issue</option>
              <option value="prediction-error">Prediction error</option>
              <option value="upload-problem">Upload problem</option>
              <option value="ui-bug">UI glitch</option>
              <option value="access">Login issue</option>
              <option value="suggestion">Suggestion</option>
              <option value="other">Other</option>
            </select>

            <textarea name="message" value={form.message} onChange={handleFormChange} className="border px-3 py-2 rounded w-full" rows={4} required />

            <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded">
              {submitting ? "Submitting…" : "Submit Ticket"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
