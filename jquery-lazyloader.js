if (!window["$"]) {
	console.log("jquery-lazyloader.js: Error >> JQuery must be defined");
}

/**
 * @component lazyLoader
 * Lazy load images
 * @requires JQuery http://www.jquery.com
 * @requires JQuery Velocity http://julian.com/research/velocity/
 * @author Daniel Ivanovic dan.ivanovic@antiblanks.com
 */
(function($) {
  	$.fn.lazyLoader = function(options) {
  		var self = this;
	  	var isLoaded = false;
	    var isRetina = window.devicePixelRatio > 1;

	    options = $.extend({
	    	"loadWhenInRange": 250,
	    	"callback": null
	    }, options);

	    this.one("lazyLoader", function() {
	    	var srcImage = isRetina 
		    	? $(this).attr("data-image-retina") 
		    	: $(this).attr("data-image");
		    if (!srcImage || srcImage.length == 0) {
		    	console.log("jquery-lazyloader.js: Error >> img src is not defined, please add data-image-retina & data-image attributes", $(this));
		    	return;
		    }
	    	$(this).css({"opacity": 0});
	        $(this).attr("src", srcImage);
	        $(this).velocity({
	        	"opacity": 1
	        }, 500);
	        $(this).removeClass("loading").addClass("loaded");
	        if (typeof options.callback == "function") 
	        	options.callback.call(this);
	    });

	    function lazyLoader() {
			var imagesInView = self.filter(function() {
				if ($(this).is(":hidden")) 
					return;

				var windowScrollTop = $(window).scrollTop();
				var windowOffsetBottom = windowScrollTop + $(window).height();
				var imageOffsetTop = $(this).offset().top;
				var imageOffsetBottom = imageOffsetTop + $(this).outerHeight();

				return imageOffsetBottom >= windowScrollTop - options.loadWhenInRange && 
					imageOffsetTop <= windowOffsetBottom + options.loadWhenInRange;
			});

			isLoaded = imagesInView.addClass("loading").trigger("lazyLoader");
			self = self.not(isLoaded);
	    };

	    $(window).on("scroll.lazyLoader", lazyLoader);
	    $(window).on("resize.lazyLoader", lazyLoader);
	    $(window).on("lookup.lazyLoader", lazyLoader);

	    $(this).removeClass("loading").removeClass("loaded");
	    lazyLoader();
	    return self;
	};
})(jQuery);