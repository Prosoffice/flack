
document.addEventListener('DOMContentLoaded', () => {


    // Disable the button as it is empty from the start
    document.querySelector('#submit').disabled = true;


    // when the user starts typing keys start measuring
    document.querySelector('#name').onkeyup = () =>{
        const charLength = document.querySelector('#name').value.length;
        charLength > 0 ? document.querySelector('#submit').disabled = false : document.querySelector('#submit').disabled = true;
    };


     // connect to websocket
     var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

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



});


