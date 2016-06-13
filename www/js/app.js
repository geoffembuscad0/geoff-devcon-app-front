var getReportBloodType = function () {
		var get_bloodtypes = JSON.parse($.ajax({
			url: Config.api + 'get_reports.php?bloodtype=1',
			type: 'GET',
			async: false
		}).responseText);
		
		var chart = new CanvasJS.Chart("chartBloodType", {

			title:{
				text:"Patient Blood Types"				

			},
                        animationEnabled: true,
			axisX:{
				interval: 1,
				gridThickness: 0,
				labelFontSize: 8,
				labelFontStyle: "normal",
				labelFontWeight: "normal",
				labelFontFamily: "Lucida Sans Unicode"

			},
			axisY2:{
				interlacedColor: "rgba(1,77,101,.2)",
				gridColor: "rgba(1,77,101,.1)"

			},

			data: [
			{     
				type: "bar",
                name: "BloodTypes",
				axisYType: "secondary",
				color: "#014D65",				
				dataPoints: get_bloodtypes
			}
			
			]
		});

chart.render();
}

var getReportCity = function () {
		var get_cities = JSON.parse($.ajax({
			url: Config.api + 'get_reports.php?city=1',
			type: 'GET',
			async: false
		}).responseText);
		
		var chart = new CanvasJS.Chart("chartCity",
	{
		title:{
			text: "Patient Cities",
			fontFamily: "arial"
		},
                animationEnabled: true,
		legend: {
			verticalAlign: "bottom",
			horizontalAlign: "center"
		},
		theme: "theme1",
		data: [
		{        
			type: "pie",
			indexLabelFontFamily: "Arial",       
			indexLabelFontSize: 20,
			indexLabelFontWeight: "bold",
			startAngle:0,
			indexLabelFontColor: "MistyRose",       
			indexLabelLineColor: "darkgrey", 
			indexLabelPlacement: "inside", 
			toolTipContent: "Number of Patients: {y}",
			showInLegend: true,
			indexLabel: "#percent%", 
			dataPoints: get_cities
		}
		]
	});

chart.render();
}

function refreshPatients(){
  $.ajax({
    url: Config.api + 'get_patients.php',
    type: 'GET',
    dataType: 'json',
    success: function(patients){
      var patient_record_render = '';
      $.each(patients,function(id, record_label){
        patient_record_render += '<tr>';
        patient_record_render += '<td>'+record_label.id+'</td>';
        patient_record_render += '<td>'+record_label.firstname+'</td>';
        patient_record_render += '<td>'+record_label.lastname+'</td>';
        patient_record_render += '<td><a class="btn btn-info view-patient" data-id="'+record_label.id+'"><i class="fa fa-search" aria-hidden="true"></i></a></td>';
        patient_record_render += '</tr>';
      });
      $('.patients-records').html(patient_record_render);

      $('.view-patient').click(function(e){
        $('.home-menu').slideUp(675);
        $('.module-layout').slideUp(675);
        $.ajax({
          url: Config.api + 'get_patient.php?id=' + $(this).attr('data-id'),
          type: 'GET',
          dataType: 'json',
          success: function(json){
            $.each(json, function(record_label, record_value){
              $('.vp-' + record_label).html(record_value);
            });
          }
        });

        $('.page-patient').show(675);

      });
    }
  });

}

$(document).ready(function(){
  refreshPatients();
  getReportBloodType();
  getReportCity();
  // $('.module-layout').hide();

  $('.btn-back').click(function(e){
  	// $('.home-menu').show();
    $('.home-menu').slideDown(675);
    // $('.module-layout').hide();
    $('.module-layout').slideUp(675);
  });

  $('.panel-btn').click(function(e){
    $('.home-menu').slideUp(675);
    $('.' + $(this).attr('data-module')).slideDown(675);
  });



  // Add Patient Record
  $('.add-patient').submit(function(e){
    e.preventDefault();
    $.ajax({
      url: Config.api + 'add_patient.php',
      type: 'GET',
      dataType: 'json',
      data: {
        firstname: $('input[name="firstname"]').val(),
        lastname: $('input[name="lastname"]').val(),
        birthdate: $('input[name="birthdate"]').val(),
        blood_type: $('select[name="bloodtype"]').val(),
        gender: $('input[name="gender"]:checked').val(),
        city: $('input[name="city"]').val()
      },
      success: function(json){
        $.each(json.error, function(field, msg){
          if(msg != ''){
            $('.error-' + field).html(msg);
          }
        });

        if(json.message != ''){
          refreshPatients();
          $('input[name="firstname"]').val('');
          $('input[name="lastname"]').val('');
          $('input[name="birthdate"]').val('');
          $('select[name="bloodtype"]').val('');
          $('input[name="city"]').val('');
          $('input[name="gender"]').prop('checked', false);
          $('.add-message').html('<div class="alert alert-success"><a class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></a><p>'+json.message+'</p></div>');
        }
      }
    });
  });
});
