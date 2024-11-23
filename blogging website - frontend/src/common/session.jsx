const storeInSession = (key, value) =>{

 return  sessionStorage.setItem(key,value);

}

const  lookInSession = (key)=>{

  return sessionStorage.getItem(key)
 
}
const  removeFromSession = (key)=>{

  return sessionStorage.removeItem(key)
}
const  logOutUser = ()=>{

sessionStorage.clear();
setUserAuth({ access_token: null });  // Reset auth context
  // Optionally redirect to login page
  navigate('/signin');
}

export {
  storeInSession,
  lookInSession,
  removeFromSession,
  logOutUser
}