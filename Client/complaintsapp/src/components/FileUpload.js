import React, {useState} from 'react'
import axios from 'axios';

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
    }
  return (
    <>  
        <h1>Hello</h1>
        
        <form onSubmit={onSubmit}>
            <div>
                <input type="file" id="customFile" onChange={onChange}/>
                    <label htmlFor='customFile'>
                        {filename}
                    </label>
            </div>
            <input type='submit' value='Upload'/>
        </form>
        
    </>
  )
}

export default FileUpload