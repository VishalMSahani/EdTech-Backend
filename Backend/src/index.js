import connectDB from "./database/index.js";
import dotenv, {config} from 'dotenv'
import { app } from "./app.js";

dotenv.config({
    path:"./.env"
});

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 6000, () =>{
        console.log(`Server is running on port: ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("Error in connecting to the database.", error);
})
