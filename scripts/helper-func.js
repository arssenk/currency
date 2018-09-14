
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function isNumberForPercentage(n) {
    return !isNaN(parseFloat(n)) && isFinite(n) && n >= 0 && n <= 100;
}


function createDeepCopy(o){
    let r = [];
    for (let i = 0; i<o.length; i++){
        r.push(Object.assign({},o[i] ))
    }
    return Object.values(r)
}


function disableInputCurrency(disableNotch) {
    for (let i = 0; i < document.getElementsByClassName("convert-table__input-exchange").length; i++) {
        document.getElementsByClassName("convert-table__input-exchange")[i].disabled = !!disableNotch;
    }
}
function updateDropDownValue() {
    chooseBox = document.getElementById("currency-choose-box-id");
    choosenBoxValue = chooseBox.options[chooseBox.selectedIndex].text;
}

function updateStatus() {
    updateDropDownValue();
    startRenderingGraph1(currencyHistory);
    redrowChart(currencyHistory);
    addTo();
}