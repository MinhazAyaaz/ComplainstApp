import React, {useState} from 'react'

function FileUpload() {

    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose File')

    const onChange = (event) =>{
        setFile(event.target.files[0]);
        setFilename(event.target.files[0].name)
    }
  return (
    <>  
        <h1>Hello</h1>
        
        <form>
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