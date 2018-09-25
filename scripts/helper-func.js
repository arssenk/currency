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

function disableSelectBox(notch) {
    if (notch) {
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
    document.getElementById('output-current-currency').innerHTML = "В моїй валюті, "
        + supportedCurrenciesTXT[supportedCurrencies.indexOf(choosenBoxValue)];
}

// Updates all forms, graphs, button and checkbox
function updateStatus() {
    updateDropDownValue();
    updateCurrencyInTitle();
    addToPercentage();
    addTo();
    addBackgroundColorToInputForm();
    startRenderingGraph1(currencyHistory);
    redrowChart(currencyHistory);
}

function runAtStart() {

    getHistoryData(currencyHistory);

    addBackgroundColorToInputForm();

    updateDropDownValue();
    updateCurrencyInTitle();

    document.getElementById('currency-choose-box-id').onchange = function () {
        updateStatus();
    };

}

function addBackgroundColorToInputForm() {
    let items = document.getElementsByClassName("convert-table__currency-img");
    for (let i = 0; i < items.length; i++) {
        let currEll = items[i];
        currEll.style["background-color"] = colorsForCurr[i];
        // currEll.style["border-radius"] = "7px";
    }
}

function updateTotalValuesGraph2(val1, val2) {
    document.getElementById("graph-2-total-" + 1).value =
        val1 + " " + supportedCurrenciesTXT[supportedCurrencies.indexOf(choosenBoxValue)];;
    document.getElementById("graph-2-total-" + 2).value =
        val2 + " " + supportedCurrenciesTXT[supportedCurrencies.indexOf(choosenBoxValue)];;
}

function getdaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

function convertToYYMMDDFormat(year, month, day) {
    return year + "-" +
        ('0' + month).slice(-2) + "-" + ('0' + day).slice(-2);
}

function isCurrentYear(date) {
    let thisMonth = parseInt(date.split("-")[1]);
    let thisYear = parseInt(date.split("-")[0]);
    let thisDay = parseInt(date.split("-")[2]);

    let currYear = parseInt(currentDate.split("-")[0]);
    let currMonth = parseInt(currentDate.split("-")[1]);
    let currDay = parseInt(currentDate.split("-")[2]);

    if ((currYear > thisYear) || ((currYear === thisYear) && (currMonth > thisMonth))) {
        return true
    }
    else if ((currYear === thisYear) && (currMonth === thisMonth) && (currDay >= thisDay)) {
        return true
    }
    else {
        return false
    }
}

function scaleNumber(number) {
    let numberToWorkWith = number.toString();
    if (numberToWorkWith.length > 6) {
        return d3.format(".3s")(number)
    }
    else{
        return addSpacesToNumber(numberToWorkWith)
    }
}

function addSpacesToNumber(number) {
    return (d3.format(",")(number)).split(",").join(" ");
}