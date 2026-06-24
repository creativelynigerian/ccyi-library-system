
import { db } from "./firebase-config.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


// =========================
// COLLECTIONS
// =========================

const booksCollection =
    collection(db, "books");


// =========================
// ADD BOOK
// =========================

async function addBook() {

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

    if (!title || !author) {

        alert(
            "Please enter Title and Author"
        );

        return;
    }

    try {

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

        document.getElementById("title").value = "";
        document.getElementById("author").value = "";
        document.getElementById("isbn").value = "";
        document.getElementById("category").value = "";
        document.getElementById("quantity").value = "";

        alert("Book Added Successfully");

        loadBooks();

    } catch (error) {

        console.error(error);

        alert(
            "Error adding book"
        );

    }

}


// =========================
// LOAD BOOKS
// =========================

async function loadBooks() {

    const table =
        document.getElementById(
            "bookTable"
        );

    const dropdown =
        document.getElementById(
            "loanBookSelect"
        );

    if (!table) return;

    table.innerHTML = "";

    if (dropdown) {

        dropdown.innerHTML =
            '<option value="">Select Book</option>';

    }

    try {

        const snapshot =
            await getDocs(
                booksCollection
            );

        snapshot.forEach((docItem) => {

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

            if (dropdown) {

                dropdown.innerHTML += `

                <option value="${docItem.id}">

                    ${book.title}

                </option>

                `;

            }

        });

    } catch (error) {

        console.error(
            "Error loading books:",
            error
        );

    }

}


// =========================
// DELETE BOOK
// =========================

async function deleteBook(id) {

    try {

        await deleteDoc(
            doc(
                db,
                "books",
                id
            )
        );

        loadBooks();

    } catch (error) {

        console.error(error);

    }

}


// =========================
// GLOBAL FUNCTIONS
// =========================

window.addBook = addBook;
window.deleteBook = deleteBook;


// =========================
// START APP
// =========================

loadBooks();

