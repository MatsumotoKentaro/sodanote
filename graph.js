fetch("data/drink_log.csv")
  .then(res => res.text())
  .then(csv => {
    const lines = csv.trim().split("\n").slice(1); // skip header
    const totals = {}; // 日付ごとの合計

    lines.forEach(line => {
      const [rawDate, rawPush, rawLiter] = line.split(",");
      const date = rawDate.replace(/^"|"$/g, "");
      const push = parseInt(rawPush.replace(/^"|"$/g, ""));
      const liter = parseFloat(rawLiter.replace(/^"|"$/g, ""));

      if (!totals[date]) {
        totals[date] = { liters: 0, pushes: 0 };
      }
      if (!isNaN(liter)) totals[date].liters += liter;
      if (!isNaN(push)) totals[date].pushes += push;
    });

    const sortedDates = Object.keys(totals).sort();
    const liters = sortedDates.map(date => totals[date].liters);
    const pushes = sortedDates.map(date => totals[date].pushes);

    new Chart(document.getElementById("drinkChart"), {
      type: "bar",
      data: {
        labels: sortedDates,
        datasets: [
          {
            label: "リットル数",
            data: liters,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            yAxisID: "yLiters"
          },
          {
            label: "プッシュ数",
            data: pushes,
            type: "line",
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.3)",
            yAxisID: "yPushes"
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          yLiters: {
            type: "linear",
            position: "left",
            title: { display: true, text: "リットル" },
            beginAtZero: true
          },
          yPushes: {
            type: "linear",
            position: "right",
            title: { display: true, text: "プッシュ数" },
            beginAtZero: true,
            grid: { drawOnChartArea: false } // 折れ線の軸は棒の上に出ないように
          }
        }
      }
    });
  });
