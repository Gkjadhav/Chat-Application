

const socket=io('http://localhost:8000');

// const socket=io('https://nodejs-real-chat-application.herokuapp.com/');


const form=document.getElementById('send-container');
const messageInput=document.getElementById('messageInp');
const messageContainer=document.querySelector(".container");
var audio=new Audio('ting.mp3');




const append=(message,position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left'){

        audio.play();
    }
}

form.addEventListener('submit',(e)=>{
    e.preventDefault(); //page will be not reload due to this
    const message= messageInput.value;
    append(`You:${message}`,'right');
    socket.emit('send',message);
    messageInput.value=''; // to make the messageInput area blank once message is send
    // so that new message can be typed now
})

const name=prompt("Enter your name to join :");
socket.emit('new-user-joined',name); // in server .i.e (client.js) this event will be listen and particular action will be taken

socket.on('user-joined',name=>{ // user-joined event emitted by server  will be listen  here in client.js using socket.on
    append(`${name} joined the chat`,'right');
});

socket.on('receive',data=>{
    append(`${data.name} : ${data.message}`,'left');
});

socket.on('left',name=>{
    append(`${name} left the chat `,'left');
});

