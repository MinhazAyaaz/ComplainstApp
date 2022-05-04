import { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";

function App() {
  const [ocr, setOcr] = useState("");
  const [ocr2, setOcr2] = useState("");
  const [imageData, setImageData] = useState(null);
  const worker = createWorker({
    logger: (m) => {
      console.log(m);
    },
  });
  const convertImageToText = async () => {
    if (!imageData) return;
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(imageData);
    var text2 = text
    // text2 = text.replace(/\\n/g, " ");
    text2 = text2.split('\n')
    // text2 = text2.toString()
    
    console.log(text2)
    var finalString = ""
    var tempString
    // text2.forEach((word)=>{
    //     if(word.length == 10){
    //         finalString = word
    //     }
    // })
    for(var i=0; i<text2.length;i++){
        if(text2[i].length >= 10){
            tempString = text2[i]
            tempString = Array.from(tempString)
            for(var j=0; j<tempString.length; j++){
                if(!isNaN(tempString[j])){
                    finalString = finalString + tempString[j]
                }
            }
            
            console.log(finalString)
        
        }
        if(finalString.length == 10){
            break
        }
    }
    setOcr(finalString);
    setOcr2(text)
  };

  useEffect(() => {
    convertImageToText();
  }, [imageData]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if(!file)return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUri = reader.result;
      console.log({ imageDataUri });
      setImageData(imageDataUri);
    };
    reader.readAsDataURL(file);
  }
  return (
    <div className="App">
      <div>
        <p>Choose an Image</p>
        <input
          type="file"
          name=""
          id=""
          onChange={handleImageChange}
          accept="image/*"
        />
      </div>
      <div className="display-flex">
        <img src={imageData} alt="" srcset="" className="ocrimg" />
        <p>{ocr}</p>
        <p>{ocr2}</p>
      </div>
    </div>
  );
}
export default App;