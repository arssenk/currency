function addTo() {
    let tmpTotal = 0;
    for (let i = 1; i < supportedCurrencies.length + 1; i++) {

        // Parse spaces
        document.getElementById("currency_" + i).value =
            document.getElementById("currency_" + i).value.split(" ").join("");

        //Parse empty string
        if (document.getElementById("currency_" + i).value === "") {
            document.getElementById("currency_" + i).value = 0;
        }

        //Convert to chosen curr and write to output
        if (isNumber(document.getElementById("currency_" + i).value)) {

            valueCurrencyArray[i - 1] = +document.getElementById("currency_" + i).value;
            let valueToWrite = convertToChosenCurrency(valueCurrencyArray[i - 1],
                supportedCurrencies[i - 1], choosenBoxValue);

            if (valueToWrite > 1000) {
                valueToWrite = Math.round(valueToWrite)
            }
            tmpTotal += valueToWrite;

            document.getElementById("currency_converted_" + i).value =
                scaleNumber(valueToWrite);

            //Format number
            document.getElementById("currency_" + i).value = addSpacesToNumber(document.getElementById("currency_" + i).value);

        }
        else {
            alert("Currency " + i + " needs to be a number")
        }
    }

    totalConverted = tmpTotal;
    redrowChart(currencyHistory)

}

function addToPercentage() {
    for (let i = 0; i < document.getElementsByClassName("convert-table__input-percentage-form").length; i++) {
        document.getElementsByClassName("convert-table__input-percentage-form")[i].disabled = !document.getElementById("percentage_checkbox").checked;
    }

    for (let i = 1; i < supportedCurrencies.length + 1; i++) {
        if (isNumberForPercentage(document.getElementById("input_percentage_" + i).value)) {
            valuePercentageArray[i - 1] = +document.getElementById("input_percentage_" + i).value;
        }
        else {
            alert("Percentage " + i + " needs to be in range 0-100")
        }
    }
    redrowChart(currencyHistory)
}
