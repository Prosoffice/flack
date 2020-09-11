console.log('it works')



document.addEventListener('DOMContentLoaded', () => {
    

    function append () {
        let counter = 0;

        while (counter < localStorage.length){
            var channelName = localStorage.key(counter);
            var channelObject = JSON.parse(localStorage.getItem(channelName));
            var ul = document.querySelector('#tasks');
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.innerHTML = channelObject.name;
            a.href = channelObject.link;
            li.append(a)
            ul.append(li);

            counter++
        };
    };

    append()


    // Disable the button as it is empty from the start
    document.querySelector('#submit').disabled = true;


    // when the user starts typing keys start measuring
    document.querySelector('#name').onkeyup = () =>{
        const charLength = document.querySelector('#name').value.length;
        charLength > 0 ? document.querySelector('#submit').disabled = false : document.querySelector('#submit').disabled = true;
    };




    // on successful submission
    document.querySelector('#new-task').onsubmit = () => {
        
        var owner = document.querySelector('.form-group').dataset.user;
        var channelName = document.querySelector('#name').value;
        var link = "/channel/" + channelName;

        obj = {name: channelName, link : link, owner: owner};
        
        // Append object to the local storage
        localStorage.setItem(channelName, JSON.stringify(obj));

        // Append to the general channel list
        const currentUl = document.querySelector('#tasks');
        const li = document.createElement('li')
        const a = document.createElement('a')
        a.innerHTML = channelName
        a.href = link
        li.append(a)
        currentUl.append(li)

        // disable the button again
        document.querySelector('#submit').disabled = true;

        // stop the form from submitting
        return true;
    };
});