import { useState } from "react";

const InputBox = ({name , type, id, value,icon,  placeholder})=>{

  const [ passwordVisible, setPasswordVisible] = useState(false);

   return (
    <div className="relative w-[100%] mb-4">
         <input
         name={name}
         type={type == "password" ? passwordVisible ?
          "text" :
          "password"
          /*
          this means that if it is password and if the password is visible than set the password as text if not visible then set is as password and if not password at all let all the type be text.
          */ 
          :type}
         placeholder={placeholder}
         defaultValue={value}
         id={id}
         className="input-box"
         />
        
        <i className={"fi " + icon +  " input-icon"}></i>

        {
          type == "password" ?
          <i className={"fi fi-rr-eye" + (!passwordVisible ? "-crossed" : "") + " input-icon left-[auto] right-4 cursor-pointer"}
          onClick = {()=>
            setPasswordVisible(currentVal => !currentVal)
          }
          ></i>  
            :""
        }

    </div>
   )
}
export default InputBox;  