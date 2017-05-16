!function($) {
    $.fn.magicOverlay = function (options) {
        // default settings
        var settings = $.extend({
            overlayClass: 'magic-overlay',
            closeButtonClass: 'close-button',
            closeButtonContent: 'Close',
            contentClass: 'content',
            loadingContainerClass: 'loading-container',
            loadingContainerContent: '<span class="animate-loader-icon">+</span>',
            errorContainerClass: 'error-container',
            dataUrlAttributeName: 'data-url',
            loadContentAlwaysWithAJAX: false,
            cacheContent: true,
            showAnimationTime: 300,
        }, options);

        var el = $(this);
        var overlay = $("<div class='" + settings.overlayClass + "'></div>");
        var loadingContainer = $("<div class='" + settings.loadingContainerClass + "'>" + settings.loadingContainerContent + "</div>");
        var errorContainer = $("<div class='" + settings.errorContainerClass + "'></div>");
        var overlayContent = $("<div class='" + settings.contentClass + "'></div>");
        var closeButton = $("<a href='#' class='" + settings.closeButtonClass + "'>" + settings.closeButtonContent + "</a>");

        closeButton.on('click', function(){
            el.closeOverlay();
        });
        overlay.append(closeButton);
        overlay.append(overlayContent);
        overlay.hide().prependTo("body")

        el.on('click', function(){
            overlayContent.html(loadingContainer);
            var requestedURL = $(this).attr(settings.dataUrlAttributeName);
            var pageFragment = undefined;

            if (requestedURL.indexOf("#") != -1) {
                pageFragment = '#' + requestedURL.split("#").pop();
            }

            if ($(this).isCurrentUrlRequestedUrl() == true && !settings.loadContentAlwaysWithAJAX && pageFragment != undefined) {
                overlayContent.html($(pageFragment).clone());
            } else {
                overlayContent.load(requestedURL, function (response, status, xhr) {

                    if (status == "error") {
                        errorContainer.html("Sorry but there was an error: " + xhr.status + " " + xhr.statusText);
                        overlayContent.html(errorContainer);
                    }

                    if ($(overlayContent).html() == '') {
                        errorContainer.html('Content is missing :(');
                        overlayContent.html(errorContainer);
                    }
                });
            }
            el.openOverlay();
        });

        $.fn.openOverlay = function() {
            overlay.show(settings.showAnimationTime);
        }

        $.fn.closeOverlay = function() {
            overlay.hide();
            overlayContent.html('');
        }

        /**
         * Based on function getDomain() from http://stackoverflow.com/questions/12220345/how-to-compare-two-urls-in-javascript-or-jquery
        */
        function getDomain(url) {
            var prefix = /^https?:\/\//;
            var domain = /^[^\/]+/;
            // remove any prefix
            url = url.replace(prefix, "");
            // remove www
            url = url.replace(/^www\./, "");
            // assume any URL that starts with a / is on the current page's domain
            if (url.charAt(0) === "/") {
                url = window.location.hostname + url;
            }
            // now extract just the domain
            var match = url.match(domain);
            if (match) {
                return(match[0]);
            }
            return(null);
        }

        $.fn.isCurrentUrlRequestedUrl = function() {
            var currentDomain = document.location.host;
            var currentPathname = document.location.pathname;
            var requestedURL = $(this).attr(settings.dataUrlAttributeName);
            var requestedDomain = getDomain(requestedURL);

            requestedURL = requestedURL.replace(/^https?:\/\//, "");
            requestedURL = requestedURL.replace(/^www\./, "");
            requestedURL = requestedURL.replace(currentDomain, "");
            var requestedPathname = requestedURL.substr(0, requestedURL.indexOf(' '));

            if (currentDomain != requestedDomain) {
                return false;
            }

            if (currentPathname == requestedPathname) {
                return true;
            }

            return false;
        }
    }
}(window.jQuery);
