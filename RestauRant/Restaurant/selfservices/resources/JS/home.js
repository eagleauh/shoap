$( document ).ready(function() {
	 $('.center').slick({
		 slidesToShow: 3,
		  autoplay: true,
		  autoplaySpeed: 3500,
		  centerMode: true,
		  lazyLoad: 'ondemand',
		  centerPadding: '10px',
		  arrows: true,
		  dots: true,
		  responsive: [
			  {
 			      breakpoint: 1440,
 			      settings: {
 			        arrows: false,
 			        centerMode: true,
 			        centerPadding: '20px',
 			        slidesToShow: 2
 			      }
 			    },
		               {
		 			      breakpoint: 1024,
		 			      settings: {
		 			        arrows: false,
		 			        centerMode: true,
		 			        centerPadding: '20px',
		 			        slidesToShow: 2
		 			      }
		 			    },
			    {
			      breakpoint: 768,
			      settings: {
			        arrows: false,
			        centerMode: true,
			        centerPadding: '40px',
			        slidesToShow: 1
			      }
			    },
			    {
			      breakpoint: 480,
			      settings: {
			        arrows: false,
			        centerMode: true,
			        centerPadding: '20px',
			        slidesToShow: 1
			      }
			    }
			  ]
		  });

		document.getElementById("appendedtext1").focus();

		 
	});


	function close() {
		document.getElementById("errormsg").style.display = "none";
		focuson();
		document.getElementById('errorMsg').style.display = 'none';
	}
	function focuson() {
		document.getElementById("appendedtext1").focus();
	}
	/* ----------------------------------------- */
navigator.browserSpecs = (function(){
	    var ua = navigator.userAgent, tem, 
	        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	    if(/trident/i.test(M[1])){
	        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
	        return {name:'IE',version:(tem[1] || '')};
	    }
	    if(M[1]=== 'Chrome'){
	        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
	        if(tem != null) return {name:tem[1].replace('OPR', 'Opera'),version:tem[2]};
	    }
	    M = M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
	    if((tem = ua.match(/version\/(\d+)/i))!= null)
	        M.splice(1, 1, tem[1]);
	    return {name:M[0], version:M[1]};
	})();

	console.log(navigator.browserSpecs); 

	if (navigator.browserSpecs.name == 'Firefox') {
	    if (navigator.browserSpecs.version <30) {	
				alert("Sorry, Web Self Service application does not support your browser And Do you know your browser is out of date? For best results, please upgrade to a newer version");
	    }
	}
	else if (navigator.browserSpecs.name == 'Chrome') {
	    if (navigator.browserSpecs.version <38) {	
			alert("Sorry, Web Self Service application does not support your browser And Do you know your browser is out of date? For best results, please upgrade to a newer version");
		}
	}else if (navigator.browserSpecs.name == 'IE') {
	    if (navigator.browserSpecs.version <10) {	
			alert("Sorry, Web Self Service application does not support your browser And Do you know your browser is out of date? For best results, please upgrade to a newer version");
		}
	}else if (navigator.browserSpecs.name == 'Opera') {
	    if (navigator.browserSpecs.version <17) {	
			alert("Sorry, Web Self Service application does not support your browser And Do you know your browser is out of date? For best results, please upgrade to a newer version");
		}
	}
	
	