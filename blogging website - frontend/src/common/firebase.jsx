
import { initializeApp } from "firebase/app";
import  {getAuth, GoogleAuthProvider, signInWithPopup}  from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBgOnHyfmRBzHfRnLDqvRYhx3lKh5JE-kk",
  authDomain: "mern-blogging-website-c0b9f.firebaseapp.com",
  projectId: "mern-blogging-website-c0b9f",
  storageBucket: "mern-blogging-website-c0b9f.firebasestorage.app",
  messagingSenderId: "1043339175174",
  appId: "1:1043339175174:web:b18d0f9556b124c870ea87"
};


const app = initializeApp(firebaseConfig);

//google auth

const provider = new GoogleAuthProvider();
const auth = getAuth();

export const authWithGoogle = async ()=>{
    let user = null;

    await signInWithPopup(auth, provider)
    .then((result)=>{
      // we get a lot of information but we only want the user info
      user=result.user
    })
    .catch((err)=>{
      console.log(err)
    })

    return user;
}