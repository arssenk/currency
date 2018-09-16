function addTo() {
    for (let i = 1; i < supportedCurrencies.length + 1; i++) {
        if (isNumber(document.getElementById("currency_" + i).value)) {
            valueCurrencyArray[ i-1] = +document.getElementById("currency_" + i).value;
            document.getElementById("currency_converted_" + i).value =
                convertToChosenCurrency(valueCurrencyArray[ i- 1],
                    supportedCurrencies[i-1], choosenBoxValue)
        }
        else {
            alert("Currency " + i + " needs to be a number")
        }
    }
    redrowChart(currencyHistory)

}

function addToPercentage() {
    for (let i = 0; i < document.getElementsByClassName("convert-table__input-percentage-form").length; i++) {
        document.getElementsByClassName("convert-table__input-percentage-form")[i].disabled = !document.getElementById("percentage_checkbox").checked;
    }


    for (let i = 1; i < supportedCurrencies.length + 1; i++) {
        if (isNumberForPercentage(document.getElementById("input_percentage_" + i).value)) {
            valuePercentageArray[ i -1] = +document.getElementById("input_percentage_" + i).value;
        }
        else {
            alert("Percentage " + i + " needs to be in range 0-100")
        }
    }
    redrowChart(currencyHistory)
}
