import { createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";

export default function EditProfile() {
  const navigate = useNavigate();

  const [username, setUsername] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [about, setAbout] = createSignal("");
  const [profileImage, setProfileImage] = createSignal("");

  onMount(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (currentUser) {
      setUsername(currentUser.username || currentUser.nama || "");
      setEmail(currentUser.email || "");
      setPassword(currentUser.password || "");
      setAbout(currentUser.about || "");
      setProfileImage(currentUser.profileImage || "");
    } else {
      navigate("/login");
    }
  });

  const handleImageUpload = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setProfileImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      username: username(),
      nama: username(),
      email: email(),
      password: password(),
      about: about(),
      profileImage: profileImage(),
    };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    const allUsers = JSON.parse(localStorage.getItem("users") || "{}");
    allUsers[updatedUser.email] = updatedUser;
    localStorage.setItem("users", JSON.stringify(allUsers));

    alert("Profil berhasil diperbarui!");
    navigate("/dashboard"); // Tambahan ini - langsung redirect ke dashboard setelah alert
  };

  return (
    <div class="flex flex-col md:flex-row h-screen font-sans overflow-y-auto">
      {/* Kiri: Profile */}
      <div class="w-full md:w-1/2 bg-green-100 flex flex-col items-center justify-center relative p-6">
        <button
          class="absolute top-4 left-4 text-2xl cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          ←
        </button>

        <h2 class="text-2xl font-bold mb-4">Profile</h2>

        <div class="w-24 h-24 md:w-28 md:h-28 bg-purple-100 rounded-full overflow-hidden flex items-center justify-center mb-4">
          {profileImage() ? (
            <img src={profileImage()} alt="Profile" class="object-cover w-full h-full" />
          ) : (
            <svg
              class="w-14 h-14 text-purple-500"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5.121 17.804A4.992 4.992 0 0012 20a4.992 4.992 0 006.879-2.196M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          )}
        </div>

        <label class="bg-green-300 text-white px-4 py-1 rounded-full shadow-md text-sm cursor-pointer">
          Upload Picture
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            class="hidden"
          />
        </label>
      </div>

      {/* Kanan: Form */}
      <div class="w-full md:w-1/2 bg-gradient-to-b from-white to-blue-100 p-6 sm:p-8 flex flex-col justify-center">
        <label class="text-sm font-semibold mb-1">Username</label>
        <input
          type="text"
          class="border border-green-400 rounded-md p-2 mb-4"
          value={username()}
          onInput={(e) => setUsername(e.currentTarget.value)}
        />

        <label class="text-sm font-semibold mb-1">E-mail</label>
        <input
          type="email"
          class="border border-green-400 rounded-md p-2 mb-4"
          value={email()}
          onInput={(e) => setEmail(e.currentTarget.value)}
        />

        <label class="text-sm font-semibold mb-1">Password</label>
        <input
          type="password"
          class="border border-green-400 rounded-md p-2 mb-4"
          value={password()}
          onInput={(e) => setPassword(e.currentTarget.value)}
        />

        <label class="text-sm font-semibold mb-1">About Me</label>
        <textarea
          class="border border-green-400 rounded-md p-2 h-24 mb-4"
          value={about()}
          onInput={(e) => setAbout(e.currentTarget.value)}
        />

        <button
          class="self-end border border-green-400 px-4 py-2 rounded-md text-sm"
          onClick={handleUpdate}
        >
          Update Profil
        </button>
      </div>
    </div>
  );
}