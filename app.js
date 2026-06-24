
let books =
JSON.parse(localStorage.getItem("books")) || [];

let loans =
JSON.parse(localStorage.getItem("loans")) || [];


let books =
JSON.parse(localStorage.getItem("books")) || [];

renderBooks();

function saveBooks(){

localStorage.setItem(
"books",
JSON.stringify(books)
);

}

function addBook(){

const title =
document.getElementById("title").value;

const author =
document.getElementById("author").value;

const isbn =
document.getElementById("isbn").value;

const category =
document.getElementById("category").value;

const quantity =
document.getElementById("quantity").value;

if(!title || !author){

alert("Please fill required fields");

return;

}

books.push({

id:Date.now(),

title,
author,
isbn,
category,
quantity

});

saveBooks();

renderBooks();

clearForm();

}

function clearForm(){

title.value="";
author.value="";
isbn.value="";
category.value="";
quantity.value="";

}

function renderBooks(){

const table =
document.getElementById("bookTable");

table.innerHTML="";

books.forEach(book=>{

table.innerHTML += `
<tr>

<td>${book.title}</td>

<td>${book.author}</td>

<td>${book.isbn}</td>

<td>${book.category}</td>

<td>${book.quantity}</td>

<td>

<button
class="edit"
onclick="editBook(${book.id})">
Edit
</button>

<button
class="delete"
onclick="deleteBook(${book.id})">
Delete
</button>

</td>

</tr>
`;

});

}

function deleteBook(id){

if(confirm("Delete this book?")){

books =
books.filter(
book => book.id !== id
);

saveBooks();

renderBooks();

}

}

function editBook(id){

const book =
books.find(
book => book.id === id
);

title.value = book.title;
author.value = book.author;
isbn.value = book.isbn;
category.value = book.category;
quantity.value = book.quantity;

deleteBook(id);

}

function searchBooks(){

const keyword =
document
.getElementById("search")
.value
.toLowerCase();

const filtered =
books.filter(book =>

book.title.toLowerCase().includes(keyword) ||

book.author.toLowerCase().includes(keyword) ||

book.category.toLowerCase().includes(keyword)

);

const table =
document.getElementById("bookTable");

table.innerHTML="";

filtered.forEach(book=>{

table.innerHTML += `
<tr>

<td>${book.title}</td>

<td>${book.author}</td>

<td>${book.isbn}</td>

<td>${book.category}</td>

<td>${book.quantity}</td>

<td>

<button
class="edit"
onclick="editBook(${book.id})">
Edit
</button>

<button
class="delete"
onclick="deleteBook(${book.id})">
Delete
</button>

</td>

</tr>
`;

});

}

