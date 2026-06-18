import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClientInstance } from "@/lib/query-client";
import { AuthProvider, useAuth } from "@/lib/AuthContext";

import { Toaster } from "@/components/ui/toaster";

import ScrollToTop from "@/components/ScrollToTop";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";

import PageNotFound from "@/lib/PageNotFound";

import Home from "@/pages/Home";
import Collection from "@/pages/Collection";
import KebayaDetail from "@/pages/KebayaDetail";
import Checkout from "@/pages/Checkout";
import SizeGuide from "@/pages/SizeGuide";
import About from "@/pages/About";
import Contact from "@/pages/Contact";

import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminOrders from "@/pages/admin/AdminOrders";


function AuthenticatedApp(){

  const {
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
    navigateToLogin
  } = useAuth();


  if(isLoadingAuth || isLoadingPublicSettings){
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }


  if(authError){

    if(authError.type === "user_not_registered"){
      return <UserNotRegisteredError/>
    }


    if(authError.type === "auth_required"){
      navigateToLogin();
      return null;
    }

  }



  return (
    <Routes>

      <Route path="/" element={<Home/>}/>
      <Route path="/koleksi" element={<Collection/>}/>
      <Route path="/kebaya/:id" element={<KebayaDetail/>}/>
      <Route path="/checkout/:kebayaId" element={<Checkout/>}/>
      <Route path="/ukuran" element={<SizeGuide/>}/>
      <Route path="/tentang" element={<About/>}/>
      <Route path="/kontak" element={<Contact/>}/>


      <Route element={<AdminLayout/>}>

        <Route 
          path="/admin"
          element={<AdminDashboard/>}
        />

        <Route
          path="/admin/produk"
          element={<AdminProducts/>}
        />


        <Route
          path="/admin/pesanan"
          element={<AdminOrders/>}
        />

      </Route>


      <Route path="*" element={<PageNotFound/>}/>


    </Routes>
  )

}




export default function App(){


return (

<AuthProvider>

<QueryClientProvider client={queryClientInstance}>


<Router>

<ScrollToTop/>

<AuthenticatedApp/>


</Router>


<Toaster/>


</QueryClientProvider>


</AuthProvider>


)


}