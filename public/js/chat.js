const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $message = document.querySelector('#message')

const messageTemplate=document.querySelector('#message-template').innerHTML
const locationTemplate=document.querySelector('#location-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML

const{ username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll = () => {
    // New message element
    const $newMessage = $message.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $message.offsetHeight

    // Height of messages container
    const containerHeight = $message.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $message.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $message.scrollTop = $message.scrollHeight
    }
}


socket.on('message', (message) => {
    console.log(message)
    const html=Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt: moment(message.createdAt).format('h:mm:ss:a')
    })
    $message.insertAdjacentHTML("beforeend", html);
    autoscroll()
    console.log('Message Delivered')
    

})

socket.on('roomData',({room,userData})=>{
    const html=Mustache.render(sidebarTemplate,{
        room,
        userData
    })
    document.querySelector('#sidebar').innerHTML=html
})


$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = e.target.elements.mess.value

    socket.emit('sendMessage', message)
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value=''
    $messageFormInput.focus()
    
})

socket.on('locationMessage', (url) => {
    console.log(url)
    const html=Mustache.render(locationTemplate,{
        username:url.username,
        url: url.url,
        createdAt:  moment(url.createdAt).format('h:mm:ss:a')
    })
    autoscroll()
    $message.insertAdjacentHTML("beforeend", html);
   console.log('Location shared')
})


document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        $sendLocationButton.setAttribute('disabled', 'disabled')
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
        $sendLocationButton.removeAttribute('disabled')
    })
})

socket.emit('join',{username,room},(error)=>{
if(error){
    alert(error)
    location.href='/'
}
   
})