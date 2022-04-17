import React, {useState} from 'react'
import axios from 'axios';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PublishIcon from '@mui/icons-material/Publish';
import { storage } from '../firebase';
import { Button } from '@mui/material';

import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";


function FileUpload() {
    const [progress, setProgress] = useState(0);
    const [urldata, seturldata] = React.useState('');
    const formHandler = (e) => {
        e.preventDefault();
        const file = e.target[0].files[0];
        uploadFiles(file);
    
  /*      axios.put('/uploadId', {
        idscan: {urldata},
        nsuid: '0123456789'
      })
      .then(function (response) {
        console.log(response);
        window.location.reload()
      })
      .catch(function (error) {
        console.log(error);
        alert(error);
      }); */
      
    };
    const handlechange2 =(e) => {
      console.log(urldata);
      axios.put('/uploadstuff', {
        idscan: urldata
        
      },{headers: {
        "x-access-token": sessionStorage.getItem("jwtkey")
      },
      params: {
        id: 12345
      }}
      )
      .then(function (response) {
        console.log(response);
        window.location.reload()
       
      })
      .catch(function (error) {
        console.log(error);
        alert(error);
      });
   
     
    };
   
    const uploadFiles = (file) => {
        //
        if (!file) return;
        const sotrageRef = ref(storage, `id/${file.name}`);
        const uploadTask = uploadBytesResumable(sotrageRef, file);
    
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const prog = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(prog);
          },
          (error) => console.log(error),
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              
              seturldata(""+downloadURL);
              console.log(downloadURL)
            });
            
          }
        );
        
       
        
      };
  return (
      
    <>  

<div >
      <form onSubmit={formHandler}>
        <input type="file" className="input" />
        <button  type="submit">Upload</button>
       
        
       
      </form>
      <hr />
      <h2>Uploading done{progress}%</h2>
    </div>
    <Button onClick={handlechange2} variant="outlined" >save</Button>
    </> 
  )
}

export default FileUpload
