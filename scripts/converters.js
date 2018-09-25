function convertToChosenCurrency(number, convertFrom, convertTo) {
    if (number === 0) {
        return 0
    }
    if (convertFrom === convertTo) {
        return number;
    }
    if (convertFrom === baseCurrency) {
        return (number * lastCurrencies[convertTo]).toFixed(2);
    }
    if (convertTo === baseCurrency) {
        return (number / lastCurrencies[convertFrom]).toFixed(2);
    }
    return (number * lastCurrencies[convertTo] / lastCurrencies[convertFrom]).toFixed(2);
}

function convertToChosenCurrencyWithDate(number, convertFrom, convertTo, date) {
    if (number === 0) {
        return 0
    }
    if (convertFrom === convertTo) {
        return number;
    }
    // console.log("here", number, convertFrom, convertTo)
    if (convertTo === baseCurrency) {
        // console.log("here 1", number / getCurrencyObjectByDate(date)[convertFrom])
        return number / getCurrencyObjectByDate(date)[convertFrom]
    }

    if (getCurrencyObjectByDate(date)[convertFrom] === undefined) {
        // console.log("here 2", number * getCurrencyObjectByDate(date)[convertTo])
        return number * getCurrencyObjectByDate(date)[convertTo]
    }
    // console.log("here 3", number * getCurrencyObjectByDate(date)[convertTo] / getCurrencyObjectByDate(date)[convertFrom])

    return number * getCurrencyObjectByDate(date)[convertTo] / getCurrencyObjectByDate(date)[convertFrom]
}

function convertToChosenForGraph(d, convertFrom, convertTo) {
    if (convertTo === baseCurrency) {
        // console.log("here 1", d, convertFrom, convertTo, "res", 1 / d[convertFrom])
        return 1 / d[convertFrom];
    }
    else if (convertFrom === baseCurrency) {
        // console.log("here 2", d, convertFrom, convertTo, "res", 1 / d[convertTo])

        return d[convertTo]
    }
    else {
        // console.log("here 3", d, convertFrom, convertTo, "res", d[convertTo] / d[convertFrom])

        return d[convertTo] / d[convertFrom]
    }
}

function getCurrencyObjectByDate(dateItem) {
    for (let i = 0; i < currencyHistory.length; i++) {
        if (currencyHistory[i].date === dateItem) {
            return currencyHistory[i];
        }
    }
}

function convertComplexPercentage(number, percentage, n) {
    return number * Math.pow(1 + percentage/ 100, n) - number;
}