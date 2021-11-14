
$(function(){

	$(window).scroll(function() {
		if ($(this).scrollTop() > 100) {
			$("#toparrow").fadeIn();
			//$("#toparrow").fadeIn("slow");
		} else {
			//$("#toparrow").hide();
			$("#toparrow").fadeOut();
		}
	});

});
