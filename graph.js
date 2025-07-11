fetch("data/drink_log.csv")
  .then(res => res.text())
  .then(csv => {
    const lines = csv.trim().split("\n").slice(1); // skip header
    const totals = {};

    lines.forEach(line => {
      const [rawDate, , rawLiter] = line.split(",");
      const date = rawDate.replace(/^"|"$/g, "");
      const literStr = rawLiter.replace(/^"|"$/g, "");
      const liter = parseFloat(literStr);

      if (!isNaN(liter)) {
        if (!totals[date]) {
          totals[date] = 0;
        }
        totals[date] += liter;
      }
    });

    // 日付でソート
    const sortedDates = Object.keys(totals).sort();
    const sortedLiters = sortedDates.map(date => totals[date]);

    // グラフ描画
    new Chart(document.getElementById("drinkChart"), {
      type: "bar",
      data: {
        labels: sortedDates,
        datasets: [{
          label: "炭酸水リットル（合計）",
          data: sortedLiters,
          backgroundColor: "rgba(75, 192, 192, 0.6)"
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  });
