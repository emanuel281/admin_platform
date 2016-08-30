$(document).ready(function () {
	// $('#myTabs a').click(function (e) {
	//   e.preventDefault();
	//   $(this).tab('show');
	// });

	// $('#next-detail a').click(function (e) {
	//   e.preventDefault();
	//   $('#myTabs a[href="#address"]').tab('show');
	// });

	var i = 0;

	$('#toggle-calendar').click(function(){

		if (i == 0) {

			$('#calendar').fullCalendar({
				header: {
					left: 'prev,next today',
					center: 'title',
					right: 'month,agendaWeek,agendaDay'
				},
				defaultDate: new Date(),
				selectable: true,
				selectHelper: true,
				select: function(start, end) {

					// $('input[name="start"]').value = (new Date());
					// $('input[name="end"]').value = (new Date());

					$('#myModal').modal('show');

					$('#add-event-form').submit(function(e){
						e.preventDefault();

						var for_get = $(this).serialize();
						var title = $('input[name="title"]').val();

						var eventData = {};
						if (title) {
							eventData = {
								title: title,
								start: $('input[name="start"]').val()?$('input[name="start"]').val():start,
								end: $('input[name="end"]').val()?$('input[name="end"]').val():end
							};

							$('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
						}

						$.post('/add/event', eventData, function(res){
							// console.log(eventData)
							$('#myModal').modal('hide');
							$('#calendar').fullCalendar('unselect');
						});

					});
				},
				editable: true,
				eventLimit: true, // allow "more" link when too many events
				events : function(start_date, end_date, timezone, callback){

							start_date = new Date(start_date);
							end_date = new Date(end_date);

								$.get('/calendar/events', 
									{
										start_date : start_date,
										end_date : end_date,
										timezone : timezone
									}, 
									function(eventz){
										// console.log(eventz)
										callback(eventz);
									});
							},
				eventClick: function(calEvent, jsEvent, view) {

					$('input[name="title"]').val(calEvent.title);
					$('input[name="start"]').val(calEvent.start);
					$('input[name="end"]').val(calEvent.end);

					// $('input[name="start"]').value = (new Date());
					// $('input[name="end"]').value = (new Date());

					$('#myModal').modal('show');


					$('#add-event-form').submit(function(e){
						e.preventDefault();

						// var for_get = $(this).serialize();
						var title = $('input[name="title"]').val();

						var eventData = {};
						if (title) {
							eventData = {
								title: title,
								start: calEvent.start,
								end: calEvent.end
							};

							$('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
						}
						$('#calendar').fullCalendar('unselect');

						$.post('/edit/event', eventData, function(res){
							$('#myModal').modal('hide');
						});

					});
					$(this).css('border-color', 'red');

			    }
			});

			i++;
		}
		else{

		$('#calendar').toggle({display:false});

		}

	})

	$('#myTabs a[href="#personal-info"]').tab('show');
});