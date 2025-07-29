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

    const allUsers: { email: string; password: string }[] = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    const found = allUsers.find(
      (u) =>
        u.email.trim().toLowerCase() === email().trim().toLowerCase() &&
        u.password === password()
    );

    if (found) {
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
    <div class="min-h-screen flex items-center justify-center bg-[#e9f9f6] font-[Poppins] px-4">
      <div class="flex w-full max-w-4xl bg-white rounded-xl overflow-hidden shadow-md flex-col md:flex-row">
        {/* LEFT SIDE - Illustration */}
        <div class="w-full md:w-1/2 bg-[#d6eafc] flex items-center justify-center p-10">
          <img
            src="/assets/undraw_login_weas.svg"
            alt="Login Illustration"
            class="w-[180px] md:w-[220px] h-auto"
          />
        </div>

        {/* RIGHT SIDE - Form */}
        <div class="w-full md:w-1/2 bg-white p-10 md:p-12 flex flex-col justify-center">
          <h2 class="text-2xl md:text-3xl font-bold text-black text-center mb-6">
            LOGIN
          </h2>

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
