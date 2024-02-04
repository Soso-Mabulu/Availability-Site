// app.js
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("pass");

// Replace this with your actual Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC7tFwWk1NZ5BKr7-JiOpul8f0lbhI2tZE",
    authDomain: "tutoring-app-40e02.firebaseapp.com",
    projectId: "tutoring-app-40e02",
    storageBucket: "tutoring-app-40e02.appspot.com",
    messagingSenderId: "848147097720",
    appId: "1:848147097720:web:f9e6f2dd98240412d6658d",
    measurementId: "G-M6Y7CR7FYJ"
};

firebase.initializeApp(firebaseConfig);

// Create a Firestore reference
const db = firebase.firestore();

// Function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to validate password
function isValidPassword(password) {
    return password.length >= 6;
}

// Function to validate username
function isValidUsername(username) {
    // Basic username validation, you can enhance it as needed
    return username.trim() !== "";
}

// Function to display error on the screen
function displayError(message) {
    const errorContainer = document.getElementById("error-container");
    errorContainer.innerText = message;
}

// Function to register a new user
function register(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const email = emailInput.value;
    const password = passwordInput.value;

    // Validate email, password, and username
    if (!isValidEmail(email)) {
        displayError("Invalid email format");
        return;
    }

    if (!isValidPassword(password)) {
        displayError("Password must be at least 6 characters long");
        return;
    }

    // Register user with Firebase
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Add user information to Firestore
            const userId = userCredential.user.uid;
            db.collection("users").doc(userId).set({
                email: email
            });

            // Registration successful, you can redirect to chat.html or any other page
            window.location.href = "chat.html";
        })
        .catch((error) => {
            displayError("Registration failed: " + error.message + ", please try again");
        });
}

// Function to log in existing user
function login(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const userEmail = email.value;
    const userPassword = passwordInput.value;

    // Validate email and password
    if (!isValidEmail(userEmail)) {
        displayError("Invalid email format");
        return;
    }

    if (!isValidPassword(userPassword)) {
        displayError("Password must be at least 6 characters long");
        return;
    }

    // Log in user with Firebase
    firebase.auth().signInWithEmailAndPassword(userEmail, userPassword)
        .then((userCredential) => {
            // Login successful, you can redirect to chat.html or any other page
            window.location.href = "chat.html";
        })
        .catch((error) => {
            displayError("Login failed: Invalid email or password, please try again");
        });
}
// Check if the user is already logged in, redirect to chat.html if yes
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        window.location.href = "chat.html";
    }
});

// Function to display error on the screen
function displayError(message) {
    const errorContainer = document.getElementById("error-container");
    errorContainer.innerText = message;
}



