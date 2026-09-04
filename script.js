// Elements for the bookshelf

const shelf1 = document.getElementById("shelf1");
const shelf2 = document.getElementById("shelf2");
const shelf3 = document.getElementById("shelf3");


// Elements for the add-book modal

const addBookButton = document.getElementById("addBookButton");
const bookModal = document.getElementById("bookModal");
const closeModal = document.getElementById("closeModal");
const bookForm = document.getElementById("bookForm");


// Elements for the book search

const bookSearch = document.getElementById("bookSearch");
const searchButton = document.getElementById("searchButton");
const searchResults = document.getElementById("searchResults");


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


// Book spine images

const genreImages = {
    "Fantasy": "images/book-spines/fantasy.png",
    "Romance": "images/book-spines/romance.png",
    "Science Fiction": "images/book-spines/science-fiction.png",
    "Sci-fi": "images/book-spines/science-fiction.png",
    "Mystery": "images/book-spines/mystery.png",
    "Thriller": "images/book-spines/thriller.png",
    "Horror": "images/book-spines/horror.png",
    "Crime": "images/book-spines/crime.png",
    "Dark Romance": "images/book-spines/dark-romance.png",
    "Historical Fiction": "images/book-spines/historical-fiction.png",
    "Young Adult": "images/book-spines/young-adult.png"
};


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
        genre: "Science Fiction"
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


// Search for books using the Open Library API

async function searchBooks() {

    const query = bookSearch.value.trim();

    if (!query) {
        return;
    }

    searchResults.innerHTML = "Searching...";

    try {

        const response = await fetch(
            `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=5&fields=key,title,author_name,cover_i,cover_edition_key,number_of_pages,number_of_pages_median`
        );

        const data = await response.json();

        console.log(data.docs);

        displaySearchResults(data.docs);

    } catch (error) {

        console.error("Error searching for books:", error);

        searchResults.innerHTML =
            "Something went wrong. Please try again.";
    }
}


// Display search results

function displaySearchResults(results) {

    searchResults.innerHTML = "";

    if (results.length === 0) {

        searchResults.innerHTML = "No books found.";

        return;
    }

    results.forEach(book => {

        const result = document.createElement("div");

        result.classList.add("search-result");


        // Create book cover

        const cover = document.createElement("img");

        if (book.cover_i) {

            cover.src =
                `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;

            cover.alt =
                `Cover of ${book.title}`;

        } else {

            cover.style.display = "none";
        }


        // Create book information

        const info = document.createElement("div");

        info.classList.add("search-result-info");


        // Title

        const title = document.createElement("h3");

        title.textContent =
            book.title || "Unknown title";


        // Author

        const author = document.createElement("p");

        author.textContent =
            book.author_name
                ? book.author_name[0]
                : "Unknown author";


        // Page count

        const pages = document.createElement("p");

        if (book.number_of_pages) {

            pages.textContent =
                `${book.number_of_pages} pages`;

        } else if (book.number_of_pages_median) {

            pages.textContent =
                `${book.number_of_pages_median} pages`;

        } else {

            pages.textContent =
                "Page count unknown";
        }


        info.appendChild(title);
        info.appendChild(author);
        info.appendChild(pages);


        result.appendChild(cover);
        result.appendChild(info);


        // Select book from search results

        result.addEventListener("click", () => {

            document.getElementById("bookTitle").value =
                book.title || "";

            document.getElementById("bookAuthor").value =
                book.author_name
                    ? book.author_name[0]
                    : "";

            document.getElementById("bookPages").value =
                book.number_of_pages ||
                book.number_of_pages_median ||
                "";

            searchResults.innerHTML =
                "<p>Book selected. Please choose a genre and add the book.";

        });


        searchResults.appendChild(result);

    });
}


// Display books on the bookshelf

function displayBooks() {

    shelf1.innerHTML = "";
    shelf2.innerHTML = "";
    shelf3.innerHTML = "";


    books.forEach((book, index) => {

        const bookElement = createBookElement(book);


        // Divide books between the three shelves

        if (index < 4) {

            shelf1.appendChild(bookElement);

        } else if (index < 8) {

            shelf2.appendChild(bookElement);

        } else {

            shelf3.appendChild(bookElement);
        }

    });
}


// Create a book element

function createBookElement(book) {

    const bookElement = document.createElement("div");

    bookElement.classList.add("book");


    // Add the genre-specific book spine

    if (genreImages[book.genre]) {

        bookElement.style.backgroundImage =
            `url("${genreImages[book.genre]}")`;
    }


    // Make the book draggable

    bookElement.setAttribute("draggable", "true");


    // Add the book title

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


    return bookElement;
}


// Drag and drop between shelves

const shelves = [shelf1, shelf2, shelf3];

shelves.forEach(shelf => {

    shelf.addEventListener("dragover", event => {

        event.preventDefault();

        const draggingBook =
            document.querySelector(".dragging");

        if (!draggingBook) {
            return;
        }


        const booksInShelf =
            [...shelf.querySelectorAll(".book:not(.dragging)")];

        const afterElement =
            getDragAfterElement(shelf, event.clientX);


        if (afterElement == null) {

            shelf.appendChild(draggingBook);

        } else {

            shelf.insertBefore(
                draggingBook,
                afterElement
            );
        }

    });

});


// Find the book that should come after the dragged book

function getDragAfterElement(shelf, x) {

    const bookElements =
        [...shelf.querySelectorAll(".book:not(.dragging)")];

    return bookElements.reduce(
        (closest, child) => {

            const box =
                child.getBoundingClientRect();

            const offset =
                x - box.left - box.width / 2;


            if (offset < 0 && offset > closest.offset) {

                return {
                    offset: offset,
                    element: child
                };

            } else {

                return closest;
            }

        },
        {
            offset: Number.NEGATIVE_INFINITY
        }
    ).element;
}


// Save the current shelf order

function saveShelfOrder() {

    const newOrder = [];


    shelves.forEach(shelf => {

        const bookElements =
            shelf.querySelectorAll(".book");


        bookElements.forEach(bookElement => {

            const title =
                bookElement.querySelector("span").textContent;


            const book =
                books.find(book => book.title === title);


            if (book) {

                newOrder.push(book);
            }

        });

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

bookForm.addEventListener("submit", event => {

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


// Search for books

searchButton.addEventListener("click", searchBooks);


// Allow searching with the Enter key

bookSearch.addEventListener("keydown", event => {

    if (event.key === "Enter") {

        searchBooks();

    }

});


// Go to reading mode

const goReadButton =
    document.getElementById("goReadButton");

goReadButton.addEventListener("click", () => {

    window.location.href = "reading.html";

});