import React, { 
  createContext, 
  useState, 
  useContext, 
  useEffect 
} from "react";


const AuthContext = createContext();


export const AuthProvider = ({children}) => {


  const [user,setUser] = useState(null);

  const [isAuthenticated,setIsAuthenticated] = useState(false);

  const [isLoadingAuth,setIsLoadingAuth] = useState(false);

  const [isLoadingPublicSettings,setIsLoadingPublicSettings] = useState(false);

  const [authError,setAuthError] = useState(null);

  const [authChecked,setAuthChecked] = useState(true);



  useEffect(()=>{

    // public website
    setIsLoadingAuth(false);
    setIsLoadingPublicSettings(false);

  },[]);



  const logout = ()=>{

    setUser(null);
    setIsAuthenticated(false);

  }



  const navigateToLogin = ()=>{

    console.log("Login disabled");

  }




  const checkUserAuth = async () => {
  setIsLoadingAuth(false);
  setIsAuthenticated(false);
  setAuthChecked(true);


    return null;

  }



  const checkAppState = ()=>{

    return null;

  }



return (

<AuthContext.Provider

value={{

user,

isAuthenticated,

isLoadingAuth,

isLoadingPublicSettings,

authError,

authChecked,

logout,

navigateToLogin,

checkUserAuth,

checkAppState

}}

>


{children}


</AuthContext.Provider>


)


}




export const useAuth = ()=>{

const context = useContext(AuthContext);


if(!context){

throw new Error(
"useAuth must be used inside AuthProvider"
)

}


return context;


}