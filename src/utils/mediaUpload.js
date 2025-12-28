import { createClient } from "@supabase/supabase-js";

const anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwaWtmY2xocW15ZHZvcW1zZGprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MjQ2MjcsImV4cCI6MjA4MjUwMDYyN30.XIK4p1YUU2Xuq-bu3zt7L-0GxSIyMjQdfCps74fSd2I";
const superbase_url = "https://apikfclhqmydvoqmsdjk.supabase.co";

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