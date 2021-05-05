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
  
  // Set variables
  let logout = document.querySelector("#logout");
  let userName = document.querySelector(".userName");
  let userEmail = document.querySelector(".userEmail");
  let fullName = document.querySelector(".fullName");
  let desc = document.querySelector(".desc");
  let createBtn = document.querySelector(".create-post");
  let closeForm = document.querySelector(".close");
  let modal = document.querySelector(".post-modal");
  let postForm = document.querySelector(".post-form");
  let postBtn = document.querySelector(".postBtn");
  let alertMsg = document.querySelector(".alertMsg");
  let allPosts = document.querySelector(".allPosts");
  let postDisplay = document.querySelector(".post-display");
 

  logout.addEventListener("click", () => {
  firebase.auth().signOut().then(() => {
    window.location.href = "login.html";
    console.log(currentUser.email + " is logged out");
  }).catch((error) => {
      console.log(error.message);
  });
 
  });
  
  //create post
  createBtn.addEventListener("click", (e) => {
    modal.style.display = "block";
    e.preventDefault();
  });

closeForm.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "none";
})

window.addEventListener("click", (e) => {
  if(e.target === modal) {
    modal.style.display = "none"
  
  }
});

// upload image to firebase storage
let ImgUrl;
let storageRef = firebase.storage().ref("Images");
let uploadData = () => {
  let file = document.getElementById("files").files[0];
  let thisRef = storageRef.child(file.name);
  thisRef.put(file).then(snapshot => {
    snapshot.ref.getDownloadURL().then(url => {
      ImgUrl = url;
    });
    console.log("upload success");
    alertMsg.innerHTML = "Upload success";
    
  }).catch(e => {
   
    console.log(e);
  });
 
}
  // upload blog post to firebase database
  postForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Set Date
  let d = new Date();
  let date = d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear();

      displayUser();
      let id = database.ref().child('posts' + uid).push().key;
      let title =  document.querySelector("#title").value;
    let subject = document.querySelector("#subject").value;
    let postedBy = username;
    writeUserData(id, title, subject, ImgUrl, postedBy, date);
  
    postForm.reset();
    modal.style.display = "none";
    alertMsg.innerHTML="";
    ImgUrl = "";
    
  });

 


  

 let showPost =  database.ref('posts/');
     showPost.on("value", (snapshot) => {
      allPosts.innerHTML = "";
      displayUser();
     
      snapshot.forEach((childsnapshot) => {
        childsnapshot.forEach(postsnap => {
          
        let post = postsnap.val();
        let postList = document.createElement("li");
        let postKey = postsnap.key;
        postList.setAttribute("data-key", postKey);
        
        let deleteBtn = document.createElement("button");
        deleteBtn.setAttribute("class", "fas fa-minus-square");
        deleteBtn.setAttribute("id", "delete-post");

       postList.classList.add("postList");
       if(post.imgUrl != null) {
       postList.innerHTML = `<h2 class="postTitle">${post.title}</h2>
       <span class="postDate">posted by ${post.postedBy}, ${post.date}</span>
       <img src = "${post.imgUrl}">
       <p class="postText">${post.subject}</p>`;
       }
       else { 
        
        postList.innerHTML = `<h2 class="postTitle">${post.title}</h2>
        <span class="postDate">posted by ${post.postedBy}, ${post.date}</span>
        <p class="postText">${post.subject}</p>`;
       }

       if(childsnapshot.key === uid) {
       deleteBtn.setAttribute("onclick", "deletePost(this)");
       postList.appendChild(deleteBtn);
       }
  
       allPosts.appendChild(postList);

      });
      });
      
    });
   //delete post
    deletePost = (e) =>  {
      const post = e.parentElement;
      const key = post.getAttribute('data-key');
      firebase.database().ref('posts').child(uid).child(key).set(null).then(e => {
      post.innerHTML = "";
      });    
  }
    // write post in firebase database
  let writeUserData = (id, title, subject, imgUrl, postedBy, date) => {

    if(imgUrl != null) {
  
     database.ref('posts/'+ uid + '/' + id).set({
       title : title,
       subject : subject,
       imgUrl : imgUrl,
       postedBy : postedBy,
       date : date,
       
     });
    } else {
      
     database.ref('posts/'+ uid + '/' + id).set({
      title : title,
      subject : subject,
      postedBy : postedBy,
      date : date,
      
    });

    }
  }

  let displayUser = () => {
    let user = firebase.auth().currentUser;
    if(user != null) {
      uid = user.uid;
      username = user.displayName;
      
     
      
    }
  }
  

 // if(childsnapshot.key === uid) {}

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user.displayName + " has logged in");
      userName.innerHTML = user.displayName;
    } else {
      console.log("User has logged out");
    }
  });

 
// scroll to top with button
let toTop = document.querySelector(".to-top");

let scrollToTop = () => {
let position = document.body.scrollTop  || document.documentElement.scrollTop;
if(position) {
  window.scrollTo({top: 0, behavior: 'smooth'});
} 

}
