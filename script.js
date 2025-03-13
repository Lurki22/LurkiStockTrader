// script.js
let stockData = [];
const ctx = document.getElementById('chart').getContext('2d');
const timeRangeSelect = document.getElementById('timeRange');
const startTimeInput = document.getElementById('startTime');
const endTimeInput = document.getElementById('endTime');
const applyRangeButton = document.getElementById('applyRange');

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
    if (stockData.length > 50) stockData.shift();
    
    chart.data.labels = stockData.map(d => d.time);
    chart.data.datasets[0].data = stockData.map(d => d.price);
    chart.update();
}

setInterval(updateStockData, 2000);

timeRangeSelect.addEventListener('change', function() {
    let timeRange = timeRangeSelect.value;
    if (timeRange === 'custom') {
        startTimeInput.style.display = 'inline';
        endTimeInput.style.display = 'inline';
        applyRangeButton.style.display = 'inline';
    } else {
        startTimeInput.style.display = 'none';
        endTimeInput.style.display = 'none';
        applyRangeButton.style.display = 'none';
        stockData = [];
        chart.data.labels = [];
        chart.data.datasets[0].data = [];
        chart.update();
    }
});

applyRangeButton.addEventListener('click', function() {
    const startTime = new Date(startTimeInput.value);
    const endTime = new Date(endTimeInput.value);
    if (isNaN(startTime) || isNaN(endTime) || startTime >= endTime) {
        alert("Bitte geben Sie einen gültigen Zeitraum ein.");
        return;
    }
    console.log("Eigener Zeitraum: ", startTime, "bis", endTime);
});
