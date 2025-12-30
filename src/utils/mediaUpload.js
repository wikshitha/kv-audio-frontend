import { createClient } from "@supabase/supabase-js";

const supabase_url = import.meta.env.VITE_SUPABASE_URL;
const anon_key = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabase_url, anon_key);

export default function mediaUpload(file) {
    return new Promise((resolve,reject)=>{
        if(file == null){
            reject("No file selected");
        }

        const timestamp = new Date().getTime();
        const filename = timestamp+file.name 
    
        supabase.storage.from("images").upload(filename,file,{
            cacheControl: "3600",
            upsert: false
        }).then((response)=>{
            if(response.error){
                console.error("Upload error:", response.error);
                reject(response.error.message || "Error uploading file");
                return;
            }
    
            const publicUrl = supabase.storage.from("images").getPublicUrl(filename).data.publicUrl;
            resolve(publicUrl);
        }).catch((error)=>{
            console.error("Upload catch error:", error);
            reject(error.message || "Error uploading file");
        })
    });

   
}