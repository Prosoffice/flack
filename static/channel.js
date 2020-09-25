
// This block runs when a Channel page is loaded
document.addEventListener('DOMContentLoaded', () => {
    const current = localStorage.getItem('active')
   
    const list = current.split(" ")

    const active_class = list[1]

    document.querySelector(`.${active_class}`).classList.add('active')

    

    
    

});