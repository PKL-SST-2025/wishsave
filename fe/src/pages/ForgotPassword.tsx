import { Component, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";

const ForgotPassword: Component = () => {
  const navigate = useNavigate();
  
  // State management
  const [email, setEmail] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal("");
  const [success, setSuccess] = createSignal(false);

  // Email validation
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!email()) {
      setError("Email wajib diisi");
      return;
    }
    
    if (!validateEmail(email())) {
      setError("Format email tidak valid");
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      
      // Show success state briefly before navigating
      setTimeout(() => {
        navigate("/verification", { 
          state: { email: email() } 
        });
      }, 1500);
      
    } catch (err) {
      setError("Terjadi kesalahan, silakan coba lagi");
      setIsLoading(false);
    }
  };

  return (
    <div class="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 overflow-hidden font-[Poppins]">
      
      {/* Soft mesh gradient background */}
      <div class="absolute inset-0 bg-gradient-to-tr from-blue-100/50 via-indigo-50/30 to-purple-100/40 animate-pulse"></div>
      
      {/* Subtle floating orbs */}
      <div class="absolute top-[-80px] left-[-80px] w-80 h-80 bg-gradient-to-r from-blue-200/30 to-indigo-300/20 blur-3xl rounded-full animate-float"></div>
      <div class="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-gradient-to-r from-indigo-200/25 to-purple-300/20 blur-3xl rounded-full animate-float-delay"></div>
      <div class="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-teal-200/20 to-blue-300/15 blur-3xl rounded-full animate-float-slow"></div>
      
      {/* Minimalist accent dots */}
      <div class="absolute top-32 right-32 w-3 h-3 bg-indigo-300/60 rounded-full animate-pulse"></div>
      <div class="absolute bottom-40 left-20 w-4 h-4 bg-blue-300/50 rounded-full animate-ping"></div>
      <div class="absolute top-20 left-1/3 w-2 h-2 bg-purple-300/70 rounded-full animate-bounce"></div>
      
      {/* Very subtle grid pattern */}
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDk5LCAxMDIsIDI0MSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
      
      {/* Main card */}
      <div class="relative z-10 bg-white/70 rounded-3xl shadow-2xl p-10 w-full max-w-md border border-white/50 text-center backdrop-blur-xl transform transition-all duration-500 hover:scale-[1.02]">
        
        {/* Success state overlay */}
        {success() && (
          <div class="absolute inset-0 bg-green-50/95 rounded-3xl flex items-center justify-center z-20 backdrop-blur-sm">
            <div class="text-center">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-green-700 mb-2">Email Terkirim!</h3>
              <p class="text-green-600 text-sm">Silakan cek email kamu untuk kode verifikasi</p>
            </div>
          </div>
        )}
        
        {/* Illustration with subtle animation */}
        <div class="transform transition-transform duration-300 hover:scale-105">
          <img
            src="/assets/undraw_forgot-password_odai.svg"
            alt="Forgot Password Illustration"
            class="w-32 mx-auto mb-6 drop-shadow-sm"
          />
        </div>

        {/* Header */}
        <div class="mb-8">
          <h2 class="text-2xl font-bold mb-3 bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
            Forgot Password ?
          </h2>
          <p class="text-gray-600 text-sm leading-relaxed">
            Masukkan email kamu untuk menerima kode verifikasi
          </p>
        </div>

        {/* Form */}
        <form class="space-y-6" onSubmit={handleSubmit}>
          <div class="text-left">
            <label class="block text-sm mb-2 font-medium text-gray-700">
              Email Address
            </label>
            <div class="relative">
              <input
                type="email"
                placeholder="you@example.com"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
                class={`w-full px-4 py-3.5 border rounded-xl focus:outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm
                  ${error() 
                    ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400' 
                    : 'border-gray-200 focus:ring-2 focus:ring-teal-200 focus:border-teal-400 hover:border-teal-300'
                  }
                  focus:scale-[1.02] transform`}
                required
                disabled={isLoading() || success()}
              />
              {/* Email icon */}
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
              </div>
            </div>
            
            {/* Error message */}
            {error() && (
              <div class="mt-2 text-sm text-red-600 flex items-center animate-fadeIn">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                {error()}
              </div>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading() || success()}
            class={`w-full py-3.5 rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-4 focus:ring-teal-200 shadow-lg
              ${isLoading() || success()
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 hover:shadow-xl'
              }`}
          >
            {isLoading() ? (
              <div class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengirim...
              </div>
            ) : (
              'Submit'
            )}
          </button>
        </form>

        {/* Back to login */}
        <button
          onClick={() => navigate("/login")}
          disabled={isLoading() || success()}
          class="mt-6 text-sm text-teal-600 hover:text-teal-700 hover:underline transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Kembali ke Login
        </button>
      </div>
      
      {/* Additional floating elements */}
      <div class="absolute top-20 right-20 w-4 h-4 bg-pink-300/60 rounded-full animate-ping"></div>
      <div class="absolute bottom-32 left-16 w-6 h-6 bg-teal-300/60 rounded-full animate-pulse"></div>
    </div>
  );
};

// Custom CSS animations (add to your global CSS)
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    33% { transform: translateY(-20px) rotate(3deg); }
    66% { transform: translateY(10px) rotate(-2deg); }
  }
  
  @keyframes float-delay {
    0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
    50% { transform: translateY(-30px) rotate(-5deg) scale(1.1); }
  }
  
  @keyframes float-slow {
    0%, 100% { transform: translateX(0) translateY(0); }
    25% { transform: translateX(20px) translateY(-10px); }
    50% { transform: translateX(-10px) translateY(-20px); }
    75% { transform: translateX(-20px) translateY(10px); }
  }
  
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .animate-float-delay {
    animation: float-delay 8s ease-in-out infinite 2s;
  }
  
  .animate-float-slow {
    animation: float-slow 12s ease-in-out infinite 1s;
  }
  
  .animate-spin-slow {
    animation: spin-slow 8s linear infinite;
  }
  
  .slow {
    animation-duration: 3s;
  }
`;

export default ForgotPassword;