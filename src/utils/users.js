// add user // remove user // getuser // getusersinroom
const users=[]

const addUser=({id,username,room})=>{

    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    if(!username || !room )
      {
          return {error: 'User and Room must be there'}
      }

   const existingUser=users.find((user)=>{
       return user.username===username&&user.room===room
   })
 
   if(existingUser)
    {
        return {error: 'User already exist'}
    }

   const user={id,username,room}

   users.push(user)
   return {user}
}


const removeUser=(id)=>{
   const index=users.findIndex((user)=>{
       return user.id===id
   })
   if(index !== -1)
   {
       return users.splice(index,1)[0]
   }
}

const getUser=(id)=>{
    const index=users.findIndex((user)=>{
        return user.id===id
    })
    return users[index]
 }

const getUsersInRoom=(room)=>{
    const array=users.filter((user)=>{
        if(user.room===room)
          {
            return user
          }
    })
 return array   
} 


module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
} 
