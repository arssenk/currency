function convertToChosenCurrency(number, convertFrom, convertTo) {
    if (number === 0) {
        return 0
    }
    if (convertFrom === convertTo) {
        return number;
    }
    if (convertFrom === "EUR") {
        return (number * lastCurrencies[convertTo]).toFixed(2);
    }
    if (convertTo === "EUR") {
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
    if (convertFrom === "EUR") {
        return (number * getCurrencyObjectByDate(date)[convertTo])
    }
    if (convertTo === "EUR") {
        return (number / getCurrencyObjectByDate(date)[convertFrom])
    }
    return (number * getCurrencyObjectByDate(date)[convertTo] / getCurrencyObjectByDate(date)[convertFrom])
}

function convertToChosenForGraph(d, convertFrom, convertTo) {
    if (convertTo === "EUR") {
        return 1 / d[convertFrom];
    }
    else if (convertFrom === "EUR") {
        return 1 / d[convertTo]
    }
    else {
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
    return number * Math.pow(1 + percentage / n / 100, n) - number;
}