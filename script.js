<script>
document.addEventListener("DOMContentLoaded", function() {
    let stockData = [];
    const ctx = document.getElementById('chart').getContext('2d');
    const timeRangeSelect = document.getElementById('timeRange');
    const stockSymbolSelect = document.getElementById('stockSymbol');
    const chartTypeSelect = document.getElementById('chartType');
    const customTimeInputs = document.getElementById('customTimeInputs');
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');
    const applyRangeButton = document.getElementById('applyRange');

    let chart;
    function createChart(type) {
        if (chart) {
            chart.destroy();
        }
        chart = new Chart(ctx, {
            type: type === 'candlestick' ? 'candlestick' : 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Stock Price',
                    data: [],
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0, 0, 255, 0.2)',
                    fill: type !== 'candlestick'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { display: true },
                    y: { display: true }
                }
            }
        });
    }

    async function fetchStockData(symbol) {
        try {
            const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/minute/2024-06-01/2024-06-02?apiKey=IdFP0vNcfWsWpYHRr0uvmw0tStpcx0nH`);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                return data.results.map(entry => ({
                    x: new Date(entry.t),
                    o: entry.o,
                    h: entry.h,
                    l: entry.l,
                    c: entry.c
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
        clearInterval(window.updateInterval);
        window.updateInterval = setInterval(async () => {
            const symbol = stockSymbolSelect.value;
            const newStockData = await fetchStockData(symbol);
            if (newStockData) {
                stockData = newStockData;
                chart.data.labels = stockData.map(d => d.x.toLocaleTimeString());
                chart.data.datasets[0].data = chartTypeSelect.value === 'candlestick'
                    ? stockData
                    : stockData.map(d => d.c);
                chart.update();
            }
        }, interval);
    }

    chartTypeSelect.addEventListener('change', function() {
        createChart(chartTypeSelect.value);
        updateStockData(1000);
    });

    stockSymbolSelect.addEventListener('change', function() {
        updateStockData(1000);
    });

    createChart('line');
});
</script>
