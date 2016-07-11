$(document).ready(function(){
   $('#map-toggle').click(function(){
       $(this).parent().toggleClass('active');
       $(this).toggleClass('active');
   }) ;
   $('.sidebar-block_title').click(function(){
       if($(this).parent().hasClass('is-active')){
           return
       }else {
           $(this).parent().addClass('is-active');
       }
   });
    $('.sidebar-block_roll').click(function(){
        console.log($(this).parent());
        $(this).parent().removeClass('is-active');
    })
});