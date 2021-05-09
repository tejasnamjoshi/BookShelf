class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => this.displayBook(book));
  }

  static remove = (event) => {
    const row = event.target.parentElement.parentElement;
    const isbn = event.target.parentElement.previousElementSibling.textContent;
    document.getElementsByTagName("tbody")[0].removeChild(row);
    this.showAlert("success", "Book successfully removed.");
    Store.removeBook(isbn)
  };

  static showAlert(status, message) {
    const alert = document.createElement("i");
    alert.classList.add(
      "alert",
      `alert-${status === "success" ? "success" : "danger"}`
    );
    alert.textContent = message;

    document.getElementById("alerts").appendChild(alert);
    setTimeout(() => {
      document.getElementById("alerts").removeChild(alert);
    }, 10 * 1000);
  }

  static showError() {
    this.showAlert("error", "Validation Failed. Please enter correct details.");
  }

  static showSuccess() {
    this.showAlert("success", "Book successfully added.");
  }

  static displayBook(book) {
    const tr = document.createElement("tr");

    const titleTd = document.createElement("td");
    titleTd.textContent = book.title;

    const authorTd = document.createElement("td");
    authorTd.textContent = book.author;

    const isbnTd = document.createElement("td");
    isbnTd.textContent = book.isbn;

    const removeTd = document.createElement("td");
    const icon = document.createElement("i");
    icon.classList.add("bi", "bi-x-square-fill", "text-danger");
    icon.setAttribute("role", "button");
    icon.setAttribute("tabIndex", "0");
    removeTd.appendChild(icon);

    icon.addEventListener("click", this.remove);

    tr.appendChild(titleTd);
    tr.appendChild(authorTd);
    tr.appendChild(isbnTd);
    tr.appendChild(removeTd);

    document.getElementsByTagName("tbody")[0].appendChild(tr);
  }

  static clearForm() {
      document.getElementById('title').value = '';
      document.getElementById('author').value = '';
      document.getElementById('isbn').value = '';
  }
}

class Store {

  static parseBook(book) {
    return new Book(book.title, book.author, book.isbn);
  }

  static getBooks() {
    const rawBooks = localStorage.getItem("books");
    let books = [];
    if (rawBooks !== null) {
      books = JSON.parse(rawBooks);
    }

    return books.map((book) => this.parseBook(book));
  }

  static saveBook(book) {
    const books = this.getBooks();
    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {    
    let books = this.getBooks();

    books.forEach((book, index) => {
        if(book.isbn === isbn) books.splice(index, 1);
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

const handleBookSubmit = (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;

  const book = new Book(title, author, isbn);

  const isValid = (book) => {
    return book.title !== "" || book.author !== "" || book.isbn !== "";
  };

  if (isValid(book)) {
    UI.displayBook(book);
    UI.showSuccess();
    Store.saveBook(book);
    UI.clearForm();
  } else {
    UI.showError();
  }
};

document.getElementById('book-form').addEventListener("submit", handleBookSubmit);

document.addEventListener("DOMContentLoaded", UI.displayBooks());
