import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const doctorName = localStorage.getItem("doctorName") || "Doctor";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("doctorName");
    navigate("/login");
  };

  return (
    <nav className="bg-medicalBlue text-white px-6 py-3 flex items-center justify-between shadow">
      <div
        className="font-bold text-lg cursor-pointer"
        onClick={() => navigate("/doctor/home")}
      >
        Glaucoma XAI Portal
      </div>

      <div className="hidden md:flex items-center gap-4 text-sm">
        <Link to="/doctor/home" className="hover:underline">
          Home
        </Link>
        <Link to="/doctor/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/doctor/patients" className="hover:underline">
          Patients
        </Link>
        <Link to="/doctor/new-prediction" className="hover:underline">
          New Prediction
        </Link>
        <Link to="/doctor/model-info" className="hover:underline">
          Model Info
        </Link>
        <Link to="/doctor/contact" className="hover:underline">
          Contact
        </Link>

        <div className="ml-4 flex items-center gap-2">
          <span className="text-xs opacity-80">Hi, Dr. {doctorName}</span>
          <button
            onClick={logout}
            className="bg-white text-medicalBlue px-3 py-1 rounded text-xs font-semibold hover:bg-blue-100"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
