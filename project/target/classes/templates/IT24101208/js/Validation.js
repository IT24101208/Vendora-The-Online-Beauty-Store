// REGISTER VALIDATION
const registerForm = document.getElementById("registerForm");
if(registerForm){
    registerForm.addEventListener("submit", function(e){
        e.preventDefault();

        let password = document.getElementById("password").value;
        let confirmPassword = document.getElementById("confirmPassword").value;

        if(password.length < 6){
            alert("Password must be at least 6 characters!");
            return;
        }

        if(password !== confirmPassword){
            alert("Passwords do not match!");
            return;
        }

        alert("Registration Successful!");
        window.location.href = "Login.html";
    });
}

// LOGIN VALIDATION
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(e){
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    fetch("http://localhost:8080/api/customers/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(res => {
        if(!res.ok) throw new Error("Invalid login");
        return res.json();
    })
    .then(data => {
        alert("Login Successful!");
        // Optionally save token or user info
        window.location.href = "dashboard.html";
    })
    .catch(err => {
        alert("Login Failed: " + err.message);
    });
});

// UPDATE PASSWORD
const updateForm = document.getElementById("updatePasswordForm");
if(updateForm){
    updateForm.addEventListener("submit", function(e){
        e.preventDefault();

        let newPass = document.getElementById("newPassword").value;
        let confirmNewPass = document.getElementById("confirmNewPassword").value;

        if(newPass !== confirmNewPass){
            alert("Passwords do not match!");
            return;
        }

        alert("Password Updated Successfully!");
        window.location.href = "Login.html";
    });
}