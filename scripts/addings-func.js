function addTo() {
    valueCurrency1 = document.getElementById("currency_1").value;
    valueCurrency2 = document.getElementById("currency_2").value;
    valueCurrency3 = document.getElementById("currency_3").value;
    valueCurrency4 = document.getElementById("currency_4").value;

    if (isNumber(valueCurrency1)) {
        document.getElementById("currency_converted_1").value = convertToChosenCurrency(valueCurrency1,
            supportedCurrencies[0], choosenBoxValue);
    }
    else {
        alert("Currency 1 needs to be a number")
    }
    if (isNumber(valueCurrency2)) {
        document.getElementById("currency_converted_2").value = convertToChosenCurrency(valueCurrency2,
            supportedCurrencies[1], choosenBoxValue)
    }
    else {
        alert("Currency 2 needs to be a number");
    }

    if (isNumber(valueCurrency3)) {
        document.getElementById("currency_converted_3").value = convertToChosenCurrency(valueCurrency3,
            supportedCurrencies[2], choosenBoxValue)
    }
    else {
        alert("Currency 3 needs to be a number");
    }
    if (isNumber(valueCurrency4)) {
        document.getElementById("currency_converted_4").value = convertToChosenCurrency(valueCurrency4,
            supportedCurrencies[3], choosenBoxValue)
    }
    else {
        alert("Currency 4 needs to be a number");
    }
    redrowChart(currencyHistory)
}

function addToPercentage() {
    for (let i = 0; i < document.getElementsByClassName("convert-table__input-percentage-form").length; i++) {
        document.getElementsByClassName("convert-table__input-percentage-form")[i].disabled = !document.getElementById("percentage_checkbox").checked;
    }


    if (value_percentage_1 === undefined) {
        return 0
    }
    if (isNumberForPercentage(document.getElementById("input_percentage_1").value)) {
        value_percentage_1 = document.getElementById("input_percentage_1").value;
    }
    else {
        alert("Percentage 1 needs to be a number")
    }
    if (isNumberForPercentage(document.getElementById("input_percentage_2").value)) {
        value_percentage_2 = document.getElementById("input_percentage_2").value;
    }
    else {
        alert("Percentage 2 needs to be a number");
    }

    if (isNumberForPercentage(document.getElementById("input_percentage_3").value)) {
        value_percentage_3 = document.getElementById("input_percentage_3").value;
    }
    else {
        alert("Percentage 3 needs to be a number");
    }
    if (isNumberForPercentage(document.getElementById("input_percentage_4").value)) {
        value_percentage_4 = document.getElementById("input_percentage_4").value;
    }
    else {
        alert("Percentage 4 needs to be a number");
    }
    redrowChart(currencyHistory)
}
