const shelf = document.getElementById("shelf");

// Elements for the add-book modal
const addBookButton = document.getElementById("addBookButton");
const bookModal = document.getElementById("bookModal");
const closeModal = document.getElementById("closeModal");
const bookForm = document.getElementById("bookForm");

// Elements for the book details modal
const detailsModal = document.getElementById("detailsModal");
const closeDetails = document.getElementById("closeDetails");

const detailsTitle = document.getElementById("detailsTitle");
const detailsAuthor = document.getElementById("detailsAuthor");
const detailsGenre = document.getElementById("detailsGenre");

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

const currentPageInput = document.getElementById("currentPage");
const updateProgressButton = document.getElementById("updateProgress");

// LocalStorage key
const storageKey = "readingTrackerBooks";

// Default books
const defaultBooks = [
    {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        pages: 310,
        currentPage: 120,
        genre: "Fantasy"
    },
    {
        title: "Pride & Prejudice",
        author: "Jane Austen",
        pages: 432,
        currentPage: 432,
        genre: "Romance"
    },
    {
        title: "Dune",
        author: "Frank Herbert",
        pages: 412,
        currentPage: 250,
        genre: "Sci-fi"
    },
    {
        title: "Harry Potter",
        author: "J.K. Rowling",
        pages: 309,
        currentPage: 80,
        genre: "Fantasy"
    }
];

// Load saved books from localStorage
const savedBooks = localStorage.getItem(storageKey);

let books = savedBooks
    ? JSON.parse(savedBooks)
    : defaultBooks;

// The currently selected book
let selectedBook = null;


// Save books to localStorage
function saveBooks() {

    localStorage.setItem(
        storageKey,
        JSON.stringify(books)
    );
}


// Display books on the shelf
function displayBooks() {

    shelf.innerHTML = "";

    books.forEach(book => {

        const bookElement = document.createElement("div");

        bookElement.classList.add("book");

        bookElement.classList.add(
            book.genre.toLowerCase().replace(" ", "-")
        );

        // Make the book draggable
        bookElement.setAttribute("draggable", "true");

        const title = document.createElement("span");

        title.textContent = book.title;

        bookElement.appendChild(title);


        // Open book details
        bookElement.addEventListener("click", () => {

            selectedBook = book;

            detailsTitle.textContent = book.title;
            detailsAuthor.textContent = `by ${book.author}`;
            detailsGenre.textContent = book.genre;

            currentPageInput.value = book.currentPage;

            updateProgressDisplay();

            detailsModal.style.display = "flex";
        });


        // Start dragging
        bookElement.addEventListener("dragstart", () => {

            bookElement.classList.add("dragging");

        });


        // Stop dragging
        bookElement.addEventListener("dragend", () => {

            bookElement.classList.remove("dragging");

            saveShelfOrder();

        });


        // Determine where the dragged book should be placed
        bookElement.addEventListener("dragover", (event) => {

            event.preventDefault();

            const draggingBook =
                document.querySelector(".dragging");

            if (!draggingBook || draggingBook === bookElement) {
                return;
            }

            const rect =
                bookElement.getBoundingClientRect();

            const mousePosition =
                event.clientX - rect.left;


            if (mousePosition < rect.width / 2) {

                shelf.insertBefore(
                    draggingBook,
                    bookElement
                );

            } else {

                shelf.insertBefore(
                    draggingBook,
                    bookElement.nextSibling
                );

            }

        });


        shelf.appendChild(bookElement);

    });
}


// Save the current shelf order
function saveShelfOrder() {

    const bookElements =
        shelf.querySelectorAll(".book");

    const newOrder = [];

    bookElements.forEach(bookElement => {

        const title =
            bookElement.querySelector("span").textContent;

        const book =
            books.find(book => book.title === title);

        if (book) {

            newOrder.push(book);

        }

    });

    books = newOrder;

    saveBooks();
}


// Update the reading progress
function updateProgressDisplay() {

    const percentage =
        (selectedBook.currentPage / selectedBook.pages) * 100;

    progressText.textContent =
        `${selectedBook.currentPage} / ${selectedBook.pages} pages`;

    progressFill.style.width =
        `${percentage}%`;
}


// Display books when the page loads
displayBooks();


// Open the add-book modal
addBookButton.addEventListener("click", () => {

    bookModal.style.display = "flex";

});


// Close the add-book modal
closeModal.addEventListener("click", () => {

    bookModal.style.display = "none";

});


// Add a new book
bookForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const title =
        document.getElementById("bookTitle").value;

    const author =
        document.getElementById("bookAuthor").value;

    const pages =
        Number(document.getElementById("bookPages").value);

    const genre =
        document.getElementById("bookGenre").value;


    const newBook = {

        title: title,
        author: author,
        pages: pages,
        currentPage: 0,
        genre: genre

    };


    books.push(newBook);

    saveBooks();

    displayBooks();

    bookForm.reset();

    bookModal.style.display = "none";

});


// Update the reading progress
updateProgressButton.addEventListener("click", () => {

    const newPage =
        Number(currentPageInput.value);


    if (
        newPage < 0 ||
        newPage > selectedBook.pages
    ) {

        alert("Please enter a valid page number.");

        return;
    }


    selectedBook.currentPage = newPage;

    saveBooks();

    updateProgressDisplay();

});


// Close the book details modal
closeDetails.addEventListener("click", () => {

    detailsModal.style.display = "none";

});