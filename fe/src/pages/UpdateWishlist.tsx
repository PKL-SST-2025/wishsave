import { createSignal, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import Button from "../components/button";

type WishlistItem = {
  id: number;
  nama: string;
  harga: number;
  ditabung: number;
  gambar?: string;
  completed?: boolean;
  completedAt?: string;
};

export default function UpdateWishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = createSignal<WishlistItem[]>([]);
  const [selectedId, setSelectedId] = createSignal<number | null>(null);
  const [amount, setAmount] = createSignal('');

  onMount(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user) {
      navigate('/login');
      return;
    }

    const email = user.email;
    const allWishlists = JSON.parse(localStorage.getItem('wishlist') || '{}');
    const userWishlist = allWishlists[email] || [];
    setWishlist(userWishlist);
  });

  const selectedItem = () =>
    wishlist().find((item) => item.id === selectedId()) || {
      id: 0,
      nama: '',
      harga: 1,
      ditabung: 0,
    };

  const newTotal = () =>
    selectedItem().ditabung + Number(amount().replace(/[^0-9]/g, '') || 0);

  const percent = () =>
    Math.min(Math.floor((newTotal() / selectedItem().harga) * 100), 100);

  const formatRupiah = (num: number) =>
    'Rp ' + num.toLocaleString('id-ID');

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user) return;

    const email = user.email;
    
    // Ambil data terbaru dari localStorage - pakai key yang sama dengan TambahWishlist
    const allWishlists = JSON.parse(localStorage.getItem('wishlist') || '{}');
    const allHistory = JSON.parse(localStorage.getItem('wishlistHistory') || '{}'); // Key diubah

    // Pastikan struktur data ada
    const userWishlist: WishlistItem[] = [...(allWishlists[email] || [])];
    const userHistory: WishlistItem[] = [...(allHistory[email] || [])]; // Variable diubah

    const itemIndex = userWishlist.findIndex((w) => w.id === selectedId());
    if (itemIndex !== -1) {
      const updatedItem = { ...userWishlist[itemIndex] };
      const addAmount = Number(amount().replace(/[^0-9]/g, '') || 0);
      
      // Update jumlah yang ditabung
      updatedItem.ditabung += addAmount;

      // Cek apakah sudah selesai (mencapai target)
      if (updatedItem.ditabung >= updatedItem.harga) {
        // Set sebagai completed dan pindahkan ke riwayat
        updatedItem.completed = true;
        updatedItem.ditabung = updatedItem.harga; // Set pas dengan target
        updatedItem.completedAt = new Date().toISOString(); // Tambah tanggal completion
        
        // Tambah ke history
        userHistory.push(updatedItem);
        
        // Hapus dari wishlist aktif
        userWishlist.splice(itemIndex, 1);
        
        alert(`Selamat! Wishlist "${updatedItem.nama}" telah selesai dan dipindahkan ke riwayat!`);
      } else {
        // Update di wishlist aktif
        userWishlist[itemIndex] = updatedItem;
        alert(`Tabungan berhasil ditambah! Progress: ${Math.floor((updatedItem.ditabung / updatedItem.harga) * 100)}%`);
      }

      // Simpan kembali ke localStorage - pakai key yang benar
      allWishlists[email] = userWishlist;
      allHistory[email] = userHistory; // Key diubah
      
      localStorage.setItem('wishlist', JSON.stringify(allWishlists));
      localStorage.setItem('wishlistHistory', JSON.stringify(allHistory)); // Key diubah

      // Dispatch event untuk update UI - trigger kedua event
      window.dispatchEvent(new Event('wishlist-updated'));
      window.dispatchEvent(new Event('wishlist-history-updated')); // Tambahan ini
      
      // Debug log untuk memastikan data tersimpan
      console.log('Updated wishlist:', userWishlist);
      console.log('Updated history:', userHistory); // Variable diubah
      console.log('Saved to localStorage - wishlist:', JSON.parse(localStorage.getItem('wishlist') || '{}')[email]);
      console.log('Saved to localStorage - history:', JSON.parse(localStorage.getItem('wishlistHistory') || '{}')[email]); // Key diubah
      
      navigate('/dashboard');
    } else {
      alert('Item tidak ditemukan!');
    }
  };

  return (
    <div class="min-h-screen bg-white flex items-center justify-center px-4 py-10 font-[Poppins]">
      <div class="w-full max-w-4xl bg-white border border-blue-200 rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        <div class="flex-1 p-8">
          <Button onClick={() => navigate(-1)} class="text-xl mb-4 w-fit px-3 py-1">←</Button>

          <h2 class="text-2xl font-bold mb-6 text-center">Form Update</h2>

          <form onSubmit={handleSubmit} class="space-y-4">
            <div>
              <label class="block mb-1 text-sm font-medium">Pilih Wishlist</label>
              <select
                value={selectedId() || ''}
                onInput={(e) => setSelectedId(Number(e.currentTarget.value))}
                required
                class="w-full border px-4 py-2 rounded"
              >
                <option value="">-- Pilih Wishlist --</option>
                {wishlist()
                  .filter((w) => !w.completed)
                  .map((w) => (
                    <option value={w.id}>{w.nama}</option>
                  ))}
              </select>
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium">Jumlah Ditabung</label>
              <input
                type="text"
                value={amount()}
                onInput={(e) => setAmount(e.currentTarget.value)}
                placeholder="Rp 500.000"
                required
                class="w-full border px-4 py-2 rounded"
              />
            </div>

            <div>
              <label class="block mb-1 text-sm font-medium">Progress</label>
              <div class="w-full bg-gray-200 h-2 rounded">
                <div
                  class="h-2 bg-blue-400 rounded"
                  style={{ width: `${percent()}%` }}
                />
              </div>
              <p class="mt-2 text-sm text-gray-600">
                Ditabung {formatRupiah(newTotal())} dari{' '}
                {formatRupiah(selectedItem().harga)} ({percent()}%)
              </p>
            </div>

            <div class="flex justify-center">
              <Button type="submit" variant="teal" class="px-12 rounded-full">
                Update
              </Button>
            </div>
          </form>
        </div>

        <div class="hidden md:flex flex-col items-center justify-center w-1/3 p-8 bg-white">
          <img src="/assets/savings-76.svg" class="w-40 mb-4" />
          <p class="text-xs text-center text-gray-600">
            Tabungan kecil hari ini, impian besar esok hari ✨
          </p>
          <img src="/assets/money-1-29.svg" class="w-28 mt-6" />
        </div>
      </div>
    </div>
  );
}