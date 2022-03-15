import React, { useState, useContext } from 'react'

const NavBar = ({ toggle }) => {

  const loginToken = localStorage.getItem('loginToken1');
  let loggedIn = false;
  // If inside the local-storage has the JWT token
  if(loginToken){
    loggedIn = true;
  }else{
    loggedIn = false
  }

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const modalStyle = {
    content: {
      top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height:'400px'
    }
  };
  return(
    <>

    
    </>
  )
}

export default NavBar;
