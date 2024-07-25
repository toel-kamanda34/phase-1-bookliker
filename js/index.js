const currentUser = { id: 1, username: "pouros" };

// fetch books and display titles
function fetchAndDisplayBooks() {
    fetch('http://localhost:3000/books')
        .then(response => response.json())
        .then(books => {
            const bookList = document.getElementById('list');
            books.forEach(book => {
                const li = document.createElement('li');
                li.textContent = book.title;
                li.addEventListener('click', () => displayBookDetails(book));
                bookList.appendChild(li);
            });
        });
}

// display book details
function displayBookDetails(book) {
    const showPanel = document.getElementById('show-panel');
    showPanel.innerHTML = `
        <h2>${book.title}</h2>
        <img src="${book.img_url}" alt="${book.title}">
        <p>${book.description}</p>
        <h3>Liked by:</h3>
        <ul id="likes-list"></ul>
        <button id="like-button">${book.users.some(user => user.id === currentUser.id) ? 'Unlike' : 'Like'}</button>
    `;

    const likesList = document.getElementById('likes-list');
    book.users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user.username;
        likesList.appendChild(li);
    });

    const likeButton = document.getElementById('like-button');
    likeButton.addEventListener('click', () => toggleLike(book));
}

// toggle like/unlike
function toggleLike(book) {
    const isLiked = book.users.some(user => user.id === currentUser.id);
    let newUsers;

    if (isLiked) {
        newUsers = book.users.filter(user => user.id !== currentUser.id);
    } else {
        newUsers = [...book.users, currentUser];
    }

    fetch(`http://localhost:3000/books/${book.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ users: newUsers }),
    })
    .then(response => response.json())
    .then(updatedBook => {
        displayBookDetails(updatedBook);
    });
}

document.addEventListener('DOMContentLoaded', fetchAndDisplayBooks);