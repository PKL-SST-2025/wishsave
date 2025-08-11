import { onMount, onCleanup, createSignal, For, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default function Grafik() {
  const navigate = useNavigate();
  let root: am5.Root | undefined;

  const [data, setData] = createSignal<any[]>([]);

  onMount(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!user) {
      navigate("/login");
      return;
    }
    const allWishlists = JSON.parse(localStorage.getItem("wishlist") || "{}");
    const email = user.email;
    const userWishlists = allWishlists[email] || [];
    const active = userWishlists.filter((item: any) => !item.completed);
    setData(active);

    root = am5.Root.new("chartdiv");
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        layout: root.verticalLayout,
        paddingTop: 20,
        paddingBottom: active.length > 4 ? 60 : 40, // Extra padding untuk label panjang
        paddingLeft: 15,
        paddingRight: 15,
      })
    );

    // ✅ PERBAIKAN MOBILE: X-Axis dengan spacing yang lebih pintar
    const xAxisRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: active.length > 5 ? Math.max(40, 300/active.length) : 60,
      cellStartLocation: 0.1,
      cellEndLocation: 0.9,
    });
    
    xAxisRenderer.grid.template.setAll({
      strokeOpacity: 0.1,
    });

    // ✅ PERBAIKAN: Label rotation dan truncate untuk banyak data
    xAxisRenderer.labels.template.setAll({
      rotation: active.length > 4 ? -90 : -45, // Rotasi vertikal jika data > 4
      centerY: active.length > 4 ? 1 : 0,
      centerX: active.length > 4 ? 0.5 : 1,
      paddingRight: active.length > 4 ? 5 : 15,
      fontSize: active.length > 6 ? "9px" : "11px",
      maxWidth: active.length > 4 ? 60 : 80,
      oversizedBehavior: "truncate"
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "nama",
        renderer: xAxisRenderer,
      })
    );

    // ✅ PERBAIKAN MOBILE: Y-Axis dengan format yang lebih compact
    const yAxisRenderer = am5xy.AxisRendererY.new(root, {
      opposite: false,
    });
    yAxisRenderer.grid.template.setAll({
      strokeOpacity: 0.1,
    });

    // ✅ Format label Y-axis untuk mobile (lebih compact)
    yAxisRenderer.labels.template.setAll({
      fontSize: "10px",
      paddingRight: 5,
    });

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: yAxisRenderer,
        numberFormat: "#a", // Format compact: 1M, 1K, etc
      })
    );

    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Tabungan",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "ditabung",
        categoryXField: "nama",
        stroke: am5.color("#1abc9c"),
        fill: am5.color("#1abc9c"),
        tooltip: am5.Tooltip.new(root, {
          labelText: "Rp {ditabung.formatNumber('#,###')}",
          pointerOrientation: "vertical",
        }),
      })
    );

    // ✅ BULLET CIRCLE dengan size yang responsive
    series.bullets.push(() =>
      am5.Bullet.new(root!, {
        sprite: am5.Circle.new(root!, {
          radius: 4, // Lebih kecil untuk mobile
          fill: series.get("fill"),
          stroke: am5.color("#ffffff"),
          strokeWidth: 2,
        }),
      })
    );

    xAxis.data.setAll(active);
    series.data.setAll(active);
    
    // ✅ PERBAIKAN: Zoom to fit semua data
    series.appear(1000);
    chart.appear(1000, 100);

    // ✅ Auto-fit chart setelah data loaded
    setTimeout(() => {
      if (active.length > 0) {
        chart.zoomOut();
      }
    }, 1200);

    // ✅ Add floating particles effect
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'floating-particle-chart';
      
      const size = Math.random() * 6 + 3;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.background = `linear-gradient(45deg, #1abc9c, #16a085)`;
      particle.style.borderRadius = '50%';
      particle.style.position = 'fixed';
      particle.style.bottom = '-10px';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '1';
      particle.style.animation = `floatUpChart ${(Math.random() * 2 + 5)}s linear forwards`;
      particle.style.opacity = (Math.random() * 0.5 + 0.2).toString();
      
      document.body.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 7000);
    };

    // Create particles every 600ms
    const particleInterval = setInterval(createParticle, 600);
    
    onCleanup(() => {
      root?.dispose();
      clearInterval(particleInterval);
    });
  });

  const formatRupiah = (num: number) => "Rp " + num.toLocaleString("id-ID");

  // ✅ Calculate statistics
  const totalTarget = () => data().reduce((sum, item) => sum + item.harga, 0);
  const totalSaved = () => data().reduce((sum, item) => sum + item.ditabung, 0);
  const progressPercentage = () => {
    const target = totalTarget();
    const saved = totalSaved();
    return target > 0 ? Math.round((saved / target) * 100) : 0;
  };

  return (
    <>
      {/* ✅ Enhanced CSS Styles */}
      <style>{`
        @keyframes floatUpChart {
          0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(45deg);
          }
        }

        @keyframes slideInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progressGlow {
          0%, 100% {
            box-shadow: 0 0 15px rgba(26, 188, 156, 0.3);
          }
          50% {
            box-shadow: 0 0 25px rgba(26, 188, 156, 0.6);
          }
        }

        .floating-bg-shape {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(45deg, #e8f8f5, #d1f2eb, #a3e4d7);
          opacity: 0.1;
          animation: float 10s ease-in-out infinite;
        }

        .enhanced-container {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 20%, #cbd5e1 100%);
          position: relative;
          overflow: hidden;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          animation: slideInUp 0.6s ease-out;
        }

        .stat-card {
          background: linear-gradient(135deg, #1abc9c, #16a085);
          color: white;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(26, 188, 156, 0.3);
        }

        .stat-card-2 {
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: white;
          transition: all 0.3s ease;
        }

        .stat-card-2:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(52, 152, 219, 0.3);
        }

        .stat-card-3 {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: white;
          transition: all 0.3s ease;
        }

        .stat-card-3:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(231, 76, 60, 0.3);
        }

        .enhanced-button {
          background: linear-gradient(45deg, #1abc9c, #16a085);
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(26, 188, 156, 0.3);
        }

        .enhanced-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(26, 188, 156, 0.4);
          background: linear-gradient(45deg, #16a085, #1abc9c);
        }

        .enhanced-table {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .table-header {
          background: linear-gradient(45deg, #1abc9c, #16a085) !important;
        }

        .progress-bar {
          background: linear-gradient(90deg, #1abc9c, #16a085, #48c9b0);
          animation: progressGlow 2s ease-in-out infinite alternate;
        }

        .empty-state {
          animation: slideInUp 0.8s ease-out;
        }

        .title-enhanced {
          background: linear-gradient(45deg, #2c3e50, #1abc9c, #3498db);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 3s ease-in-out infinite;
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        /* ✅ PERBAIKAN MOBILE: Chart container responsive */
        #chartdiv {
          min-height: 350px !important;
        }

        @media (max-width: 768px) {
          #chartdiv {
            min-height: 400px !important; /* Lebih tinggi untuk accommodate banyak labels */
          }
          
          .glass-card {
            margin: 0 -0.5rem;
          }
          
          .title-enhanced {
            font-size: 1.5rem !important;
          }
          
          .stat-card, .stat-card-2, .stat-card-3 {
            padding: 1rem !important;
          }
          
          .stat-card p:last-child, 
          .stat-card-2 p:last-child, 
          .stat-card-3 p:last-child {
            font-size: 1.25rem !important;
          }
        }
      `}</style>

      <div class="enhanced-container relative p-6 min-h-screen">
        {/* ✅ Enhanced Floating Background Shapes */}
        <div class="floating-bg-shape" style={{
          width: "100px",
          height: "100px",
          top: "8%",
          left: "5%",
          "animation-delay": "0s"
        }}></div>
        <div class="floating-bg-shape" style={{
          width: "120px",
          height: "120px",
          top: "15%",
          right: "10%",
          "animation-delay": "2s"
        }}></div>
        <div class="floating-bg-shape" style={{
          width: "80px",
          height: "80px",
          bottom: "20%",
          left: "15%",
          "animation-delay": "4s"
        }}></div>
        <div class="floating-bg-shape" style={{
          width: "110px",
          height: "110px",
          bottom: "10%",
          right: "8%",
          "animation-delay": "3s"
        }}></div>

        {/* ✅ Enhanced Header */}
        <div class="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            class="enhanced-button flex items-center gap-2 text-white px-6 py-3 rounded-xl font-medium"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Kembali
          </button>

          <h1 class="title-enhanced text-3xl font-bold text-center">
            Progress Tabungan
          </h1>
          
          <div class="w-24"></div>
        </div>

        {/* ✅ Enhanced Stats Cards */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="stat-card p-6 rounded-2xl">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white/80 text-sm font-medium">Total Target</p>
                <p class="text-2xl font-bold text-white">{formatRupiah(totalTarget())}</p>
              </div>
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="stat-card-2 p-6 rounded-2xl">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white/80 text-sm font-medium">Total Tersimpan</p>
                <p class="text-2xl font-bold text-white">{formatRupiah(totalSaved())}</p>
              </div>
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="stat-card-3 p-6 rounded-2xl">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white/80 text-sm font-medium">Progress Keseluruhan</p>
                <p class="text-2xl font-bold text-white">{progressPercentage()}%</p>
              </div>
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ✅ Enhanced Chart - FIXED FOR MOBILE */}
          <div class="lg:col-span-8 glass-card rounded-2xl shadow-xl p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-8 h-8 bg-gradient-to-r from-teal-400 to-blue-400 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-800">Grafik Progress</h3>
            </div>
            <div
              id="chartdiv"
              class="w-full h-[400px] md:h-[500px] rounded-xl"
            />
          </div>

          {/* ✅ Enhanced Data Table */}
          <div class="lg:col-span-4 glass-card rounded-2xl shadow-xl p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <h2 class="text-lg font-semibold text-gray-800">Data Wishlist</h2>
            </div>
            
            <Show
              when={data().length > 0}
              fallback={
                <div class="empty-state text-center py-16">
                  <div class="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-700 mb-2">Belum Ada Data</h3>
                  <p class="text-gray-500 text-sm">
                    Tambahkan wishlist pertama Anda untuk melihat progress tabungan!
                  </p>
                </div>
              }
            >
              <div class="overflow-x-auto">
                <table class="w-full table-auto border-collapse enhanced-table rounded-lg overflow-hidden">
                  <thead>
                    <tr class="table-header text-white">
                      <th class="px-3 py-3 text-left text-sm font-medium">Nama</th>
                      <th class="px-3 py-3 text-left text-sm font-medium">Target</th>
                      <th class="px-3 py-3 text-left text-sm font-medium">Tersimpan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={data()}>
                      {(item, index) => (
                        <tr class={`${index() % 2 === 0 ? 'bg-white/60' : 'bg-gray-50/60'} hover:bg-teal-50/60 transition-colors duration-200`}>
                          <td class="px-3 py-3 text-sm font-medium text-gray-900">{item.nama}</td>
                          <td class="px-3 py-3 text-sm text-gray-700">
                            {formatRupiah(item.harga)}
                          </td>
                          <td class="px-3 py-3 text-sm">
                            <div class="flex flex-col gap-1">
                              <span class="text-teal-600 font-medium">
                                {formatRupiah(item.ditabung)}
                              </span>
                              <div class="w-full bg-gray-200 rounded-full h-1">
                                <div 
                                  class="progress-bar h-1 rounded-full" 
                                  style={{
                                    width: `${Math.min((item.ditabung / item.harga) * 100, 100)}%`
                                  }}
                                ></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </>
  );
}