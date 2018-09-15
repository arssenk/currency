function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function isNumberForPercentage(n) {
    return !isNaN(parseFloat(n)) && isFinite(n) && n >= 0 && n <= 100;
}


function createDeepCopy(o) {
    let r = [];
    for (let i = 0; i < o.length; i++) {
        r.push(Object.assign({}, o[i]))
    }
    return Object.values(r)
}


function disableInputCurrency(disableNotch) {
    for (let i = 0; i < document.getElementsByClassName("convert-table__input-exchange").length; i++) {
        document.getElementsByClassName("convert-table__input-exchange")[i].disabled = !!disableNotch;
    }
}
function disableInputPercentage(disableNotch) {
    for (let i = 0; i < document.getElementsByClassName("convert-table__input-percentage-form").length; i++) {
        document.getElementsByClassName("convert-table__input-percentage-form")[i].disabled = !!disableNotch;
    }
}
function disableCheckBox(notch) {
    document.getElementById("percentage_checkbox").disabled = !!notch;
}

function disableForms(disableNotch) {
    disableInputCurrency(disableNotch);
    disableButton(disableNotch);
    disableCheckBox(disableNotch);
    disableSelectBox(disableNotch)
}

function disableSelectBox(notch){
    if (notch){
        document.getElementById("currency-choose-box-id").setAttribute("disabled", "")
    }
    else {
        document.getElementById("currency-choose-box-id").removeAttribute("disabled")
    }
}
function updateDropDownValue() {
    chooseBox = document.getElementById("currency-choose-box-id");
    choosenBoxValue = chooseBox.options[chooseBox.selectedIndex].text;
}
function updateCurrencyInTitle() {
    document.getElementById('output-current-currency').innerHTML = "В моїй валюті, " + choosenBoxValue;
}
// Updates all forms, graphs, button and checkboxl
function updateStatus() {

    updateDropDownValue();
    updateCurrencyInTitle();
    addToPercentage();
    addTo();
    addBackgroundColorToInputForm();
    startRenderingGraph1(currencyHistory);
    redrowChart(currencyHistory);

}
function whenStart() {

    addButton();
    getHistoryData(currencyHistory);

    addBackgroundColorToInputForm();

    updateDropDownValue();
    updateCurrencyInTitle();


    document.getElementById('currency-choose-box-id').onchange = function () {
        updateStatus();
    };
}

function mapCurrency(cur) {
    return colorsForCurr[supportedCurrenciesAll.indexOf(cur)]
}
function getRaangeOfAllPossibleKeys() {
    let keys = [];
    for (let i = 0; i < supportedCurrenciesAll.length; i++) {
        keys.push(supportedCurrenciesAll[i]);
        keys.push(supportedCurrenciesAll[i] + "_percentage")
    }
    return keys
}

function addBackgroundColorToInputForm() {
    let items = document.getElementsByClassName("convert-table__input-exchange");
    for (let i = 1; i < items.length + 1; i++) {

        let currEll = document.getElementById("currency_" + i);

        currEll.style["background-color"] = colorsForCurr[i - 1];
        currEll.style["border-radius"] = "7px";

    }

}