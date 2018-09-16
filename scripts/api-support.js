function generateDateRange() {
    let years = ["2016", "2017"];
    let result = [];

    for (let i = 0; i < years.length; i++) {
        for (let month = 1; month < 13; month++) {
            if (month.toString().length === 1) {
                result.push(years[i] + "-0" + month + "-05")
            }
            else {
                result.push(years[i] + "-" + month + "-05")
            }
        }
    }
    return result

}

function processDataApi(data) {
    let neededCurrencies = supportedCurrenciesAll.filter(item => item !== choosenBoxValue);
    let tmp = [];

    for (let currentCurrency = 0; currentCurrency < neededCurrencies.length; currentCurrency++) {
        tmp[neededCurrencies[currentCurrency]] = data["rates"][neededCurrencies[currentCurrency]]
    }
    tmp["date"] = data["date"];
    return tmp;
}
//Gets a data for 2 consecutive years
function getHistoryData(arr) {
    disableForms(1);

    const url = "https://ratesapi.io/api/";
    let dates = generateDateRange();
    for (let i = 0; i < dates.length; i++) {
        dates[i] = url + dates[i];
    }
    Promise.all(dates.map(url => fetch(url)))
        .then(resp => Promise.all(resp.map(r => r.json())))
        .then(resp => Promise.all(resp.map(r => processDataApi(r))))
        .then(resp => Promise.all(resp.map(r => arr.push(r))))
        .then(res => {
                lastCurrencies = Object.assign({}, currencyHistory[Math.floor(currencyHistory.length /2) +1]);
                startRenderingGraph1(currencyHistory);
                redrowChart(currencyHistory);
                disableForms(0);
            }
        )
        .catch(err => {
            console.log(err)
        });
}