var userMap,disabledModels,index,status,cphase;
var smodels= {
		  0: "Not Selected",
		  1: "Model IA",
		  2: "Model IB",
		  3: "Model IC",
		  4: "Model II"
		};
$(document).ready(function () {
	initializeData();
	var sbody = $('#profileModal');
	disabledModels=['1','2','3'];
//	document.getElementById("btnConfirm").disabled = true;

    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.scrollup').fadeIn();
        } else {
            $('.scrollup').fadeOut();
        }
    });
    
    $('.scrollup').click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, 600);
        return false;
    });
	var totalAmt=0;
    var billItems=$('ul[class="viewBillPay"] li').not('ul[class="viewBillPay"] li ul li');
    var arraySize= billItems.length-1;

    billItems.each(function(idx, li) {
   
		 var payableAmt=$(li).find('p').text().trim();
		 totalAmt+=parseInt(payableAmt);
		 if( totalAmt=='0' && arraySize===idx)
		  	$(li).find('a').trigger('click');
    	  
    });
    
    $('.input-number-increment').click(function() {
  	  var $input = $(this).parents('.input-number-group').find('.input-number');
  	  var val = parseInt($input.val(), 10);
  	  if(val<99){
  	 	 $input.val(val + 1);
  		calculateReq($input);
    	}
  		
  	});

  	$('.input-number-decrement').click(function() {
  	  var $input = $(this).parents('.input-number-group').find('.input-number');
  	  var val = parseInt($input.val(), 10);
  	  if(val>0){
  	  	$input.val(val - 1);
	    calculateReq($input);
  	  }
  	})
  	
  
  	sbody.on('click', 'div.cart-plans div.flick-cart-plan', function () {
  		model_option = $(this).attr('data-option');
  		if($.inArray( model_option, disabledModels)!=-1){  //selected disabled
  			model_option=0;
  		}
  		
  		if(model_option!=0){
  			$("#cart-plans .flick-cart-plan").each(function(){
  				$(this).removeClass("flick-cart-plan-unselected flick-cart-plan-selected");
  				current_model= $(this).attr('data-option');
  				if($.inArray( model_option, disabledModels)!=-1)
  					$(this).addClass("flick-cart-plan-disabled");
  				else if(model_option==current_model)
  					$(this).addClass("flick-cart-plan-selected");	
  				else if($.inArray( current_model, disabledModels)==-1)
  					$(this).addClass("flick-cart-plan-unselected");
  			});
  			
  			if($.inArray( model_option, disabledModels )==-1)
  				$('#selectModel').val(model_option); 
  			else
  				$('#selectModel').val(0); 
  			
  		}
  	//	console.log('selected model: '+$('#selectModel').val()+' '+smodels[$('#selectModel').val()]);
  		$('#modelSelection').html(smodels[$('#selectModel').val()]);
  		if($('#selectModel').val()!=0){
	  		if($('#selectModel').val()<4){
	  			$('#model1Cap').show();
	  			$('#model2Cap').hide();
	  			$('#form-soura-modal').parsley('destroy');
	  			$('#inputReqCapacity').parsley('removeConstraint', 'required');
	  			$('#form-soura-modal').parsley();
	  		}else{
	  		
	  			$('#model1Cap').hide();
	  			$('#form-soura-modal').parsley('destroy');
	  			$("#inputReqCapacity").parsley('addConstraint', {
		 			required : true 
		 			
		 		});
	  			$('#form-soura-modal').parsley();
	  			$('#model2Cap').show();
	  		}
  		}
  			
  	});
  	
  	$( '#form-soura-modal' ).parsley( 'addListener', {
  	    onFieldValidate: function ( elem ) {

  	        // if field is not visible, do not apply Parsley validation!
  	        if ( !$( elem ).is( ':visible' ) ) {
  	            return true;
  	        }

  	        return false;
  	    }
  	} );
  	 $("#btnConfirm").click(function(event) {
			event.preventDefault(); // cancel default behavior
	  });
  	
    
});

function calculateReq(elem) {       
    var items = new Array();
           
    var targetId = $(elem).attr('id');
    var targetVal = elem.value;
    var targetEle = $(elem).closest(".viewBillPay");
    var targetEleUpper = $(elem).closest(".input-number-group");
    var totalLed= 0;
    var totalRt = 0;
    var totalIcb =0;
   	var  totalLedCon=0;
	var  totalRtCon=0;
  //  targetEleUpper.find("#countId").val(parseInt(targetVal));
    targetEle.find(".input-number-group #idLedCount").each(
                    function(index) {
                            totalGross=parseInt($(this).val());                                       
                            if ( totalGross> 0) {                                                
                            	totalLed = parseInt(parseInt(totalLed) + totalGross);                                                                                                
                            }
                    });      
    targetEle.find(".input-number-group #idRtCount").each(
            function(index) {
                    totalGross=parseInt($(this).val());                                       
                    if ( totalGross> 0) {                                                
                    	totalRt = parseInt(parseInt(totalRt) + totalGross);                                                                                                
                    }
            });      
    
    targetEle.find(".ToggleAmountDue .payableAmt").html(parseInt(totalLed));
    targetEle.find(".TogglePayable .payableAmt").html(parseInt(totalRt));
     // $("#consumerTotalAmount #total").val(parseFloat(totalamt).toFixed(2));          
    //targetEleUpper.find("#total").val(parseFloat(targetValtemp).toFixed(2));
     $(".ToggleAmountDue .payableAmt").each(
                    function(index) {
                            totalGross=parseInt($(this).text());
                            if (totalGross > 0) {
                            	totalLedCon = parseInt(parseInt(totalLedCon) + parseInt(totalGross));
                            }
                    });             
     $(".TogglePayable .payableAmt").each(
             function(index) {
                     totalGross=parseInt($(this).text());
                     if (totalGross > 0) {
                    	 totalRtCon = parseInt(parseInt(totalRtCon) + parseInt(totalGross));
                     }
             });             
    $("#totalPayCon p").html(parseInt(totalLedCon)); 
    $("#totalPayCon p input").val(parseInt(totalLedCon)); 
    $("#totalPayCon #totalLedDemand").val(parseInt(totalLedCon));
    $("#totalPayCon #totalRtCount").val(parseInt(totalRtCon));
}        



function checkSubmit(){

        	var totalLed= $("#totalPayCon p").html();
        	var totalRt=$("#totalPayCon #totalRtCount").val();
     
        	if(parseInt(totalLed) > 0){
        		if($('#ledForm').parsley('isValid')){
						
						$.confirm({
				    	    title: 'Confirm  Requirement !',
				    	    theme: 'modern',
				    	    columnClass: 'col-md-6 col-md-offset-4',
				    	    content: " <h4 style='color:#8dc63f;'>LED Requirement: <b>"+totalLed+
				    	    "</b> <br/> <h4 style='color:#e87231;'>Old Bulbs to be returned: <b>"+totalRt+ "</b></h4>",
				    	    buttons: {
				    	    	confirm:{
					                text: 'Proceed',
					                btnClass: 'btn-blue',
					                action: function () {
					    	           
					                	document.getElementById("ledForm").submit();
					    	        }},
				    	        cancel: function () {
				    	          
				    	        }
				    	    }
				    	   });
				
        		}else{
        		
        		    $.alert({
        		        title: 'Error !',
        		        theme: 'modern',
        		        columnClass: 'col-md-6 col-md-offset-4',
        		        content: 'Maximum no. of LEDs you can demand is <b> only 20</b> for single consumer<br/> Maximum no. of bulbs you can return is <b> only 100 </b> for single consumer'
        	
        		    
        		    });
        			
        		}
        			
        	}
        	else{
        		
        		$.confirm({
		    	    title: 'Confirm  Requirement !',
		    	    theme: 'modern',
		    	    columnClass: 'col-md-6 col-md-offset-4',
		    	    content: " <h4>Are you sure you want to cancel your demand?</h4>",
		    	    buttons: {
		    	    	confirm:{
			                text: 'Proceed',
			                btnClass: 'btn-blue',
			                action: function () {
			    	           
			                	document.getElementById("ledForm").submit();
			    	        }},
		    	        cancel: function () {
		    	          
		    	        }
		    	    }
		    	   });
        			
        		}
        }
      


function validateUser(mobile,code,event){
	if($('#loginForm').parsley('validate')){
			$('#closeBtn').attr('disabled','disabled');
			$('#loginBtn').attr('disabled','disabled');
			$('#errMessage').html('');
			$('#errMessageDialog').html('');

			 $.ajax({
					 datatype:"application/json",
					url : "verifyUser",
					type : "POST",
					data : {
						 'userName' : $("#appendedtext1").val(),
			             'encPass': $("#appendedtext2").val()
					},
					success : function(response) {			
						$('#loginBtn').attr('disabled',false);
						$('#closeBtn').attr('disabled',false);
						if(response.err_flag!=0){
							//$('#errorMsg').show();
							$('#errMessage').html(response.message);
							if(response.err_flag>1){
							//	$('#loginModal').modal('hide');
								$('#closeBtn').trigger('click');
							//	$('#loginModal').modal().hide();
							//	$('body').removeClass('modal-open');
								$('.modal-backdrop').remove()
								$('#errormsgdialog').modal('show');
								$('#errMessageDialog').html(response.dmessage);	
							}		
						}else{				
							
							document.getElementById("loginForm").submit();	
						}		
						 
					},
					error : function(e) {
					}
				});		
		}else
			console.log('parsley error');
	}	




function actionSubmit(identifier){
	
	var dataOption=$(identifier).data('option') ;
	var dataId=$(identifier).data('id');
//	console.log('dataOption: '+dataOption);
//	console.log('dataId: '+dataId);
	dataArr=dataOption.split("#");
	//ccid#status#index#cnum#sectioncode
//	console.log('dataArr: '+dataArr[0]);
	index=dataArr[2];status=dataArr[1];
	document.getElementById("btnWithdraw").disabled = true;
	document.getElementById("btnConfirm").disabled = true;
	$("#packageNotMsg").html('');
	if(dataId==10){
		if(status==0){
			
			document.getElementById("btnWithdraw").disabled = true;
			$('#AppNetwork').html('<p class="loading">');
			$('#AppCons').html('<p class="loading">');
			disabledModels=['1','2','3'];
			$('#selectModel').val(0); 
			$('#mCustConnId').val(dataArr[0]);
			$('#mSection').val(dataArr[4]);
			$('#mConsumerNum').val(dataArr[3]);
			$('#model2Cap').show();
  			$('#model1Cap').hide();
  			$("#inputReqCapacity").parsley('addConstraint', {
	 			required : true 
	 			
	 		});
  			$('#inputReqCapacity').val('');

			$("#cart-plans .flick-cart-plan").each(
					function(){
						model_option= $(this).attr('data-option');
						$(this).show();
					//	if(model_option!=4){
							$(this).removeClass("flick-cart-plan-disabled flick-cart-plan-unselected flick-cart-plan-selected");
							$(this).addClass("flick-cart-plan-disabled");	
					/*	}else{
							$(this).removeClass("flick-cart-plan-disabled flick-cart-plan-unselected flick-cart-plan-selected");
							$(this).addClass("flick-cart-plan-selected");
						}	*/
			});
			userProfile=userMap[dataArr[0]];
			//	console.log('userProfile: '+JSON.stringify(userProfile));
				$('#modalHeading').html(userProfile.consumerName+' - '+userProfile.consumerNum);
			//	$('#ApplicantName').html(userProfile.consumerName+'<small>'+userProfile.consumerNum+'</small>'+'<small>'+userProfile.section+' section</small>');
				$('#AppLoad').html(userProfile.load+' Watts <span class=\'schemePlan\' title=\'Phase\'>'+userProfile.phase+'</span>');
				$('#ApplicantName').html('<small>'+userProfile.address+'</small>');
//				$('#AppAddress').html('<small>'+userProfile.address+'</small>');
				
				getProfile(dataArr[4],dataArr[3]);
				$('#profileModal').modal('show');	
		}
		$("#modelSelectHead").show();
		$("#modalFooter").hide();
		$("#footerBtn").show();
		$("#gstRow").show();
		$('#gstNum').attr('disabled',false);
		$('#inputReqCapacity').attr('disabled',false);
		
		$('#c1').attr('disabled',false);
		$('#c2').attr('disabled',false);
		$('#modelSelection').html(smodels[0]);
		cphase=userProfile.cphase;

	}else if(dataId==20){
	
		 //to do: show different modal for paid cases with only selected modal and 
		// if possible show current status from onet
		
		//for unpaid/failed cases, edit with same modal
		userProfile=userMap[dataArr[0]];
		networkInfo=JSON.parse(userProfile.networkInfo);
//		console.log(userProfile);
		avgCons=userProfile.average;
		
		$('#AppCons').html(userProfile.average+' units');
		
		 if(status==1 ||status==-1  ){
			
			document.getElementById("btnWithdraw").disabled = false;
			disabledModels=['3','1','2'];
			if(avgCons<=120)
				disabledModels=[];
			else if(avgCons<=150)
				disabledModels=['1'];
			else if(avgCons<=200)
				disabledModels=['1','2'];
//			console.log('qssaved model: '+userProfile.model);
//			console.log('disabledModels : '+disabledModels);
			$("#cart-plans .flick-cart-plan").each(
					function(){
						model_option= $(this).attr('data-option');
						
							if($.inArray( model_option, disabledModels )==-1){
								$(this).removeClass("flick-cart-plan-disabled flick-cart-plan-selected");
								$(this).addClass("flick-cart-plan-unselected");
							}	
						
						$(this).show();
			});
			model_option=userProfile.model;
			if(model_option!=0){
	  			$("#cart-plans .flick-cart-plan").each(function(){
	  				$(this).removeClass("flick-cart-plan-unselected");
	  				current_model= $(this).attr('data-option');
	  				if($.inArray( current_model, disabledModels)!=-1){
	  					$(this).addClass("flick-cart-plan-disabled");
	  					$(this).removeClass("flick-cart-plan-unselected");
	  				}else if(model_option==current_model)
	  					$(this).addClass("flick-cart-plan-selected");	
	  				else if($.inArray( model_option, disabledModels)==-1)
	  					$(this).addClass("flick-cart-plan-unselected");
	  			});
	  			
	  			
	  		}
			$('#selectModel').val(userProfile.model); 
			$('#mNetwork').val(userProfile.networkInfo);
			$('#mAvgCons').val(avgCons);
			$('#mCustConnId').val(dataArr[0]);
			$('#mSection').val(dataArr[4]);
			$('#mConsumerNum').val(dataArr[3]);
			$('#gstNum').val(userProfile.gstin);
			if(model_option!=4){  //model 1
				
				$("#model2Cap").hide();
				$("#model1Cap").show();
				if(userProfile.capacity==2)
					$("#c1").prop("checked", true);
				else
					$("#c2").prop("checked", true);
				
				$('#inputReqCapacity').parsley('removeConstraint', 'required');
				
			}else{
				$("#model2Cap").show();
				$("#model1Cap").hide();
				$('#inputReqCapacity').val(userProfile.capacity);
				$("#inputReqCapacity").parsley('addConstraint', {
		 			required : true 
		 			
		 		});
			}		
			
			$('#modelSelection').html(smodels[model_option]);
			$("#modelSelectHead").show();
			$("#modalFooter").hide();
			$("#footerBtn").show();
			$("#gstRow").show();
			$('#gstNum').attr('disabled',false);
			$('#inputReqCapacity').attr('disabled',false);
			$('#c1').attr('disabled',false);
			$('#c2').attr('disabled',false);
			document.getElementById("btnConfirm").disabled = false;
		}else{
			model_option=userProfile.model;
			$("#cart-plans .flick-cart-plan").each(
					function(){
						$(this).removeClass("flick-cart-plan-disabled flick-cart-plan-unselected");
						$(this).hide();
			});
			$("#cart-plans .flick-cart-plan").each(
					function(){
						current_model= $(this).attr('data-option');
						if(model_option==current_model){
							$(this).addClass("flick-cart-plan-selected");
							$(this).show();
						}
			});
			
			$('#modelSelection').html(smodels[model_option]);
			
			if(model_option!=4){  //model 1
				
				$("#model2Cap").hide();
				$("#model1Cap").show();
				if(userProfile.capacity==2)
					$("#c1").prop("checked", true);
				else
					$("#c2").prop("checked", true);
				
				$('#c1').attr('disabled','disabled');
				$('#c2').attr('disabled','disabled');
			}else{
				$("#model2Cap").show();
				$("#model1Cap").hide();
				$('#inputReqCapacity').val(userProfile.capacity);
				$('#inputReqCapacity').attr('disabled','disabled');
			}
			if(userProfile.gstin!=null && userProfile.gstin!=''){
				$("#gstRow").show();
				$('#gstNum').attr('disabled','disabled');
				$('#gstNum').val(userProfile.gstin);
			}else
				$("#gstRow").hide();
			
			$("#modelSelectHead").hide();
			$("#footerBtn").hide();
			$("#modalFooter").show();
		}
		 
		 $('#modalHeading').html(userProfile.consumerName+' - '+userProfile.consumerNum);
			$('#AppLoad').html(userProfile.load+' Watts <span class=\'schemePlan\' title=\'Phase\'>'+userProfile.phase+'</span>');
			$('#ApplicantName').html('<small>'+userProfile.address+'</small>');
			
			$('#AppNetwork').html('<label>Pole:</label>'+networkInfo.pole_code+'<br/><label>Transformer:</label>'+
					networkInfo.transformer_name+'<span class=\'schemePlan\' data-tooltip=\'DTR Capacity\' title=\'DTR Capacity\'>'+	
					networkInfo.capacity+' kVA</span><br/><label>Feeder:</label>'+networkInfo.feeder_name);
			$('#profileModal').modal('show');	
			cphase=userProfile.cphase;
	}

}


function getProfile(sectionCode,consumerNo)
{
	document.getElementById("btnConfirm").disabled = true;
//	console.log('consumerNo: '+consumerNo);
	var avgCons=0;
	$.ajax({
		datatype:"application/json",
		url : "getOnetConsumerProfile",
		data:{'consumerNum':consumerNo,'sectionId':sectionCode,channel:'SOURA'},
		type : "POST",
		success : function(response) { 
			
			networkInfo=response.feederInfo;
			consumerInfo=response.consumerInfo;
			if(response == null || response == ""){
				$("#packageNotMsg").html('Something went wrong, Please try after some time');
				
			}else if(response.err_flag<0){
				$("#packageNotMsg").html(response.disp_msg);
				
			}else if(response.err_flag>0)
				$("#packageNotMsg").html(response.disp_msg);
			else  if(response.err_flag==0)
				document.getElementById("btnConfirm").disabled = false;
			
			
			if(response.err_flag<=0){
				$('#AppNetwork').html('<label>Pole:</label>'+networkInfo.pole_code+'<br/><label>Transformer:</label>'+
						networkInfo.transformer_name+'<span class=\'schemePlan\' data-tooltip=\'DTR Capacity\' title=\'DTR Capacity\'>'+	
						networkInfo.capacity+' kVA</span><br/><label>Feeder:</label>'+networkInfo.feeder_name);
				
				$('#AppCons').html('<strong style=\'color\':red;>'+consumerInfo.avg_consumption+' units </strong>');
				avgCons=consumerInfo.avg_consumption;
				disabledModels=['3','1','2'];
				if(avgCons<=120)
					disabledModels=[];
				else if(avgCons<=150)
					disabledModels=['1'];
				else if(avgCons<=200)
					disabledModels=['1','2'];
			//	console.log(disabledModels);
				$("#cart-plans .flick-cart-plan").each(
						function(){
							model_option= $(this).attr('data-option');
					//		if(model_option!=4){
								if($.inArray( model_option, disabledModels )==-1){
									$(this).removeClass("flick-cart-plan-disabled");
									$(this).addClass("flick-cart-plan-unselected");
								}	
					//		}		
				});
				
				$('#mNetwork').val(JSON.stringify(networkInfo));
				$('#mAvgCons').val(avgCons);

			}	
		},  
		error : function(e) {  
		      //alert('Error: ' + e);   
		     } 
	});
}

function submitForm() {
	var model = $('#selectModel').val();
	var inputCap = $('#inputReqCapacity').val();
	var radioCap = $('input[name=model1Cap_option]:checked').val();
	
//	 console.log('submitForm model: '+model+' '+cphase+' '+inputCap );
	if (model != "" && model != null) {
	//	document.getElementById("btnConfirm").disabled = true;
	//    event.preventDefault();
	    if(model==4){
	    	if(cphase==1 && inputCap>5)
	    		$("#packageNotMsg").html('Only up to 5kW allowed for single phase consumers');
	    	else
	    		saveApp(model);
	    }else
	    	saveApp(model);
	}else{
		$.alert({
	        title: 'Error !',
	        icon: 'fa  fa-exclamation-triangle',
	        type: 'red',
	        content: 'Please select a model'

	    
	    });
	}

}


function saveApp(model)
{
	
//	console.log($("#form-soura-modal").serialize());
	if(model==0){

		$.alert({
	        title: 'Error !',
	        icon: 'fa  fa-exclamation-triangle',
	        type: 'red',
	        content: 'Please select a model'

	    
	    });
	}
	else if($('#form-soura-modal').parsley('isValid'))
	{
		if(model<4)
	    	$('#inputReqCapacity').val(0);
		$('#btnBack').attr('disabled','disabled');
		$('#btnWithdraw').attr('disabled','disabled');
		$('#btnConfirm').attr('disabled','disabled');
		$("#packageNotMsg").html('');
		
		$.ajax({
			url : "saveSouraApp",
			data: $("#form-soura-modal").serialize(),
			type : "POST",
			success : function(response) {
				if(response >0){
					$("#packageNotMsg").html('Something went wrong, Please try after some time');
					document.getElementById("btnBack").disabled = false;
	
				}else{
					window.location.href = 'sbp';
				}
			},  
			error : function(e) {  
				
			     } 
		});
		}else{
			$.alert({
		        title: 'Error !',
		        icon: 'fa  fa-exclamation-triangle',
		        type: 'red',
		        content: 'Solar plant capacity should be between 2kWp and 100 kWp'

		    
		    });
		}
}

function withdraw()
{
	
/*	console.log($("#form-soura-modal").serialize());
	if($('#form-soura-modal').parsley('isValid'))
	{*/
		$('#selectModel').val(0);
		$('#inputReqCapacity').val(0);
		$('#btnBack').attr('disabled','disabled');
		$('#btnWithdraw').attr('disabled','disabled');
		$('#btnConfirm').attr('disabled','disabled');
		$("#packageNotMsg").html('');
		
		$.ajax({
			url : "saveSouraApp",
			data: $("#form-soura-modal").serialize(),
			type : "POST",
			success : function(response) {
			//	console.log('saveAddress: ' +response);

				if(response == 1){
					$("#packageNotMsg").html('Something went wrong, Please try after some time');
					document.getElementById("btnBack").disabled = false;
				}else{
					window.location.href = 'sbp';
				}
			},  
			error : function(e) {  
				
			     } 
		});
	/*}else{
			alert("Invalid Entry.");
		}*/
}

function back() {
	$('#profileModal').modal('hide');	

}

function checkProceed(){

	var totalDemand=$("#demandTotal").val();
	var msg='';model=0;
	if(totalDemand>0){
		if($('#sbpAppForm').parsley('isValid')){
			i=0;
			$('#sbpAppForm *').filter(':input[name$="consumerNumber"] ').each(function(){
			//	console.log(this.name);
				tmp='demandList['+[i]+'].statusFlag'; 
				if(document.getElementsByName(tmp)[0].value==1||document.getElementsByName(tmp)[0].value==-1){
					msg+='<br/>';
					tmp='demandList['+[i]+'].consumerNumber';
					msg+=' <h4> '+document.getElementsByName(tmp)[0].value+ ':';
					tmp='demandList['+[i]+'].souraModel';
					model=document.getElementsByName(tmp)[0].value;
					model-=3;
					msg+=' <b> '+smodels[model]+'</b>';
					msg+=' </h4> '
				}
			
				i++;
			});
			msg+='<br/>';
				$.confirm({
		    	    title: 'Confirm  Requirement ',
		    	 //   theme: 'modern',
		    	    icon: 'fa  fa-question-circle',  
		    	    type: 'blue',
		    	    columnClass: 'col-md-6 col-md-offset-4',
		    	    content: msg+" <h4 style='color:#8dc63f;'>Total Demand <b> Rs."+totalDemand,
		    	    buttons: {
		    	    	confirm:{
			                text: 'Proceed',
			                btnClass: 'btn-blue',
			                action: function () {
			    	           
			                	document.getElementById("sbpAppForm").submit();
			    	        }},
		    	        cancel: function () {
		    	          
		    	        }
		    	    }
		    	   });
		
		}else{
		
			alert("Invalid Entry.");
		}
			
	}
	else{
		
		
		$.alert({
	        title: 'Error !',
	        icon: 'fa  fa-exclamation-triangle',
	        type: 'red',
	        content: 'You not selected any consumers.<br/> If status is \'Payment Initiated\' then you can be attempt payment for this consumer only after this transaction is marked either success or fail from Payment Gateway'

	    
	    });
			
		}
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

	