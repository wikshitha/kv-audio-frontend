import { useState } from "react";
import mediaUpload from "../utils/mediaUpload";

export default function Testing() {
   const [file, setFile] = useState(null);

   function uploadFile() {
    console.log(file)
    mediaUpload(file).then((url)=>{
        console.log(url)
    })
   }

    return (
        <div className="w-full h-screen flex  justify-center items-center">
          <input type="file" onChange={(e)=>{setFile(e.target.files[0])}}/>
          <button onClick={uploadFile} className="w-[100px] h-[40px] bg-red-600  text-white py-2 rounded-lg hover:bg-red-700 transition duration-200">
            Upload
        </button>
        </div>
    )
}