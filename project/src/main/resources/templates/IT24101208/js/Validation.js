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
if(loginForm){
    loginForm.addEventListener("submit", function(e){
        e.preventDefault();
        alert("Login Successful!");
        window.location.href = "dashboard.html";
    });
}

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