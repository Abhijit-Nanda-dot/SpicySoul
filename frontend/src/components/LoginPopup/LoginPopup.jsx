import React, { useContext } from 'react';
import './LoginPopup.css';
import {useState } from 'react';
import { assets } from '../../assets/assets';
import StoreContext from '../../context/store';
import axios from "axios"


const LoginPopup = ({setShowLogin}) => {

  const{url,setToken} =useContext(StoreContext)
   
   
  

    const[currState,setCurrState] = useState("Login")
    const[data,setData] =useState({
      name:"",
      email:"",
      password:""
    })

    const onChangeHandler=(event)=>{
      const name = event.target.name
      const value=event.target.value;
      setData(data=>({...data,[name]:value}))
    }
    const onLogin =async(event) =>{
      event.preventDefault()

      try {
        let newUrl =url;
        if(currState ==="Login"){
          newUrl+="/api/user/login"
        }
        else{
          newUrl +="/api/user/register"
        }
        const response = await axios.post(newUrl,data);

        if(response.data.success){
          setToken(response.data.token);
          localStorage.setItem("token",response.data.token);
          setShowLogin(false)
        }
        else{
          alert(response.data.message)
        }
      } catch (error) {
        console.error("Error:", error);
        if(error.response){
          alert(error.response.data?.message || "An error occurred. Please try again.");
        } else if(error.request){
          alert("Network error. Please check if the server is running.");
        } else{
          alert("An unexpected error occurred. Please try again.");
        }
      }

    }
    

  return (
    <div className="login-popup">
        <form onSubmit={onLogin} className="login-popup-container">

            <div className="login-popup-title">

                <h2>{currState}</h2>
                <img onClick ={()=>setShowLogin(false)} src={assets.cross_icon} alt=""/>

            </div>

            <div className="login-popup-inputs">

              {currState==="Login"? <></> : <input name='name' onChange={onChangeHandler} value={data.name} type ="text" placeholder="Your Name" required/>}
                <input name='email' onChange={onChangeHandler} value={data.email} type ="email" placeholder="Email" required/>
                <input name='password' onChange={onChangeHandler} value={data.password} type ="password" placeholder="Password" required/>

            </div>
            <button type='submit' > {currState==="Signup"?"Create Account":"Login"} </button>
            <div className="login-popup-condition">
              <input type="checkbox" required/>
              <p>I agree to the Terms of Service and Privacy Policy</p>
            </div>

            {currState==="Login"? 
            <p>Create an new account <span onClick={()=>setCurrState("Signup")}>Click here!</span></p> : 
            <p>Already have an account? <span onClick={()=>setCurrState("Login")}>Login here!</span></p>}

            </form>
    </div>
  );
};

export default LoginPopup;
