import clsStyling from '../styling/styling';
import { loadingOverplayer } from '../styling/components/loading';
import { blacklistOverplayer } from '../styling/components/blacklist-screen';
import { responsive } from './component/responsive';
import reportclsReportFunction from "../styling/components/reportfunction";
import { _checkBlacklistDomain } from '../../../utils/functions'
import sliderclsSlider from "../styling/components/slider";
const browser = require("webextension-polyfill");
const browserBuild = process.env.BROWSER_ENV || 'chrome';

const addHeaderTag = () => {
    const style_url = browser.extension.getURL("assets/css/styling.css");
    document.querySelector('head').append("<link rel='stylesheet' id='etisalatInjectCSS' type='text/css' href='" + style_url + "'>");
}

let currentSetting;
export const init = async (tab) => {

    clsStyling.init();
    //console.log("app - init",tab);
    // init if the extension is enabled
    const checkBlacklistDomain = await _checkBlacklistDomain(window.location.href);
    //console.log("checkBlacklistDomain",checkBlacklistDomain)
    const { setting } = await browser.storage.sync.get('setting');
    if (typeof setting !== "undefined") {
        applyTransform(setting, 'onload', checkBlacklistDomain);
    }
    else {
        // console.log('browser.storage.sync.get-setting', setting);
    }
    // browser.storage.sync.get(['setting'], function(result) {
    //     if(typeof result.setting !== "undefined"){
    //         // if(result.setting.enabled){                
    //         // }
    //         applyTransform(result.setting,'onload', checkBlacklistDomain);
    //     }
    //     else{
    //         console.log('browser.storage.sync.get-setting',result);
    //     }
    // });

    if (window.self == window.top) {
        window.addEventListener("message", function (event) {
            if (event.source == window && event.data && event.data.action == 'openNewTab') {
                browser.runtime.sendMessage({ method: 'openNewTab', data: event.data })
            }
        })
    }

    // handle updates so it can be enabled interactively
    browser.runtime.onMessage.addListener(messageReceived);
    function messageReceived(msg) {
        // console.log("onMessage",msg);
        if (msg) {
            if (msg.method == "changeSetting") {
                applyTransform(msg.data.setting, 'changeSetting', checkBlacklistDomain);
            }
            else if (msg.method == "reportIssue") {
                if (window.self == window.top) { //is top document - Parent 
                    reportclsReportFunction.show();
                }
            }
        }
        return true;
    }

}
function applyTransform(setting, loadType, checkBlacklistDomain) {
    //blacklistOverplayer.appendBlacklistOverplay(setting.theme);
    currentSetting = setting;
    if (setting.enabled) {
        enable(setting, loadType, checkBlacklistDomain);
    }
    else {
        disable(loadType, checkBlacklistDomain);
    }
}
function getDomain() {
    var hostname = window.location.hostname;
    var temp = hostname.split('.').reverse();
    var result = typeof temp[1] != 'undefined' ? temp[1] : temp[0];
    if (result.length <= 3) {
        if(typeof temp[2] != 'undefined'){
            result = temp[2];
        }
        else if(typeof temp[1] != 'undefined'){
            result = temp[1];
        } 
    }

    document.querySelector('body').setAttribute('domain', result);

    if (result == 'etisalat' && window.location.href.includes("smb")) {
        document.querySelector('body').setAttribute('page', 'smb');
    }

    return result;
}
function enable(setting, loadType, checkBlacklistDomain) {
    //console.log(' checkBlacklistDomain',checkBlacklistDomain);
    if (checkBlacklistDomain != false && checkBlacklistDomain == 'all') {
        loadingOverplayer.removeOverlay();
        blacklistOverplayer.appendBlacklistOverplay(setting.theme);
        return false;
    }
    if (checkBlacklistDomain == false || (checkBlacklistDomain != false && checkBlacklistDomain != 'all')) {
        responsive.process(setting, loadType);
    }

    clsStyling.run();

    //addHeaderTag();
    document.querySelector('body').classList.add('etisalat');
    document.querySelector('body').setAttribute('browser', browserBuild);
    document.querySelector('body').setAttribute('etisalattheme', setting.theme);
    document.querySelector('body').setAttribute('etisalatfontstyle', setting.fontstyle);
    if (checkBlacklistDomain == false || (checkBlacklistDomain != false && checkBlacklistDomain != 'all' && setting.device == 'desktop')) { //run except Ipad block
        document.querySelector('body').setAttribute('etisalatdevice', setting.device);
    }

    var domain = getDomain();
    clsStyling.extract_navigation(domain);

    // only running for mobile & tablet

    $(document).ready(function () {
        /* if((typeof window.name == 'string' && window.name.indexOf('etisalatUUID-') == 0) || window.self == window.top){

            var strcontent = "width=1024,initial-scale=1,maximum-scale=1";

            if($('meta[name="viewport"]').length == 0) {
                var viewPortTag=document.createElement('meta');
                viewPortTag.id="viewport";
                viewPortTag.name = "viewport";
                viewPortTag.content = strcontent;
                document.getElementsByTagName('head')[0].appendChild(viewPortTag);
            }else {
                $('meta[name="viewport"]').attr('content',strcontent);
            }
        
        }     */
    });
    /* document.querySelector('meta[name="viewport"]').remove();
    var meta = document.createElement('meta');
    meta.name = "viewport";
    meta.content = "width=375, height=375, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0";
    document.getElementsByTagName('head')[0].appendChild(meta); */


}

function disable(loadType, checkBlacklistDomain) {
    loadingOverplayer.removeOverlay();
    blacklistOverplayer.removeBlacklistOverlay(currentSetting.theme);

    document.querySelector('body').classList.remove('etisalat');
    clsStyling.disable();
    document.querySelector('body').removeAttribute('etisalattheme');
    document.querySelector('body').removeAttribute('etisalatfontstyle');
    document.querySelector('body').removeAttribute('etisalatdevice');
    responsive.process(currentSetting, loadType);

    sliderclsSlider.note_delete();
}