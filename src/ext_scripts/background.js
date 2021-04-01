import { INSTALLED_URL, BROWSER_ENV, mapUserAgent } from '../utils/config'
import BowserDetect from "bowser";
import { _checkBlacklistDomain, _changeBrowserIcon, _loadUserAgentDomain, _checkSupportedDomain, _getDomain } from '../utils/functions'
const browser = require("webextension-polyfill");

const filterHeaderRes = ["x-frame-options", "content-security-policy", "frame-options"];
const browserDetail = BowserDetect.parse(window.navigator.userAgent);
const blockPermission = ['blocking', 'responseHeaders'];
if (browserDetail.browser.name.toLowerCase() == "chrome") {
	blockPermission.push('extraHeaders');
}

browser.runtime.onInstalled.addListener(function (details) {
	if (details.reason === "install") {
		// Code to be executed on first install
		// eg. open a tab with a url
		browser.tabs.create({
			active: true,
			url: INSTALLED_URL
		});
	} else if (details.reason === "update") {
		// When extension is updated
	} else if (details.reason === "chrome_update") {
		// When browser is updated
	} else if (details.reason === "shared_module_update") {
		// When a shared module is updated
	}
});

/* browser.runtime.onMessageExternal.addListener(
	function (request, sender, sendResponse) {
		//console.log('onMessageExternalonMessageExternal',request, sender, sendResponse);
		// if (sender.url == blocklistedWebsite)
		//   return;  // don't allow this web page access
		// if (request.openUrlInEditor)
		//   openUrl(request.openUrlInEditor);
		if (typeof request.action != "undefined") {
			if (request.action == 'openNewTab') {
				browser.tabs.update(sender.tab.id, { url: "chrome://newtab/" });
			}
		}
	});
 */
browser.runtime.onMessage.addListener((msg) => {
	//console.log('browser.runtime.onMessage:',msg)
	if (msg) {
		if (msg.method == "changeSetting") {
			applySetting(msg, 'changeSetting').then(() => { }).catch(err => console.log(err));
		}
		else if (msg.method == "openNewTab") {
			browser.tabs.query({ active: true, currentWindow: true }).then(async tabs => {
				let browserHomeUrl = "about:newtab"; //chrome
				if (BROWSER_ENV && BROWSER_ENV == 'firefox') {
					try {
						let homepage = await browser.browserSettings.homepageOverride.get({});
						let firstHomepage = homepage.value.split('|')[0];
						browserHomeUrl = firstHomepage;
					} catch (error) {
						browserHomeUrl = 'about:home';
					}
					if(browserHomeUrl == 'about:home'){
						browser.tabs.create({ active: true });
						browser.tabs.remove(tabs[0].id);
						return;
					}
				}
				if (BROWSER_ENV == "safari") {
					browser.tabs.create({ active: true });
					browser.tabs.remove(tabs[0].id);
					return;
				}
				browser.tabs.update(tabs[0].id, { url: browserHomeUrl });
			}).catch(err => console.log('browser.tabs.query', err));
		}
	}
	return true;
});


browser.browserAction.onClicked.addListener((tab) => {
	const tabId = tab ? tab.id : null;
	/*browser.tabs.executeScript(tabId, {
	  file: "./assets/js/render.bundle.js"
	});*/
})


browser.tabs.onUpdated.addListener(
	async (tabId, changeInfo, tab) => {
		//console.log('browser.tabs.onUpdated.addListener',changeInfo,tab);
		// read changeInfo data and do something with it (like read the url)
		/* if (changeInfo.url){
			console.log('changeInfo.url : ',changeInfo.url);   
			if(changeInfo.url.indexOf('http://') >= 0 || changeInfo.url.indexOf('https://') >= 0){
			  applySetting(null,'onload');     
			}       
		} */
		if (typeof changeInfo.status != 'undefined') {
			if (changeInfo.status == 'loading') {
				if (tab.url.indexOf('http://') >= 0 || tab.url.indexOf('https://') >= 0) { //changeInfo.status == 'complete' && 
					//console.log('browser.tabs.onUpdated.addListener',changeInfo,tab);  
					await applySetting(null, 'onload');
				}
			}
			else if (changeInfo.status == 'complete') {
				//console.log('remove block',_cancelRequest);
				browser.webRequest.onBeforeRequest.removeListener(_cancelRequest);
				await _sendExtentionIDToWebpage(tabId, tab.url);
			}
		}
		if (typeof changeInfo.favIconUrl != 'undefined') {
			//console.log('remove block',_cancelRequest);
			browser.webRequest.onBeforeRequest.removeListener(_cancelRequest);
		}
	}
);
browser.tabs.onActivated.addListener(async (activeInfo) => {
	const tab = await browser.tabs.get(activeInfo.tabId);
	let { setting } = await browser.storage.sync.get('setting');
	if (typeof setting != "undefined") {
		await applySetting(setting, 'activeTab');
	}
	// browser.tabs.get(activeInfo.tabId, (tab) => {
	//   if (typeof (setting) != "undefined") {
	//     applySetting(setting, 'activeTab');
	//   }
	// })
});


async function _responsiveChangeZoom(setting, tabId, checkBlacklistDomain) {
	try {
		//console.log('_responsiveChangeZoom- init', setting, tabId, checkBlacklistDomain);
		try {
			await browser.tabs.setZoomSettings(tabId, { mode: "automatic", scope: "per-tab" });//defaultZoomFactor:0,     
		} catch (error) {
			console.log('setZoomSettings', error);
		}

		//console.log('_responsiveChangeZoom', setting, tabId, checkBlacklistDomain)
		if (setting.enabled == true && checkBlacklistDomain == false) {
			var zoomLevel = 1;
			if (setting.device == 'tablet') {
				zoomLevel = 1.5;
			}
			else if (setting.device == 'mobile') {
				zoomLevel = 2.5;
			}
			let zoomFactor = await browser.tabs.getZoom(tabId);
			if (zoomFactor != zoomLevel) {
				await browser.tabs.setZoom(tabId, zoomLevel);
			}

		}
		else {
			try {
				const [zoomSettings, zoomFactor] = await Promise.all([browser.tabs.getZoomSettings(tabId), browser.tabs.getZoom(tabId)]);
				if (zoomFactor != zoomSettings.defaultZoomFactor) {
					await browser.tabs.setZoom(tabId, zoomSettings.defaultZoomFactor);
				}
			} catch (error) {
				await browser.tabs.setZoom(tabId, 0);
			}
		}

	} catch (err) {
		console.log('responsiveChangeZoom : ', err.message);
	}
}

async function applySetting(msg, applyType) {
	let { setting } = await browser.storage.sync.get('setting');
	if (msg != null && applyType == 'changeSetting') {
		setting = msg.data.setting;
		await browser.storage.sync.set({ "setting": msg.data.setting });
	}
	if (typeof setting != "undefined") {
		_changeBrowserIcon(setting, null, null);
	}
	const tabs = await browser.tabs.query({ url: ['*://*/*'] });
	await Promise.all(
		Array.from(tabs, tab => {
			let tabId = tab ? tab.id : null;
			let tabUrl = tab ? tab.url : null;
			if (tabId != null) {
				if (typeof setting != "undefined") {
					if (tab.active) {
						// let checkBlacklistDomain = await _checkBlacklistDomain(tabUrl.toLowerCase());
						_checkBlacklistDomain(tabUrl.toLowerCase()).then(async (res) => {
							_changeBrowserIcon(setting, tabId, res);
							//console.log('checkBlacklistDomain',applyType,tabs[i],checkBlacklistDomain,setting);
							_responsiveChangeCancelRequest(setting, tab, applyType, res);
							//UserAgent
							_responsiveChangeUserAgent(setting, tab, applyType, res);
							//setzoom
							_responsiveChangeZoom(setting, tabId, res);
						})

					}
					//send message change to webpage
					if (applyType == 'changeSetting' && msg != null) {
						browser.tabs.sendMessage(tabId, msg).catch(err => console.log(err));
					}
				}
			}
		})
	).catch(err => console.log(err));
}


function _requestHeaderModify(parameters, setting) {
	for (var i = 0; i < parameters.requestHeaders.length; ++i) {
		if (parameters.requestHeaders[i].name === 'User-Agent') {
			parameters.requestHeaders[i].value = mapUserAgent[setting.device] || parameters.requestHeaders[i].value
			break;
		}
	}
	return { requestHeaders: parameters.requestHeaders };
}

function _responsiveChangeUserAgent(setting, tab, applyType, checkBlacklistDomain) {
	const _requestHeaderModifyWrap = (parameters) => {
		return _requestHeaderModify(parameters, setting);
	}
	if (setting.enabled == true && setting.device != 'desktop' && checkBlacklistDomain == false) {
		browser.webRequest.onBeforeSendHeaders.addListener(_requestHeaderModifyWrap,
			{ urls: ["*://*/*"] },
			["blocking", "requestHeaders"]
		);
	}
	else {
		browser.webRequest.onBeforeSendHeaders.removeListener(_requestHeaderModifyWrap);
	}

	//reload if back desktop supported sites
	if (tab.url.indexOf('http://') >= 0 || tab.url.indexOf('https://') >= 0) {
		let hostname = _getDomain(tab.url);
		let domainInfo = _checkSupportedDomain(hostname);
		if ((setting.enabled == false || (setting.enabled == true && setting.device == 'desktop')) && domainInfo) {
			if (applyType == 'changeSetting') {
				//apply clear cache
				_clearRedirectCache();
				if (domainInfo) {
					//browser.tabs.update(tab.id, { url: "https://" + domainInfo.d[0] });
				}
				setTimeout(() => {
					browser.webRequest.onBeforeSendHeaders.removeListener(_requestHeaderModifyCache);
				}, 200);
			}
		}
	}
}
function _requestHeaderModifyCache(parameters) {
	var headers = parameters.requestHeaders || [];
	headers.push({
		"name": "Cache-Control",
		"value": "no-cache"
	});
	headers.push({
		"name": "pragma",
		"value": "no-cache"
	});
	return { requestHeaders: headers };
}
function _clearRedirectCache() {
	browser.webRequest.onBeforeSendHeaders.addListener(
		_requestHeaderModifyCache,
		{ urls: ["*://*/*"] },
		["blocking", "requestHeaders"]
	);
}
/*************************** responsive user-agent ****************************/

/*************************** responsive block loading main in iframe Mode(table/mobile) ****************************/
function _responsiveChangeCancelRequest(setting, tab, applyType, checkBlacklistDomain) {
	//console.log(setting.enabled == true , setting.device != 'desktop', checkBlacklistDomain == false);
	if (setting.enabled == true && setting.device != 'desktop' && checkBlacklistDomain == false) {
		browser.webRequest.onBeforeRequest.addListener(
			_cancelRequest,
			{ urls: ["*://*/*"], tabId: tab.id },
			["blocking"]
		);
	}
	else {
		browser.webRequest.onBeforeRequest.removeListener(_cancelRequest);
	}
}
function _cancelRequest(requestDetails) {
	//console.log("Canceling: " + requestDetails.url,requestDetails);
	var cancelReuqest = false;
	if (requestDetails.frameId == 0) {
		if (requestDetails.type == 'main_frame') {
			//console.log("Canceling - main_frame: " + requestDetails.url,requestDetails);
			cancelReuqest = false;
		}
		else {
			//console.log("Canceling - else: " + requestDetails.url,requestDetails);
			cancelReuqest = true;
		}
	}
	else {
		//console.log("Canceling - frameId != 0: " + requestDetails.url,requestDetails);
		cancelReuqest = false;
	}
	return { cancel: cancelReuqest };
}
/*************************** responsive block loading main in iframe Mode(table/mobile) ****************************/

/*******************************************************************************************************************/
async function _sendExtentionIDToWebpage(tabId, tabURL) {
	if (tabURL.indexOf('http://') >= 0 || tabURL.indexOf('https://') >= 0) {
		let parseUrl = new URL(tabURL);
		let hostname = parseUrl.hostname;
		await browser.tabs.executeScript(tabId, {
			allFrames: true,
			code: `
					if(typeof document.getElementById("btn-etisalat-done") !== 'undefined' && document.getElementById("btn-etisalat-done") != null){
						document.querySelector("#btn-etisalat-done").setAttribute("extID","`+ browser.runtime.id + `");
					}
				`
		});
	}
}

browser.webRequest.onHeadersReceived.addListener(details => {
	let responseHeaders = details.responseHeaders.filter(e => !filterHeaderRes.includes(e.name.toLowerCase()));
	return { responseHeaders };
}, { urls: ["https://*/*", "http://*/*"], types: ['sub_frame'] }, blockPermission);

(async () => {
	let { setting } = await browser.storage.sync.get('setting');
	await _changeBrowserIcon(setting, null, null);
})()




