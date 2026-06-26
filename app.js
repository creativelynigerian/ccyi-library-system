// ======================================================
// CCYI LIBRARY MANAGEMENT SYSTEM
// app.js
// Part 1
// ======================================================

import { db } from "./firebase-config.js";

import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


// ======================================================
// FIRESTORE COLLECTIONS
// ======================================================

const booksCollection = collection(db, "books");
const loansCollection = collection(db, "loans");


// ======================================================
// DOM ELEMENTS
// ======================================================

const bookTable = document.getElementById("bookTable");
const loanTable = document.getElementById("loanTable");

const loanBookSelect =
    document.getElementById("loanBookSelect");


// Dashboard

const totalBooks =
    document.getElementById("totalBooksCount");

const totalLoans =
    document.getElementById("totalLoansCount");

const overdueBooks =
    document.getElementById("overdueCount");


// ======================================================
// HELPER FUNCTIONS
// ======================================================

function showMessage(message) {
    alert(message);
}

function clearBookForm() {

    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
    document.getElementById("category").value = "";
    document.getElementById("quantity").value = "";

}

function clearLoanForm(){

    document.getElementById("borrowerName").value="";
    document.getElementById("borrowerPhone").value="";
    document.getElementById("borrowerEmail").value="";
    document.getElementById("loanBookSelect").value="";
    document.getElementById("borrowDate").value="";
    document.getElementById("dueDate").value="";

}


function formatDate(date){

    if(!date) return "";

    return new Date(date).toLocaleDateString();

}


// ======================================================
// DASHBOARD
// ======================================================

async function updateDashboard(){

    try{

        const booksSnapshot =
            await getDocs(booksCollection);

        const loansSnapshot =
            await getDocs(loansCollection);

        totalBooks.textContent =
            booksSnapshot.size;

        let activeLoans = 0;

        let overdue = 0;

        const today = new Date();

        loansSnapshot.forEach(docItem=>{

            const loan = docItem.data();

            if(loan.status==="Borrowed"){

                activeLoans++;

                if(new Date(loan.dueDate) < today){

                    overdue++;

                }

            }

        });

        totalLoans.textContent =
            activeLoans;

        overdueBooks.textContent =
            overdue;

    }

    catch(error){

        console.error(error);

    }

}


// ======================================================
// INITIALIZE APP
// ======================================================

async function init(){

    try{

        await Promise.all([

            loadBooks(),

            loadLoans(),

            updateDashboard()

        ]);

    }

    catch(error){

        console.error(error);

    }

}
// ======================================================
// BOOK MANAGEMENT
// ======================================================

// ---------------------------
// Add Book
// ---------------------------

async function addBook() {

    try {

        const title = document.getElementById("title").value.trim();
        const author = document.getElementById("author").value.trim();
        const isbn = document.getElementById("isbn").value.trim();
        const category = document.getElementById("category").value.trim();
        const quantity = parseInt(document.getElementById("quantity").value) || 0;

        if (!title || !author) {
            showMessage("Book title and author are required.");
            return;
        }

        await addDoc(booksCollection, {
            title,
            author,
            isbn,
            category,
            quantity,
            createdAt: new Date()
        });

        clearBookForm();

        await loadBooks();
        await updateDashboard();

        showMessage("Book added successfully.");

    } catch (error) {

        console.error(error);
        showMessage("Unable to add book.");

    }

}



// ---------------------------
// Load Books
// ---------------------------

async function loadBooks() {

    try {

        bookTable.innerHTML = "";

        loanBookSelect.innerHTML =
            `<option value="">Select Book</option>`;

        const q = query(
            booksCollection,
            orderBy("title")
        );

        const snapshot = await getDocs(q);

        snapshot.forEach((bookDoc) => {

            const book = bookDoc.data();

            bookTable.innerHTML += `

            <tr>

                <td>${book.title}</td>

                <td>${book.author}</td>

                <td>${book.isbn || ""}</td>

                <td>${book.category || ""}</td>

                <td>${book.quantity}</td>

                <td>

                    <button
                        onclick="editBook('${bookDoc.id}')">

                        Edit

                    </button>

                    <button
                        onclick="deleteBook('${bookDoc.id}')">

                        Delete

                    </button>

                </td>

            </tr>

            `;

            if (book.quantity > 0) {

                loanBookSelect.innerHTML += `

                <option value="${bookDoc.id}">

                    ${book.title} (${book.quantity} available)

                </option>

                `;

            }

        });

    }

    catch (error) {

        console.error(error);

    }

}



// ---------------------------
// Delete Book
// ---------------------------

async function deleteBook(id) {

    const answer =
        confirm("Delete this book permanently?");

    if (!answer) return;

    try {

        await deleteDoc(
            doc(db, "books", id)
        );

        await loadBooks();

        await updateDashboard();

        showMessage("Book deleted.");

    }

    catch (error) {

        console.error(error);

    }

}



// ---------------------------
// Edit Book
// ---------------------------

async function editBook(id) {

    try {

        const ref = doc(db, "books", id);

        const snap = await getDoc(ref);

        if (!snap.exists()) {

            showMessage("Book not found.");

            return;

        }

        const book = snap.data();

        const title =
            prompt("Book Title", book.title);

        if (title === null) return;

        const author =
            prompt("Author", book.author);

        if (author === null) return;

        const isbn =
            prompt("ISBN", book.isbn || "");

        const category =
            prompt("Category", book.category || "");

        const quantity =
            parseInt(
                prompt(
                    "Quantity",
                    book.quantity
                )
            );

        await updateDoc(ref, {

            title,
            author,
            isbn,
            category,
            quantity

        });

        await loadBooks();

        showMessage("Book updated.");

    }

    catch (error) {

        console.error(error);

    }

}



// ---------------------------
// Search Books
// ---------------------------

function searchBooks() {

    const keyword =
        document
        .getElementById("search")
        .value
        .toLowerCase();

    const rows =
        bookTable.getElementsByTagName("tr");

    for (let row of rows) {

        const text =
            row.textContent.toLowerCase();

        row.style.display =
            text.includes(keyword)
                ? ""
                : "none";

    }

}
// ======================================================
// LOAN MANAGEMENT
// ======================================================

// ---------------------------
// Loan Book
// ---------------------------

async function loanBook() {

    try {

        const borrowerName =
            document.getElementById("borrowerName").value.trim();

        const borrowerPhone =
            document.getElementById("borrowerPhone").value.trim();

        const borrowerEmail =
            document.getElementById("borrowerEmail").value.trim();

        const bookId =
            document.getElementById("loanBookSelect").value;

        const borrowDate =
            document.getElementById("borrowDate").value;

        const dueDate =
            document.getElementById("dueDate").value;

        if (
            !borrowerName ||
            !borrowerPhone ||
            !borrowerEmail ||
            !bookId ||
            !borrowDate ||
            !dueDate
        ) {
            showMessage("Please complete all fields.");
            return;
        }

        if (new Date(dueDate) < new Date(borrowDate)) {

            showMessage(
                "Due date cannot be earlier than borrow date."
            );

            return;

        }

        const bookRef = doc(db, "books", bookId);

        const bookSnap = await getDoc(bookRef);

        if (!bookSnap.exists()) {

            showMessage("Book not found.");

            return;

        }

        const book = bookSnap.data();

        if (book.quantity <= 0) {

            showMessage("Book is out of stock.");

            return;

        }

        await addDoc(loansCollection, {

            borrowerName,
            borrowerPhone,
            borrowerEmail,

            bookId,

            bookTitle: book.title,

            borrowDate,
            dueDate,

            status: "Borrowed",

            createdAt: serverTimestamp()

        });

        await updateDoc(bookRef, {

            quantity: book.quantity - 1

        });

        clearLoanForm();

        await Promise.all([

            loadBooks(),
            loadLoans(),
            updateDashboard()

        ]);

        showMessage("Book loaned successfully.");

    }

    catch (error) {

        console.error(error);

        showMessage("Unable to loan book.");

    }

}



// ---------------------------
// Load Loans
// ---------------------------

async function loadLoans() {

    try {

        loanTable.innerHTML = "";

        const q = query(
            loansCollection,
            orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        snapshot.forEach((loanDoc) => {

            const loan = loanDoc.data();

            const overdue =

                loan.status === "Borrowed" &&

                new Date(loan.dueDate) < new Date();

            loanTable.innerHTML += `

            <tr>

                <td>${loan.borrowerName}</td>

                <td>${loan.bookTitle}</td>

                <td>${formatDate(loan.borrowDate)}</td>

                <td>

                    <span style="color:${overdue ? "red" : "inherit"}">

                        ${formatDate(loan.dueDate)}

                    </span>

                </td>

                <td>

                    ${overdue
                        ? "Overdue"
                        : loan.status}

                </td>

                <td>

                    ${loan.status === "Borrowed"

                        ?

                        `<button
                            onclick="returnBook('${loanDoc.id}','${loan.bookId}')">

                            Return

                        </button>`

                        :

                        "Returned"

                    }

                </td>

            </tr>

            `;

        });

    }

    catch (error) {

        console.error(error);

    }

}



// ---------------------------
// Return Book
// ---------------------------

async function returnBook(loanId, bookId) {

    try {

        const loanRef =
            doc(db, "loans", loanId);

        const bookRef =
            doc(db, "books", bookId);

        const loanSnap =
            await getDoc(loanRef);

        const bookSnap =
            await getDoc(bookRef);

        if (
            !loanSnap.exists() ||
            !bookSnap.exists()
        ) {

            showMessage("Unable to locate record.");

            return;

        }

        const book =
            bookSnap.data();

        await updateDoc(

            loanRef,

            {

                status: "Returned",

                returnedDate:

                    new Date().toISOString()

            }

        );

        await updateDoc(

            bookRef,

            {

                quantity:

                    book.quantity + 1

            }

        );

        await Promise.all([

            loadBooks(),

            loadLoans(),

            updateDashboard()

        ]);

        showMessage(

            "Book returned successfully."

        );

    }

    catch (error) {

        console.error(error);

    }

}
