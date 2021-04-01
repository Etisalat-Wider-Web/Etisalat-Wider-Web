import '../assets/scss/inject.scss'

import { init } from './modules/render/app';
init();

// chrome.extension.sendMessage({}, function(response) {
// 	var readyStateCheckInterval = setInterval(function() {
// 	if (document.readyState === "complete") {
// 		clearInterval(readyStateCheckInterval);

// 		// ----------------------------------------------------------
// 		// This part of the script triggers when page is done loading
// 		console.log("Hello. This message was sent from scripts/inject.js");
// 		// ----------------------------------------------------------

// 	}
// 	}, 10);
// });

// console.log('inject');
// var $ = require( "jquery" );

// import {ExtractorHeader,extractorHeaderOBJ} from './modules/extract-contents/header';

// let webContentData = {};
// webContentData.header = extractorHeaderOBJ.extact();

// console.log(webContentData);

//console.log($('body').html());

// import sanitizeHtml from 'sanitize-html';
// (() => {
//     const navContainer = document.querySelectorAll('header nav ul li a[href]:not([href="#"]');
//     let itemNav = navContainer[0].parentNode;
//     while (itemNav && sanitizeHtml(itemNav.innerHTML, { allowedTags: [] }) == "" && itemNav.tagName != "ul") {
//         itemNav = itemNav.parentNode;
//     }
//     console.log(itemNav)

// })()
