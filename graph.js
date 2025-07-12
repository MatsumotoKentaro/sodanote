fetch("data/drink_log.csv")
  .then(res => res.text())
  .then(csv => {
    const lines = csv.trim().split("\n").slice(1); // skip header
    const totals = {};

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
    const liters = [];
    const pushes = [];
    const cumulativeLiters = [];
    const cumulativePushes = [];

    let literSum = 0;
    let pushSum = 0;
    sortedDates.forEach(date => {
      const liter = totals[date].liters;
      const push = totals[date].pushes;
      liters.push(liter);
      pushes.push(push);
      literSum += liter;
      pushSum += push;
      cumulativeLiters.push(literSum);
      cumulativePushes.push(pushSum);
    });

    // グラフ1：複合（棒＋線）
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
          x: {
            ticks: { maxRotation: 45, minRotation: 30 }
          },
          yLiters: {
            beginAtZero: true,
            position: "left",
            title: { display: true, text: "リットル" }
          },
          yPushes: {
            beginAtZero: true,
            position: "right",
            title: { display: true, text: "プッシュ数" },
            grid: { drawOnChartArea: false }
          }
        }
      }
    });

    // グラフ2：累積リットル＆プッシュ（折れ線2本）
    new Chart(document.getElementById("cumulativeChart"), {
      type: "line",
      data: {
        labels: sortedDates,
        datasets: [
          {
            label: "累積リットル数",
            data: cumulativeLiters,
            yAxisID: "yLiters",
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.3)",
            fill: false,
            tension: 0.2
          },
          {
            label: "累積プッシュ数",
            data: cumulativePushes,
            yAxisID: "yPushes",
            borderColor: "rgba(255, 159, 64, 1)",
            backgroundColor: "rgba(255, 159, 64, 0.3)",
            fill: false,
            tension: 0.2
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            ticks: { maxRotation: 45, minRotation: 30 }
          },
          yLiters: {
            beginAtZero: true,
            position: "left",
            title: { display: true, text: "累積リットル" }
          },
          yPushes: {
            beginAtZero: true,
            position: "right",
            title: { display: true, text: "累積プッシュ" },
            grid: { drawOnChartArea: false }
          }
        }
      }
    });
  });
