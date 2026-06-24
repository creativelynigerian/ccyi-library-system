
async function loadBooks() {

    const table = document.getElementById("bookTable");
    const dropdown = document.getElementById("loanBookSelect");

    if (!table) return;

    table.innerHTML = "";

    if (dropdown) {
        dropdown.innerHTML =
            '<option value="">Select Book</option>';
    }

    try {

        const snapshot =
            await getDocs(booksCollection);

        snapshot.forEach((docItem) => {

            const book = docItem.data();

            const row = `
                <tr>
                    <td>${book.title || ""}</td>
                    <td>${book.author || ""}</td>
                    <td>${book.isbn || ""}</td>
                    <td>${book.category || ""}</td>
                    <td>${book.quantity || 0}</td>
                    <td>
                        <button onclick="deleteBook('${docItem.id}')">
                            Delete
                        </button>
                    </td>
                </tr>
            `;

            table.innerHTML += row;

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


// Make functions available to HTML buttons

window.addBook = addBook;
window.deleteBook = deleteBook;
window.loadBooks = loadBooks;

