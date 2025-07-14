import { useNavigate } from "@solidjs/router";
import Button from "../components/button";


export default function LoginPage() {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate("/login/form"); // arahkan ke form login detail
  };

  const goToRegister = () => {
    navigate("/signup");
  };

  return (
    <div class="min-h-screen bg-black flex items-center justify-center font-[Poppins] relative overflow-hidden px-4">
      {/* Logo di pojok kiri atas */}
      <div class="absolute top-6 left-6 z-20 flex items-center gap-2 text-white">
        <span class="text-xl">🛍️</span>
        <span class="text-lg font-bold">WishSave</span>
      </div>

      {/* Ornamen dreamy */}
      <div class="absolute inset-0 z-0">
        {[...Array(10)].map((_, i) => (
          <div
            class="absolute bg-white/5 rounded-full blur-2xl"
            style={{
              width: `${60 + Math.random() * 100}px`,
              height: `${60 + Math.random() * 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Konten Tengah */}
      <div class="relative z-10 text-center w-full max-w-md">
        <h1 class="text-5xl font-bold text-white mb-4">Welcome Back!</h1>

        <p class="text-white/80 mb-4 text-sm">
          To keep connected with us please login with your personal info
        </p>

        <p class="text-white/60 text-sm mb-8">
          Don’t have an account?{" "}
          <button
            onClick={goToRegister}
            class="text-teal-400 font-medium hover:underline"
          >
            Sign Up
          </button>
        </p>

        <Button onClick={handleSignInClick}>Sign In</Button>

      </div>
    </div>
  );
}
