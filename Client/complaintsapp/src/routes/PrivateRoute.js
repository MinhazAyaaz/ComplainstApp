import React from 'react';
import {Navigate} from "react-router-dom";
import {useState} from 'react'

export default function PrivateRoute( {children} ) {
    const [jwt, setJwt] = useState(sessionStorage.getItem("jwtkey"))
  return (
    jwt ? children : <Navigate to="/login"/>
  )
}
