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
    <div
      class="min-h-screen flex items-center justify-center bg-cover bg-center font-[Poppins] px-4"
      style={{ "background-image": "url('/assets/verification.jpeg')" }}
    >
      <div class="bg-white/70 backdrop-blur-lg rounded-2xl shadow-md p-10 w-full max-w-md text-center border border-[#b2e0d5]">
        {/* Ilustrasi */}
        <img
          src="/assets/undraw_security-on_btwg.svg"
          alt="Verification Illustration"
          class="w-28 mx-auto mb-6"
        />

        {/* Text */}
        <p class="text-gray-700 mb-8 text-sm">
          Masukkan 4 digit kode verifikasi yang kami kirim ke email kamu
        </p>

        {/* OTP Inputs */}
        <div class="flex justify-center gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <input
              ref={(el) => (inputs[i] = el)}
              type="text"
              maxLength={1}
              value={otp()[i]}
              onInput={(e) => handleChange(e.currentTarget.value, i)}
              class="w-12 h-12 border-2 border-[#90d9c7] rounded-md text-center text-xl focus:outline-none focus:ring-2 focus:ring-[#a7ede7] bg-transparent"
            />
          ))}
        </div>

        {/* Button */}
        <Button
  type="button"
  onClick={handleVerify}
  variant="teal"
  class="w-full py-3 rounded-full"
>
  Verify
</Button>


        <button
          onClick={() => navigate("/forgot-password")}
          class="mt-6 text-sm text-teal-600 hover:underline"
        >
          Back to Forgot Password
        </button>
      </div>
    </div>
  );
};

export default VerificationPage;
