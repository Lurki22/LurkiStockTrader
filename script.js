// script.js
let stockData = [];
const ctx = document.getElementById('chart').getContext('2d');
const timeRangeSelect = document.getElementById('timeRange');
const customTimeInputs = document.getElementById('customTimeInputs');
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

function updateStockData(interval) {
    stockData = [];
    clearInterval(window.updateInterval);
    window.updateInterval = setInterval(() => {
        const newPrice = (Math.random() * 100 + 50).toFixed(2);
        const time = new Date().toLocaleTimeString();
        stockData.push({ time, price: newPrice });
        if (stockData.length > 50) stockData.shift();
        chart.data.labels = stockData.map(d => d.time);
        chart.data.datasets[0].data = stockData.map(d => d.price);
        chart.update();
    }, interval);
}

timeRangeSelect.addEventListener('change', function() {
    let timeRange = timeRangeSelect.value;
    if (timeRange === 'custom') {
        customTimeInputs.style.display = 'block';
    } else {
        customTimeInputs.style.display = 'none';
        let interval;
        switch (timeRange) {
            case 'minute': interval = 1000; break;
            case 'hour': interval = 60000; break;
            case 'day': interval = 3600000; break;
            case 'month': interval = 86400000; break;
            case 'year': interval = 2592000000; break;
        }
        updateStockData(interval);
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
    stockData = [];
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    chart.update();
});
