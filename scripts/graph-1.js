var svgLineChart = d3.select(".convert-table__line-graph"),
    marginLineChart = {top: 20, right: 80, bottom: 30, left: 50},
    widthLineChart = svgLineChart.attr("width") - marginLineChart.left - marginLineChart.right,
    heightLineChart = svgLineChart.attr("height") - marginLineChart.top - marginLineChart.bottom,
    gLineChart = svgLineChart.append("g").attr("transform", "translate(" + marginLineChart.left + "," + marginLineChart.top + ")");


var x = d3.scaleTime().range([0, widthLineChart]),
    y = d3.scaleLinear().range([heightLineChart, 0]),
    colorCurrencies = ["red", "blue", "orange", "green"],
    colorsLineChart = d3.scaleOrdinal(d3.schemeCategory10);

timeParser = d3.timeParse("%Y-%m-%d");

var line = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) {
        return x(d.date);
    })
    .y(function (d) {
        return y(d.currency);
    });

d3.tsv("./data/data.tsv", type, function (error, data) {
    if (error) throw error;

    var currencies = data.columns.slice(1).map(function (currentCurrency) {
        return {
            currentCurrency: currentCurrency,
            values: data.map(function (d) {
                return {date: d.date, currency: 1 / d[currentCurrency]};
            })
        };
    });

    x.domain(d3.extent(data, function (d) {
        return d.date;
    }));

    y.domain([
        d3.min(currencies, function (c) {
            return d3.min(c.values, function (d) {
                return d.currency;
            });
        }),
        d3.max(currencies, function (c) {
            return d3.max(c.values, function (d) {
                return d.currency;
            });
        })
    ]);

    colorsLineChart.domain(currencies.map(function (c) {
        return c.currentCurrency;
    }));

    gLineChart.append("g")
        .attr("class", "axis-bottom-chart-1")
        .attr("transform", "translate(0," + heightLineChart + ")")
        .call(d3.axisBottom(x));

    gLineChart.append("g")
        .attr("class", "axis-left-chart-1")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("y", -1)
        .attr("x", 0)
        .attr("fill", "#000")
        .text("EUR");

    var city = gLineChart.selectAll(".city")
        .data(currencies)
        .enter().append("g")
        .attr("class", "city");

    city.append("path")
        .attr("class", "line")
        .attr("d", function (d) {
            return line(d.values);
        })
        .style("stroke", function (d) {
            switch (d.currentCurrency) {
                case "EUR":
                    return colorCurrencies[0];
                    break;
                case "USD":
                    return colorCurrencies[1];
                    break;
                case "GBP":
                    return colorCurrencies[2];
                    break;
                case "CAD":
                    return colorCurrencies[3];
                    break;
                default:
                    return colorsLineChart(d.currentCurrency);
            }
        });

    city.append("text")
        .datum(function (d) {
            return {currentCurrency: d.currentCurrency, value: d.values[d.values.length - 1]};
        })
        .attr("transform", function (d) {
            return "translate(" + x(d.value.date) + "," + y(d.value.currency) + ")";
        })
        .attr("x", 3)
        .attr("y", 3)
        .style("font", "11px sans-serif")
        .text(function (d) {
            return d.currentCurrency;
        });
});

function type(d, k, columns) {
    d.date = timeParser(d.date);
    for (var i = 1, n = columns.length, c; i < n; ++i) {
        d[c = columns[i]] = +d[c];
    }
    return d;

}