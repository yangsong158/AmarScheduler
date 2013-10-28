$(document).ready(function() {
	$("input, textarea").addClass("idle");
	$("input, textarea").focus(function() {
		$(this).addClass("activeField").removeClass("idle");
	}).blur(function() {
		$(this).removeClass("activeField").addClass("idle");
	});
});
