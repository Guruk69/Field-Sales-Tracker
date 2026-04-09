import { useState } from "react";

interface LoginProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        onLogin();
      } else {
        setError(data.message || "Login failed ❌");
      }
    } catch (err) {
      setError("Server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      
      {/* Container */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200">

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-black mb-6">
          Welcome Back 👋
        </h2>

        {/* Inputs */}
        <div className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-black !text-white p-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Field Sales Tracker
        </p>

      </div>
    </div>
  );
};

export default LoginView;