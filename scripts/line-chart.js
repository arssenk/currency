function startRenderingGraph1(data_1) {

    let data = Object.values(Object.assign({}, data_1));
    let dataToSplit = Object.values(Object.assign({}, data_1));
    let dataStatic = [];
    let dataMoving = [];

    for (let i = 0; i < dataToSplit.length; i++) {
        if (parseInt(dataToSplit[i].date.split("-")[0]) < currentYear) {
            dataStatic.push(dataToSplit[i]);
        }
        else {
            if (interestedMonth.includes(parseInt(data[i].date.split("-")[1]))) {
                dataMoving.push(dataToSplit[i])
            }
            if (parseInt(dataToSplit[i].date.split("-")[1]) === 1) {
                dataStatic.push(dataToSplit[i])
            }
        }
    }

    d3.select(".convert-table__line-graph").remove();
    d3.select(".convert-table__graph-1").append("svg").attr("class", "convert-table__line-graph").attr("width", 400)
        .attr("height", 200);


    let svgLineChart = d3.select(".convert-table__line-graph"),
        marginLineChart = {top: 20, right: 80, bottom: 30, left: 50},
        widthLineChart = svgLineChart.attr("width") - marginLineChart.left - marginLineChart.right,
        heightLineChart = svgLineChart.attr("height") - marginLineChart.top - marginLineChart.bottom,
        gLineChart = svgLineChart.append("g").attr("transform", "translate(" + marginLineChart.left + ","
            + marginLineChart.top + ")");


    let x = d3.scaleTime()
    y = d3.scaleLinear().range([heightLineChart, 0]),
        colorsLineChart = d3.scaleOrdinal(d3.schemeCategory10);

    let timeParser = d3.timeParse("%Y-%m-%d");

    let focusCurrencies = [];
    let drags = [];
    let draggedFunctions = [];
    let lineMovingItems = [];
    let lineConcatenateItems = [];


    let line = d3.line()
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

    let currenciesStatic = supportedCurrencies.filter(item => {
        return item !== choosenBoxValue && supportedCurrencies.includes(item)
    }).map(function (currentCurrencyToAssign) {
        return {
            currentCurrency: currentCurrencyToAssign,
            values: dataStatic.map(function (d) {
                return {
                    date: timeParser(d.date),
                    currency: convertToChosenForGraph(d,
                        currentCurrencyToAssign, choosenBoxValue)
                };
            })
        };
    });

    let currenciesMoving = supportedCurrencies.filter(item => {
        return item !== choosenBoxValue && supportedCurrencies.includes(item)
    }).map(function (currentCurrencyToAssign) {
        return {
            currentCurrency: currentCurrencyToAssign,
            values: dataMoving.map(function (d) {
                return {
                    date: timeParser(d.date),
                    currency: convertToChosenForGraph(d,
                        currentCurrencyToAssign, choosenBoxValue),
                    currencyName: currentCurrencyToAssign
                };
            })
        };
    });

    // Create focus group items and drug functions
    for (let i = 0; i < supportedCurrencies.length; i++) {
        focusCurrencies[i] = svgLineChart.append("g")
            .attr("transform", "translate(" + marginLineChart.left + "," + marginLineChart.top + ")");
        lineMovingItems[i] = d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d.currency);
            });

        lineConcatenateItems[i] = d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d.currency);
            });

        draggedFunctions[i] = function (d) {
            d.currency = y.invert(d3.event.y);
            d3.select(this)
                .attr('cx', x(d.date))
                .attr('cy', y(d.currency));
            focusCurrencies[i].select('path').attr('d', lineMovingItems[i]);

            updateCurrency(d);
            redrowChart(currencyHistory);
        };
        drags[i] = d3.drag()
            .on('start', dragstarted)
            .on('drag', draggedFunctions[i])
            .on('end', dragended);
    }


    x.domain(d3.extent(data, function (d) {
        return timeParser(d.date);
    })).range([0, widthLineChart]);

    //MinMax
    y.domain([
        d3.min(currencies, function (c) {
            return d3.min(c.values, function (d) {
                return d.currency - 0.1;
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
        .call(d3.axisLeft(y).ticks(10))
        .append("text")
        .attr("y", 0)
        .attr("x", 25)
        .attr("fill", "#000")
        .text(choosenBoxValue);


    let currencyLines = gLineChart.selectAll(".currencyLines")
        .data(currenciesStatic)
        .enter().append("g")
        .attr("class", "currencyLines");

    currencyLines.append("path")
        .attr("class", "convert-table__line-graph-1")
        .attr("d", function (d) {
            return line(d.values);
        })
        .style("stroke", function (d) {
            supportedCurrencies.filter(item => {
                return item !== choosenBoxValue && supportedCurrencies.includes(item)
            });
            if (supportedCurrencies.includes(d.currentCurrency)) {
                return colorsForCurr[supportedCurrencies.indexOf(d.currentCurrency)]
            }
            else {
                return colorsLineChart(d.currentCurrency);
            }
        });

    // add line path to points add circles
    for (let i = 0; i < focusCurrencies.length - 1; i++) {

        focusCurrencies[i].append("path")
            .datum(currenciesMoving[i].values)
            .attr("class", "convert-table__moving-lines")
            .attr("fill", "none")
            .style("stroke", function () {
                if (supportedCurrencies.indexOf(choosenBoxValue) <= i) {
                    return colorsForCurr[i + 1]
                }
                else {
                    return colorsForCurr[i]
                }
            })
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 2)
            .attr("d", lineMovingItems[i]);

        focusCurrencies[i].selectAll('circle')
            .data(currenciesMoving[i].values)
            .enter()
            .append('circle')
            .attr('r', 4.5)
            .attr('cx', function (d) {
                return x(d.date);
            })
            .attr('cy', function (d) {
                return y(d.currency);
            })
            .style('cursor', 'pointer')
            .style('fill', function () {
                if (supportedCurrencies.indexOf(choosenBoxValue) <= i) {
                    return colorsForCurr[i + 1]
                }
                else {
                    return colorsForCurr[i]
                }
            });

        //Filter first circle so it doesn't drag
        focusCurrencies[i].selectAll('circle').filter(function (item, ind) {
            if (ind !== 0) {
                return this
            }
        })
            .call(drags[i]);
    }


    function dragstarted(d) {
        d3.select(this).raise().classed('active', true);

    }

    function dragended(d) {
        d3.select(this).classed('active', false);

    }

    function updateCurrency(currencyItem) {
        for (let i = 0; i < currencyHistory.length; i++) {
            if (JSON.stringify(timeParser(currencyHistory[i].date)) === JSON.stringify(currencyItem.date)) {
                // console.log(currencyHistory[i][currencyItem.currencyName] )
                currencyHistory[i][currencyItem.currencyName] = 1 / currencyItem.currency;
                // console.log(currencyHistory[i][currencyItem.currencyName] , currencyHistory[i].date)

                return 1;
            }
        }
        return 0;
    }
};

