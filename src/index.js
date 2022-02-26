const express = require('express');
const app = express();
const server = require("http").createServer(app);
const cors = require('cors');
const port = process.env.PORT ||5000;
app.use(cors());
app.get('/',(req,res)=>{
    res.send("connected to server");
})
const io = require('socket.io')(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
})
io.on('connection',(socket)=>{
    socket.emit('me',socket.id);
    socket.on('disconnect',()=>{
        socket.broadcast.emit("callended");
    });
    socket.on("calluser",({userToCall , signalData,from, name})=>{
        io.to(userToCall).emit("clasUser",{signal:signalData, from , name})
    });
    socket.on("answerCall",(data)=>{
        io.to(data.to).emit("call accepted", data.signal);
    });
})
server.listen(port,(req,res)=>{
    console.log(`connected at localhost:${port}`);
})