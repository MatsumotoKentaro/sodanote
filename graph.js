fetch("data/drink_log.csv")
  .then(res => res.text())
  .then(csv => {
    const lines = csv.trim().split("\n").slice(1); // skip header
    const dates = [];
    const liters = [];

    lines.forEach(line => {
      const [rawDate, , rawLiter] = line.split(",");
      const date = rawDate.replace(/^"|"$/g, "");
      const literStr = rawLiter.replace(/^"|"$/g, "");
      const liter = parseFloat(literStr);
      if (!isNaN(liter)) {
        dates.push(date);
        liters.push(liter);
      }
    });

    const ctx = document.getElementById("drinkChart");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: dates,
        datasets: [{
          label: "炭酸リットル",
          data: liters,
          backgroundColor: "rgba(54, 162, 235, 0.5)"
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  })
  .catch(error => console.error("CSV読み込みエラー:", error));
