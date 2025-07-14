import { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";

const ForgotPassword: Component = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    navigate("/verification");
  };

  return (
    <div
      class="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#c1f7f5] via-[#fefefe] to-[#fbe2e9] px-4 overflow-hidden font-[Poppins]"
    >
      {/* Ornamen dreamy blur */}
      <div class="absolute top-[-80px] left-[-80px] w-80 h-80 bg-pink-200/40 blur-3xl rounded-full z-0 animate-pulse"></div>
      <div class="absolute bottom-[-80px] right-[-80px] w-96 h-96 bg-teal-100/40 blur-3xl rounded-full z-0 animate-pulse"></div>

      {/* Optional: pattern image */}
      <div class="absolute inset-0 bg-[url('/assets/forgotpassword.jpeg')] bg-repeat opacity-20 z-0"></div> 

      <div class="relative z-10 bg-white/60 rounded-2xl shadow-xl p-10 w-full max-w-md border border-[#b2e0d5] text-center backdrop-blur-lg">
        {/* Ilustrasi */}
        <img
          src="/assets/undraw_forgot-password_odai.svg"
          alt="Forgot Password Illustration"
          class="w-28 mx-auto mb-6"
        />

        {/* Judul */}
        <h2 class="text-2xl font-bold mb-2">Forgot Password ?</h2>
        <p class="text-gray-600 mb-8 text-sm">
          Masukkan email kamu untuk menerima kode verifikasi
        </p>

        {/* Form */}
        <form class="space-y-6" onSubmit={handleSubmit}>
          <div class="text-left">
            <label class="block text-sm mb-1 font-medium">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              class="w-full px-4 py-3 border border-[#90d9c7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a7ede7] bg-transparent"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-[#a7ede7] hover:bg-[#7ddfd0] text-white font-semibold py-3 rounded-full transition"
          >
            Submit
          </button>
        </form>

        <button
          onClick={() => navigate("/login")}
          class="mt-6 text-sm text-teal-600 hover:underline"
        >
        Kembali ke Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
