```javascript id="bspm7x"
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

        alert("Please enter Title and Author");

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
                createdAt: new Date()
            }
        );

        alert("Book Added Successfully");

        loadBooks();

    } catch (error) {

        console.error(error);

        alert("Error adding book");

    }

}
```
```javascript id="vtz34h"
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

    } catch(error) {

        console.error(error);

    }

}
```
