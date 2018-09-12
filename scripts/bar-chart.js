var barChart = d3.select(".convert-table__bar-chart"),
    marginBar = {top: 20, right: 130, bottom: 30, left: 30},
    widthBar = +barChart.attr("width") - marginBar.left - marginBar.right,
    heightBar = +barChart.attr("height") - marginBar.top - marginBar.bottom,
    gBar = barChart.append("g").attr("transform", "translate(" + marginBar.left + "," + marginBar.top + ")");

var xBar = d3.scaleBand()
    .rangeRound([0, widthBar])
    .paddingInner(0.05);

var yBar = d3.scaleLinear()
    .rangeRound([heightBar, 0]);

var colors = d3.scaleOrdinal(d3.schemeCategory10);

d3.tsv("./data/data-bar-chart.tsv", function (error, data) {
    if (error) throw error;
    data.forEach(function(d, i, columns) {
            var t = 0;
            if (value_currency_1 !== undefined) {
                t += +value_currency_1;
                t += +value_currency_2 / +d.USD;
                t += +value_currency_3 / +d.GBP;
                t += +value_currency_4 / +d.CAD;
            }
            d.total = t;
            return d;

    });

    var keys = ["USD", "GBP", "CAD"];
    xBar.domain(data.map(function (d) {
        return d.date;
    }));
    yBar.domain([0, d3.max(data, function (d) {
        return d.total;
    })]);
    colors.domain(keys);

    gBar.append("g")
        .selectAll("g")
        .data(d3.stack().keys(keys)(data))
        .enter().append("g")
        .attr("fill", function (d) {
            return colors(d.key);
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
        .attr("x", 30)
        .attr("y", yBar(yBar.ticks().pop()) + 4)
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .text("EUR");

    //Leave last date
    d3.selectAll(".axis-bottom-bar>.tick:not(:last-child)").remove();
});