const express=require('express');
const cors=require('cors');
const cookieParser=require('cookie-parser');
require('dotenv').config()
const userRouter=require('./src/routes/UserRoutes');
const PORT=5000;

//Connect to database
require('./src/config/db.js');

const app=express();
app.use('/api/user',userRouter)

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get('/',(req,res)=>{
res.send('Server created successfully!');
})

app.listen(PORT,console.log(`Server running on Port: ${PORT}`));