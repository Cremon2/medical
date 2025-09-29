// Switch tabs
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
});

signupTab.addEventListener('click', () => {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
});

// Show password
document.getElementById('show-password').addEventListener('change', function () {
    const pw = document.getElementById('login-password');
    pw.type = this.checked ? 'text' : 'password';
});

// Load or create users list in localStorage
// Existing users from localStorage
let users = JSON.parse(localStorage.getItem('users')) || {};

// Default users to ensure exist
const defaultUsers = {
    "admin": { password: "123", role: "admin" },
    "dr.john": { password: "456", role: "doctor" },
    "dr.smith": { password: "654", role: "doctor" },
    "dr.emily": { password: "321", role: "doctor" },
    "jane": { password: "789", role: "patient" },
    "hannah" : { password: "bakit", role: "patient"}
};

// Merge defaults into existing (only add if not already present)
for (const username in defaultUsers) {
    if (!users.hasOwnProperty(username)) {
        users[username] = defaultUsers[username];
    }
}

// Save updated users back to localStorage
localStorage.setItem('users', JSON.stringify(users));


// Login
document.getElementById('login-button').addEventListener('click', () => {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const message = document.getElementById('login-message');

    const user = users[username];

    if (!username) {
        message.textContent = "Please enter your username.";
        document.getElementById('login-username').focus();
        return;
    }
    if (!password) {
        message.textContent = "Please enter your password.";
        document.getElementById('login-password').focus();
        return;
    }
    if (user && user.password === password) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('role', user.role);
        window.location.href = 'index.html';
    } else {
        message.textContent = "Incorrect username or password.";
        document.getElementById('login-username').focus();
    }    
});

// Sign Up
document.getElementById('signup-button').addEventListener('click', () => {
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const retypePassword = document.getElementById('Retype-password').value;
    const message = document.getElementById('signup-message');
    const termsChecked = document.getElementById('terms-checkbox').checked;

    message.style.color = "red";
    message.textContent = "";

    if (!username || !email || !password || !retypePassword) {
        message.textContent = "All fields are required.";
        return;
    }

    if (password !== retypePassword) {
        message.textContent = "Passwords do not match.";
        return;
    }

    if (!termsChecked) {
        message.textContent = "You must agree to the Terms and Conditions.";
        return;
    }

    if (users[username]) {
        message.textContent = "Username already exists.";
        return;
    }

    // Add user (role is fixed to patient)
    users[username] = { email, password, role: "patient" };
    localStorage.setItem('users', JSON.stringify(users));

    message.style.color = "green";
    message.textContent = "Account created! You can now log in.";

    setTimeout(() => {
        if (typeof loginTab !== "undefined") {
            loginTab.click();
        }
        message.textContent = "";
    }, 1500);
});

// Modal functionality
const modal = document.getElementById("terms-modal");
const openModalBtn = document.getElementById("terms-link");
const closeModalBtn = document.querySelector(".close-button");

openModalBtn.addEventListener("click", function (e) {
    e.preventDefault();
    modal.style.display = "block";
});

closeModalBtn.addEventListener("click", function () {
    modal.style.display = "none";
});

window.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});
