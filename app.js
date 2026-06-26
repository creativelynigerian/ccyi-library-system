
import { db } from "./firebase-config.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    getDoc,
    doc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


// =========================
// COLLECTIONS
// =========================

async function addBook() {

    try {

        const title = document.getElementById("title").value.trim();
        const author = document.getElementById("author").value.trim();
        const isbn = document.getElementById("isbn").value.trim();
        const category = document.getElementById("category").value.trim();
        const quantity = parseInt(document.getElementById("quantity").value) || 0;

        if (!title || !author) {
            alert("Title and Author are required.");
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

        ["title","author","isbn","category","quantity"].forEach(id=>{
            document.getElementById(id).value="";
        });

        await loadBooks();
        await updateDashboard();

        alert("Book added successfully.");

    } catch(err){

        console.error(err);
        alert("Unable to add book.");

    }

}
// =========================
// LOAD BOOKS
// =========================

async function loadBooks(){

    const table = document.getElementById("bookTable");
    const dropdown = document.getElementById("loanBookSelect");

    table.innerHTML="";
    dropdown.innerHTML='<option value="">Select Book</option>';

    try{

        const snapshot = await getDocs(booksCollection);

        snapshot.forEach(bookDoc=>{

            const book = bookDoc.data();

            table.innerHTML += `
            <tr>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isbn}</td>
                <td>${book.category}</td>
                <td>${book.quantity}</td>
                <td>
                    <button onclick="deleteBook('${bookDoc.id}')">
                        Delete
                    </button>
                </td>
            </tr>
            `;

            if(book.quantity>0){

                dropdown.innerHTML += `
                    <option value="${bookDoc.id}">
                        ${book.title} (${book.quantity} available)
                    </option>
                `;

            }

        });

    }catch(err){

        console.error(err);

    }

}
// =========================
// LOAN BOOKS
// =========================
async function loanBook(){

    try{

        const borrowerName=document.getElementById("borrowerName").value.trim();
        const borrowerPhone=document.getElementById("borrowerPhone").value.trim();
        const borrowerEmail=document.getElementById("borrowerEmail").value.trim();

        const bookId=document.getElementById("loanBookSelect").value;

        const borrowDate=document.getElementById("borrowDate").value;
        const dueDate=document.getElementById("dueDate").value;

        if(!borrowerName || !bookId){

            alert("Complete all required fields.");
            return;

        }

        const bookRef=doc(db,"books",bookId);
        const snap=await getDoc(bookRef);

        if(!snap.exists()){

            alert("Book not found.");
            return;

        }

        const book=snap.data();

        if(book.quantity<1){

            alert("Book unavailable.");
            return;

        }

        await addDoc(loansCollection,{

            borrowerName,
            borrowerPhone,
            borrowerEmail,

            bookId,
            bookTitle:book.title,

            borrowDate,
            dueDate,

            status:"Borrowed",

            createdAt:new Date()

        });

        await updateDoc(bookRef,{

            quantity:book.quantity-1

        });

        [
            "borrowerName",
            "borrowerPhone",
            "borrowerEmail",
            "loanBookSelect",
            "borrowDate",
            "dueDate"
        ].forEach(id=>{
            document.getElementById(id).value="";
        });

        await Promise.all([
            loadBooks(),
            loadLoans(),
            updateDashboard()
        ]);

        alert("Book loaned successfully.");

    }catch(err){

        console.error(err);
        alert("Unable to loan book.");

    }

}
/ =========================
// LOAD LOANS
// =========================
async function loadLoans(){

    const table=document.getElementById("loanTable");

    table.innerHTML="";

    try{

        const snapshot=await getDocs(loansCollection);

        snapshot.forEach(loanDoc=>{

            const loan=loanDoc.data();

            table.innerHTML += `
            <tr>
                <td>${loan.borrowerName}</td>
                <td>${loan.bookTitle}</td>
                <td>${loan.borrowDate}</td>
                <td>${loan.dueDate}</td>
                <td>${loan.status}</td>
                <td>
                    ${
                        loan.status==="Borrowed"
                        ? `<button onclick="returnBook('${loanDoc.id}','${loan.bookId}')">Return</button>`
                        : "-"
                    }
                </td>
            </tr>
            `;

        });

    }catch(err){

        console.error(err);

    }

}
// =========================
// DELETE BOOK
// =========================

async function deleteBook(id){

    if(!confirm("Delete this book?")) return;

    try{

        await deleteDoc(doc(db,"books",id));

        await Promise.all([
            loadBooks(),
            updateDashboard()
        ]);

    }catch(err){

        console.error(err);

    }

}
// =========================
// DASHBOARD
// =========================
async function updateDashboard(){

    const books=await getDocs(booksCollection);
    const loans=await getDocs(loansCollection);

    document.getElementById("totalBooksCount").textContent=books.size;

    document.getElementById("totalLoansCount").textContent=loans.size;

    let overdue=0;

    const today=new Date();

    loans.forEach(doc=>{

        const loan=doc.data();

        if(
            loan.status==="Borrowed" &&
            new Date(loan.dueDate)<today
        ){
            overdue++;
        }

    });

    document.getElementById("overdueCount").textContent=overdue;

}
// =========================
// GLOBAL FUNCTIONS
// =========================

window.addBook = addBook;
window.deleteBook = deleteBook;

// =========================
// REGISTER THE NEW
// =========================
window.loanBook = loanBook;


// =========================
// START APP
// =========================
window.addBook=addBook;
window.loanBook=loanBook;
window.deleteBook=deleteBook;

async function init(){

    await Promise.all([
        loadBooks(),
        loadLoans(),
        updateDashboard()
    ]);

}

init();
loadBooks();
loadLoans();

