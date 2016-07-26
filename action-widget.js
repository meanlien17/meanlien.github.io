/*
 * Action Widget
 */
jQuery(document).ready(function ($) {
	if ($('.actions-widget').length > 0) {
		//initialize share drawer
		if ($('.action-share').length > 0) {
			initShareAction($('#content'));
		}
		
		//initialize the action widget brochure button if link is in nav, or when brochureReady is triggered.
		if ($('.action-brochure').length > 0) {
			if (localeData == undefined || localeData == null) {
				$(document).on('getLocale', function () {
					initBrochureAction($('.actions-widget'));
				});
			} else {
				initBrochureAction($('.actions-widget'));
			}
		}

		//initialize the action widget special offers button if the link in header, or when specialOffersReady
		if ($('.action-offers').length > 0) {
			if (localeData == undefined || localeData == null) {
				$(document).on('getLocale', function () {
					initSpecialOfferAction($('.actions-widget'));
				});
			} else {
				initSpecialOfferAction($('.actions-widget'));
			}
		}

		$(document).on('click', '.action-item > a, .action-item > button, .action-item > span', function (e) {
			var $actionItem = $(this),
				actionOption = $actionItem.data('actionOption'),
				actionText = $actionItem.find('.text-line, .util-link').text();

			if (typeof dataLayer == 'object') {
				dataLayer.push({
					'event': 'action-widget-click',
					'action-option': String(actionOption), 
					'action-text': String(actionText) 
				});
			}
			if (actionOption == 'cruise with me' || actionOption == 'search cruises' || actionOption == 'get brochure') {
				e.preventDefault();
				setTimeout(function () {
					window.location.href = $actionItem.attr('href');
				}, 120);
			}
		});
	}
});

function initShareAction($container) {
	$container.on('click', '.action-share', function (e) {
		e.preventDefault();
		var $actionShareBtn = $(this);
		$actionShareBtn.toggleClass('active').trigger('blur').closest('.article-header').find('.action-share-drawer').slideToggle(function () {
			var actionStatus = '';
			if ($(this).is(':visible')) {
				dataLayer.push({ 
					'event': 'action-drawer-open', 
					'action-drawer-content': String('social share links')
				}); 
			}
		});
	});

	var addthisUrl = $container.find('.addthis_toolbox').attr('addthis:url');

	if (addthisUrl.substring(0,1) == '/') {
		addthisUrl = window.location.protocol + '//' + window.location.hostname + addthisUrl;
		$container.find('.addthis_toolbox').attr('addthis:url',addthisUrl);
	}
}

function initSpecialOfferAction($container) {
	if (localeData.specialOffers == 'true') {
		var guestInfoObj = guestProfile.getInfo();

		if (guestInfoObj == null) {
			// always show the specialOffers button (by using N) if guestInfo is not available
			displaySpecialOfferAction($container, 'N');
		} else {
			displaySpecialOfferAction($container, guestInfoObj.specialOffersFlag);
		}
	}
}

function displaySpecialOfferAction($container, specialOffersFlag) {
	if (specialOffersFlag === 'N') {
		var specialOffersUrl = $bookURL + '/captaincircle/specialOfferRegistration.page?popupCondition=special-offers-button-click&pageSection=action-widget&formType=popup';
		//show the special offer button and create a custom click event
		if (window.self === window.top) {
			$container.find('.action-offers').addClass('open-mfp mfp-iframe').prop('href',specialOffersUrl).attr({'data-mfp-width':'640px','data-mfp-height':'690px','data-mfp-main-class':'special-offers'}).closest('.action-item').removeClass('hidden');		
		} else {
			$container.on('click','.action-offers', function () {
				e.preventDefault();
				$('.action-offers', window.parent.document).trigger('click');
			});
		}
	}
}


function initBrochureAction($container) {
	if (localeData.brochures == 'true') {
		var getBrochureUrl = $('#navbar').find('.navbar-brochure').attr('href');
		//show button and populate the url for the brochure link
		$container.find('.action-brochure').prop('href',getBrochureUrl).closest('.action-item').removeClass('hidden');
		//force the link to open in the parent page when $container is not in top document
		if (window.self !== window.top) {
			$container.find('.action-brochure').prop('target','_parent');
		}
	}
}