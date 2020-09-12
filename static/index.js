// This is a function dedicated to just update the DOM on chatroom and channel creation events
function updateDOM (name, chat, time){

    const chatDiv = document.querySelector('.msg-page');

    const p = document.createElement('p');
    const span = document.createElement('span');
    const inbox = document.createElement('div');
    const receivedMsg = document.createElement('div');
    const receivedImg = document.createElement('div')
    const nameStrong = document.createElement('strong');
    const userDP = document.createElement('i')
    const subChatDiv = document.createElement('div');

    userDP.classList.add('fa');
    userDP.classList.add('fa-user-circle');
    userDP.classList.add('fa-3x');

    receivedImg.classList.add('received-chats-img');
    receivedImg.append(userDP);

    p.innerHTML = chat;
    
    nameStrong.innerHTML = name;

    span.append(nameStrong);
    span.append("  ");
    span.append(time);
    span.classList.add('time');

    inbox.classList.add('received-msg-inbox');
    inbox.append(span);
    inbox.append(p);           

    receivedMsg.classList.add('received-msg');
    receivedMsg.append(inbox);

    subChatDiv.classList.add('received-chats');
    subChatDiv.classList.add('my-3');
    subChatDiv.append(receivedImg);
    subChatDiv.append(receivedMsg);

    chatDiv.append(subChatDiv);

    // Auto scroll to see most recent messages
    $(".msg-page").stop().animate({ scrollTop: $(".msg-page")[0].scrollHeight}, 1000);


};



















document.addEventListener('DOMContentLoaded', () => {
    // connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port, { transports: ['websocket'] });


    // Disable the button as it is empty from the start
    document.querySelector('#submit').disabled = true;


    // when the user starts typing keys start measuring
    document.querySelector('#name').onkeyup = () =>{
        const charLength = document.querySelector('#name').value.length;
        charLength > 0 ? document.querySelector('#submit').disabled = false : document.querySelector('#submit').disabled = true;
    };

     socket.on('connect', () => {
         
        // When form is submitted
        document.querySelector('#newChannel').onsubmit = () => {

            // who is creating this channel?
            const owner = document.querySelector('.form-group').dataset.user;
    
            // what is the name of the channel
            const channelName = document.querySelector('#name').value;
            
            // process a link for the channel
            const link = '/channel/' + channelName;


            // while connected to websocket, emit these values above to the server
            socket.emit('channel creation', {'channel': {'name': channelName,'link':link, 'owner': owner}});


            // disable the button again
            document.querySelector('#submit').disabled = true;

            document.querySelector('#name').value = "";

            
            document.querySelector(".box").classList.remove("show");

            document.querySelector('.bg_shadow').classList.remove("active");
        

            // stop the form from submitting
            return false;
    
        };


     });

     
    //  When a new chanel is announced in a new emit event then do this

    socket.on('channel created and added', data => {

        // update the DOM
        if (data !== 'duplicate'){
            const error = document.querySelector('.error')
            error.innerHTML = ""

            const ul = document.querySelector('#channelList');
            const li = document.createElement('li');
            const a = document.createElement('a');
            const icon = document.createElement('div');
            const title = document.createElement('div');
            const fa = document.createElement('i');

            for (let i in data){
            const name = i;
            const link = data[i]['link'];
            const owner = data[i]['owner'];

            icon.classList.add('icon');
            title.classList.add('title');
            
            fa.classList.add('fa')
            fa.classList.add('fa-hashtag')
            
            icon.append(fa)
            title.innerHTML = name;

            a.append(icon)
            a.append(title)
            a.href = link;
            a.classList.add('room')
            a.dataset.owner = owner;
            li.append(a);
            ul.append(li);
            };
        
        }else{
            const error = document.querySelector('.error')
            error.innerHTML = "This page already exist."
        };


    });


    // STATIC JAVASCRIPT
    document.querySelector(".hamburger .fa").addEventListener('click', () => {
        document.querySelector('.wrapper').classList.add("active");
    });

    document.querySelector(".close").addEventListener('click', () => {
        document.querySelector('.wrapper').classList.remove("active")
    });

    document.querySelector(".create").addEventListener('click', () => {
        document.querySelector(".box").classList.add("show");
        document.querySelector('.bg_shadow').classList.add("active");
    });














    // CHANNEL JS
    if (document.querySelector('.home')){

        // This block ensures the user don`t submit an empty chat 
    document.querySelector('.chat').addEventListener('keyup', function (event){

        // Get the character length on every keyup event
        const charLength = document.querySelector('.chat').value.length;

        // This is called a Ternary if statement, it does certain actions depending on 
        // the length of the input field characters
        charLength > 0 ? document.querySelector('.fa-paper-plane').classList.add('occupied') : document.querySelector('.fa-paper-plane').classList.remove('occupied');


        // Enables the "Enter" key for submission
        if (event.keyCode === 13) {           
            charLength > 0 ?document.querySelector('.submit').click(): event.preventDefault();
        }

        
    });
    

    // Answers the question...What Channel is this please?
    var channel = document.querySelector('.bolt').dataset.room;
    
    // Answers the question......Who is this user?
    var user = document.querySelector('.new-chat').dataset.user;

    // Let the server know that the above user has joined this channel
    socket.emit('join', {'user': user, 'channel': channel})


    // The server is now aware that the said user has joined this channel...
    // When the server emits that a user joined a channel, announce it to other users in that channel
    socket.on('join room', data => {
        const user = data['user'];
        const channel = data['channel'];
        console.log(user + ' has joined ' + channel);
        const message = 'joined this channel';
        const time = data['time'];
        updateDOM(user, message, time);
    })
  

    socket.on('connect', () => {

        console.log('Client connected')

        // Add event listeners to the channel buttons to allow the user to change channels
        document.querySelectorAll('.room').forEach(i => {
        i.onclick = () => {
          socket.emit('leave', { 'username': user, 'room': channel})
          room = i.textContent
          window.location.href = room
        }

        
        })

        // When a user joins a room announce it to the users in the room
        socket.on('leave room', data => {
            const user = data['username']
            console.log(user + ' has left the room')  
            const message = 'left the room'
            updateDOM(user, message, '10pm')
        }) 

        // When the chat form is submitted
        document.querySelector('.submit').onclick = () => {

            // Answers the question....What is the message?
            const chat = document.querySelector('.chat').value;

            
            // Send this user`s message to the server
            socket.emit('new message', {'channel': channel, 'chat':chat, 'user': user});
            

            // disable the button again
            document.querySelector('.fa-paper-plane').classList.remove('occupied');

            // Empty the chat box 
            document.querySelector('.chat').value = "";

            

            // stop the form from submitting
            return false;

        }; 
    });


    // When the message is stored on the server, update the DOM with the server-emit data
    socket.on('message stored', data => {
        const name = data['name']
        const chat = data['chat']
        const time = data['time']

        updateDOM(name, chat, time)

    });


    // Auto scroll to see most recent messages
    $('.msg-page').stop().animate({ scrollTop: $('.msg-page')[0].scrollHeight}, 1000);




    }

    

});


