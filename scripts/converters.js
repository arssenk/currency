
function convertToChosenCurrency(number, convertFrom, convertTo) {
    if (number === 0) {
        return 0
    }
    if (convertFrom === convertTo) {
        return number;
    }
    if (convertFrom === "EUR") {
        return (number * lastCurrencies[convertTo]).toFixed(2)
    }
    if (convertTo === "EUR") {
        return (number / lastCurrencies[convertFrom]).toFixed(2);
    }
    return (number * lastCurrencies[convertTo] / lastCurrencies[convertFrom]).toFixed(2);
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
