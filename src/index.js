const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const {genMes,locatMes}=require('./utils/message')
const{addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    

    socket.on('join',({username,room},callback)=>{
          //to enter a  particular room
        const {error,user}=addUser({id:socket.id,username,room})
         if(error)
         {
            return callback(error)
         }
         socket.join(user.room)
        socket.emit('message', genMes('Admin','Welcome'))
        socket.broadcast.to(user.room).emit('message', genMes('Admin',`${user.username} has joined!`))
    
        callback()
        io.to(user.room).emit('roomData',{
            room: user.room,
            userData: getUsersInRoom(user.room)
        })

    })
     

    socket.on('sendMessage', (message) => {

        const user=getUser(socket.id)
        io.to(user.room).emit('message', genMes(user.username,message))
    })   

    socket.on('sendLocation', (coords) => {
        const user=getUser(socket.id)
        io.to(user.room).emit('locationMessage', locatMes(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
    })
  
    socket.on('disconnect', () => {
        const user=removeUser(socket.id)
        if(user)
        {
            io.to(user.room).emit('message', genMes('Admin',`${user.username} has left!`))
            io.to(user.room).emit('roomData',{
                room: user.room,
                userData: getUsersInRoom(user.room)
            })
       
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})