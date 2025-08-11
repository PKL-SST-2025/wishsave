import { Component, onMount } from "solid-js";
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

  // ✅ Tambahkan animasi particles setelah component mount
  onMount(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      
      const size = Math.random() * 8 + 4;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.background = `linear-gradient(45deg, #e0f2fe, #b3e5fc)`;
      particle.style.borderRadius = '50%';
      particle.style.position = 'fixed';
      particle.style.bottom = '-10px';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '1';
      particle.style.animation = `floatUp ${Math.random() * 2 + 6}s linear forwards`;
      particle.style.opacity = (Math.random() * 0.4 + 0.1).toString();
      
      document.body.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 7000);
    };

    // Create particles every 800ms (slower)
    const particleInterval = setInterval(createParticle, 800);
    
    // Cleanup on component unmount
    return () => {
      clearInterval(particleInterval);
    };
  });

  return (
    <>
      {/* ✅ CSS Animations - ditambahkan inline untuk SolidJS */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(90deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.6;
          }
        }

        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .floating-bg-shape {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(45deg, #e0f2fe, #b3e5fc, #81d4fa);
          opacity: 0.08;
          animation: float 8s ease-in-out infinite;
        }

        .enhanced-form-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 
            0 25px 45px rgba(0, 0, 0, 0.1),
            0 0 50px rgba(125, 223, 208, 0.1);
          animation: slideIn 0.6s ease-out;
          border: 2px solid rgba(125, 223, 208, 0.2);
        }

        .enhanced-input {
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.9);
        }

        .enhanced-input:focus {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(125, 223, 208, 0.2);
          border-color: #7ddfd0 !important;
        }

        .title-enhanced {
          background: linear-gradient(45deg, #2563eb, #7ddfd0, #a7ede7);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 3s ease-in-out infinite;
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .floating-icon-enhanced {
          animation: iconFloat 3s ease-in-out infinite;
        }

        @keyframes iconFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(-10px) rotate(10deg) scale(1.05);
          }
        }
      `}</style>

      <div
        class="min-h-screen flex items-center justify-center bg-center bg-no-repeat bg-cover font-[Poppins] px-4 relative overflow-hidden"
        style={{
          "background": "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 20%, #cbd5e1 100%)",
          "background-size": "cover",
        }}
      >
        {/* ✅ Subtle Animated Background Shapes */}
        <div class="floating-bg-shape" style={{
          width: "100px",
          height: "100px",
          top: "15%",
          left: "12%",
          "animation-delay": "0s"
        }}></div>
        <div class="floating-bg-shape" style={{
          width: "140px",
          height: "140px",
          top: "25%",
          right: "18%",
          "animation-delay": "3s"
        }}></div>
        <div class="floating-bg-shape" style={{
          width: "80px",
          height: "80px",
          bottom: "25%",
          left: "25%",
          "animation-delay": "6s"
        }}></div>
        <div class="floating-bg-shape" style={{
          width: "120px",
          height: "120px",
          bottom: "20%",
          right: "15%",
          "animation-delay": "2s"
        }}></div>

        {/* ✅ Enhanced Form Container */}
        <div class="enhanced-form-container rounded-2xl p-10 w-full max-w-md relative overflow-hidden z-10">
          <div class="relative z-10">
            {/* ✅ Enhanced Title */}
            <h2 class="text-2xl font-bold mb-6 text-center title-enhanced">
              Reset Your Password
            </h2>

            <form class="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label class="block mb-1 font-medium text-gray-700">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  placeholder="Enter a new password"
                  class="enhanced-input w-full px-4 py-3 border border-[#90d9c7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a7ede7]"
                  required
                />
              </div>
              <div>
                <label class="block mb-1 font-medium text-gray-700">Confirm new password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your new password"
                  class="enhanced-input w-full px-4 py-3 border border-[#90d9c7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a7ede7]"
                  required
                />
              </div>
              
              {/* ✅ Menggunakan Button component Anda dengan enhancement */}
              <div style={{
                "background": "linear-gradient(45deg, #7ddfd0, #a7ede7)",
                "border-radius": "9999px",
                "box-shadow": "0 10px 25px rgba(125, 223, 208, 0.3)",
                "transition": "all 0.3s ease",
                "transform": "translateY(0)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(125, 223, 208, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(125, 223, 208, 0.3)";
              }}>
                <Button type="submit" variant="teal" class="w-full rounded-full py-3 border-0">
                  Simpan
                </Button>
              </div>
            </form>
          </div>

          {/* ✅ Enhanced Floating Icon */}
          <img
            src="/assets/undraw_my-password_iyga.svg"
            alt="Reset Password Illustration"
            class="floating-icon-enhanced w-24 absolute top-6 right-6 z-0 opacity-90"
          />
          
          {/* ✅ Extra glow effect */}
          <div 
            class="absolute -top-2 -left-2 -right-2 -bottom-2 rounded-2xl opacity-20"
            style={{
              "background": "linear-gradient(45deg, #7ddfd0, #a7ede7, #90d9c7)",
              "filter": "blur(10px)",
              "z-index": "-1"
            }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;