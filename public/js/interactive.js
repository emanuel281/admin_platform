$(document).ready(function () {
	// $('#myTabs a').click(function (e) {
	//   e.preventDefault();
	//   $(this).tab('show');
	// });

	// $('#next-detail a').click(function (e) {
	//   e.preventDefault();
	//   $('#myTabs a[href="#address"]').tab('show');
	// });

	$('#calendar').fullCalendar({
		theme : true,
		businessHours : true,
		editable : true,
		header : {
			left : 'prev,next,today',
			center : 'title',
			right : 'month,agendaWeek,agendaDay'
		},
		events : function(start, end, timezone, callback){
			$.get('/calendar/events', 
				{
					start_date : '2016-08-24 00:15:00',
					end_date : '2016-08-24 00:30:00',
					timezone : timezone
				}, 
				function(events){
					callback(events)
				});
		},
		eventRender : function (event, element, view, callback) {
			
			console.log("event: ", event, "element: ", element, "view: ", view, "callback: ", callback);
			return element;

		}
	});

	$('#toggle-calendar').click(function(){

		$('#calendar').toggle({display:false});

	})

	$('#myTabs a[href="#personal-info"]').tab('show');
});