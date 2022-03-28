import React, {useState} from 'react'
import axios from 'axios';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PublishIcon from '@mui/icons-material/Publish';

function FileUpload() {

    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose File')
    const [uploadedFIle, setUploadedFIle] = useState({})
    const onChange = (event) =>{
        setFile(event.target.files[0]);
        setFilename(event.target.files[0].name)
    }

    const onSubmit = async (event) =>{
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try{
            const res = await axios.post('/uploadId', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "x-access-token": sessionStorage.getItem("jwtkey")
                }
            })
            
            const {fileName, filePath } = res.data;
            setUploadedFIle({fileName, filePath})
        }catch(e){
            console.log(e)
        }
        window.location.reload()
    }
  return (
    <>  

        <form onSubmit={onSubmit}>
            <div >
                <input className="fileUploadBtn" type="file" id="customFile" onChange={onChange}/>
                    <label htmlFor="customFile">
                        { file ? 
                        <div className="fileUpload">
                        <img src={URL.createObjectURL(file)} width="200"/>
                        </div>
                        :
                    <div className="fileUpload">
                            <UploadFileIcon sx={{width: 100, height: 100, color: '#1cacd4'}}/>
                            <p>Drag and drop your <b> scanned ID</b></p>
                
                            <p>or <b>Click Here </b> to upload it</p>
                        </div>
                    }
                        
                    </label>

            </div>
            <div className="uploadAction">
                <p><b>File: </b>{filename}</p>
                <button type='submit' value='Upload'> <PublishIcon/> Upload </button>
            </div>
             </form>
    
    </> 
  )
}

export default FileUpload