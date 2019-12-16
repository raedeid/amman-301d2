$('#show').mouseover(function(){
  $('#cats').removeClass('h');
});


$('#hide').mouseover(function(){
  $('#cats').addClass('h');
});

$('#show-hide').click(function(){
  $('#cats').toggleClass('h');
});


$('document').ready(function(){

  function Cat(data){
    this.name = data.name;
    this.age = data.age;
    this.image = data.image;
  }

  Cat.prototype.render = function(){
    // CLONING

    let wholeCat = $('<li> <h2 class="hi"></h2> <img/> <p></p> </li>').clone();

    wholeCat.find('.hi').text(this.name);
    wholeCat.find('img').attr('src', this.image);
    wholeCat.find('p').text(this.age);
    
    $('#cats').append(wholeCat);
  }
  
  // Read data from cats.json and log them
  $.get('./cats.json')
    .then( data => {

      data.forEach(element => {
        let cat = new Cat(element);
        cat.render();
      });
      // console.log(data);
    });
});
