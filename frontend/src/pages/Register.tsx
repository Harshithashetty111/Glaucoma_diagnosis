import { useState } from "react";
import axios from "axios";

/* FULL WORKING REGISTER PAGE */

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    hospital: "",
    specialization: "",
    experience_years: "",
  });

  // IMPORTANT - API base URL (frontend/.env must have VITE_API_BASE_URL)
  const API = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

  const register = async () => {
    try {
      const res =await axios.post(`${API}/api/auth/register`
, {
        ...form,
        experience_years: Number(form.experience_years),
      });

      console.log("REGISTER SUCCESS:", res.data);
      alert("Registration Successful!");
      window.location.href = "/login";
      
    } catch (err: any) {
      console.error("REGISTER ERROR:", err.response?.data || err.message);
      alert("Registration Failed. Check console for details.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">

        <h2 className="text-3xl font-bold mb-6 text-center text-medicalBlue">
          Doctor Registration
        </h2>

        <div className="space-y-4">

          <input
            name="name"
            className="w-full border p-2 rounded-md focus:ring outline-none"
            placeholder="Full Name"
            onChange={handleChange}
          />

          <input
            name="email"
            className="w-full border p-2 rounded-md"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            className="w-full border p-2 rounded-md"
            placeholder="Password"
            onChange={handleChange}
          />

          <input
            name="hospital"
            className="w-full border p-2 rounded-md"
            placeholder="Hospital / Clinic"
            onChange={handleChange}
          />

          <input
            name="specialization"
            className="w-full border p-2 rounded-md"
            placeholder="Specialization"
            onChange={handleChange}
          />

          <input
            name="experience_years"
            className="w-full border p-2 rounded-md"
            placeholder="Years of Experience"
            onChange={handleChange}
          />

        </div>

        <button
          onClick={register}
          className="mt-6 w-full bg-accent text-white py-2 rounded-md font-medium hover:bg-green-600 transition"
        >
          Register
        </button>

        <p className="mt-4 text-center text-sm">
          Already registered?{" "}
          <a href="/login" className="text-medicalBlue font-semibold">
            Login
          </a>
        </p>

      </div>
    </div>
  );
}
