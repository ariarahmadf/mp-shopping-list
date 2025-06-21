// Get DOM elements
const itemForm = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const clearBtn = document.querySelector('.btn-clear');
const itemFilter = document.querySelector('.filter');
const formBtn = itemForm.querySelector('button');

// Set the default value of the edit mode variable
let isEditMode = false;

// Display all list items in the DOM structure
function displayItems() {
	const itemsFromStorage = getItemsFromStorage();

	itemsFromStorage.forEach((item) => addItemToDOM(item));

	checkUI();
}

// Special function when form input button is clicked
function onAddItemSubmit(e) {
	e.preventDefault();

	const newItem = itemInput.value;

	if (newItem === '') {
		alert('Please add an item!');
		return;
	}

	if (isEditMode) {
		const itemToEdit = itemList.querySelector('.edit-mode');
		removeItemFromStorage(itemToEdit.textContent);
		itemToEdit.classList.remove('edit-mode');
		itemToEdit.remove();
		isEditMode = false;
	} else {
		if (checkIfItemExists(newItem)) {
			alert('That item alredy exists!');
			itemInput.value = '';
			return;
		}
	}

	addItemToDOM(newItem);
	addItemToStorage(newItem);
	checkUI();
	itemInput.value = '';
}

// Function to add an item to the DOM structure
function addItemToDOM(item) {
	const li = document.createElement('li');
	li.appendChild(document.createTextNode(item));

	const button = createButton('remove-item btn-link text-red');
	li.appendChild(button);

	itemList.appendChild(li);
}

// Function to create a button element
function createButton(classes) {
	const button = document.createElement('button');
	button.className = classes;

	const icon = createIcon('fa-solid fa-xmark');

	button.appendChild(icon);

	return button;
}

// Function to create an icon element
function createIcon(classes) {
	const icon = document.createElement('i');
	icon.className = classes;

	return icon;
}

// Function to add item data to local storage
function addItemToStorage(item) {
	const itemsFromStorage = getItemsFromStorage();

	itemsFromStorage.push(item);

	localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// Function to retrieve item data from local storage
function getItemsFromStorage() {
	let itemsFromStorage;

	if (localStorage.getItem('items') === null) {
		itemsFromStorage = [];
	} else {
		itemsFromStorage = JSON.parse(localStorage.getItem('items'));
	}

	return itemsFromStorage;
}

// Special function when list item is clicked
function onItemClick(e) {
	if (e.target.parentElement.classList.contains('remove-item')) {
		removeItem(e.target.parentElement.parentElement);
	} else {
		setItemToEdit(e.target);
	}
}

// Function to check for duplication between new items and previously stored items
function checkIfItemExists(item) {
	const itemsFromStorage = getItemsFromStorage();
	return itemsFromStorage.includes(item);
}

// Function to edit a list item
function setItemToEdit(item) {
	isEditMode = true;

	itemList
		.querySelectorAll('li')
		.forEach((i) => i.classList.remove('edit-mode'));

	item.classList.add('edit-mode');
	formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
	formBtn.style.backgroundColor = '#228B22';
	itemInput.value = item.textContent.trim();
}

// Function to remove a list item from the DOM structure
function removeItem(item) {
	if (confirm('Are you sure?')) {
		item.remove();
		removeItemFromStorage(item.textContent);
		checkUI();
	}
}

// Function to delete list item values stored in local storage
function removeItemFromStorage(item) {
	let itemFromStorage = getItemsFromStorage();

	itemFromStorage = itemFromStorage.filter((i) => i !== item);

	localStorage.setItem('items', JSON.stringify(itemFromStorage));
}

// Special function to remove all list items from the DOM structure
function clearItems() {
	while (itemList.firstChild) {
		itemList.removeChild(itemList.firstChild);
	}
	checkUI();
}

// Function to customize the UI display based on the condition or number of list items
function checkUI() {
	itemInput.value = '';

	const items = itemList.querySelectorAll('li');

	if (items.length == 0) {
		clearBtn.style.display = 'none';
		itemFilter.style.display = 'none';
	} else {
		clearBtn.style.display = 'block';
		itemFilter.style.display = 'block';
	}

	formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
	formBtn.style.backgroundColor = '#333';

	isEditMode = false;
}

// Function to filter items that are being searched
function filterItems(e) {
	const text = e.target.value.toLowerCase();
	const items = itemList.querySelectorAll('li');

	items.forEach((item) => {
		const itemName = item.firstChild.textContent.toLowerCase();
		if (itemName.indexOf(text) != -1) {
			item.style.display = 'flex';
		} else {
			item.style.display = 'none';
		}
	});
	console.log(text);
}

// Initialization function when the javascript file is called
function init() {
	itemForm.addEventListener('submit', onAddItemSubmit);
	itemList.addEventListener('click', onItemClick);
	clearBtn.addEventListener('click', clearItems);
	itemFilter.addEventListener('input', filterItems);
	document.addEventListener('DOMContentLoaded', displayItems);

	checkUI();
}

// Calling the init function
init();
