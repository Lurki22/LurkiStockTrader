// index.js
import React from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "https://cdn.skypack.dev/recharts";

const API_KEY = "DEIN_POLYGON_API_KEY";
const STOCKS = ["AAPL", "GOOGL", "TSLA", "AMZN", "MSFT"];
const INTERVALS = ["second", "minute", "hour", "day", "month", "year"];

const App = () => {
    const [selectedStock, setSelectedStock] = React.useState("AAPL");
    const [interval, setInterval] = React.useState("day");
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        fetchStockData();
        const intervalId = setInterval(fetchStockData, 60000);
        return () => clearInterval(intervalId);
    }, [selectedStock, interval]);

    const fetchStockData = async () => {
        const url = `https://api.polygon.io/v2/aggs/ticker/${selectedStock}/range/1/${interval}/2023-01-01/2023-12-31?apiKey=${API_KEY}`;
        const response = await fetch(url);
        const json = await response.json();
        setData(json.results || []);
    };

    return (
        React.createElement("div", { className: "container" },
            React.createElement("h1", null, "Live Stock Trader"),
            React.createElement("div", { className: "controls" },
                React.createElement("select", { onChange: (e) => setSelectedStock(e.target.value), value: selectedStock },
                    STOCKS.map((stock) => React.createElement("option", { key: stock, value: stock }, stock))
                ),
                React.createElement("select", { onChange: (e) => setInterval(e.target.value), value: interval },
                    INTERVALS.map((intv) => React.createElement("option", { key: intv, value: intv }, intv))
                )
            ),
            React.createElement(ResponsiveContainer, { width: "100%", height: 400 },
                React.createElement(LineChart, { data: data },
                    React.createElement(XAxis, { dataKey: "t" }),
                    React.createElement(YAxis, null),
                    React.createElement(Tooltip, null),
                    React.createElement(CartesianGrid, { stroke: "#eee", strokeDasharray: "5 5" }),
                    React.createElement(Line, { type: "monotone", dataKey: "c", stroke: "#8884d8" })
                )
            )
        )
    );
};

ReactDOM.render(React.createElement(App), document.getElementById("root"));
