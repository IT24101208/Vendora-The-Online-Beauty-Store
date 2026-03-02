// Registration Validation
function registerValidation() {

let password =
document.getElementById("password").value;

let confirmPassword =
document.getElementById("confirmPassword").value;

if(password !== confirmPassword){
alert("Passwords do not match!");
return false;
}

alert("Registration Successful!");
return true;
}


// Login Validation + Role Redirect
function loginValidation(){

let role =
document.getElementById("role").value;

if(role === "admin"){
window.location.href="dashboard.html?role=admin";
}
else if(role === "customer"){
window.location.href="dashboard.html?role=customer";
}
else if(role === "delivery"){
window.location.href="dashboard.html?role=delivery";
}
else{
window.location.href="dashboard.html?role=supplier";
}

return false;
}


// Admin Login Check
function adminLoginValidation(){

let email =
document.getElementById("adminEmail").value;

let password =
document.getElementById("adminPassword").value;

if(email==="admin@vendora.com"
&& password==="admin123"){

window.location.href=
"dashboard.html?role=admin";
return false;
}

document.getElementById("error")
.innerText="Invalid Admin Credentials";

return false;
}