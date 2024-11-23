import { Link, Navigate } from "react-router-dom";
import InputBox from "../components/input.component.jsx";
import googleIcon from "../imgs/google.png";
import AnimationWrapper from "../common/page-animation.jsx";
import { useContext, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session.jsx";
import { UserContext } from "../App.jsx";
import { authWithGoogle } from "../common/firebase.jsx";

const UserAuthForm = ({ type }) => {
  

  //importing userAuth => access_token
  let { userAuth : {access_token}, setUserAuth} = useContext(UserContext)

//  console.log(access_token);

  const UserAuthThroughServer = (serverRoute, formData) => {
    
    const base_URL = import.meta.env.VITE_SERVER_DOMAIN + serverRoute;

    
    //making request to the server
    axios
      .post(base_URL, formData)
      //to only get data
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data))
        setUserAuth(data);
      })
      .catch(({ response }) => {
        toast.error(response.data.error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let serverRoute = type == "sign-in" ? "/signin" : "/signup";

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    // retrieve the data from the form
    let form = new FormData(formElement);
    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    // form validation
    let { fullname, email, password } = formData;

    if (fullname) {
      // for signin
      if (fullname.length < 3) {
        return toast.error("Fullname must be at least 3 letters long.");
      }
    }
    if (!email) {
      return toast.error("Email is required.");
    }
    if (!emailRegex.test(email)) {
      return toast.error("Email is invalid.");
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password should be 6 to 20 characters long with a number, at least one lowercase and uppercase letters."
      );
    }

    UserAuthThroughServer(serverRoute, formData);

  };

  
  const handleGoogleAuth=(e)=>{
    //prevents from submiting the form
    e.preventDefault(); 

   authWithGoogle(e).then (user => {
     
      // console.log(user)
      let serverRoute = "/google-auth";
      let formData = {
        access_token : user.accessToken
      }
      

      // console.log(formData)

     UserAuthThroughServer(serverRoute, formData)

    }).catch(err=>{
   toast.error("Trouble Login through google");
   return console.log(err)
    })
  }


  return (
    access_token?
   <Navigate to="/"/>

    :
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-centre justify-center">
        <Toaster />
        <form
          id="formElement"
          onSubmit={handleSubmit}
          className="w-[80%] max-w-[400px]"
        >
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type == "sign-up" ? "Join us Today" : "Welcome back"}
          </h1>

          {type != "sign-in" && (
            <InputBox
              name="fullname"
              id="fullname"
              type="text"
              placeholder="Full Name"
              icon="fi-rr-circle-user"
            />
          )}

          <InputBox
            name="email"
            id="email"
            type="email"
            placeholder="Email Address"
            icon="fi-rr-at"
          />

          <InputBox
            name="password"
            id="password"
            type="password"
            placeholder="Password"
            icon="fi-rr-lock"
          />

          <button className="btn-dark center mt-14" type="submit">
            {type.replace("-", " ")}
          </button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button
            type="button"
            className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
            onClick={handleGoogleAuth}
          >
            <img src={googleIcon} className="w-5" />
            Continue With Google
          </button>
          {type == "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have an account?
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Join us now.
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a member?
              <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign in here.
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
