const getElement = (selection) => {
  const element = document.querySelector(selection);
  if (element) {
    return element;
  } else {
    throw new Error("please check your selection");
  }
};

// selection of element
const alert = getElement(".alert");
const sumbitBtn = getElement(".submit-btn");
const form = getElement(".grocery-form");
const grocery = getElement("#grocery");

const container = getElement(".grocery-container");
const list = getElement(".grocery-list");
const clearBtn = getElement(".clear-btn");

let editElement;
let editFlag = false;
let editId = "";

//  ADD EVENTLISTENER

form.addEventListener("submit", addItems);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setUpApp);

// FUNCTION
function addItems(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();
  if (value && !editFlag) {
    creatListElement(id, value);
    displayAlert("item sucessfully added", "success");
    container.classList.add("show-container");

    setDefault();
    // ADD TO LOCAL STORAGE
    addToLocalStorage(id, value);
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("item edited successfully ", "success");
    // edit local storage
    editLocalStorage(editId, value);
    setDefault();
  } else {
    displayAlert("please fill the form", "danger");
  }
}
// SET DEFAULT
function setDefault() {
  grocery.value = "";
  editFlag = false;
  editId = "";
  sumbitBtn.textContent = "submit";
}
// CLEAR ITEM
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach((item) => {
      list.removeChild(item);
    });
    container.classList.remove("show-container");
  }
  displayAlert("item deleted sucessfully", "danger");
  setDefault();
  localStorage.removeItem(list)
}
// EDITITEM
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  //  SET VALUES
  editElement = e.currentTarget.parentElement.previousElementSibling;
  //  console.log(editElement);
  grocery.value = editElement.innerHTML;
  editId = element.dataset.id;
  editFlag = true;
  sumbitBtn.textContent = "edit";
}
// DELETE ITEM
function deleteItem(e) {
  const element = e.target.parentElement.parentElement.parentElement;
  const id = element.dataset.id;
  //  console.log(element);
  console.log(id);
  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");
  setDefault();
  //  REMOVE FROM LOCAL STORAGE
  removeFromLocalStorage(id);
}

// DISPLAY ALERT
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}
// add tolocal storage
function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}
function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}
// edit local storage
function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.find((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return items;
  });
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
}

// localstorage
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}
// setup app
function setUpApp() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items = items.forEach((item) => {
      const { id, value } = item;
      creatListElement(id, value);
    });
  }
}

// create list  element
function creatListElement(id, value) {
  const element = document.createElement("article");

  const atrr = document.createAttribute("dataset-id");
  atrr.value = id;
  element.setAttributeNode(atrr);
  element.classList.add("grocery-item");
  element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
  // selection of button
  const editBtn = element.querySelector(".edit-btn");
  const deleteBtn = element.querySelector(".delete-btn");
  // add of eventlistener
  editBtn.addEventListener("click", editItem);
  deleteBtn.addEventListener("click", deleteItem);
  list.appendChild(element);
}
