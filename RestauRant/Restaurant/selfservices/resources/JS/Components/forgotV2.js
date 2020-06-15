var refreshIntervalId;
(function(){
	
	var mob_regex = /^[6-9][0-9]{9}$/;
	var email_regex = new RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$');
	var consnum_regex=/^[1][1-3][4-7][0-9]{10}$/;
	var userid_regex=/^[a-zA-Z0-9_.@]{6,40}$/;
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
		var signupTab=true;//forgot user id
		var loginTab=true;//forgot password
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
							$("#signin-id").val('');
							self.showSigninForm(event.target.getAttribute('data-signin'));
							$("#signin-id").focus();
						}
						else if( event.target.getAttribute("data-signin")=="reset"){						
					      //  display = $('#time');
							$('#statusErrMsg').html('');
							$('#statusErrMsg').hide();
							
									clearInterval(refreshIntervalId);
									$('#signin-otp').val('');
								    self.showSigninForm(event.target.getAttribute('data-signin'));
								    $("#signin-otp").focus();
									$('#cd-signin-resend').hide();
									$('#cd-signin-timer').show();
							        display = document.querySelector('#time-signin');
									startTimer(oneMinute, display,'signin');
								
							
						  
   
						}else{
							if(!signupTab) return;
							$('#signup-consnum').val('');
							$('#signup-email').val('');	
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
			var userId = $('#signin-id').val();
			var email = $('#signin-email').val();
			self.toggleError(document.getElementById('signin-email'), false);
			self.toggleError(document.getElementById('signin-id'), false);
			self.toggleError(document.getElementById('signin-password'), false);

		
				// Validating Email Field.
			 if ( !userId.match(userid_regex) || userId.length ==0 ) {
				self.toggleError(document.getElementById('signin-id'), true);
				$("#signin-id").focus();
				return false;
				}
			
			else if (email.length == 0) {
				//	$('#statusErrMsg').text("* All fields are mandatory *"); // This Segment Displays The Validation Rule For All Fields
					self.toggleError(document.getElementById('signin-email'), true);
					$("#signin-email").focus();
					return false;
				}
					// Validating Name Field.
			else if (!email.match(email_regex) || email.length == 0) {
					
					self.toggleError(document.getElementById('signin-email'), true);
					$("#signin-email").focus();
					return false;
				}
			else if ( code.length < 6) {
				self.toggleError(document.getElementById('signin-password'), true);
				$("#signup-password").focus();
				return false;
			}
			else{
					getUserStatus(email,userId,code);
			}
			
	
			
		});
		this.blocks[1].getElementsByTagName('form')[0].addEventListener('submit', function(event){
		
			var consnum = $('#signup-consnum').val();
			var semail = $('#signup-email').val();	
			event.preventDefault();
			self.toggleError(document.getElementById('signup-consnum'), false);
			self.toggleError(document.getElementById('signup-email'), false);
			if (consnum.length == 0) {
				self.toggleError(document.getElementById('signup-consnum'), true);
				$("#signup-consnum").focus();
				return false;
			}
				// Validating Name Field.
			else if (!consnum.match(consnum_regex) || consnum.length == 0) {
				
				self.toggleError(document.getElementById('signup-consnum'), true);
				$("#signup-consnum").focus();
				return false;
			}
				// Validating Email Field.
			else if (!email_regex.test(semail) || semail.length == 0) {
				self.toggleError(document.getElementById('signup-email'), true);
				$("#signup-email").focus();
				return false;
				}
			else{
					validateUser(consnum,semail);
				}
		
		});
		
		function validateUser(consnum,email){
			$('#btnSignUp').attr('disabled','disabled');
			$('#userIdErrMsg').html('');
			$('#userIdErrMsg').hide();
			loginTab=false;
			 $.ajax({
					 datatype:"application/json",
					url : "sendUserId",
					type : "POST",
					data : {
						 'consnum' : consnum,
			             'email' : email
			            
					},
					success : function(response) {			
						$('#btnSignUp').attr('disabled',false);
						if(response.err_flag!=0){
							if(response.err_flag==1){
								self.toggleError(document.getElementById(response.field), true);
							}else{
									$('#userIdErrMsg').show();
									$('#userIdErrMsg').html(response.message);
				
							}
						
						}else{
							$('#userIdErrMsg').html('');
							$('#userIdErrMsg').hide();
							link = document.getElementById('close');
							link.click();
							$.alert({
	                            title: 'Success',
	                            icon: 'fa  fa-check-circle',
	                            type: 'blue',
	                            content: response.message,
	                        });
							
						}					
					},
					error : function(e) {
					}
				});
		 }	
		
	 
		
		function getUserStatus(email,userId,code){
			$('#statusErrMsg').html('');
			$('#statusErrMsg').hide();
			signupTab=false;
			$('#refreshButton').attr('disabled','disabled');
			$('#btnLogin').attr('disabled','disabled');
			 $.ajax({
					 datatype:"application/json",
					url : "checkUserStatus",
					type : "POST",
					data : {
						 'email' : email,
			             'userId' : userId,
			             'code': code  ,
			             'uniqueId': $("#captchaUniqueIdHidden").val()
					},
					success : function(response) {	
						console.log(response);
						$('#refreshButton').attr('disabled',false);
						$('#btnLogin').attr('disabled',false);
						if(response.err_flag!=0){
						
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
							if(response.otp_err_flag!=0){
							  $('#userid').val(userId);
							  $('#email').val(email);
							  $('#form-app-status').submit();
							
							}else{
								
								$('#signinOtpMsg').html(response.message);
								clearInterval(refreshIntervalId);
								$("#signin-password").val('');
								$('#signin-otp').val('');
							    self.showSigninForm('reset');
								$('#cd-signin-resend').hide();
								$('#cd-signin-timer').show();
						        display = document.querySelector('#time-signin');
								startTimer(oneMinute, display,'signin');
							}
													
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
					url : "verifyForgotOTP",
					type : "POST",
					data : {
						 'otpInput' : otp
					},
					success : function(response) {	
						console.log(response);
						$('#btnLoginOtp').attr('disabled',false);
						if(response.err_flag!=0){
							$('#loginOtpErrMsg').show();
							$('#loginOtpErrMsg').html(response.message);
							$('#signin-otp').val('');
						}else{
							$('#loginOtpErrMsg').hide();
							$('#btnLoginOtp').attr('disabled','disabled');
							var form = document.createElement("form");
				   	    	form.setAttribute("method", "GET");
				   	    	form.setAttribute("action", "changepassCon");
				   	    	var input1 = document.createElement("input");
				   	    	input1.setAttribute("type", "hidden");
				   	        input1.setAttribute("name", "sessionId");
				   	    	input1.setAttribute("value",response.message);	
				   	    	form.appendChild(input1);
				   	    	document.body.appendChild(form);
				   	    	form.submit();
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


function stopCarret() {
	if (obj.value.length > 5){
		setCaretPosition(obj, 5);
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
	$('#loginOtpErrMsg').hide();
	$('#loginOtpErrMsg').html('');
	// clearInterval(refreshIntervalId);
	 //startTimer(oneMinute, display,tab);
		$.ajax({
			type : "POST",
			url : "resendForgotOTP",
			data : {	
				'otpInput' :  $('#signin-otp').val(),
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


