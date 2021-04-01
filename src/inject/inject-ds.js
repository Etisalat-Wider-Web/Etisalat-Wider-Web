const browser = require("webextension-polyfill");
import { loadingOverplayer } from './modules/styling/components/loading';
_ini();
//window.document.
async function _ini() {
    let { setting } = await browser.storage.sync.get('setting');

    if (typeof setting !== "undefined") {
        if (setting.enabled) {
            loadingOverplayer.appendOverplay(setting.theme);
        }
    }
    else {
        // console.log('browser.storage.sync.get-setting', result);
    }


    window.onload = function () {
    }
    window.addEventListener("load", function (event) {
        if (window.self == window.top) {
            //loadingOverplayer.removeOverlay();
        }
    }, false);
}