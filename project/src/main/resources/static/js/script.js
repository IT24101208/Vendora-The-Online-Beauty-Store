const form = document.getElementById('registrationForm');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if(password !== confirmPassword){
        alert("Passwords do not match!");
        return;
    }

    // Here, normally you'd send the data to the backend
    alert("Registration successful!");
});