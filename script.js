document.addEventListener("DOMContentLoaded", function() {
    let stockData = [];
    const ctx = document.getElementById('chart').getContext('2d');
    const timeRangeSelect = document.getElementById('timeRange');
    const stockSymbolSelect = document.getElementById('stockSymbol');
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

    async function fetchStockData(symbol) {
        try {
            const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?apiKey=DEIN_API_KEY`);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                return data.results.map(entry => ({
                    time: new Date(entry.t).toLocaleTimeString(),
                    price: entry.c
                })).slice(-50);
            } else {
                console.error("Keine Daten für die Aktie verfügbar:", symbol);
                return null;
            }
        } catch (error) {
            console.error("Fehler beim Abrufen der Daten:", error);
            return null;
        }
    }

    async function updateStockData(interval) {
        stockData = [];
        clearInterval(window.updateInterval);
        window.updateInterval = setInterval(async () => {
            const symbol = stockSymbolSelect.value;
            const newStockData = await fetchStockData(symbol);
            if (newStockData) {
                stockData = newStockData;
                chart.data.labels = stockData.map(d => d.time);
                chart.data.datasets[0].data = stockData.map(d => d.price);
                chart.update();
            }
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
                case 'second': interval = 1000; break;
                case 'minute': interval = 60000; break;
                case 'hour': interval = 3600000; break;
                case 'day': interval = 86400000; break;
                case 'month': interval = 2592000000; break;
                case 'year': interval = 31536000000; break;
            }
            updateStockData(interval);
        }
    });

    stockSymbolSelect.addEventListener('change', function() {
        updateStockData(1000);
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
});
