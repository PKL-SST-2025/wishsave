import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import Button from "../components/button"; 

export default function TambahWishlist() {
  const navigate = useNavigate();
  const [nama, setNama] = createSignal('');
  const [harga, setHarga] = createSignal('');
  const [ditabung, setDitabung] = createSignal('');
  const [gambar, setGambar] = createSignal('');

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!user) return;

    const email = user.email;
    const allWishlists = JSON.parse(localStorage.getItem("wishlist") || "{}");

    const userWishlists = allWishlists[email] || [];

    const newItem = {
      id: Date.now(),
      nama: nama(),
      harga: Number(harga().replace(/[^0-9]/g, '')),
      ditabung: Number(ditabung().replace(/[^0-9]/g, '')) || 0,
      gambar: gambar(),
      completed: false,
    };

    allWishlists[email] = [...userWishlists, newItem];
    localStorage.setItem("wishlist", JSON.stringify(allWishlists));

    window.dispatchEvent(new Event("wishlist-updated"));

    navigate("/dashboard");
  };

  return (
    <div class="min-h-screen bg-white flex items-center justify-center relative">
      <div class="absolute inset-0 bg-white z-0" />
      <div class="relative z-10 w-full max-w-6xl border border-green-200 rounded-lg shadow-md flex flex-col md:flex-row overflow-hidden">
        <div class="w-full md:w-2/3 p-8 bg-white">
          <Button onClick={() => navigate(-1)} variant="default" class="mb-4 text-2xl w-fit px-3 py-1">←</Button>
          <h2 class="text-2xl font-bold text-center mb-6">Tambah Wishlist</h2>
          <form onSubmit={handleSubmit} class="space-y-4">
            <div>
              <label class="block font-semibold mb-1">Wishlist</label>
              <input
                type="text"
                value={nama()}
                onInput={(e) => setNama(e.currentTarget.value)}
                required
                placeholder="Contoh: Apple Watch"
                class="w-full border px-4 py-2 rounded"
              />
            </div>
            <div>
              <label class="block font-semibold mb-1">Target Harga</label>
              <input
                type="text"
                value={harga()}
                onInput={(e) => setHarga(e.currentTarget.value)}
                required
                placeholder="Contoh: Rp 2.000.000"
                class="w-full border px-4 py-2 rounded"
              />
            </div>
            <div>
              <label class="block font-semibold mb-1">Jumlah Ditabung</label>
              <input
                type="text"
                value={ditabung()}
                onInput={(e) => setDitabung(e.currentTarget.value)}
                placeholder="Contoh: Rp 500.000"
                class="w-full border px-4 py-2 rounded"
              />
            </div>
            <div>
              <label class="block font-semibold mb-1">Upload Gambar</label>
              <input
                type="file"
                accept="image/*"
                class="hidden"
                id="upload"
                onChange={(e) => {
                  const file = e.currentTarget.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => setGambar(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <label for="upload" class="cursor-pointer text-blue-600 text-sm">📷 Pilih Gambar</label>
            </div>
            <Button type="submit" variant="teal" class="w-full">
             Simpan Wishlist
            </Button>

          </form>
        </div>

        <div class="hidden md:flex flex-col items-center justify-center w-1/3 p-6 bg-white">
          <img src="/assets/undraw_wishlist_0k5w.svg" class="w-24 mb-4" />
          <p class="text-sm text-center text-gray-600">Tabung pelan-pelan, impian jadi kenyataan ✨</p>
          <img src="/assets/savings-50.svg" class="w-36 mt-6" />
        </div>
      </div>
    </div>
  );
}
