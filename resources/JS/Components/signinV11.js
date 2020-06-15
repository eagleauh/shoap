var refreshIntervalId;
(function(){
	
	var mob_regex = /^[6-9][0-9]{9}$/;
	var email_regex = new RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$');
	var webid_regex=/^[1-2][0-9]{12}$/;
//	var email_regex = new RegExp('^([0-9a-zA-Z]([-\.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})');
	
    //Login/Signup modal window - 
	function ModalSignin( element ) {
		this.element = element;
		this.blocks = this.element.getElementsByClassName('js-signin-modal-block');
		this.switchers = this.element.getElementsByClassName('js-signin-modal-switcher')[0].getElementsByTagName('a'); 
		this.triggers = document.getElementsByClassName('js-signin-modal-trigger');
		this.hidePassword = this.element.getElementsByClassName('js-hide-password');
		this.init();
	};

	ModalSignin.prototype.init = function() {
		var self = this;
		var oneMinute = 60 * 1;
		var signupTab=true;
		var loginTab=true;
		var signupService=1;
		//open modal/switch form
		for(var i =0; i < this.triggers.length; i++) {
			(function(i){
				self.triggers[i].addEventListener('click', function(event){
					if( event.target.hasAttribute('data-signin') ) {
						event.preventDefault();
	
						if( event.target.getAttribute("data-signin")=="login"){	
							if(!loginTab) return;
							changeCaptha();
							clearInterval(refreshIntervalId);
							$("#signin-password").val('');
							self.showSigninForm(event.target.getAttribute('data-signin'));
							$("#signin-mobile").focus();
						}
						else if( event.target.getAttribute("data-signin")=="reset"){						
					      //  display = $('#time');
							$('#statusErrMsg').html('');
							$('#statusErrMsg').hide();
							var code = $('#signin-password').val();
							var mobile = $('#signin-mobile').val();
							
							self.toggleError(document.getElementById('signin-mobile'), false);
							self.toggleError(document.getElementById('signin-id'), false);
							self.toggleError(document.getElementById('signin-password'), false);

							if (!mobile.match(mob_regex) || mobile.length == 0) {		
								self.toggleError(document.getElementById('signin-mobile'), true);
								$("#signin-mobile").focus();
								return ;
							}
							else if ( code.length == 0) {
								self.toggleError(document.getElementById('signin-password'), true);
								$("#signin-password").focus();
								return ;
							}else{
								if(code=='~#'){
									clearInterval(refreshIntervalId);
									$('#signin-otp').val('');
								    self.showSigninForm(event.target.getAttribute('data-signin'));
								    $("#signin-otp").focus();
									$('#cd-signin-resend').hide();
									$('#cd-signin-timer').show();
							        display = document.querySelector('#time-signin');
									startTimer(oneMinute, display,'signin');
								}else
									validateUser(mobile,code,event);
							}
				
							
						  
   
						}else if( event.target.getAttribute("data-signin")=="mobileVerify"){	
							clearInterval(refreshIntervalId);
							self.showSigninForm(event.target.getAttribute('data-signin'));
							 $("#signup-otp").focus();
							
								$('#cd-signup-resend').hide();
								$('#cd-signup-timer').show();
						        display = document.querySelector('#time-signup','signup');
								startTimer(oneMinute, display,'signup');
						}else{
							if(!signupTab) return;
							if( event.target.hasAttribute('data-id') ){
								signupService=event.target.getAttribute("data-id");
								$('#signup-service').val(signupService);
							}
							self.showSigninForm(event.target.getAttribute('data-signin'));
						}
					}
					
				});
			})(i);
		}

		//close modal
		this.element.addEventListener('click', function(event){
			if( hasClass(event.target, 'js-signin-modal') || hasClass(event.target, 'js-close') ) {
				event.preventDefault();
				removeClass(self.element, 'cd-signin-modal--is-visible');
				signupTab=true;
				loginTab=true;
			}
		});
		//close modal when clicking the esc keyboard button
		document.addEventListener('keydown', function(event){
			(event.which=='27') && removeClass(self.element, 'cd-signin-modal--is-visible');
		});

		//hide/show password
		for(var i =0; i < this.hidePassword.length; i++) {
			(function(i){
				self.hidePassword[i].addEventListener('click', function(event){
					self.togglePassword(self.hidePassword[i]);
				});
			})(i);
		} 

	
		this.blocks[3].getElementsByTagName('form')[0].addEventListener('submit', function(event){
			event.preventDefault();
			var webId = $('#signup-otp').val();
			
			$('#cd-signup-error').hide();
			if ( webId.length !=6 ) {
				$('#cd-signup-error').show();
				$("#signup-otp").focus();
				return false;
			}else{
				validateNewUserOtp(webId);
			}		
		});
		this.blocks[2].getElementsByTagName('form')[0].addEventListener('submit', function(event){
			event.preventDefault();
			var webId = $('#signin-otp').val();
			
			$('#cd-signin-error').hide();
			if ( webId.length !=6 ) {
				$('#cd-signin-error').show();
				$("#signin-otp").focus();
				return false;
			}else{
				validateUserOtp(webId);
			}	
			
		});
		this.blocks[0].getElementsByTagName('form')[0].addEventListener('submit', function(event){
			event.preventDefault();
			var code = $('#signin-password').val();
			var webId = $('#signin-id').val();
			var mobile = $('#signin-mobile').val();
			self.toggleError(document.getElementById('signin-mobile'), false);
			self.toggleError(document.getElementById('signin-id'), false);
			self.toggleError(document.getElementById('signin-password'), false);

			if (mobile.length == 0) {
			//	$('#statusErrMsg').text("* All fields are mandatory *"); // This Segment Displays The Validation Rule For All Fields
				self.toggleError(document.getElementById('signin-mobile'), true);
				$("#signin-mobile").focus();
				return false;
			}
				// Validating Name Field.
			else if (!mobile.match(mob_regex) || mobile.length == 0) {
				
				self.toggleError(document.getElementById('signin-mobile'), true);
				$("#signin-mobile").focus();
				return false;
			}
				// Validating Email Field.
			else if ( !webId.match(webid_regex) || webId.length !=13 ) {
				self.toggleError(document.getElementById('signin-id'), true);
				$("#signin-id").focus();
				return false;
				}
			else if ( code.length < 6) {
				self.toggleError(document.getElementById('signin-password'), true);
				$("#signup-password").focus();
				return false;
			}else{
					getAppStatus(mobile,webId,code);
			}
			
	
			
		});
		this.blocks[1].getElementsByTagName('form')[0].addEventListener('submit', function(event){
			var service = $('#signup-service').val();
			var smobile = $('#signup-mobile').val();
			var semail = $('#signup-email').val();	
			event.preventDefault();
			self.toggleError(document.getElementById('signup-mobile'), false);
			self.toggleError(document.getElementById('signup-email'), false);
			self.toggleError(document.getElementById('signup-service'), false);
			if (smobile.length == 0) {
				self.toggleError(document.getElementById('signup-mobile'), true);
				$("#signup-mobile").focus();
				return false;
			}
				// Validating Name Field.
			else if (!smobile.match(mob_regex) || smobile.length == 0) {
				
				self.toggleError(document.getElementById('signup-mobile'), true);
				$("#signup-mobile").focus();
				return false;
			}
				// Validating Email Field.
			else if (!email_regex.test(semail) || semail.length == 0) {
				self.toggleError(document.getElementById('signup-email'), true);
				$("#signup-email").focus();
				return false;
				}
				// Validating Select Field.
			else if ( service == 0) {
				self.toggleError(document.getElementById('signup-service'), true);
				$("#signup-service").focus();
				return false;
			}else{
					validateNewUser(smobile,semail,service);
				}
		
		});
		
		function validateNewUser(mobileNo,email,service){
			$('#btnSignUp').attr('disabled','disabled');
			loginTab=false;
			 $.ajax({
					 datatype:"application/json",
					url : "validateNewApp",
					type : "POST",
					data : {
						 'mobile' : mobileNo,
			             'email' : email,
			             'service': service      
					},
					success : function(response) {			
						$('#btnSignUp').attr('disabled',false);
						if(response.err_flag!=0){
						
							self.toggleError(document.getElementById(response.field), true);
						}else{
							var link = document.getElementById('signupOtp');
							$('#signupOtpMsg').html(response.message);
							$('#signup-otp').val('');
							link.click();
						}					
					},
					error : function(e) {
					}
				});
		 }	
		
		function validateNewUserOtp(otp){
			$('#signupOtpErrMsg').hide();
			$('#signupOtpErrMsg').html('');
			$('#btnSignUpOtp').attr('disabled','disabled');
			 $.ajax({
					 datatype:"application/json",
					url : "verifyNCSOTP",
					type : "POST",
					data : {
						 'otpInput' : otp
					},
					success : function(response) {			
						
						if(response.err_flag!=0){
							$('#btnSignUpOtp').attr('disabled',false);
							$('#signupOtpErrMsg').show();
							$('#signupOtpErrMsg').html(response.message);
							$('#signup-otp').val('');
						}else{
							$('#signupOtpErrMsg').hide();
						
							document.getElementById("signUpForm").submit();	
						}
							
						
					},
					error : function(e) {
					}
				});
		 }	 
		
		function getAppStatus(mobileNo,webId,code){
			$('#statusErrMsg').html('');
			$('#statusErrMsg').hide();
			signupTab=false;
			$('#refreshButton').attr('disabled','disabled');
			$('#btnLogin').attr('disabled','disabled');
			 $.ajax({
					 datatype:"application/json",
					url : "checkStatusApp",
					type : "POST",
					data : {
						 'mobile' : mobileNo,
			             'webId' : webId,
			             'code': code  ,
			             'uniqueId': $("#captchaUniqueIdHidden").val()
					},
					success : function(response) {			
						$('#refreshButton').attr('disabled',false);
						$('#btnLogin').attr('disabled',false);
						if(response.err_flag!=0){
						
							if(response.err_flag==3){
								var link = document.getElementById('loginOtp');
								$('#signin-password').val('~#');
								$('#signinOtpMsg').html(response.message);
								$('#signin-otp').val('');
								link.click();
								return;
							}
							changeCaptha();
							$("#signin-password").val('');
							if(response.err_flag==1){
								self.toggleError(document.getElementById(response.field), true);
							}else{
									$('#statusErrMsg').show();
									$('#statusErrMsg').html(response.message);
				
							}
								
						}else{
							$('#refreshButton').attr('disabled','disabled');
							$('#btnLogin').attr('disabled','disabled');
					
							  $('#inputRegNo').val(webId);
							  $('#form-app-status').submit();
													
						}					
					},
					error : function(e) {
					}
				});
		 }	
		
		function validateUserOtp(otp){
			$('#loginOtpErrMsg').hide();
			$('#loginOtpErrMsg').html('');
			$('#btnLoginOtp').attr('disabled','disabled');
			 $.ajax({
					datatype:"application/json",
					url : "verifyNCSOTP",
					type : "POST",
					data : {
						 'otpInput' : otp
					},
					success : function(response) {			
						$('#btnLoginOtp').attr('disabled',false);
						if(response.err_flag!=0){
							$('#loginOtpErrMsg').show();
							$('#loginOtpErrMsg').html(response.message);
							$('#signin-otp').val('');
						}else{
							$('#loginOtpErrMsg').hide();
							$('#btnLoginOtp').attr('disabled','disabled');
							document.getElementById("loginForm").submit();	
							
						}						
					},
					error : function(e) {
					}
				});
		 }	
		
		function validateUser(mobile,code,event){
			$('#loginOtp').attr('disabled','disabled');
			$('#refreshButton').attr('disabled','disabled');
			$('#btnLogin').attr('disabled','disabled');
			signupTab=false;
			 $.ajax({
					 datatype:"application/json",
					url : "checkStatusApp",
					type : "POST",
					data : {
						 'mobile' : mobile,
			             'code' : code,
			             'webId' : '-1',
			             'uniqueId': $("#captchaUniqueIdHidden").val()
					},
					success : function(response) {			
						$('#loginOtp').attr('disabled',false);
						$('#refreshButton').attr('disabled',false);
						$('#btnLogin').attr('disabled',false);
						if(response.err_flag!=0){
						
							changeCaptha();
							
							if(response.err_flag==1){
								self.toggleError(document.getElementById(response.field), true);
							}else{
									$('#statusErrMsg').show();
									$('#statusErrMsg').html(response.message);		
							}			
						}else{
					
							$('#signinOtpMsg').html(response.message);
							clearInterval(refreshIntervalId);
							$("#signin-password").val('');
							$('#signin-otp').val('');
						    self.showSigninForm(event.target.getAttribute('data-signin'));
							$('#cd-signin-resend').hide();
							$('#cd-signin-timer').show();
					        display = document.querySelector('#time-signin');
							startTimer(oneMinute, display,'signin');
							
						}		
						 
					},
					error : function(e) {
					}
				});		
		}	
	};

	ModalSignin.prototype.togglePassword = function(target) {
		var password = target.previousElementSibling;
		( 'password' == password.getAttribute('type') ) ? password.setAttribute('type', 'text') : password.setAttribute('type', 'password');
		target.textContent = ( 'Hide' == target.textContent ) ? 'Show' : 'Hide';
		putCursorAtEnd(password);
	}

	ModalSignin.prototype.showSigninForm = function(type) {
		// show modal if not visible
		!hasClass(this.element, 'cd-signin-modal--is-visible') && addClass(this.element, 'cd-signin-modal--is-visible');
		// show selected form
		for( var i=0; i < this.blocks.length; i++ ) {
			this.blocks[i].getAttribute('data-type') == type ? addClass(this.blocks[i], 'cd-signin-modal__block--is-selected') : removeClass(this.blocks[i], 'cd-signin-modal__block--is-selected');
		}
		//update switcher appearance
		var switcherType = (type == 'signup') ? 'signup' : 'login';
		if(type=='mobileVerify') 
			switcherType='signup';
		for( var i=0; i < this.switchers.length; i++ ) {
			this.switchers[i].getAttribute('data-type') == switcherType ? addClass(this.switchers[i], 'cd-selected') : removeClass(this.switchers[i], 'cd-selected');
		} 
	};

	ModalSignin.prototype.toggleError = function(input, bool) {
		// used to show error messages in the form
		toggleClass(input, 'cd-signin-modal__input--has-error', bool);
		toggleClass(input.nextElementSibling, 'cd-signin-modal__error--is-visible', bool);
	}

	var signinModal = document.getElementsByClassName("js-signin-modal")[0];
	if( signinModal ) {
		new ModalSignin(signinModal);
	}

	// toggle main navigation on mobile
	var mainNav = document.getElementsByClassName('js-main-nav')[0];
	if(mainNav) {
		mainNav.addEventListener('click', function(event){
			if( hasClass(event.target, 'js-main-nav') ){
				var navList = mainNav.getElementsByTagName('ul')[0];
				toggleClass(navList, 'cd-main-nav__list--is-visible', !hasClass(navList, 'cd-main-nav__list--is-visible'));
			} 
		});
	}
	
	//class manipulations - needed if classList is not supported
	function hasClass(el, className) {
	  	if (el.classList) return el.classList.contains(className);
	  	else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
	}
	function addClass(el, className) {
		var classList = className.split(' ');
	 	if (el.classList) el.classList.add(classList[0]);
	 	else if (!hasClass(el, classList[0])) el.className += " " + classList[0];
	 	if (classList.length > 1) addClass(el, classList.slice(1).join(' '));
	}
	function removeClass(el, className) {
		var classList = className.split(' ');
	  	if (el.classList) el.classList.remove(classList[0]);	
	  	else if(hasClass(el, classList[0])) {
	  		var reg = new RegExp('(\\s|^)' + classList[0] + '(\\s|$)');
	  		el.className=el.className.replace(reg, ' ');
	  	}
	  	if (classList.length > 1) removeClass(el, classList.slice(1).join(' '));
	}
	function toggleClass(el, className, bool) {
		if(bool) addClass(el, className);
		else removeClass(el, className);
	}

	//credits http://css-tricks.com/snippets/jquery/move-cursor-to-end-of-textarea-or-input/
	function putCursorAtEnd(el) {
    	if (el.setSelectionRange) {
      		var len = el.value.length * 2;
      		el.focus();
      		el.setSelectionRange(len, len);
    	} else {
      		el.value = el.value;
    	}
	};
	
	
	
})();

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

var obj = document.getElementById('signin-otp');
obj.addEventListener("keydown", stopCarret); 
obj.addEventListener("keyup", stopCarret); 
var obj1 = document.getElementById('signup-otp');
obj1.addEventListener("keydown", stopCarret); 
obj1.addEventListener("keyup", stopCarret); 

function stopCarret() {
	if (obj.value.length > 5){
		setCaretPosition(obj, 5);
	}
	if (obj1.value.length > 5){
		setCaretPosition(obj1, 5);
	}
}

function setCaretPosition(elem, caretPos) {
    if(elem != null) {
        if(elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        }
        else {
            if(elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            }
            else
                elem.focus();
        }
    }
}


function startTimer(duration, display,tab) {
    var timer = duration, minutes, seconds;
    var tmp="-1";
    refreshIntervalId=  setInterval(function () {
    
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        tmp= minutes + ":" + seconds;
        display.innerHTML = tmp;

        if (--timer < 0) {
            timer = duration;
        }
        if(tmp=="00:00"){
        	$('#cd-'+tab+'-resend').show();
    		$('#cd-'+tab+'-timer').hide();
    		clearInterval(refreshIntervalId);
        }
       
    }, 1000);
  
}

function resendOtp(tab){
	$('#cd-'+tab+'-resend').hide();
	$('#cd-'+tab+'-timer').show();
	var oneMinute = 60 * 1;
	 display = document.querySelector('#time-'+tab);
	// clearInterval(refreshIntervalId);
	 //startTimer(oneMinute, display,tab);
		$.ajax({
			type : "POST",
			url : "resendNCOTP",
			data : {	
				'otpInput' :  $('#signup-otp').val(),
				'mobNo' : $('#signup-mobile').val()
			},
			success : function(response) {
				//console.log(tab+':'+response);
				if(response === "otpUpdatedSent"){
					$('#'+tab+'OtpMsg').html('Updated OTP number has been sent to your mobile number.. please wait');
					 clearInterval(refreshIntervalId);
					 startTimer(oneMinute, display,tab);
				}else{
					$('#'+tab+'OtpMsg').html('Could not sent OTP. Please refresh the page');
				}
				
			},
			error : function(e) {
				// startTimer(oneMinute, display,tab);
			}
		});
	
}

function homeClick(option){
	var link;
	if(option==2)
		link = document.getElementById('homeStatus');
	else if (option==1)
		link = document.getElementById('homeSignup');
	link.click();
}


