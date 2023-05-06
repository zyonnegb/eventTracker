var trash = document.getElementsByClassName("fa-trash"); //declares trash variable for trash icons
var star = document.getElementsByClassName("fa-star");//declares star variable for star icons
var done = document.getElementsByClassName("fa-check");//declares done variable for check icons

//Favorites Item Upon Star Click - PUT METHOD
Array.from(star).forEach(function(element) {
  element.addEventListener('click', function(){
    let eventName = this.parentNode.parentNode.parentNode.childNodes[1].textContent
    let check = eventName.split('')
    if(check[0] == "★"){
      console.log('Already Favorited!')
      unfavorite(check)
      return
    }
    fetch('favorite', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'eventName':eventName,
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});

//Unfavorites Already Favorited Items - PUT METHOD
function unfavorite (check){
    let eventNameUn;
    eventNameUn = check.slice(4)
    eventNameUn = eventNameUn.join('')
    console.log(eventNameUn)
    fetch('unfavorite', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'eventName': eventNameUn
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
}
//Deletes Card - DELETE METHOD
Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function(){
  console.log(this.parentNode.parentNode.parentNode.childNodes[1].textContent)
  const eventName = this.parentNode.parentNode.parentNode.childNodes[1].textContent
  const yourName = this.parentNode.parentNode.parentNode.childNodes[5].innerText
  const eventDesc = this.parentNode.parentNode.parentNode.childNodes[7].innerText
      fetch('delete', {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'eventName': eventName,
          'yourName': yourName,
          'eventDesc': eventDesc,
        })
      }).then(function (response) {
        window.location.reload()
      })
    });
});

//runs when check mark is clicked, applies line through style, or unapply style is already applied
//no method, only runs client side :/
Array.from(done).forEach(function(element) {
  element.addEventListener('click', function(){
    const yourName = this.parentNode.parentNode.parentNode.childNodes[5]
    const eventDesc = this.parentNode.parentNode.parentNode.childNodes[7]
    const eventName = this.parentNode.parentNode.parentNode.childNodes[1]
    const eventDay = this.parentNode.parentNode.parentNode.childNodes[9]
    if(eventName.style.textDecoration.includes('line-through')){ //checks if already marked as done
      eventName.style.textDecoration = "none";
      eventDesc.style.textDecoration = "none";
      yourName.style.textDecoration = "none";
      eventDay.style.textDecoration = "none";
      return
    }
    eventName.style.textDecoration = "line-through";
    eventDesc.style.textDecoration = "line-through";
    yourName.style.textDecoration = "line-through";
    eventDay.style.textDecoration = "line-through";
  });
});
