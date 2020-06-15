
	$(document).ready(function() {
		
		$('.js-select2-single').select2({
		    theme: 'bootstrap4',
		    width: 'resolve' 
		});
		
		
		
		 function getDistricts(){
			 options='';
			 $.ajax({
				 
				 datatype:"application/json",
					url : "getDistricts",
					type : "POST",
					success : function(response) { 
						if(response == null || response == ""){
							$("#packageNotMsg").html('Internal Server Error, Please try after some time');
						}
					      //alert(response);
					      $.each(response, function(key,value) {
					    	  var val = value;				    	 
					    	//  $("#District").append("<option value='"+val+"'>"+key+"</option>");
					    	//  options+="<option value='"+val+"'>"+key+"</option>";
					    	  var newOption = new Option(key,val, false, false);
						      $('#District').append(newOption);
					    	
					      });
					     
					      $('#District').trigger('change');
				//	      getPremiseSection(4);
					     }, 
					     
					     
					error : function(e) {  
					      //alert('Error: ' + e);   
					     } 
				});
		 }	 
		 getDistricts();
		 
		 	 
   });
	
	function getPremiseSection(value)
	{
		var districtId=value;
		options='';
		$('#inputSectionNo').find('option').remove();
		$("#packageNotMsg").html('');
		$.ajax({
		datatype:"application/json",
		url : "getinputSection",
		data:{'distictid':districtId},
		type : "POST",
		success : function(response) { 
			if(response == null || response == ""){
				$("#packageNotMsg").html('Internal Server Error, Please try after some time');
			}else {
		     
				$('#inputSectionNo').find('option').remove();
			//	$("#inputSectionNo").append("<option value=''>--select--</option>");
			      $.each(response, function(key,value) {

			   // 	  options+="<option value='"+val+"'>"+key+"</option>";
			    	  var newOption = new Option( key,value, false, false);
				      $('#inputSectionNo').append(newOption);
			      });
			      $('#inputSectionNo').trigger('change');
			}
	    },  
		error : function(e) {  
		      //alert('Error: ' + e);   
		     } 
		});
	}
	function sectionChange(value){
		
		var strTable='';
		var aryServiceStage={5:'Weather Proof',6:'LT-Line Extn',7:'HT-Line Extn'};
		reload();
		if(value!=null && value!=""){
			$("#service_status tbody").html('');
			$.ajax({
				datatype:"application/json", 
				url : "getPendingApplicantList",
				data:{'sectionId':value},
				type : "POST",
				success : function(response) { 
					if(response == null || response == ""){
						$("#packageNotMsg").html('Internal Server Error, Please try after some time');
					}else{
					//	console.log(response);
						$("#panel_load").hide();
						if(response.err_flag!=0){
							
							$("#intro_outer").removeClass('panel-info panel-success');
							$("#intro_outer").addClass('panel-warning');
							$("#panel_body").html('Information is not avaiable now. Please try again later.');
							$("#panel_body").show();
						}
						else{
							if(response.count==0){
	
								$("#intro_outer").removeClass('panel-info panel-warning');
								$("#intro_outer").addClass('panel-success');
								$("#panel_body").html('No applicants pending. All connections have been effected. ');
								$("#panel_body").show();
								
							}else {
								$("#intro").hide(200);
								$("#panel_table").show(600);
								$("#table_head").html(' <strong>Section: </strong>'+response.office.full_name+
					                     '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Ph: </strong>'+response.office.office_phone+
					                     '<br/>   <strong>Total No. of Applicants: </strong>'+response.count+
					                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>As on:  </strong>'+response.ason);
									i=0;
								  $.each(response.list, function(key,value) {
									  applicant=nvl(value.consumer_num,value.applicant_num);
									  bgColor='';
									  i++;
									 if(value.objn_status==1)
											bgColor='style="background-color: #e59866;"'; 
									 else if(parseInt(value.sla_delay_days)>parseInt(value.sla_time))
											bgColor='style="background-color: #f5b7b1;"'; 
									else
											 bgColor='';
									  strTable='<tr '+bgColor+' >'
				                        +'<td>'+i+'</td>'
				                        +'<td>'+applicant+'<br/>'+value.customer_name+' </td>'
				                        +'<td>'+value.sla_delay_days+'/'+value.sla_time+'</td>'
				                        +'<td>'+value.objn_days+'</td>'
				                        +'<td>'+nvl(value.status,'Completed')+'</td>'
				                        +'<td>'+aryServiceStage[value.sla_service_stage_id]+'</td>'
				                        +'</tr>';
									  $("#service_status tbody").append(strTable);  
								  });
								 
				                    
								
							}
						}
						
							
					}
				      
					
				      
				},  
				error : function(e) {  
				      //alert('Error: ' + e);   
				     } 
			});
		}
		
	}
	function reload(){
			$("#panel_table").hide();
			$("#intro").show();
			
			$("#panel_body").hide();
			$("#panel_load").show();
			$("#packageNotMsg").html('');
			$("#intro_outer").removeClass('panel-warning panel-success');
			$("#intro_outer").addClass('panel-info');
		}


	function nvl(value1,value2) 
	{
		if (value1 == null)
		return value2;
		return value1;
	}

