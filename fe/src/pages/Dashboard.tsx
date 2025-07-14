import { For, Show, createSignal, onMount, onCleanup } from "solid-js";
import { useNavigate } from "@solidjs/router";

type WishlistItem = {
  id: number;
  nama: string;
  harga: number;
  ditabung: number;
  gambar?: string;
  completed?: boolean;
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

  onMount(() => {
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
      const userWishlists = allWishlists[email] || [];
      const filtered = userWishlists.filter((item: WishlistItem) => !item.completed);

      setWishlist(filtered);
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

  return (
    <div class="flex min-h-screen relative text-gray-800 font-[Poppins]">
      {/* SIDEBAR */}
      <aside
        class={`fixed top-0 left-0 h-full bg-[#ACDFD2] text-white transition-all duration-300 z-20 ${
          isSidebarOpen() ? "w-64 px-6" : "w-0 overflow-hidden"
        }`}
      >
        <div class="py-6 flex flex-col justify-between h-full">
          <div>
            <h2 class="text-2xl font-bold mb-6">WishList</h2>
            <nav class="space-y-3">
              <button
                class="flex items-center gap-3 border-b border-white pb-2 w-full text-left"
                onClick={() => navigate("/tambah-wishlist")}
              >
                🎁 <span>Tambah WishList</span>
              </button>
              <button
                class="flex items-center gap-3 border-b border-white pb-2 w-full text-left"
                onClick={() => navigate("/riwayatwishlist")}
              >
                ⏱ <span>Riwayat WishList</span>
              </button>
              <button
                class="flex items-center gap-3 border-b border-white pb-2 w-full text-left"
                onClick={() => navigate("/grafik")}
              >
                📈 <span>Grafik Tabungan</span>
              </button>
              <button
                class="flex items-center gap-3 border-b border-white pb-2 w-full text-left"
                onClick={() => navigate("/edit-profile")}
              >
                👤 <span>Profil</span>
              </button>
            </nav>
          </div>
          <button
            class="flex items-center gap-2 text-sm hover:opacity-80"
            onClick={() => {
              localStorage.removeItem("currentUser");
              navigate("/login");
            }}
          >
            🚪 <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div
        class={`flex-1 min-h-screen transition-all duration-300 ${
          isSidebarOpen() ? "ml-64" : "ml-0"
        } bg-cover bg-center relative`}
        style={{ "background-image": "url('/assets/home.jpg')" }}
      >
        <div class="absolute inset-0 bg-white bg-opacity-70 backdrop-blur-sm z-0" />
        <div class="relative z-10">
          {/* HEADER */}
          <div class="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-300 bg-[#d6f0f2]">
            <div class="flex items-center gap-4">
              <button
                class="text-2xl md:text-3xl"
                onClick={() => setIsSidebarOpen(!isSidebarOpen())}
              >
                ☰
              </button>
              <h1 class="text-xl md:text-2xl font-bold">WishList</h1>
            </div>
            <div class="flex items-center gap-4 relative">
              <button
                onClick={() => navigate("/tambah-wishlist")}
                class="text-2xl md:text-3xl"
              >
                ➕
              </button>

              {/* ICON PROFIL */}
              <button
                ref={profileButtonRef}
                class="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center bg-white"
                onClick={() => setIsProfileOpen(!isProfileOpen())}
              >
                {profileImage() ? (
                  <img src={profileImage()} alt="Profile" class="w-full h-full object-cover" />
                ) : (
                  <svg
                    class="w-6 h-6 text-gray-500"
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

              {/* POPUP PROFIL */}
              <Show when={isProfileOpen()}>
                <div
                  ref={profilePopupRef}
                  class="absolute right-0 top-14 w-48 bg-white border border-gray-200 rounded shadow-md p-4 z-50"
                >
                  <p class="text-sm font-semibold mb-1">{username() || "Belum ada nama"}</p>
                  <p class="text-xs text-gray-600">{email() || "Belum ada email"}</p>
                </div>
              </Show>
            </div>
          </div>

          {/* BANNER */}
          <div class="relative flex items-center justify-center px-6 py-6 bg-[#edf9fa] border-b overflow-hidden">
            <img
              src="/assets/checklist-43.svg"
              alt="Kiri"
              class="hidden md:block absolute left-6 w-28 md:w-40"
            />
            <div class="text-center z-10">
              <h2 class="text-xl font-bold">Daftar Wishlist</h2>
              <p class="text-sm text-gray-600">“Pilih barang impianmu & mulai nabung!”</p>
            </div>
            <img
              src="/assets/undraw_savings_uwjn (1).svg"
              alt="Kanan"
              class="hidden md:block absolute right-6 w-28 md:w-40"
            />
          </div>

          {/* KONTEN */}
          <div class="p-6 relative z-10">
            <Show
              when={wishlist().length > 0}
              fallback={<p class="text-center text-gray-600 italic">Belum ada wishlist.</p>}
            >
              <div class="space-y-4">
                <For each={wishlist()}>
                  {(item) => {
                    const persen = Math.min((item.ditabung / item.harga) * 100, 100).toFixed(0);
                    return (
                      <div class="bg-white shadow-md rounded-xl p-4 flex items-center gap-4">
                        <Show when={item.gambar}>
                          <img
                            src={item.gambar}
                            alt={item.nama}
                            class="w-16 h-16 object-cover rounded-md"
                          />
                        </Show>
                        <div class="flex-1">
                          <div class="flex justify-between items-start mb-2">
                            <div>
                              <h3 class="font-semibold">{item.nama}</h3>
                              <p class="text-sm">Harga: {formatRupiah(item.harga)}</p>
                              <p class="text-sm text-gray-500">
                                Ditabung: {formatRupiah(item.ditabung)} ({persen}%)
                              </p>
                            </div>
                            <button
                              class="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 text-sm"
                              onClick={() => navigate("/wishlist/update")}
                            >
                              + Update
                            </button>
                          </div>
                          <div class="h-2 w-full bg-gray-200 rounded">
                            <div
                              class="h-2 bg-blue-400 rounded"
                              style={{ width: `${persen}%` }}
                            />
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
