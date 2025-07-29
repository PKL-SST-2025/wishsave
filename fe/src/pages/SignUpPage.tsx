import { Component, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import Button from "../components/button"; 
import Input from "../components/input";

const SignUpPage: Component = () => {
  const navigate = useNavigate();

  const [nama, setNama] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const existing = users.find((u: any) => u.email === email());
    if (existing) {
      alert("Email sudah terdaftar!");
      return;
    }

    const newUser = {
      nama: nama(),
      email: email(),
      password: password(),
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    localStorage.setItem("activeUser", JSON.stringify(newUser)); 

    navigate("/dashboard");
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-[#F7F7F7] font-[Poppins] px-4">
      <div class="flex w-full max-w-4xl bg-white rounded-xl overflow-hidden shadow-md flex-col md:flex-row">
        
        {/* LEFT SIDE - Illustration (atas di HP, kiri di desktop) */}
        <div class="w-full md:w-1/2 bg-[#EAF4F2] flex items-center justify-center p-10">
          <img
            src="/assets/undraw_sign-up_qamz.svg"
            alt="Sign Up Illustration"
            class="w-3/4"
          />
        </div>

        {/* RIGHT SIDE - Form */}
        <div class="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center relative">
          <div class="absolute top-4 left-4 w-10 h-10 bg-[#A7EDE7] rounded-full hidden md:block"></div>
          <h2 class="text-2xl md:text-3xl font-bold text-black mb-2 z-10">
            Create an account
          </h2>
          <p class="text-gray-600 mb-8 z-10">Join us and start your journey</p>

          <form class="space-y-6 z-10" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              class="w-full px-4 py-3 border border-[#DACDCD] rounded-lg focus:outline-none"
              required
              onInput={(e) => setNama(e.currentTarget.value)}
            />
            <input
              type="email"
              placeholder="Email"
              class="w-full px-4 py-3 border border-[#DACDCD] rounded-lg focus:outline-none"
              required
              onInput={(e: InputEvent) => setEmail((e.target as HTMLInputElement).value)}
            />
            <input
              type="password"
              placeholder="Password"
              class="w-full px-4 py-3 border border-[#DACDCD] rounded-lg focus:outline-none"
              required
              onInput={(e: InputEvent) => setPassword((e.target as HTMLInputElement).value)}
            />
            
            <Button
              type="submit"
              variant="teal"
              class="w-full py-3 rounded-full"
            >
              Sign Up
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
