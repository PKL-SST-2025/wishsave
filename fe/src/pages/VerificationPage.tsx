import { Component, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import Button from "../components/button";

const VerificationPage: Component = () => {
  const [otp, setOtp] = createSignal(["", "", "", ""]);
  const inputs: HTMLInputElement[] = [];
  const navigate = useNavigate();

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp()];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
  };

  const handleVerify = () => {
    const kode = otp().join("");
    if (kode.length === 4) {
      navigate("/reset-password");
    } else {
      alert("Please enter the full 4-digit code!");
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center font-[Poppins] px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div class="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
        {/* Floating Shapes */}
        <div class="absolute top-20 left-10 w-20 h-20 bg-teal-100/40 rounded-full animate-pulse"></div>
        <div class="absolute top-40 right-20 w-32 h-32 bg-blue-100/30 rounded-full animate-bounce" style="animation-delay: 0.5s;"></div>
        <div class="absolute bottom-32 left-1/4 w-16 h-16 bg-emerald-100/50 rounded-full animate-pulse" style="animation-delay: 1s;"></div>
        <div class="absolute bottom-20 right-1/3 w-24 h-24 bg-cyan-100/35 rounded-full animate-bounce" style="animation-delay: 1.5s;"></div>
        
        {/* Geometric Patterns */}
        <div class="absolute top-1/4 left-1/2 w-40 h-40 border border-teal-200/30 rounded-lg rotate-45 animate-spin" style="animation-duration: 20s;"></div>
        <div class="absolute bottom-1/4 right-1/4 w-32 h-32 border border-blue-200/40 rounded-lg rotate-12 animate-pulse"></div>
        
        {/* Gradient Overlays */}
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      </div>

      {/* Main Content */}
      <div class="relative z-10 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-md text-center border border-white/20">
        {/* Ilustrasi */}
        <div class="flex items-center justify-center mb-6">
          <div class="relative">
            {/* Shield Icon */}
            <div class="w-20 h-20 bg-gradient-to-br from-teal-300 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            {/* Pulse Ring */}
            <div class="absolute inset-0 rounded-2xl border-4 border-teal-300/40 animate-ping"></div>
          </div>
        </div>

        {/* Text */}
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Email Verification</h2>
        <p class="text-gray-600 mb-8 text-sm leading-relaxed">
          Masukkan 4 digit kode verifikasi yang kami kirim ke email kamu
        </p>

        {/* OTP Inputs */}
        <div class="flex justify-center gap-3 mb-8">
          {[...Array(4)].map((_, i) => (
            <input
              ref={(el) => (inputs[i] = el)}
              type="text"
              maxLength={1}
              value={otp()[i]}
              onInput={(e) => handleChange(e.currentTarget.value, i)}
              class="w-14 h-14 border-2 border-gray-200 rounded-xl text-center text-xl font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-teal-300/30 focus:border-teal-300 bg-white/90 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
            />
          ))}
        </div>

        {/* Button */}
        <Button
          type="button"
          onClick={handleVerify}
          variant="teal"
          class="w-full py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          Verify Code
        </Button>

        <button
          onClick={() => navigate("/forgot-password")}
          class="mt-6 text-sm text-teal-600 hover:text-teal-700 hover:underline font-medium transition-colors duration-200"
        >
          ← Back to Forgot Password
        </button>
      </div>

      {/* Additional floating elements for extra visual appeal */}
      <div class="absolute top-10 right-10 w-6 h-6 bg-teal-200/30 rounded rotate-45 animate-spin" style="animation-duration: 8s;"></div>
      <div class="absolute bottom-10 left-10 w-4 h-4 bg-blue-200/40 rounded-full animate-pulse" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/2 left-5 w-8 h-8 border-2 border-emerald-200/25 rounded-full animate-bounce" style="animation-delay: 3s;"></div>
    </div>
  );
};

export default VerificationPage;