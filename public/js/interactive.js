$(document).ready(function () {
	$('#myTabs a').click(function (e) {
	  e.preventDefault();
	  $(this).tab('show');
	});

	$('#next-detail a').click(function (e) {
	  e.preventDefault();
	  $('#myTabs a[href="#address"]').tab('show');
	});


	 $('#myTabs a[href="#personal-info"]').tab('show');
});