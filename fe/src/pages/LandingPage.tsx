import { useNavigate } from "@solidjs/router";
import { createSignal, createMemo } from "solid-js";
import Button from "../components/button";

interface Review {
  id: number;
  name: string;
  avatar: string;
  profileColor: string;
  rating: number;
  achievement: string;
  timeUsed: string;
  review: string;
  verified: boolean;
  date: string;
}

interface NewReviewForm {
  name: string;
  achievement: string;
  timeUsed: string;
  rating: string;
  review: string;
}

export default function LandingPage() {
  const navigate = useNavigate();

  const goToAuth = () => {
    navigate("/login");
  };

  // Reviews State
  const [searchTerm, setSearchTerm] = createSignal('');
  const [reviews, setReviews] = createSignal<Review[]>([]);
  const [showAddModal, setShowAddModal] = createSignal(false);
  const [newReview, setNewReview] = createSignal<NewReviewForm>({
    name: '',
    achievement: '',
    timeUsed: '',
    rating: '5',
    review: ''
  });

  const filteredReviews = createMemo(() =>
    reviews().filter(review =>
      review.name.toLowerCase().includes(searchTerm().toLowerCase()) ||
      review.achievement.toLowerCase().includes(searchTerm().toLowerCase()) ||
      review.review.toLowerCase().includes(searchTerm().toLowerCase())
    )
  );

  const totalReviews = createMemo(() => reviews().length);
  const averageRating = createMemo(() => {
    if (reviews().length === 0) return "0.0";
    return (reviews().reduce((sum, review) => sum + review.rating, 0) / reviews().length).toFixed(1);
  });
  const fiveStarCount = createMemo(() => reviews().filter(review => review.rating === 5).length);
  const verifiedUsers = createMemo(() => reviews().filter(review => review.verified).length);

  // Helper function to get current date in Indonesian format
  const getCurrentDate = () => {
    const now = new Date();
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  const handleAddReview = () => {
    const current = newReview();
    if (current.name && current.achievement && current.review) {
      const profileColors = [
        'bg-gradient-to-br from-pink-400 to-pink-600',
        'bg-gradient-to-br from-blue-400 to-blue-600',
        'bg-gradient-to-br from-purple-400 to-purple-600',
        'bg-gradient-to-br from-green-400 to-green-600',
        'bg-gradient-to-br from-teal-400 to-teal-600',
        'bg-gradient-to-br from-orange-400 to-orange-600',
        'bg-gradient-to-br from-red-400 to-red-600',
        'bg-gradient-to-br from-yellow-400 to-yellow-600'
      ];
      
      const newReviewData = {
        id: Date.now(),
        ...current,
        profileColor: profileColors[Math.floor(Math.random() * profileColors.length)],
        avatar: current.name.charAt(0).toUpperCase(),
        rating: parseInt(current.rating),
        verified: true,
        date: getCurrentDate() // Auto-generate current date
      };
      
      setReviews([...reviews(), newReviewData]);
      setNewReview({
        name: '',
        achievement: '',
        timeUsed: '',
        rating: '5',
        review: ''
      });
      setShowAddModal(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span class={`text-lg ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ⭐
      </span>
    ));
  };

  return (
    <div class="relative min-h-screen w-full bg-gradient-to-br from-[#c1f7f5] via-[#fefefe] to-[#fbe2e9] font-[Poppins] overflow-hidden">
      
      {/* Background Pattern */}
      <div class="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#14b8a6" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* ORIGINAL LANDING PAGE SECTION */}
      <div class="min-h-screen flex flex-col lg:flex-row">
        
        {/* Left Section - Text Content */}
        <div class="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12 relative z-10">
          
          {/* Logo */}
          <div class="flex items-center gap-3 mb-12">
            <div class="w-12 h-12 bg-gradient-to-r from-teal-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
              ✨
            </div>
            <h1 class="text-3xl lg:text-4xl font-bold text-teal-600">WishSave</h1>
          </div>

          {/* Main Content */}
          <div class="max-w-2xl">
            <h2 class="text-4xl lg:text-6xl font-bold text-gray-800 leading-tight mb-6">
              Save Smart,
              <br />
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-pink-500">
                Dream Big
              </span>
            </h2>

            <p class="text-xl text-gray-600 mb-8 leading-relaxed">
              Wujudkan impianmu dengan cara yang lebih terorganisir. 
              <br class="hidden lg:block" />
              Catat wishlist, kelola tabungan, raih target! 🎯
            </p>

            {/* Stats Cards */}
            <div class="grid grid-cols-3 gap-4 mb-8">
              <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/50">
                <div class="text-2xl font-bold text-teal-600 mb-1">10K+</div>
                <div class="text-sm text-gray-600">Users</div>
              </div>
              <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/50">
                <div class="text-2xl font-bold text-pink-500 mb-1">50K+</div>
                <div class="text-sm text-gray-600">Wishes</div>
              </div>
              <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/50">
                <div class="text-2xl font-bold text-teal-600 mb-1">1B+</div>
                <div class="text-sm text-gray-600">Saved</div>
              </div>
            </div>

            {/* CTA */}
            <div class="flex flex-col sm:flex-row gap-4 items-start">
              <Button 
                onClick={goToAuth} 
                variant="gradient"
                class="text-lg px-8 py-4 hover:scale-105 transition-all duration-300"
              >
                Start Your Journey 🚀
              </Button>
              <button class="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2 px-4 py-4">
                <span>▶️</span> Watch Demo
              </button>
            </div>

            <p class="text-gray-400 text-sm mt-4">
              Free forever • No credit card required
            </p>
          </div>
        </div>

        {/* Right Section - Visual */}
        <div class="flex-1 flex items-center justify-center px-8 lg:px-16 py-12 relative">
          
          {/* Phone Mockup */}
          <div class="relative">
            {/* Phone Frame */}
            <div class="w-80 h-[640px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
              <div class="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                
                {/* Screen Content */}
                <div class="h-full bg-gradient-to-b from-[#c1f7f5] to-[#fbe2e9] p-6">
                  
                  {/* Phone Header */}
                  <div class="flex items-center justify-between mb-8 pt-6">
                    <div class="text-2xl font-bold text-teal-600">WishSave</div>
                    <div class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      👤
                    </div>
                  </div>

                  {/* Wishlist Cards in Phone */}
                  <div class="space-y-4">
                    <div class="bg-white/80 rounded-2xl p-4 border border-white/50">
                      <div class="flex items-center gap-3 mb-3">
                        <div class="text-2xl">📱</div>
                        <div>
                          <div class="font-semibold text-gray-800">iPhone 15 Pro</div>
                          <div class="text-sm text-gray-600">Rp 20.000.000</div>
                        </div>
                      </div>
                      <div class="bg-gray-100 rounded-full h-2 mb-2">
                        <div class="bg-gradient-to-r from-teal-400 to-pink-400 h-2 rounded-full" style="width: 75%"></div>
                      </div>
                      <div class="text-xs text-gray-600">75% complete • Rp 15.000.000 saved</div>
                    </div>

                    <div class="bg-white/80 rounded-2xl p-4 border border-white/50">
                      <div class="flex items-center gap-3 mb-3">
                        <div class="text-2xl">🏖️</div>
                        <div>
                          <div class="font-semibold text-gray-800">Vacation Bali</div>
                          <div class="text-sm text-gray-600">Rp 8.000.000</div>
                        </div>
                      </div>
                      <div class="bg-gray-100 rounded-full h-2 mb-2">
                        <div class="bg-gradient-to-r from-pink-400 to-teal-400 h-2 rounded-full" style="width: 30%"></div>
                      </div>
                      <div class="text-xs text-gray-600">30% complete • Rp 2.400.000 saved</div>
                    </div>

                    <div class="bg-white/80 rounded-2xl p-4 border border-white/50">
                      <div class="flex items-center gap-3 mb-3">
                        <div class="text-2xl">🚗</div>
                        <div>
                          <div class="font-semibold text-gray-800">Toyota Supra</div>
                          <div class="text-sm text-gray-600">Rp 500.000.000</div>
                        </div>
                      </div>
                      <div class="bg-gray-100 rounded-full h-2 mb-2">
                        <div class="bg-gradient-to-r from-teal-400 to-pink-400 h-2 rounded-full" style="width: 12%"></div>
                      </div>
                      <div class="text-xs text-gray-600">12% complete • Rp 60.000.000 saved</div>
                    </div>
                  </div>

                  {/* Bottom Navigation in Phone */}
                  <div class="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-3 border border-white/50">
                    <div class="flex justify-around">
                      <div class="text-center">
                        <div class="text-xl mb-1">🏠</div>
                        <div class="text-xs text-teal-600 font-medium">Home</div>
                      </div>
                      <div class="text-center">
                        <div class="text-xl mb-1">📋</div>
                        <div class="text-xs text-gray-400">Lists</div>
                      </div>
                      <div class="text-center">
                        <div class="text-xl mb-1">💰</div>
                        <div class="text-xs text-gray-400">Savings</div>
                      </div>
                      <div class="text-center">
                        <div class="text-xl mb-1">⚙️</div>
                        <div class="text-xs text-gray-400">Settings</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements around Phone */}
            <div class="absolute -top-8 -left-8 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/50 animate-bounce">
              <div class="text-2xl mb-1">🎯</div>
              <div class="text-sm font-medium text-gray-800">Goal: 3</div>
            </div>

            <div class="absolute -top-8 -right-8 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/50 animate-bounce animation-delay-1000">
              <div class="text-2xl mb-1">💎</div>
              <div class="text-sm font-medium text-gray-800">Achieved</div>
            </div>

            <div class="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/50 animate-bounce animation-delay-2000">
              <div class="text-2xl mb-1">📊</div>
              <div class="text-sm font-medium text-gray-800">Analytics</div>
            </div>

            <div class="absolute -bottom-8 -right-8 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/50 animate-bounce animation-delay-3000">
              <div class="text-2xl mb-1">🏆</div>
              <div class="text-sm font-medium text-gray-800">Rewards</div>
            </div>
          </div>
        </div>

      </div>

      {/* USER REVIEWS SECTION - TAMBAHAN DI BAWAH */}
      <div class="max-w-7xl mx-auto p-6 relative z-10">
        
        {/* Reviews Header */}
        <div class="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-8">
          <div class="flex items-center gap-4 flex-1">
            <div class="w-12 h-12 bg-gradient-to-r from-teal-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
              💬
            </div>
            <div>
              <h1 class="text-4xl font-bold text-gray-800 mb-2">User Reviews</h1>
              <p class="text-gray-600">Apa kata pengguna WishSave tentang perjalanan menabung mereka</p>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div class="relative">
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400">
                🔍
              </div>
              <input
                type="text"
                placeholder="Cari review atau achievement..."
                value={searchTerm()}
                onInput={(e) => setSearchTerm(e.target.value)}
                class="pl-10 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              variant="gradient"
              class="px-6 py-3 hover:scale-105 transition-all duration-300"
            >
              + Tambah Review
            </Button>
          </div>
        </div>

        {/* Rating Overview Cards */}
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
                <div class="w-6 h-6 text-white text-xl">⭐</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-yellow-600 mb-1">{averageRating()}</div>
                <div class="text-gray-600 text-sm">Rating Rata-rata</div>
              </div>
            </div>
          </div>
          
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-gradient-to-r from-teal-500 to-pink-500 rounded-xl">
                <div class="w-6 h-6 text-white text-xl">👥</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-teal-600 mb-1">{totalReviews()}</div>
                <div class="text-gray-600 text-sm">Total Reviews</div>
              </div>
            </div>
          </div>
          
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                <div class="w-6 h-6 text-white text-xl">🏆</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-green-600 mb-1">{fiveStarCount()}</div>
                <div class="text-gray-600 text-sm">5-Star Reviews</div>
              </div>
            </div>
          </div>
          
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <div class="w-6 h-6 text-white text-xl">✅</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-blue-600 mb-1">{verifiedUsers()}</div>
                <div class="text-gray-600 text-sm">Verified Users</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        {filteredReviews().length === 0 ? (
          <div class="text-center py-16">
            <div class="w-20 h-20 bg-gradient-to-r from-teal-500 to-pink-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              💬
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-4">Belum Ada Review</h3>
            <p class="text-gray-600 mb-8">Jadilah yang pertama berbagi pengalaman menggunakan WishSave!</p>
            <Button
              onClick={() => setShowAddModal(true)}
              variant="gradient"
              class="px-8 py-4 hover:scale-105 transition-all duration-300"
            >
              Tulis Review Pertama ✨
            </Button>
          </div>
        ) : (
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredReviews().map((review) => (
              <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
                
                {/* Review Header */}
                <div class="flex items-center gap-4 mb-4">
                  <div class={`w-12 h-12 ${review.profileColor} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                    {review.avatar}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <div class="font-semibold text-gray-800">{review.name}</div>
                      {review.verified && (
                        <div class="w-4 h-4 text-blue-500">✅</div>
                      )}
                    </div>
                    <div class="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>

                {/* Achievement */}
                <div class="mb-4">
                  <div class="font-medium text-teal-600 mb-1">🎯 {review.achievement}</div>
                  <div class="text-sm text-gray-600">Menggunakan WishSave selama {review.timeUsed}</div>
                </div>

                {/* Review Text */}
                <div class="text-gray-700 text-sm mb-4 italic">
                  "{review.review}"
                </div>

                {/* Date */}
                <div class="flex justify-between items-center text-xs text-gray-500">
                  <span>{review.date}</span>
                  <span class="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Verified ✓
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Review Modal */}
        {showAddModal() && (
          <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md border border-white/50 max-h-[90vh] overflow-y-auto">
              <h3 class="text-2xl font-bold text-gray-800 mb-6">Bagikan Review Anda</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                  <input
                    type="text"
                    value={newReview().name}
                    onInput={(e) => setNewReview({...newReview(), name: e.target.value})}
                    class="w-full px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Masukkan nama Anda"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Achievement/Impian yang Tercapai</label>
                  <input
                    type="text"
                    value={newReview().achievement}
                    onInput={(e) => setNewReview({...newReview(), achievement: e.target.value})}
                    class="w-full px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Contoh: iPhone 15 Pro, Liburan Bali"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Lama Menggunakan WishSave</label>
                  <input
                    type="text"
                    value={newReview().timeUsed}
                    onInput={(e) => setNewReview({...newReview(), timeUsed: e.target.value})}
                    class="w-full px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Contoh: 6 bulan, 2 tahun"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <select
                    value={newReview().rating}
                    onChange={(e) => setNewReview({...newReview(), rating: e.target.value})}
                    class="w-full px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                    <option value="3">⭐⭐⭐ (3 Stars)</option>
                    <option value="2">⭐⭐ (2 Stars)</option>
                    <option value="1">⭐ (1 Star)</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Review</label>
                  <textarea
                    value={newReview().review}
                    onInput={(e) => setNewReview({...newReview(), review: e.target.value})}
                    rows={4}
                    class="w-full px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    placeholder="Bagikan pengalaman Anda menggunakan WishSave..."
                  />
                </div>
              </div>

              <div class="flex gap-4 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  class="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-xl border border-gray-200 transition-colors"
                >
                  Batal
                </button>
                <Button
                  onClick={handleAddReview}
                  variant="gradient"
                  class="flex-1 px-4 py-2 hover:scale-105 transition-all duration-300"
                >
                  Kirim Review
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
      `}</style>
    </div>
  );
}