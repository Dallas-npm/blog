// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyClvPD7udhXktA_KRvVUGpRaH94It6vwvk",
  authDomain: "my-blog-3f61d.firebaseapp.com",
  projectId: "my-blog-3f61d",
  storageBucket: "my-blog-3f61d.appspot.com",
  messagingSenderId: "1018007727599",
  appId: "1:1018007727599:web:521095981a08c267b21a1a"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Set database variable
let database = firebase.database();

// Open & Close Register form
let signIn = document.getElementById("signIn");
let register = document.getElementById("register");
let form = document.getElementById("form");
let cancelBtn = document.querySelector(".cancelBtn");
let loginCancel = document.querySelector(".loginCancel");
let regBtn = document.querySelector(".regBtn");
let formRegister = document.querySelector(".form-register");
let formLogin = document.querySelector(".form-login");
let loader = document.querySelector(".loader");
let inputError = document.querySelector(".input-error");
let registerError =  document.querySelector(".register-error");
let about = document.querySelector(".about-page");

register.onclick = () => {
  formRegister.style.display = "block";
  about.style.display = "none";
  document.body.style.backgroundColor = "rgba(0, 0, 0, 0.75)"; 
  formLogin.style.display = "none";
  
}

cancelBtn.addEventListener("click", () => {
  formRegister.style.display = "none";
  formRegister.reset();
  about.style.display = "block";
  registerError.innerHTML = "";
  document.body.style.backgroundColor = "#0f0e17"; 
});

loginCancel.addEventListener("click", () => {  
  formLogin.style.display = "none";
  formLogin.reset();
  about.style.display = "block";
  inputError.innerHTML = "";
  document.body.style.backgroundColor = "#0f0e17"; 
  
});

// close form when you click anywhere on screen
window.addEventListener("click", (e) => {
  if(e.target == form) {
      formRegister.style.display = "none";
      formLogin.style.display = "none";
      formRegister.reset();
      about.style.display = "block";
      registerError.innerHTML = "";
      inputError.innerHTML = "";
      document.body.style.backgroundColor = "#0f0e17";
  }
});

signIn.addEventListener("click", () => {
  formLogin.style.display = "block";
  formRegister.style.display = "none";
  about.style.display = "none";
  document.body.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
 
});


formRegister.addEventListener("submit", (e) => {
  e.preventDefault();

  let email = document.querySelector("#email").value;
  let password = document.querySelector("#psw").value;

  firebase.auth().createUserWithEmailAndPassword(email, password).then((cred) => {
    // Signed in 
    updateuserData();
    let user = cred.user;
    return database.ref('users/' + user.uid).set({
      uid : user.uid,
      username: document.querySelector("#name").value,
      fullname: document.querySelector("#fullName").value,
      desc: document.querySelector("#desc").value,
      email: user.email,
    });
    
  }).then(() => {
    formRegister.reset();
    formRegister.style.display = "none";
    loader.style.display = "block";
    setTimeout(() => {
      window.location.href = "index.html";
      }, 2000);
  
  })
  .catch((error) => {
    let errorMessage = error.message;
   registerError.innerHTML = `<p>${errorMessage}</p>`;
    // ..
  });

});




formLogin.addEventListener("submit", (e) => {
  e.preventDefault();

  let email = document.querySelector("#uemail").value;
  let password = document.querySelector("#upsw").value;

  firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
    let user = userCredential.user;
    formLogin.style.display = "none";
    loader.style.display = "block";
    setTimeout(() => {
    window.location.href = "index.html";
    }, 2000);
  })
  .catch((error) => {
    let errorCode = error.code;
    let errorMessage = error.message;
    inputError.innerHTML = `<p>${errorMessage} Please use valid email and password</p>`;
    
  });

  formLogin.reset();
  
 
});

let updateuserData = () => {
let user = firebase.auth().currentUser;

user.updateProfile({
  displayName: document.querySelector("#name").value,
}).then(function() {

  // Update successful.
  console.log("update successful");
}).catch(function(error) {
  console.log("update not successful");
  // An error happened.
});
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log(user.displayName + " has logged in");
   
    // ...
  } else {
    console.log("User has logged out");
    // User is signed out
    // ...
  }
});


