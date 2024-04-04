import connectDB from "./database/index.js";
import dotenv, {config} from 'dotenv'

dotenv.config({
    path:"./.env"
});

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 800, () =>{
        console.log(`Server is running on port: ${process.env.PORT}`);
    })
})
.then((error)=>{
    console.log("Error in connecting to the database.", error);
})
