import { createSignal, onMount, onCleanup, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';

type WishlistItem = {
  id: number;
  nama: string;
  harga: number;
  ditabung: number;
  gambar?: string;
  completed?: boolean;
  completedAt?: string;
};

export default function RiwayatWishlist() {
  const navigate = useNavigate();
  const [riwayat, setRiwayat] = createSignal<WishlistItem[]>([]);
  const [search, setSearch] = createSignal('');

  onMount(() => {
    loadRiwayat();
    
    // Listen ke event update dari Dashboard DAN TambahWishlist
    const handleUpdate = () => loadRiwayat();
    window.addEventListener('wishlist-updated', handleUpdate);
    window.addEventListener('wishlist-history-updated', handleUpdate); // Tambahan ini
    
    onCleanup(() => {
      window.removeEventListener('wishlist-updated', handleUpdate);
      window.removeEventListener('wishlist-history-updated', handleUpdate); // Tambahan ini
    });
  });

  const loadRiwayat = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user) return;
    
    const email = user.email;
    
    // Ambil dari kedua sumber: wishlistHistory (baru) dan wishlist completed (lama)
    const allHistory = JSON.parse(localStorage.getItem('wishlistHistory') || '{}');
    const allWishlists = JSON.parse(localStorage.getItem('wishlist') || '{}');
    
    const userHistory = allHistory[email] || [];
    const userWishlists = allWishlists[email] || [];
    
    // Filter wishlist lama yang completed
    const completedWishlists = userWishlists.filter((item: WishlistItem) => item.completed === true);
    
    // Gabungkan history baru + completed lama (hindari duplikat berdasarkan id)
    const allCompleted = [...userHistory];
    completedWishlists.forEach((item: WishlistItem) => {
      if (!allCompleted.some(existing => existing.id === item.id)) {
        allCompleted.push(item);
      }
    });
    
    setRiwayat(allCompleted);
  };

  const handleHapus = (id: number, nama: string) => {
    if (!confirm(`Yakin mau hapus "${nama}" dari Riwayat?`)) return;

    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user) return;

    const email = user.email;
    
    // Hapus dari wishlistHistory
    const allHistory = JSON.parse(localStorage.getItem('wishlistHistory') || '{}');
    let userHistory: WishlistItem[] = allHistory[email] || [];
    userHistory = userHistory.filter((item) => item.id !== id);
    allHistory[email] = userHistory;
    localStorage.setItem('wishlistHistory', JSON.stringify(allHistory));
    
    // Hapus dari wishlist (untuk data lama yang completed)
    const allWishlists = JSON.parse(localStorage.getItem('wishlist') || '{}');
    let userWishlists: WishlistItem[] = allWishlists[email] || [];
    userWishlists = userWishlists.filter((item) => item.id !== id);
    allWishlists[email] = userWishlists;
    localStorage.setItem('wishlist', JSON.stringify(allWishlists));
    
    // Update tampilan
    loadRiwayat();
    
    // Dispatch events
    window.dispatchEvent(new Event('wishlist-updated'));
    window.dispatchEvent(new Event('wishlist-history-updated'));
  };

  const filtered = () =>
    riwayat().filter((item) =>
      item.nama.toLowerCase().includes(search().toLowerCase())
    );

  const formatRupiah = (num: number) => 'Rp ' + num.toLocaleString('id-ID');
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

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
              Lihat semua impian yang berhasil kamu wujudkan ({riwayat().length} tercapai)
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
        {filtered().length === 0 ? (
          <div class="text-center py-12">
            <div class="text-6xl mb-4">🎯</div>
            <h3 class="text-xl font-semibold text-gray-700 mb-2">Belum Ada Wishlist Tercapai</h3>
            <p class="text-gray-500 max-w-md mx-auto">
              Yuk mulai nabung untuk mewujudkan impianmu! Wishlist yang sudah tercapai akan muncul di sini.
            </p>
          </div>
        ) : (
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
                  <p class="text-sm text-gray-600 mb-1">{formatRupiah(item.harga)}</p>
                  
                  {/* Tanggal tercapai */}
                  {item.completedAt && (
                    <p class="text-xs text-green-600 mb-2">
                      Tercapai: {formatDate(item.completedAt)}
                    </p>
                  )}

                  {/* Progress bar - completed (hijau penuh) */}
                  <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div class="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>

                  {/* Tombol Hapus */}
                  <button
                    onClick={() => handleHapus(item.id, item.nama)}
                    class="mt-1 text-xs text-red-500 hover:underline"
                  >
                    🗑️ Hapus
                  </button>
                </div>
              )}
            </For>
          </div>
        )}
      </div>
    </div>
  );
}