// CCYI Library Management System

let books = JSON.parse(localStorage.getItem("books")) || [];
let loans = JSON.parse(localStorage.getItem("loans")) || [];

// =========================
// STORAGE
// =========================

function saveBooks() {
localStorage.setItem("books", JSON.stringify(books));
}

function saveLoans() {
localStorage.setItem("loans", JSON.stringify(loans));
}

// =========================
// BOOKS
// =========================

function addBook() {

```
const title = document.getElementById("title").value.trim();
const author = document.getElementById("author").value.trim();
const isbn = document.getElementById("isbn").value.trim();
const category = document.getElementById("category").value.trim();
const quantity = parseInt(document.getElementById("quantity").value) || 0;

if (!title || !author) {
    alert("Please enter Title and Author");
    return;
}

books.push({
    id: Date.now(),
    title,
    author,
    isbn,
    category,
    quantity
});

saveBooks();
clearBookForm();
renderBooks();
populateBookDropdown();
updateDashboard();

alert("Book Added Successfully");
```

}

function clearBookForm() {
document.getElementById("title").value = "";
document.getElementById("author").value = "";
document.getElementById("isbn").value = "";
document.getElementById("category").value = "";
document.getElementById("quantity").value = "";
}

function renderBooks() {

```
const table = document.getElementById("bookTable");
if (!table) return;

table.innerHTML = "";

books.forEach(book => {

    table.innerHTML += `
    <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td>${book.category}</td>
        <td>${book.quantity}</td>
        <td>
            <button onclick="editBook(${book.id})">Edit</button>
            <button onclick="deleteBook(${book.id})">Delete</button>
        </td>
    </tr>`;
});
```

}

function deleteBook(id) {

```
if (!confirm("Delete this book?")) return;

books = books.filter(book => book.id !== id);

saveBooks();
renderBooks();
populateBookDropdown();
updateDashboard();
```

}

function editBook(id) {

```
const book = books.find(book => book.id === id);

if (!book) return;

document.getElementById("title").value = book.title;
document.getElementById("author").value = book.author;
document.getElementById("isbn").value = book.isbn;
document.getElementById("category").value = book.category;
document.getElementById("quantity").value = book.quantity;

deleteBook(id);
```

}

function searchBooks() {

```
const keyword =
    document.getElementById("search").value.toLowerCase();

const table = document.getElementById("bookTable");

table.innerHTML = "";

books
    .filter(book =>
        book.title.toLowerCase().includes(keyword) ||
        book.author.toLowerCase().includes(keyword) ||
        book.category.toLowerCase().includes(keyword)
    )
    .forEach(book => {

        table.innerHTML += `
        <tr>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>${book.category}</td>
            <td>${book.quantity}</td>
            <td>
                <button onclick="editBook(${book.id})">Edit</button>
                <button onclick="deleteBook(${book.id})">Delete</button>
            </td>
        </tr>`;
    });
```

}

// =========================
// LOANS
// =========================

function populateBookDropdown() {

```
const select = document.getElementById("loanBookSelect");

if (!select) return;

select.innerHTML = "";

books.forEach(book => {

    if (book.quantity > 0) {

        select.innerHTML += `
        <option value="${book.id}">
            ${book.title}
        </option>`;
    }
});
```

}

function loanBook() {

```
const borrowerName =
    document.getElementById("borrowerName").value;

const borrowerPhone =
    document.getElementById("borrowerPhone").value;

const borrowerEmail =
    document.getElementById("borrowerEmail").value;

const bookId =
    Number(document.getElementById("loanBookSelect").value);

const borrowDate =
    document.getElementById("borrowDate").value;

const dueDate =
    document.getElementById("dueDate").value;

const book =
    books.find(b => b.id === bookId);

if (!book) {
    alert("Book not found");
    return;
}

book.quantity--;

loans.push({
    id: Date.now(),
    borrowerName,
    borrowerPhone,
    borrowerEmail,
    bookId,
    bookTitle: book.title,
    borrowDate,
    dueDate,
    status: "Borrowed"
});

saveBooks();
saveLoans();

renderBooks();
renderLoans();
populateBookDropdown();
updateDashboard();
```

}

function renderLoans() {

```
const table = document.getElementById("loanTable");

if (!table) return;

table.innerHTML = "";

loans.forEach(loan => {

    let status = loan.status;

    if (
        status === "Borrowed" &&
        new Date(loan.dueDate) < new Date()
    ) {
        status = "Overdue";
    }

    table.innerHTML += `
    <tr>
        <td>${loan.borrowerName}</td>
        <td>${loan.bookTitle}</td>
        <td>${loan.borrowDate}</td>
        <td>${loan.dueDate}</td>
        <td>${status}</td>
        <td>
            <button onclick="returnBook(${loan.id})">
                Return
            </button>
        </td>
    </tr>`;
});
```

}

function returnBook(id) {

```
const loan = loans.find(l => l.id === id);

if (!loan) return;

const book = books.find(b => b.id === loan.bookId);

if (book) {
    book.quantity++;
}

loan.status = "Returned";

saveBooks();
saveLoans();

renderBooks();
renderLoans();
populateBookDropdown();
updateDashboard();
```

}

// =========================
// DASHBOARD
// =========================

function updateDashboard() {

```
const totalBooks =
    document.getElementById("totalBooksCount");

const totalLoans =
    document.getElementById("totalLoansCount");

const overdue =
    document.getElementById("overdueCount");

if (totalBooks) totalBooks.textContent = books.length;
if (totalLoans) totalLoans.textContent = loans.length;

if (overdue) {

    const count = loans.filter(loan =>
        loan.status === "Borrowed" &&
        new Date(loan.dueDate) < new Date()
    ).length;

    overdue.textContent = count;
}
```

}

// =========================
// INIT
// =========================

document.addEventListener("DOMContentLoaded", () => {
renderBooks();
renderLoans();
populateBookDropdown();
updateDashboard();
});
