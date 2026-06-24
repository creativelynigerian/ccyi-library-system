```javascript
import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const booksCollection =
collection(db, "books");

async function addBook(){

const title =
document.getElementById("title").value;

const author =
document.getElementById("author").value;

const isbn =
document.getElementById("isbn").value;

const category =
document.getElementById("category").value;

const quantity =
parseInt(
document.getElementById("quantity").value
) || 0;

if(!title || !author){

alert("Title and Author Required");

return;

}

await addDoc(
booksCollection,
{
title,
author,
isbn,
category,
quantity,
createdAt:
new Date()
}
);

alert("Book Added");

loadBooks();

}

async function loadBooks(){

const table =
document.getElementById(
"bookTable"
);

table.innerHTML = "";

const snapshot =
await getDocs(
booksCollection
);

snapshot.forEach(docItem=>{

const book =
docItem.data();

table.innerHTML += `

<tr>

<td>${book.title}</td>

<td>${book.author}</td>

<td>${book.isbn}</td>

<td>${book.category}</td>

<td>${book.quantity}</td>

<td>

<button
onclick="deleteBook('${docItem.id}')">
Delete
</button>

</td>

</tr>

`;

});

}

window.deleteBook =
async function(id){

await deleteDoc(
doc(db,"books",id)
);

loadBooks();

}

window.addBook =
addBook;

loadBooks();
```
