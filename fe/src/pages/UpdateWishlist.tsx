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
    const allWishlists = JSON.parse(localStorage.getItem('wishlist') || '{}');
    const allRiwayat = JSON.parse(localStorage.getItem('riwayatWishlist') || '{}');

    const userWishlist: WishlistItem[] = allWishlists[email] || [];
    const userRiwayat: WishlistItem[] = allRiwayat[email] || [];

    const index = userWishlist.findIndex((w) => w.id === selectedId());
    if (index !== -1) {
      userWishlist[index].ditabung += Number(amount().replace(/[^0-9]/g, '') || 0);

      // ✅ Jika tabungan >= harga, pindah ke riwayat
      if (userWishlist[index].ditabung >= userWishlist[index].harga) {
        const done = { ...userWishlist[index], completed: true };
        userRiwayat.push(done);
        userWishlist.splice(index, 1);

        allRiwayat[email] = userRiwayat;
      }

      allWishlists[email] = userWishlist;
      localStorage.setItem('wishlist', JSON.stringify(allWishlists));
      localStorage.setItem('riwayatWishlist', JSON.stringify(allRiwayat));

      window.dispatchEvent(new Event('wishlist-updated'));
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
                {wishlist().map((w) => (
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
              <Button type="submit" variant="teal" class="px-12 rounded-full">Update</Button>

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
