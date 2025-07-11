fetch("data/drink_log.csv")
  .then(res => res.text())
  .then(csv => {
    const lines = csv.trim().split("\n").slice(1); // ヘッダー除外
    const dates = [];
    const liters = [];

    lines.forEach(line => {
      const [date, , liter] = line.split(",");
      dates.push(date);
      liters.push(parseFloat(liter));
    });

    new Chart(document.getElementById("drinkChart"), {
      type: 'bar',
      data: {
        labels: dates,
        datasets: [{
          label: '炭酸リットル',
          data: liters,
          backgroundColor: 'rgba(54, 162, 235, 0.5)'
        }]
      }
    });
  });
