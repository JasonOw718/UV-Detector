import express from "express"
import axios from "axios"
import bodyParser from "body-parser"

const app = express();
const port = 3000;
const CONVERTER_API = "http://api.positionstack.com/v1/forward"
const UV_API = "https://api.openuv.io/api/v1/uv";

const UV_API_KEY = "openuv-3pywdrm0gbenhi-io";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/",(req,res)=>{
    res.render("index.ejs");
})

const config = {
  headers: { "x-access-token": UV_API_KEY },
};
app.post("/submit",async (req,res)=>{
    const address = req.body;
    const unit = address["unit"];
    const street = address["street"];
    const city = address["city"];
    const state = address["state"];
    const poscode = address["poscode"];
    try{
        const url = CONVERTER_API + "?access_key=e125fe0678760509564f0ff7c4c8c3af&query="+`${unit},${street},${poscode},${city},${state}`; 
        const response = await axios.get(url);
        const latitude = response.data.data[0].latitude;
        const longitude = response.data.data[0].longitude;
        const url2 = UV_API + `?lat=${latitude}&lng=${longitude}&alt=98&dt=`;
        const response2 = await axios.get(url2,config);
        res.render("index.ejs",{content:JSON.stringify(response2.data)});
    }catch(error){
        console.log(error);
        res.render("index.ejs",{content:JSON.stringify(error.response.data)});
    }
    
})

app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`);
})