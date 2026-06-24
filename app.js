```javascript
async function loadBooks(){

const table =
document.getElementById("bookTable");

const dropdown =
document.getElementById("loanBookSelect");

table.innerHTML = "";

if(dropdown){

dropdown.innerHTML =
'<option value="">Select Book</option>';

}

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

if(dropdown){

dropdown.innerHTML += `

<option value="${docItem.id}">
${book.title}
</option>

`;

}

});

}
```
