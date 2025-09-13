const checkbox = document.getElementById('checkbox');
const passwordInput = document.getElementById('password');
const submit = document.getElementById('submit');

const users = {
    "mon": "123" // username: password
};

checkbox.addEventListener('change', function () {
    passwordInput.type = this.checked ? 'text' : 'password';
});

submit.addEventListener('click', function () {
    const usernameInput = document.getElementById('username').value;
    const password = passwordInput.value;

    if (users[usernameInput] === password) {
        console.log("Login successful");
        // Redirect to index.html
        window.location.href = 'index.html';
    } else {
        console.log("Wrong credentials");
    }
});
