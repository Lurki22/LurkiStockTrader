let stockData = [];
const ctx = document.getElementById('chart').getContext('2d');

const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Stock Price',
            data: [],
            borderColor: 'blue',
            fill: false,
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: { display: true },
            y: { display: true }
        }
    }
});

function updateStockData() {
    const newPrice = (Math.random() * 100 + 50).toFixed(2);
    const time = new Date().toLocaleTimeString();

    stockData.push({ time, price: newPrice });
    if (stockData.length > 20) stockData.shift();

    chart.data.labels = stockData.map(d => d.time);
    chart.data.datasets[0].data = stockData.map(d => d.price);
    chart.update();
}

setInterval(updateStockData, 2000);
