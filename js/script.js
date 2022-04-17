let input = document.getElementById('input');
let checkIcon = "check_circle";
let uncheckIcon = "radio_button_unchecked";
let lineThrough = "lineThrough";
let spending = document.getElementById('spending');


//function that opens the confirmation popup for clear all
function popupClearAll() {
    let myPopupClearAll = document.getElementById("myPopupClearAll");

    myPopupClearAll.classList.toggle("show");
}

//function to clear all localstorage
function clearAll() {
    localStorage.clear();
    location.reload();
};

let list = [],
    id = 0;

//when starting it checks if there is something in the localstorage and shows it on the screen	
let data = localStorage.getItem('shoppingList');

if (data) {

    list = JSON.parse(data);
    list.forEach(function(item) {
        addShopping(item.name, item.id, item.done, item.value);
    })
    totalCalc();
} else {
    list = [];
}


//check the id of the last array to start counting from it
let lastArray = list[list.length - 1]

if (lastArray == undefined) {
    id = 0
} else {
    id = lastArray.id + 1

}


//function that adds tasks to array and saves to localstorage
function addList() {
    let shopping = input.value.trim();

    if (shopping) {
        addShopping(shopping, id, false, 0);
        list.push({
            name: shopping,
            id: id,
            done: false,
            value: 0,
        });

        saveLocal(id);

        id++;
    }
    input.value = '';
}

//function that creates objects on the screen
function addShopping(shopping, id, done) {

    let DONE = done ? checkIcon : uncheckIcon;
    let LINE = done ? lineThrough : '';
    let CHECKED = done ? 'checked' : '';
    let CONTENTEDIT = done ? false : true;
    let item = `
		<li class="item">
			<i class="material-icons checkBtn ${CHECKED}" onclick="popupDone(${id})" id="${id}">${DONE}</i>
			<div>
				<p class="text ${LINE}" onfocusout="makeChanges(${id})" id="text${id}" contenteditable="${CONTENTEDIT}" onkeypress="return characterLimit(${id})" onpaste="return false">${shopping}</p>
			</div>
			<div class="containerTrash">
			<i class="material-icons trashBtn" onclick="popup(${id})" id="trashBtn${id}">delete</i>
			</div>
			<div class="popup" id="popup${id}">
				<span class="popuptext" id="myPopup${id}">Tem certeza?
					<div>
						<button class="material-icons trashAccepted" onclick="removeList(${id})">done</button>
						<button class="material-icons trashCancel" onclick="popup(${id})">close</button>
					</div>
				</span>
			</div>
			<div class="popupDone" id="popupDone${id}">
				<span class="popuptextDone" id="mypopupDone${id}">Valor
					<div>
						<input class="inputValue" type="number" id="inputDone${id}" placeholder="R$" maxlength="100">
						<button class="material-icons trashAccepted" onclick="completeList(${id}, inputDone${id})">done</button>
						<button class="material-icons trashCancel" onclick="popupDone(${id})">close</button>
					</div>
				</span>
			</div>
		</li>`;

    document.getElementById('list').insertAdjacentHTML("beforeend", item);
}

//function that opens the confirmation popup for task deletion
function popup(id) {
    let myPopup = document.getElementById("myPopup" + id);
    let trashBtn = document.getElementById("trashBtn" + id);
    let popup = document.getElementById("popup" + id)

    let coordinates = trashBtn.getBoundingClientRect();

    popup.style.top = coordinates.top
    popup.style.left = coordinates.left

    myPopup.classList.toggle("show");
}

//function that opens the confirmation popup for task completion
function popupDone(id) {
    let currentArray = list.find(checkArray)


    function checkArray(currentArray) {
        return currentArray.id === id
    }
    if (currentArray.done == false) {
        let mypopupDone = document.getElementById("mypopupDone" + id);
        let trashBtn = document.getElementById("trashBtn" + id);
        let popupDone = document.getElementById("popupDone" + id)
        let coordinates = trashBtn.getBoundingClientRect();

        popupDone.style.top = coordinates.top
        popupDone.style.right = coordinates.right
        mypopupDone.classList.toggle("show");
    } else {
        remove(id);

    }
}

//function that removes items from the list
function remove(id) {
    let currentArray = list.find(checkArray)
    let element = document.getElementById(id)
    let text = document.getElementById('text' + id)

    function checkArray(currentArray) {
        return currentArray.id === id
    }

    document.getElementById(element.id).innerHTML = uncheckIcon;
    currentArray.done = false;
    element.parentNode.querySelector('.checkBtn').classList = "material-icons checkBtn";
    element.parentNode.querySelector('.text').classList = "text";
    text.contentEditable = true;
    saveLocal();
}

//function that calculates total amount spent
function totalCalc() {
    let total = 0
    list.filter(item => item.done == true).forEach(item => total += item.value)
    spending.innerHTML = String(total.toFixed(2)).replace('.', ',');
}

//function to complete task
function completeList(id, inputID) {
    let mypopupDone = document.getElementById("mypopupDone" + id);
    let price = parseFloat(inputID.value.trim().replace(',', '.'));
    let element = document.getElementById(id)
    let currentArray = list.find(checkArray)
    let check = document.getElementById(element.id).innerHTML;
    let text = document.getElementById('text' + id)

    function checkArray(currentArray) {
        return currentArray.id === id
    }

    document.getElementById(element.id).innerHTML = checkIcon
    currentArray.done = true;
    currentArray.value = price;
    element.parentNode.querySelector('.checkBtn').classList = "material-icons checkBtn checked";
    element.parentNode.querySelector('.text').classList = "text lineThrough";
    text.contentEditable = false;

    mypopupDone.classList.toggle("show");
    saveLocal();

}

//function to remove task
function removeList(id) {
    let element = document.getElementById(id)
    let currentArray = list.find(checkArray)

    element.parentNode.parentNode.removeChild(element.parentNode);

    function checkArray(currentArray) {
        return currentArray.id === id
    }

    list.splice(list.indexOf(currentArray), 1);
    saveLocal();
}

//function to save task change
function makeChanges(id) {
    let text = document.getElementById('text' + id)
    let currentArray = list.find(checkArray)

    function checkArray(currentArray) {
        return currentArray.id === id
    }

    currentArray.name = text.innerHTML;

    saveLocal();
}

//function to limit characters of task change
function characterLimit(id) {
    return (document.getElementById('text' + id).innerText.length < 99)
}


//function that saves to localStorage
function saveLocal() {
    localStorage.setItem('shoppingList', JSON.stringify(list));
    totalCalc();

    totalCalc();
}