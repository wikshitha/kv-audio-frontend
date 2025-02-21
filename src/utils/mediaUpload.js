import { createClient } from "@supabase/supabase-js";

const anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaWxmeXVleXJ1a3BucHN4cmpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNDc3ODYsImV4cCI6MjA1NTcyMzc4Nn0.mkToRcBi59Ui5DBzuI0lClomM1BzBfjlxmHdRIRYcqM";
const superbase_url = "https://qailfyueyrukpnpsxrjo.supabase.co";

const superbase = createClient(superbase_url, anon_key);

export default function mediaUpload(file) {
    return new Promise((resolve,reject)=>{
        if(file == null){
            reject("No file selected");
        }

        const timestamp = new Date().getTime();
        const filename = timestamp+file.name 
    
        superbase.storage.from("images").upload(filename,file,{
            cacheControl: "3600",
            upsert: false
        }).then(()=>{
    
            const publicUrl = superbase.storage.from("images").getPublicUrl(filename).data.publicUrl;
            resolve(publicUrl);
        }).catch(()=>{
            reject("Error uploading file");
        })
    });

   
}