function convertAYearAhead(item) {
    item = Object.assign({}, item);

    let date = item["date"];
    let currYear = parseInt(date.split("-")[0]);
    let currMonth = parseInt(date.split("-")[1]);
    let currDay = parseInt(date.split("-")[2]);
    item["date"] = ((currYear + 1) + "-" + currMonth + "-" + currDay);
    // console.log("t", ((currYear + 1) + "-" + currMonth  + "-" +  currDay),)
    return item
}
function generateYearBack(currDate, url) {
    let currMonth = parseInt(currDate.split("-")[1]);
    let currYear = parseInt(currDate.split("-")[0]);
    // currentYear = currYear;
    currentDate = currDate;
    let result = [];
    const maxMonth = 12;
    for (let month = 1; month < maxMonth + 1; month++) {
        // console.log(month, maxMonth + 1)

        if ((month + currMonth) <= maxMonth) {

            let monthToWrite = month + currMonth;
            if (monthToWrite.toString().length === 1) {
                result.push((currYear - 1) + "-0" + monthToWrite + "-05")
            }
            else {
                result.push((currYear - 1) + "-" + monthToWrite + "-05")
            }
        }
        else {
            let monthToWrite = month - (maxMonth - currMonth);
            if (monthToWrite.toString().length === 1) {
                result.push((currYear) + "-0" + monthToWrite + "-05")
            }
            else {
                result.push((currYear) + "-" + monthToWrite + "-05")
            }
        }
    }
    for (let i = 0; i < result.length; i++) {
        result[i] = url + result[i];
    }
    return result

}

function processDataApi(data) {
    let neededCurrencies = supportedCurrenciesAll.filter(item => item !== choosenBoxValue);
    let tmp = [];

    for (let currentCurrency = 0; currentCurrency < neededCurrencies.length; currentCurrency++) {

        tmp[neededCurrencies[currentCurrency]] = data["rates"][neededCurrencies[currentCurrency]];

        //If added currency is not in api call
        if (data["rates"][neededCurrencies[currentCurrency]] === undefined) {
            alert("Your added currency is not supported");
            throw "Your added currency is not supported";
        }
    }
    tmp["date"] = data["date"];
    return tmp;
}
//Gets a data for 2 consecutive years
function getHistoryData(arr) {
    disableForms(1);

    const url = "https://ratesapi.io/api/";

    let getLatestData = fetch(url + "latest").then(resp => resp.json())
        .then(resp => {
            return generateYearBack(resp.date, url);
        });

    getLatestData.then(dates => {
        return Promise.all(dates.map(url => fetch(url)))
    })
        .then(resp => {
            return Promise.all(resp.map(r => r.json()))
        })
        .then(resp => resp.map(r => processDataApi(r)))
        .then(resp => resp.map(r => {
                arr.push(r)
                return r;
            })
        )
        .then(resp => {
            resp.map(r => {
                arr.push(convertAYearAhead(r))
            })
        })
        .then(res => {
                lastCurrencies = Object.assign({}, currencyHistory[Math.floor(currencyHistory.length / 2) + 1]);
                startRenderingGraph1(currencyHistory);
                redrowChart(currencyHistory);
                disableForms(0);
            }
        )
        .catch(err => {
            console.log(err)
        })
}