import { useNavigate } from "@solidjs/router";
import Button from "../components/button";

export default function LandingPage() {
  const navigate = useNavigate();

  const goToAuth = () => {
    navigate("/login");
  };

  return (
    <div class="relative min-h-screen w-full bg-gradient-to-br from-[#c1f7f5] via-[#fefefe] to-[#fbe2e9] flex flex-col items-center justify-center overflow-hidden px-6 py-12 text-center font-[Poppins]">

      {/* Optional: Background pattern */}
      <div 
        class="absolute inset-0 bg-[url('/assets/landingpage.jpeg')] bg-repeat opacity-20 z-0" 
      />

      {/* Ornamen dreamy */}
      <div class="absolute top-[-80px] left-[-80px] w-80 h-80 bg-pink-200/40 blur-3xl rounded-full z-0 animate-pulse" />
      <div class="absolute bottom-[-80px] right-[-80px] w-96 h-96 bg-teal-100/40 blur-3xl rounded-full z-0 animate-pulse" />

      {/* Logo */}
      <div class="relative z-10 flex items-center gap-4 mb-6">
        <div class="text-4xl">✨</div>
        <h1 class="text-4xl md:text-5xl font-extrabold text-teal-600 tracking-wide drop-shadow">
          WishSave
        </h1>
      </div>

      {/* Headline */}
      <h2 class="relative z-10 text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-snug">
        Make Your Dreams <br /> Come True 🌟
      </h2>

      {/* Subtitle */}
      <p class="relative z-10 text-gray-600 max-w-xl mb-10 text-base md:text-lg px-4">
        Catat semua wishlist impianmu dan kelola tabungan dengan cara paling mudah, visual menarik, dan penuh motivasi.
      </p>

      {/* Ilustrasi */}
      <div class="relative z-10 w-[260px] md:w-[320px] aspect-square bg-white/60 border border-dashed border-teal-200 rounded-3xl shadow-xl mb-10 flex items-center justify-center text-5xl">
        🎁💖
      </div>

      {/* Tombol CTA */}
      <Button onClick={goToAuth} variant="gradient" class="z-10">
  Get Started
</Button>

    </div>
  );
}
