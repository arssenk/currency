function createDatesAYearAhead() {
    let result = [];
    let currYear = parseInt(currentDate.split("-")[0]);
    let currMonth = parseInt(currentDate.split("-")[1]);
    let currDay = parseInt(currentDate.split("-")[2]);
    let monthToWrite = 0;
    let yearToWrite = 0;
    for (let i = 1; i <= 4; i++) {

        if (3 * i + currMonth > 12) {
            monthToWrite = 3 * i + currMonth - 12;
            yearToWrite = currYear + 1;
        }
        else {
            monthToWrite = 3 * i + currMonth;
            yearToWrite = currYear;
        }
        result.push(convertToYYMMDDFormat(yearToWrite, monthToWrite, currDay));
    }
    return result;
}
function generateYearBack(currDate, url, userKey) {
    let currMonth = parseInt(currDate.split("-")[1]);
    let currYear = parseInt(currDate.split("-")[0]);
    currentDate = currDate;
    let result = [];
    const maxMonth = 12;
    let monthToWrite = 0;
    let yearToWrite = 0;
    for (let month = 1; month < maxMonth + 1; month++) {
        if ((month + currMonth) <= maxMonth) {
            monthToWrite = month + currMonth;
            yearToWrite = currYear - 1
        }
        else {
            monthToWrite = month - (maxMonth - currMonth);
            yearToWrite = currYear;
        }
        for (let dayToWrite = 1; dayToWrite <= getdaysInMonth(yearToWrite, monthToWrite); dayToWrite++) {
            if (isCurrentYear(convertToYYMMDDFormat(yearToWrite, monthToWrite, dayToWrite))) {
                result.push(convertToYYMMDDFormat(yearToWrite, monthToWrite, dayToWrite));
            }
        }
    }

    for (let i = 0; i < result.length; i++) {
        if (result[i] !== currentDate) {
            result[i] = url + "historical/" + result[i] + ".json?app_id=" + userKey;
        }
        else {
            result.splice(i, 1)
        }
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

    const url = "https://openexchangerates.org/api/";
    const userKey = "12046b6b63cb4907a5f4614618796747";

    let getLatestData = fetch(url + "latest.json?app_id=" + userKey).then(resp => resp.json())
        .then(resp => {
            let dateTimastampLatest = new Date(resp.timestamp * 1000);
            resp.date = convertToYYMMDDFormat(dateTimastampLatest.getFullYear(),
                dateTimastampLatest.getMonth() + 1, dateTimastampLatest.getDate());
            return generateYearBack(resp.date, url, userKey);
        });

    getLatestData.then(dates => {
        return Promise.all(dates.map(url => {
            return fetch(url)
        }))
    })
        .then(resp => {
            return Promise.all(resp.map(r => r.json()
            ))
        })
        .then(resp => resp.map(r => {
            let dateTimastamp = new Date(r.timestamp * 1000);
            r.date = convertToYYMMDDFormat(dateTimastamp.getFullYear(), dateTimastamp.getMonth() + 1, dateTimastamp.getDate());
            return processDataApi(r)
        }))
        .then(resp => resp.map(r => {
                if (r.date === currentDate) {
                    lastCurrencies = Object.assign({}, r);
                }
                arr.push(r);
                return r;
            })
        )
        .then(resp => {
            let tmpDataItem;
            let datesToAssign = createDatesAYearAhead();
            for (let dataIndex = 0; dataIndex <= 3; dataIndex++) {
                tmpDataItem = Object.assign({}, resp[dataIndex])
                tmpDataItem.date = datesToAssign[dataIndex];
                arr.push(tmpDataItem)
            }
        })
        .then(res => {
                // addTo();
                // startRenderingGraph1(arr);
                // redrowChart(arr);
                updateStatus()
                disableForms(0);
            }
        )
        .catch(err => {
            console.log(err)
        })
}