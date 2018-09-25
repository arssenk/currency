// Get the modal
function runAtStartModalWindow() {
    let modal = document.getElementById('currency-modal');

// Get the button that opens the modal
    let currencyButton = document.getElementById("add-currency-btn");

// Get the <span> element that closes the modal
    let closeButton = document.getElementsByClassName("modal__close")[0];

// When the user clicks on the button, open the modal
    currencyButton.onclick = function () {
        modal.style.display = "block";
    };

// When the user clicks on (x), close the modal
    closeButton.onclick = function () {
        modal.style.display = "none";
    };

// When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    addOptionsToModalWindow();
}