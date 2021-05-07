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

  let closeForm = document.querySelector(".close");
  let loader = document.querySelector(".loader");
  
 // logout button
  logout.addEventListener("click", () => {
  firebase.auth().signOut().then(() => {
    window.location.href = "login.html";
    console.log(currentUser.email + " is logged out");
  }).catch((error) => {
      console.log(error.message);
  });
  });

  closeForm.addEventListener("click", (e) => {
    e.preventDefault();
    showModal.style.display = "none";
  })
  
  window.addEventListener("click", (e) => {
    if(e.target ===  showModal) {
      showModal.style.display = "none"
    
    }
  });

// Set Date
let d = new Date();
let date = d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear();

  let displayUser = () => {
    let user = firebase.auth().currentUser;
    if(user != null) {
      uid = user.uid;
      username = user.displayName;
    
    }
  }

  let loginMsg = document.querySelector(".login-msg");
  
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user.displayName + " has logged in");
     
    } else {
      loginMsg.style.display = "block";
      loginMsg.innerHTML = `<h2>You are not logged in, redirecting to login page</h2>`;
     
      loader.style.display = "block";
      setTimeout(() => {
      
        window.location.href = "login.html";
        loader.style.display = "none";
        
      },  3000);
      console.log("User has logged out");
    }
  });

  //set variables
 let showUser = document.querySelector(".show-user");
  let getData = database.ref('users/');

  getData.on('value', snap => {
    displayUser();
   
    snap.forEach(data => {
        userInfo = data.val();
        if(userInfo.uid === uid) {
            
        
    let showProfile = document.createElement("div");
        showProfile.classList.add("show-profile");

        showProfile.innerHTML = `<h3 class="nickname">${userInfo.username}</h3>
        <span class="description">${userInfo.desc}</span>
        <p class="full-name">${userInfo.fullname}</p>
        <p class="show-email">${userInfo.email}</p>`;
        showUser.appendChild(showProfile);

    }
        
    });
  });
 
    

let editBtn = document.querySelector(".open-update");
let updateBtn = document.querySelector(".updateBtn");
let userForm = document.querySelector(".user-form");
let showModal = document.querySelector(".modal-user");

editBtn.addEventListener("click", e => {
  e.preventDefault();
  showModal.style.display = "block";
});


userForm.addEventListener("submit", e => {
  e.preventDefault();
  let birthday = document.querySelector("#birthday").value;
let skills = document.querySelector("#skills").value;
let phone = document.querySelector("#phone").value;
let education = document.querySelector("#edu").value;
let interested = document.querySelector("#interested").value;
let bio = document.querySelector("#bio").value;

updateUser(birthday, skills, phone, education, interested, bio);


showModal.style.display = "none";
  userForm.reset();
});

let showUpdate = document.querySelector(".show-update");
let getUpdate = database.ref("profiles/");

getUpdate.on("value", snap => {
  displayUser();
  
  snap.forEach(snapchild => {
   if(snapchild.key === uid) {
    profile = snapchild.val();

    let showData = document.createElement("div");
    showData.classList.add("show-data");

    showData.innerHTML =
     `<table id="profile">
    <tr>
      <td>Date of birth:</td>
      <td>${profile.birth}</td>
    </tr>
    <tr>
    <td>Phone:</td>
    <td>${profile.phone}</td>
    </tr>
    <tr>
    <td>Education:</td>
    <td>${profile.education}</td>
    </tr>
    <tr>
    <td>Interested in:</td>
    <td>${profile.interested}</td>
    </tr>
    <tr>
    <td>Skills:</td>
    <td>${profile.skills}</td>
    </tr>
    <tr>
    <td>Bio:</td>
    <td>${profile.bio}</td>
    </tr>
    </table>`;
    showUser.appendChild(showData);
    
  }
  })
});

let updateUser = (birth, skills, phone, education, interested, bio) => {
  let postData = {
    birth : birth,
    skills : skills,
    phone : phone,
    education : education,
    interested : interested,
    bio : bio,
  };

  let newUpdateKey = database.ref('users').push().key;

  let updates = {};
  updates['profiles/' + uid] = postData;

  return database.ref().update(updates);
}


let deleteProfile = document.querySelector(".delete-profile");

deleteProfile.addEventListener("click", e => {
  e.preventDefault();
  let user = firebase.auth().currentUser;
console.log(user);
if(user.uid === uid) {
  
  database.ref('users').child(uid).set(null);
  database.ref('profiles').child(uid).set(null);  
user.delete().then(() => {
  showUser.innerHTML = "";
  window.href = "login.html";
}).catch(error => {
  console.log(error.message);
});
}
});