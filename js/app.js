let main_container = document.querySelector(`main-container`);

let i = 1;

function prev() {
    if (i === 1) {
        document.getElementById('prev').disabled = true;
    }
}