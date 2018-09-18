function addButton() {
    let currencyAddButton = document.createElement("BUTTON");
    currencyAddButton.className = "convert-table__add-currency-button";
    let spanTagInButton = document.createElement("SPAN");
    let spanValue = document.createTextNode("Валюта");
    spanTagInButton.appendChild(spanValue)
    currencyAddButton.appendChild(spanValue);
    currencyAddButton.onclick = function () {
        addLineOfFormsForCurrency()
    };

    document.getElementsByClassName("converter__for-button")[0].append(currencyAddButton);

}

function addLineOfFormsForCurrency() {

    if (hiddenCurrencies.length !== 0) {
        addColorToSupportedColors();
        addInputCurrencyForm();
        addOutputCurrencyForm();
        addPercentageForm();
        addOptionToBox();
        supportedCurrencies.push(hiddenCurrencies.pop());
        addDefaultValuesAtAddingNewForm();
        updateStatus();
    }
    if (hiddenCurrencies.length === 0) {
        disableButton(1)
    }
}
function disableButton(notch) {
    document.getElementsByClassName("convert-table__add-currency-button")[0].disabled = !!notch;

}
function addInputCurrencyForm() {
    let sectionForOutputFrom = document.createElement("SECTION");
    sectionForOutputFrom.className = "convert-table__input-section";

    let imageForOutputFrom = document.createElement("img");
    imageForOutputFrom.className = "convert-table__currency-img";
    imageForOutputFrom.src = "./img/" + hiddenCurrencies[hiddenCurrencies.length - 1] + ".gif";
    imageForOutputFrom.alt = hiddenCurrencies[hiddenCurrencies.length - 1];


    let inputForm = document.createElement("INPUT");
    inputForm.className = "convert-table__input-exchange";
    inputForm.id = "currency_" + (document.getElementsByClassName("convert-table__input-section").length + 1).toString();
    inputForm.type = "text";
    inputForm.value = "0";

    inputForm.onchange = addTo;

    sectionForOutputFrom.appendChild(imageForOutputFrom);
    sectionForOutputFrom.appendChild(inputForm);

    document.getElementsByClassName("convert-table__input-fields")[0].append(sectionForOutputFrom);
}
function addOutputCurrencyForm() {
    let outputElement = document.createElement("OUTPUT");
    outputElement.className = "convert-table__output-exchange";
    outputElement.id = "currency_converted_" + (document.getElementsByClassName("convert-table__output-exchange").length + 1).toString();
    outputElement.innerHTML = 0;
    document.getElementsByClassName("convert-table__converted-currency")[0].append(outputElement);
}

function addPercentageForm() {

    let inputForm = document.createElement("INPUT");
    inputForm.className = "convert-table__input-percentage-form";
    inputForm.id = "input_percentage_" + (document.getElementsByClassName("convert-table__input-percentage-form").length + 1).toString();
    inputForm.type = "text";
    inputForm.setAttribute("value", "0");

    inputForm.onchange = addToPercentage;
    document.getElementsByClassName("convert-table__input-percentage")[0].append(inputForm);


}
function addOptionToBox() {
    let optionVal = document.createElement("OPTION");
    optionVal.value = hiddenCurrencies[hiddenCurrencies.length - 1];
    optionVal.innerHTML = hiddenCurrencies[hiddenCurrencies.length - 1];
    document.getElementById("currency-choose-box-id").append(optionVal);
}

function generateColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function addColorToSupportedColors() {
    let color = generateColor();
    while (colorsForCurr.includes(color)) {
        color = generateColor();
    }
    colorsForCurr.push(color);
}

function addDefaultValuesAtAddingNewForm() {
    valueCurrencyArray.push(0);
    valuePercentageArray.push(0);
}
