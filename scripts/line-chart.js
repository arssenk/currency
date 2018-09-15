function startRenderingGraph1(data_1) {

    let data = Object.values(Object.assign({}, data_1));

    d3.select(".convert-table__line-graph").remove();
    d3.select(".convert-table__graph-1").append("svg").attr("class", "convert-table__line-graph").attr("width", 400).attr("height", 200);

    let svgLineChart = d3.select(".convert-table__line-graph"),
        marginLineChart = {top: 20, right: 80, bottom: 30, left: 50},
        widthLineChart = svgLineChart.attr("width") - marginLineChart.left - marginLineChart.right,
        heightLineChart = svgLineChart.attr("height") - marginLineChart.top - marginLineChart.bottom,
        gLineChart = svgLineChart.append("g").attr("transform", "translate(" + marginLineChart.left + "," + marginLineChart.top + ")");


    let x = d3.scaleTime().range([0, widthLineChart]),
        y = d3.scaleLinear().range([heightLineChart, 0]),
        colorCurrencies = ["yellow", "red", "blue", "orange", "green", "purple"],
        colorsLineChart = d3.scaleOrdinal(d3.schemeCategory10);

    timeParser = d3.timeParse("%Y-%m-%d");

    let line = d3.line()
        .curve(d3.curveBasis)
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.currency);
        });

    let currencies = supportedCurrencies.filter(item => {
        return item !== choosenBoxValue && supportedCurrencies.includes(item)
    }).map(function (currentCurrencyToAssign) {
        return {
            currentCurrency: currentCurrencyToAssign,
            values: data.map(function (d) {
                return {
                    date: timeParser(d.date),
                    currency: convertToChosenForGraph(d,
                        currentCurrencyToAssign, choosenBoxValue)
                };
            })
        };
    });

    //MinMax
    x.domain(d3.extent(data, function (d) {
        return timeParser(d.date);
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
        .call(d3.axisBottom(x).ticks(5));

    gLineChart.append("g")
        .attr("class", "axis-left-chart-1")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("y", 0)
        .attr("x", 25)
        .attr("fill", "#000")
        .text(choosenBoxValue);

    let city = gLineChart.selectAll(".city")
        .data(currencies)
        .enter().append("g")
        .attr("class", "city");

    city.append("path")
        .attr("class", "line")
        .attr("d", function (d) {
            return line(d.values);
        })
        .style("stroke", function (d) {
            if (supportedCurrencies.length <= colorCurrencies.length){
                return colorCurrencies[supportedCurrencies.indexOf(d.currentCurrency)]
            }
            else{
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

};

