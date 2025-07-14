import { createSignal, onMount, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';

type WishlistItem = {
  nama: string;
  harga?: number;
  gambar?: string;
};

export default function RiwayatWishlist() {
  const navigate = useNavigate();
  const [riwayat, setRiwayat] = createSignal<WishlistItem[]>([]);
  const [search, setSearch] = createSignal('');

  onMount(() => {
    loadRiwayat();
  });

  const loadRiwayat = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const email = user?.email || '';
    const allRiwayat = JSON.parse(localStorage.getItem('riwayatWishlist') || '{}');
    const data = allRiwayat[email] || [];
    setRiwayat(data);
  };

  const handleHapus = (nama: string) => {
    if (!confirm(`Yakin mau hapus "${nama}" dari Riwayat?`)) return;

    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user) return;

    const email = user.email;
    const allRiwayat = JSON.parse(localStorage.getItem('riwayatWishlist') || '{}');
    let data: WishlistItem[] = allRiwayat[email] || [];

    // Filter hapus
    data = data.filter((item) => item.nama !== nama);
    allRiwayat[email] = data;

    localStorage.setItem('riwayatWishlist', JSON.stringify(allRiwayat));
    setRiwayat(data);
  };

  const filtered = () =>
    riwayat().filter((item) =>
      item.nama.toLowerCase().includes(search().toLowerCase())
    );

  const formatRupiah = (num: number) => 'Rp ' + num.toLocaleString('id-ID');

  return (
    <div class="min-h-screen bg-center bg-no-repeat bg-cover p-6 relative text-gray-800">
      {/* Background */}
      <div
        class="absolute inset-0 -z-10 bg-center bg-cover bg-no-repeat"
        style={{ 'background-image': "url('/assets/riwayat.jpg')" }}
      />

      {/* Overlay */}
      <div class="absolute inset-0 bg-white bg-opacity-80 z-0 backdrop-blur-md" />

      <div class="relative z-10">
        {/* Tombol Panah Kembali */}
        <button
          onClick={() => navigate('/dashboard')}
          class="text-2xl mb-4 hover:opacity-80"
        >
          ←
        </button>

        {/* Header */}
        <div class="relative bg-white rounded-3xl p-6 mb-10 shadow-md overflow-hidden flex items-center justify-between">
          {/* Ilustrasi Kiri */}
          <img
            src="/assets/riwayatilustrasi.png"
            alt="Checklist"
            class="w-20 md:w-24 hidden md:block ml-8"
          />

          {/* Judul */}
          <div class="text-center flex-1">
            <h1 class="text-2xl font-bold text-gray-800">Riwayat Wishlist</h1>
            <p class="text-sm text-gray-600 mt-1">
              Lihat semua impian yang berhasil kamu wujudkan
            </p>

            {/* Search */}
            <div class="mt-4 bg-gray-100 rounded-xl px-4 py-3 flex items-center gap-3 max-w-md mx-auto">
              <span class="text-gray-400 text-xl">🔍</span>
              <input
                type="text"
                placeholder="Search"
                class="bg-transparent w-full focus:outline-none text-sm"
                value={search()}
                onInput={(e) => setSearch(e.currentTarget.value)}
              />
            </div>
          </div>

          {/* Ilustrasi Kanan */}
          <img
            src="/assets/Shopaholics - Online Shopping.png"
            alt="Shopping"
            class="w-24 md:w-28 hidden md:block mr-4"
          />
        </div>

        {/* Grid Card */}
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          <For each={filtered()}>
            {(item) => (
              <div class="relative bg-[#f9fafa] border border-[#d3acea] p-4 rounded-xl shadow-sm text-center">
                {/* Centang */}
                <div class="absolute top-2 right-2">
                  <div class="w-5 h-5 rounded-full bg-[#7ddfd0] flex items-center justify-center text-white text-xs font-bold">
                    ✓
                  </div>
                </div>

                <img
                  src={item.gambar || '/assets/langit.png'}
                  alt={item.nama}
                  class="w-20 h-20 object-cover rounded-md mb-3 mx-auto"
                />

                <h3 class="text-sm font-semibold text-gray-800 mb-1">{item.nama}</h3>
                {item.harga && (
                  <p class="text-sm text-gray-600">{formatRupiah(item.harga)}</p>
                )}

                {/* Tombol Hapus */}
                <button
                  onClick={() => handleHapus(item.nama)}
                  class="mt-3 text-xs text-red-500 hover:underline"
                >
                  🗑️ Hapus
                </button>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
