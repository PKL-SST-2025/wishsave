import { For, Show, createSignal, onMount, onCleanup } from "solid-js";
import { useNavigate } from "@solidjs/router";

type WishlistItem = {
  id: number;
  nama: string;
  harga: number;
  ditabung: number;
  gambar?: string;
  completed?: boolean;
  completedAt?: string;
};

export default function Dashboard() {
  const [wishlist, setWishlist] = createSignal<WishlistItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(true);
  const [profileImage, setProfileImage] = createSignal("");
  const [username, setUsername] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [isProfileOpen, setIsProfileOpen] = createSignal(false);

  const navigate = useNavigate();

  let profileButtonRef: HTMLButtonElement | undefined;
  let profilePopupRef: HTMLDivElement | undefined;

  const formatRupiah = (num: number) => "Rp " + num.toLocaleString("id-ID");

  // Fungsi logout yang bisa dipake di dropdown
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  onMount(() => {
    const sidebarStatus = localStorage.getItem("sidebarOpen");
    if (sidebarStatus !== null) {
      setIsSidebarOpen(sidebarStatus === "true");
    }

    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!user) {
      navigate("/login");
      return;
    }

    setProfileImage(user.profileImage || "");
    setUsername(user.username || user.nama || "");
    setEmail(user.email || "");

    const loadWishlist = () => {
      const allWishlists = JSON.parse(localStorage.getItem("wishlist") || "{}");
      const email = user.email;
      const userWishlists = [...(allWishlists[email] || [])];
      
      // Langsung set wishlist tanpa cek completed lagi
      // Biar Update Wishlist yang handle pemindahan ke riwayat
      setWishlist(userWishlists);
      
      console.log("Dashboard loaded wishlist:", userWishlists);
    };

    loadWishlist();
    window.addEventListener("wishlist-updated", loadWishlist);

    const handleClickOutside = (e: MouseEvent) => {
      if (
        profilePopupRef &&
        !profilePopupRef.contains(e.target as Node) &&
        profileButtonRef &&
        !profileButtonRef.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    onCleanup(() => {
      window.removeEventListener("wishlist-updated", loadWishlist);
      document.removeEventListener("click", handleClickOutside);
    });
  });

  const toggleSidebar = () => {
    const next = !isSidebarOpen();
    setIsSidebarOpen(next);
    localStorage.setItem("sidebarOpen", String(next));
  };

  return (
    <div class="flex h-screen overflow-hidden">
      {/* Mobile Overlay - Hanya untuk mobile */}
      <Show when={isSidebarOpen()}>
        <div 
          class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => {
            setIsSidebarOpen(false);
            localStorage.setItem("sidebarOpen", "false");
          }}
        />
      </Show>

      {/* Sidebar - Fixed positioning dengan height penuh */}
      <aside
        class={`text-white transition-all duration-300 fixed lg:relative
          top-0 left-0 z-40 h-full
          ${isSidebarOpen() ? "w-64 translate-x-0 lg:translate-x-0" : "w-64 -translate-x-full lg:-translate-x-full lg:w-0"}`}
        style={{
          "background": "linear-gradient(135deg, #ACDFD2 0%, #7BC7A8 50%, #5BAE7F 100%)",
          "box-shadow": "0 10px 30px rgba(0, 0, 0, 0.15)",
          "border-right": "1px solid rgba(255, 255, 255, 0.2)"
        }}
      >
        {/* Decorative elements dengan warna hijau mint */}
        <div class="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-15 rounded-full -translate-y-16 translate-x-16"></div>
        <div class="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-15 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div class={`py-6 px-6 flex flex-col justify-between h-full transition-opacity duration-300 relative z-10 ${isSidebarOpen() ? "opacity-100" : "opacity-0"}`}>
          <div>
            {/* Header dengan tombol close */}
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-white drop-shadow-lg select-none pointer-events-none">WishList</h2>
              <button
                onClick={toggleSidebar}
                class="text-white hover:bg-white hover:bg-opacity-25 p-3 rounded-full transition-all duration-200 text-xl hover:rotate-90 transform min-w-[2.5rem] min-h-[2.5rem] flex items-center justify-center"
                title="Tutup sidebar"
              >
                ✕
              </button>
            </div>
            <nav class="space-y-3">
              <button
                class="flex items-center gap-3 w-full text-left hover:bg-white hover:bg-opacity-25 px-3 py-3 rounded-lg transition-all duration-200 hover:translate-x-2 group backdrop-blur-sm bg-white bg-opacity-15 border border-white border-opacity-30"
                onClick={() => navigate("/wishlist/update")}
              >
                <span class="text-lg group-hover:scale-110 transition-transform duration-200">🔄</span> 
                <span class="font-medium">Update</span>
              </button>
              <button
                class="flex items-center gap-3 w-full text-left hover:bg-white hover:bg-opacity-25 px-3 py-3 rounded-lg transition-all duration-200 hover:translate-x-2 group backdrop-blur-sm bg-white bg-opacity-15 border border-white border-opacity-30"
                onClick={() => navigate("/riwayatwishlist")}
              >
                <span class="text-lg group-hover:scale-110 transition-transform duration-200">⏱</span> 
                <span class="font-medium">Riwayat WishList</span>
              </button>
              <button
                class="flex items-center gap-3 w-full text-left hover:bg-white hover:bg-opacity-25 px-3 py-3 rounded-lg transition-all duration-200 hover:translate-x-2 group backdrop-blur-sm bg-white bg-opacity-15 border border-white border-opacity-30"
                onClick={() => navigate("/grafik")}
              >
                <span class="text-lg group-hover:scale-110 transition-transform duration-200">📈</span> 
                <span class="font-medium">Grafik Tabungan</span>
              </button>
              <button
                class="flex items-center gap-3 w-full text-left hover:bg-white hover:bg-opacity-25 px-3 py-3 rounded-lg transition-all duration-200 hover:translate-x-2 group backdrop-blur-sm bg-white bg-opacity-15 border border-white border-opacity-30"
                onClick={() => navigate("/edit-profile")}
              >
                <span class="text-lg group-hover:scale-110 transition-transform duration-200">👤</span> 
                <span class="font-medium">Profil</span>
              </button>
            </nav>
          </div>

          {/* Logout */}
          <button
            class="flex items-center gap-3 text-sm hover:bg-red-500 hover:bg-opacity-80 px-4 py-3 rounded-lg transition-all duration-200 bg-red-400 bg-opacity-25 border border-red-300 border-opacity-40 hover:scale-105 transform group"
            onClick={handleLogout}
          >
            <span class="text-lg group-hover:scale-110 transition-transform duration-200">🚪</span> 
            <span class="font-medium">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        class={`flex-1 flex flex-col bg-cover bg-center relative transition-all duration-300 h-full
          ${isSidebarOpen() ? "lg:ml-0" : "lg:ml-0 lg:w-full"}`}
        style={{ "background-image": "url('/assets/home.jpg')" }}
      >
        <div class="absolute inset-0 bg-white bg-opacity-70 backdrop-blur-sm z-0" />
        <div class="relative z-10 flex flex-col h-full">

          {/* Navbar */}
          <div class="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-300 bg-[#d6f0f2] relative flex-shrink-0">
            <div class="flex items-center gap-4">
              {/* Tombol menu - Hilang di desktop ketika sidebar terbuka */}
              <button 
                class={`text-xl sm:text-2xl md:text-3xl z-50 relative cursor-pointer hover:bg-white hover:bg-opacity-20 p-3 rounded transition-colors select-none flex items-center justify-center min-w-[3rem] min-h-[3rem]
                  ${isSidebarOpen() ? 'lg:hidden' : 'block'}`}
                onClick={toggleSidebar}
              >
                ☰
              </button>
              <h1 class="text-lg sm:text-xl md:text-2xl font-bold select-none pointer-events-none">WishList</h1>
            </div>
            <div class="flex items-center gap-4 relative">
              <button
                onClick={() => navigate("/tambah-wishlist")}
                class="text-xl sm:text-2xl md:text-3xl hover:bg-white hover:bg-opacity-20 p-2 rounded transition-colors"
              >
                ➕
              </button>
              <button
                ref={profileButtonRef}
                class="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center bg-white"
                onClick={() => setIsProfileOpen(!isProfileOpen())}
              >
                {profileImage() ? (
                  <img src={profileImage()} alt="Profile" class="w-full h-full object-cover" />
                ) : (
                  <svg
                    class="w-4 h-4 sm:w-6 sm:h-6 text-gray-500"
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
              </button>
              <Show when={isProfileOpen()}>
                <div
                  ref={profilePopupRef}
                  class="absolute right-0 top-12 sm:top-14 w-48 bg-white border border-gray-200 rounded shadow-md p-4 z-50"
                >
                  <p class="text-sm font-semibold mb-1 text-gray-800">{username() || "Belum ada nama"}</p>
                  <p class="text-xs text-gray-600 mb-3">{email() || "Belum ada email"}</p>
                  <button
                    class="text-sm text-red-600 hover:underline"
                    onClick={() => {
                      setIsProfileOpen(false);
                      handleLogout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              </Show>
            </div>
          </div>

          {/* Ilustrasi & Judul */}
          <div class="relative flex items-center justify-center px-4 py-6 bg-[#edf9fa] border-b overflow-hidden flex-shrink-0">
            {/* Gambar kiri - otomatis menyesuaikan ukuran layar */}
            <img
              src="/assets/checklist-43.svg"
              alt="Kiri"
              class="absolute left-2 opacity-80"
              style={{ 
                width: "clamp(1.5rem, 8vw, 9rem)", 
                height: "clamp(1.5rem, 8vw, 9rem)" 
              }}
            />
            
            {/* Konten tengah */}
            <div class="text-center z-10 px-4">
              <h2 class="text-lg sm:text-xl font-bold">Daftar Wishlist</h2>
              <p class="text-sm text-gray-600">"Pilih barang impianmu & mulai nabung!"</p>
            </div>
            
            {/* Gambar kanan - otomatis menyesuaikan ukuran layar */}
            <img
              src="/assets/undraw_savings_uwjn (1).svg"
              alt="Kanan"
              class="absolute right-2 opacity-80"
              style={{ 
                width: "clamp(1.5rem, 8vw, 9rem)", 
                height: "clamp(1.5rem, 8vw, 9rem)" 
              }}
            />
          </div>

          {/* Daftar Wishlist - dengan overflow control */}
          <div class="flex-1 p-4 sm:p-6 overflow-y-auto">
            <Show
              when={wishlist().length > 0}
              fallback={
                <div class="flex items-center justify-center h-full">
                  <p class="text-center text-gray-600 italic">Belum ada wishlist.</p>
                </div>
              }
            >
              <div class="space-y-4">
                <For each={wishlist()}>
                  {(item) => {
                    const persen = Math.min((item.ditabung / item.harga) * 100, 100).toFixed(0);
                    return (
                      <div class="bg-white shadow-md rounded-xl p-4">
                        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <Show when={item.gambar}>
                            <div class="w-full sm:w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={item.gambar}
                                alt={item.nama}
                                class="w-full h-full object-contain"
                                style={{ "background-color": "#f9fafb" }}
                              />
                            </div>
                          </Show>
                          <div class="flex-1 min-w-0">
                            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                              <div class="min-w-0 flex-1">
                                <h3 class="font-semibold truncate">{item.nama}</h3>
                                <p class="text-sm">Harga: {formatRupiah(item.harga)}</p>
                                <p class="text-sm text-gray-500">
                                  Ditabung: {formatRupiah(item.ditabung)} ({persen}%)
                                </p>
                              </div>
                              <div class="flex flex-row sm:flex-col gap-2 w-full sm:w-auto flex-shrink-0">
                                <button
                                  class="flex-1 sm:flex-none text-red-500 text-sm hover:underline"
                                  onClick={() => {
                                    const updated = wishlist().filter(w => w.id !== item.id);
                                    setWishlist(updated);
                                    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
                                    const all = JSON.parse(localStorage.getItem("wishlist") || "{}");
                                    const email = user.email;
                                    all[email] = updated;
                                    localStorage.setItem("wishlist", JSON.stringify(all));
                                    window.dispatchEvent(new Event("wishlist-updated"));
                                  }}
                                >
                                  Hapus
                                </button>
                              </div>
                            </div>
                            <div class="h-2 w-full bg-gray-200 rounded">
                              <div
                                class="h-2 bg-blue-400 rounded"
                                style={{ width: `${persen}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                </For>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}