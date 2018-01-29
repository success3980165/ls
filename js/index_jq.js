$(".page5,.page1").click(function() {
  $(".nav1").slideUp(200);
  $(".page6").fadeIn(500)
})
$(".page6").click(function() {
  $(".nav1").slideDown(200);
  $(".page6").fadeOut(200);
})