function redrowChart(data_1) {
    let data = createDeepCopy(data_1);
    let dataFourMonth = [];

    for (let i = 0; i < data.length; i++) {
        if (interestedMonth.includes(parseInt(data[i].date.split("-")[1])) && parseInt(data[i].date.split("-")[0]) === currentYear) {
            dataFourMonth.push(data[i])
        }
    }

    d3.select(".convert-table__bar-chart").remove();
    d3.select(".convert-table__graph-2").append("svg").attr("class", "convert-table__bar-chart")
        .attr("width", 500).attr("height", 200);

    let barChart = d3.select(".convert-table__bar-chart"),
        marginBar = {top: 30, right: 180, bottom: 30, left: 70},
        widthBar = +barChart.attr("width") - marginBar.left - marginBar.right,
        heightBar = +barChart.attr("height") - marginBar.top - marginBar.bottom,
        gBar = barChart.append("g").attr("transform", "translate(" + marginBar.left + "," + marginBar.top + ")");

    let xBar = d3.scaleBand()
        .rangeRound([0, widthBar])
        .paddingInner(0.1);

    let yBar = d3.scaleLinear()
        .rangeRound([heightBar, 0]);


    let colors = d3.scaleOrdinal(d3.schemeCategory10);

    //update values
    for (let i = 0; i < dataFourMonth.length; i++) {
        //Total value of bar
        let totalValue = 0;
        for (let currencyIndex = 0; currencyIndex < supportedCurrencies.length; currencyIndex++) {
            if (i === 0) {
                //Zero day
                dataFourMonth[i][supportedCurrencies[currencyIndex]] =
                    +convertToChosenCurrencyWithDate(valueCurrencyArray[currencyIndex],
                        supportedCurrencies[currencyIndex], choosenBoxValue, dataFourMonth[i].date)
            }
            else {
                dataFourMonth[i][supportedCurrencies[currencyIndex]] =
                    +convertToChosenCurrencyWithDate(valueCurrencyArray[currencyIndex],
                        supportedCurrencies[currencyIndex], choosenBoxValue, dataFourMonth[i].date)
            }

            totalValue += dataFourMonth[i][supportedCurrencies[currencyIndex]];

            if (document.getElementById("percentage_checkbox").checked) {
                //Zero day
                if (i === 0) {
                    dataFourMonth[i][supportedCurrencies[currencyIndex] + "_percentage"] = 0;
                }
                //Calculate complex percentage
                else {
                    dataFourMonth[i][supportedCurrencies[currencyIndex] + "_percentage"] =
                        convertComplexPercentage(valueCurrencyArray[currencyIndex],
                            valuePercentageArray[currencyIndex], i);
                }
                //Convert to chosen currency
                dataFourMonth[i][supportedCurrencies[currencyIndex] + "_percentage"] =
                    +convertToChosenCurrencyWithDate(dataFourMonth[i][supportedCurrencies[currencyIndex] + "_percentage"],
                        supportedCurrencies[currencyIndex], choosenBoxValue, dataFourMonth[i].date)

                totalValue += dataFourMonth[i][supportedCurrencies[currencyIndex] + "_percentage"]
            }
        }
        dataFourMonth[i].total = totalValue;
    }

    let keys = [];

    if (document.getElementById("percentage_checkbox").checked) {

        //Create "EUR", "EUR_percentage", ... keys
        for (let i = 0; i < supportedCurrencies.length; i++) {
            keys.push(supportedCurrencies[i]);
            keys.push(supportedCurrencies[i] + "_percentage")
        }
    }
    else {
        keys = supportedCurrencies;
    }

    xBar.domain(dataFourMonth.map(function (d) {
        return d.date;
    }));
    yBar.domain([0, d3.max(dataFourMonth, function (d) {
        return d.total;
    })]);
    colors.domain(keys);


    gBar.append("g")
        .selectAll("g")
        .data(d3.stack().keys(keys)(dataFourMonth))
        .enter().append("g")
        .attr("fill", function (d) {
            if (supportedCurrencies.includes(d.key)) {
                return colorsForCurr[supportedCurrencies.indexOf(d.key)]
            }
            else {
                return colors(d.key);
            }
        })
        .selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter().append("rect")
        .attr("x", function (d) {
            return xBar(d.data.date)
        })
        .attr("y", function (d) {
            return yBar(d[1]);
        })
        .attr("height", function (d) {
            return yBar(d[0]) - yBar(d[1]);
        })
        .attr("width", xBar.bandwidth());

    gBar.append("g")
        .attr("class", "axis-bottom-bar")
        .attr("transform", "translate(0," + heightBar + ")")
        .call(d3.axisBottom(xBar));

    gBar.append("g")
        .attr("class", "axis-left-bar")
        .call(d3.axisLeft(yBar))
        .append("text")
        .attr("x", 3)
        .attr("y", yBar(yBar.ticks().pop()) - 12)
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .text(choosenBoxValue);

    //Leave last date
    d3.selectAll(".axis-bottom-bar>.tick:not(:last-child)").remove();

}
