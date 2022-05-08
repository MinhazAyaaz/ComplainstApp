import { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";

function App() {
  const [ocr, setOcr] = useState("");
  const [ocr2, setOcr2] = useState("");
  const [imageData, setImageData] = useState(null);
  const [progress, setProgress] = useState(0);
  const worker = createWorker({
    logger: (m) => {
      console.log(m);
      setProgress(parseInt(m.progress*100))
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
    text2 = text2.split('\n')

    console.log(text2)

    var finalString = ""
    var tempString
  
    for(var i=0; i<text2.length;i++){
        if(text2[i].length >= 10){
            tempString = text2[i]
            tempString = Array.from(tempString)
            console.log(tempString)
            for(var j=0; j<tempString.length; j++){
                if(tempString[j]>='0' && tempString[j]<='9'){
                    finalString = finalString + tempString[j]
                    console.log(tempString[j])
                }
            }
        }
        if(finalString.length == 10){
            break
        }else{
            finalString=""
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
      {progress < 100 && progress > 0 && <div>
        <div className="progress-label">Progress ({progress}%)</div>
        <div className="progress-bar">
          <div className="progress" style={{width: `${progress}%`}} ></div>
        </div>
      </div>}
      <div className="display-flex">
        <img src={imageData} alt="" srcset="" className="ocrimg" />
        <p>{ocr}</p>
        <p>{ocr2}</p>
      </div>
    </div>
  );
}
export default App;