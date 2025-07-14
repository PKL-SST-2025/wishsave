import { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";
import Button from "../components/button";
import Input from "../components/input";


const ResetPassword: Component = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    // ✅ Ambil input
    const newPassword = (document.getElementById("newPassword") as HTMLInputElement).value;
    const confirmPassword = (document.getElementById("confirmPassword") as HTMLInputElement).value;

    if (newPassword !== confirmPassword) {
      alert("Password tidak sama!");
      return;
    }

    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!user) {
      alert("User tidak ditemukan. Silakan login ulang.");
      navigate("/login/form");
      return;
    }

    // ✅ Update user di storage
    user.password = newPassword;
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("user", JSON.stringify(user)); // simpan ke global user juga

    alert("Password berhasil diubah! Silakan login dengan password baru.");
    navigate("/login/form"); // arahkan ke LoginFormPage
  };

  return (
    <div
      class="min-h-screen flex items-center justify-center bg-center bg-no-repeat bg-cover font-[Poppins] px-4"
      style={{
        "background-image": "url('/assets/verification.jpeg')",
        "background-size": "cover",
      }}
    >
      <div class="bg-white rounded-2xl shadow-md p-10 w-full max-w-md border border-[#7ddfd0] relative overflow-hidden">
        <div class="relative z-10">
          <h2 class="text-2xl font-bold mb-6 text-center">Reset Your Password</h2>

          <form class="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label class="block mb-1 font-medium">New Password</label>
              <input
                id="newPassword"
                type="password"
                placeholder="Enter a new password"
                class="w-full px-4 py-3 border border-[#90d9c7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a7ede7]"
                required
              />
            </div>
            <div>
              <label class="block mb-1 font-medium">Confirm new password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                class="w-full px-4 py-3 border border-[#90d9c7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a7ede7]"
                required
              />
            </div>
            <Button type="submit" variant="teal" class="w-full rounded-full py-3">Simpan</Button>

          </form>
        </div>

        <img
          src="/assets/undraw_my-password_iyga.svg"
          alt="Reset Password Illustration"
          class="w-24 absolute top-6 right-6 z-0 opacity-90"
        />
      </div>
    </div>
  );
};

export default ResetPassword;
