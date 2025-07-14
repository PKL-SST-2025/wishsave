import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import Button from "../components/button";
import Input from "../components/input";

export default function LoginFormPage() {
  const navigate = useNavigate();
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    // Ambil semua user
const allUsers: { email: string; password: string }[] = JSON.parse(
  localStorage.getItem("users") || "[]"
);

const found = allUsers.find(
  u =>
    u.email.trim().toLowerCase() === email().trim().toLowerCase() &&
    u.password === password()
);


    if (found) {
      // Simpan user aktif
      localStorage.setItem("currentUser", JSON.stringify(found));
      navigate("/dashboard");
    } else {
      alert("Email atau password salah!");
    }
  };

  const goToForgot = () => {
    navigate("/forgot-password");
  };

  return (
    <div class="min-h-screen bg-[#e9f9f6] flex items-center justify-center font-[Poppins]">
      <div class="w-full max-w-6xl h-[500px] flex overflow-hidden rounded-[20px]">
        {/* KIRI */}
        <div class="w-1/2 relative bg-transparent">
          <div class="absolute inset-0 bg-[#d6eafc] clip-triangle z-0" />
          <div class="relative z-10 h-full flex items-center justify-center">
            <img
              src="/assets/undraw_login_weas.svg"
              alt="Login Illustration"
              class="w-[220px] h-auto"
            />
          </div>
        </div>

        {/* KANAN */}
        <div class="w-1/2 bg-[#e9f9f6] flex flex-col justify-center px-14">
          <h2 class="text-3xl font-bold text-black text-center mb-8">LOGIN</h2>

          <form onSubmit={handleSubmit} class="space-y-5">
           <Input
              type="email"
              placeholder="Email"
              value={email()}
              onInput={(e) =>
                setEmail((e.target as HTMLInputElement).value)
              }
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password()}
              onInput={(e) =>
                setPassword((e.target as HTMLInputElement).value)
              }
              required
            />


            <Button
              type="submit"
              variant="teal"
              class="w-full py-3 rounded-full"
            >
              Sign In
            </Button>
          </form>

          <button
            onClick={goToForgot}
            class="mt-4 text-sm text-[#44c0a0] hover:underline text-center"
          >
            Forgot password ?
          </button>
        </div>
      </div>
    </div>
  );
}
