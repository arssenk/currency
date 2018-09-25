function redrowChart(data_1) {
    let data = createDeepCopy(data_1);
    let dataFourMonth = [];
    quarterMonthCopy = quarterMonth.slice();
    let namesXAxisBar = ["сьогодні", "через рік"];


    // Current year chosen month
    for (let i = 0; i < data.length; i++) {
        if (!isCurrentYear(data[i].date)) {
            dataFourMonth.push(data[i])
            // quarterMonthCopy = quarterMonthCopy.filter(item => item !== parseInt(data[i].date.split("-")[1]))
        }
    }


    d3.select(".bar-chart__svg").remove();
    d3.select(".bar-chart").append("svg").attr("class", "bar-chart__svg")
        .attr("width", 300).attr("height", 200);

    let barChart = d3.select(".bar-chart__svg"),
        marginBar = {top: 21, right: 3, bottom: 26, left: 65},
        widthBar = +barChart.attr("width") - marginBar.left - marginBar.right,
        heightBar = +barChart.attr("height") - marginBar.top - marginBar.bottom,
        gBar = barChart.append("g").attr("transform", "translate(" + marginBar.left + "," + marginBar.top + ")");

    let xBar = d3.scaleBand()
        .rangeRound([0, widthBar])
        .paddingInner(0.02);

    let xLabelsBarChart = d3.scaleOrdinal().domain(namesXAxisBar)
        .range([widthBar / 8 - 2, 7 * widthBar / 8 - 2]);

    let yBar = d3.scaleLinear()
        .rangeRound([heightBar, 0]);


    let colors = d3.scaleOrdinal(d3.schemeCategory10);

    //update values
    for (let i = 0; i < dataFourMonth.length; i++) {
        //Total value of bar
        let totalValue = 0;
        for (let currencyIndex = 0; currencyIndex < supportedCurrencies.length; currencyIndex++) {

            dataFourMonth[i][supportedCurrencies[currencyIndex]] =
                +convertToChosenCurrencyWithDate(valueCurrencyArray[currencyIndex],
                    supportedCurrencies[currencyIndex], choosenBoxValue, dataFourMonth[i].date);

            totalValue += dataFourMonth[i][supportedCurrencies[currencyIndex]];

            if (document.getElementById("percentage_checkbox").checked) {


                //Calculate complex percentage
                dataFourMonth[i][supportedCurrencies[currencyIndex] + "_percentage"] =
                    convertComplexPercentage(valueCurrencyArray[currencyIndex],
                        valuePercentageArray[currencyIndex], i+1);

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
        return d.total ;
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
            else if(d.key.split("_").length > 1 && d.key.split("_")[1] === "percentage"){
                return colorsForPercentage[supportedCurrencies.indexOf(d.key.split("_")[0])]
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
        .attr("class", "bar-chart__axis-bottom")
        .attr("transform", "translate(0," + heightBar + ")")
        .call(d3.axisBottom(xLabelsBarChart))
        .attr("font-size", "12px");

    gBar.append("g")
        .attr("class", "bar-chart__axis-left")
        .call(d3.axisLeft(yBar).ticks(5)
            .tickFormat(function (d) {
                let tickValue = d3.format(".3s")(d);
                if (this.parentNode.nextSibling) {
                    return tickValue
                }
                else {
                    return tickValue + " " + choosenBoxValue
                }
            }));

    updateTotalValuesGraph2(scaleNumber(Math.round(totalConverted)),
        scaleNumber(Math.round(dataFourMonth[dataFourMonth.length - 1]["total"]))
    );

    //Remove zero tick
    barChart.selectAll(".tick")
        .filter(function (d) {
            return d === 0;
        })
        .remove();
}
