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
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: root.verticalLayout,
      })
    );

    const xAxisRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 30,
    });
    xAxisRenderer.grid.template.setAll({
      strokeOpacity: 0.1,
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "nama",
        renderer: xAxisRenderer,
      })
    );

    const yAxisRenderer = am5xy.AxisRendererY.new(root, {});
    yAxisRenderer.grid.template.setAll({
      strokeOpacity: 0.1,
    });

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: yAxisRenderer,
      })
    );

    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Tabungan",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "ditabung",
        categoryXField: "nama",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{ditabung.formatNumber('#,###')}",
        }),
      })
    );

    // BULLET CIRCLE
    series.bullets.push(() =>
      am5.Bullet.new(root!, {
        sprite: am5.Circle.new(root!, {
          radius: 5,
          fill: series.get("fill"),
        }),
      })
    );


    xAxis.data.setAll(active);
    series.data.setAll(active);
    series.appear(1000);
    chart.appear(1000, 100);

    onCleanup(() => root?.dispose());
  });

  const formatRupiah = (num: number) => "Rp " + num.toLocaleString("id-ID");

  return (
    <div class="relative p-6 min-h-screen bg-[#f9f9f9]">
      <button
        onClick={() => navigate("/dashboard")}
        class="absolute top-6 left-6 flex items-center gap-2 bg-[#1abc9c] text-white px-4 py-2 rounded hover:bg-[#16a085]"
      >
        ← Kembali
      </button>

      <h1 class="text-2xl font-bold mb-4 text-center">Progress Tabungan</h1>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart */}
        <div class="lg:col-span-8 bg-white rounded shadow p-4">
          <div
            id="chartdiv"
            class="w-full h-[500px] rounded"
          />
        </div>

        {/* Data Tabel */}
        <div
          class="lg:col-span-4 bg-white rounded shadow p-4"
          style={{ background: `url('/assets/verification.jpeg') center/cover` }}
        >
          <h2 class="text-xl font-bold mb-4">Data Wishlist</h2>
          <Show
            when={data().length > 0}
            fallback={
              <p class="text-center text-gray-600 italic">
                Belum ada data wishlist.
              </p>
            }
          >
            <table class="w-full table-auto border-collapse bg-white/80">
              <thead>
                <tr class="bg-[#1abc9c] text-white">
                  <th class="px-4 py-2 border">Nama</th>
                  <th class="px-4 py-2 border">Target Harga</th>
                  <th class="px-4 py-2 border">Ditabung</th>
                </tr>
              </thead>
              <tbody>
                <For each={data()}>
                  {(item) => (
                    <tr class="odd:bg-gray-100">
                      <td class="px-4 py-2 border">{item.nama}</td>
                      <td class="px-4 py-2 border">
                        {formatRupiah(item.harga)}
                      </td>
                      <td class="px-4 py-2 border">
                        {formatRupiah(item.ditabung)}
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </Show>
        </div>
      </div>
    </div>
  );
}
