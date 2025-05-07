import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors'
import { getDataBaseConnection } from './dataBase/db.js';
import authRouters from './routers/routers.js';


const PORT = process.env.PORT || 3000;

// initialize the app
const app = express();
app.use(cors());
app.use(express.json());

//connect to db
getDataBaseConnection();


// routers
app.use('/api/auth',authRouters);
app.use('/api',authRouters);
app.get('/', (req, res) => {
    res.send('Server is up!');
  });



// error router
app.use((req,res)=>{
    res.status(404).json({
        message: 'End point not found. Please check the API document.',
    })
})


app.listen(PORT, ()=>console.log(`Server running at Port ${PORT}`));        