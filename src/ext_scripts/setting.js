import _isEqual from 'lodash/isEqual';
const browser = require("webextension-polyfill");
let setting = getCurrentSetting();
let enabled = setting.enabled;
let fontstyle = setting.fontstyle;
let theme = setting.theme;
let device = setting.device;
init();
(async () => {
    let result = await browser.storage.sync.get("setting");
    if (typeof result.setting !== "undefined") {
        setting = result.setting;
        enabled = setting.enabled;
        fontstyle = setting.fontstyle;
        theme = setting.theme;
        device = setting.device;
        loadSetting();
    }
})();



function loadSetting() {
    //enable
    _setBackgroundColor(theme);
    var toggle_extension = document.querySelector(".toggle");
    if (enabled) {
        toggle_extension.classList.add("notransition");
        toggle_extension.classList.remove("off");
        toggle_extension.classList.add("on");
        setTimeout(function () {
            toggle_extension.classList.remove("notransition");
        }, 100);
    }
    //fontstyle
    document.querySelector(".togglebuttons-font a[fontstyle].active").classList.remove('active');
    document.querySelector(".togglebuttons-font a[fontstyle='" + fontstyle + "']").classList.add('active');
    //color-theme
    document.querySelector(".togglebuttons-col a[color].active").classList.remove('active');
    document.querySelector(".togglebuttons-col a[color='" + theme + "']").classList.add('active');
    //device
    document.querySelector(".togglebuttons-device a[device].active").classList.remove('active');
    document.querySelector(".togglebuttons-device a[device='" + device + "']").classList.add('active');
}
function init() {
    var toggle_extension = document.querySelector(".toggle");
    toggle_extension.addEventListener("click", function (e) {
        e.preventDefault();
        if (enabled) {
            toggle_extension.classList.remove("on");
            toggle_extension.classList.add("off");
        } else {
            toggle_extension.classList.remove("off");
            toggle_extension.classList.add("on");
        }
        enabled = !enabled;
        var currentSetting = getCurrentSetting();
        sendChangeSetting(currentSetting);
        return false;
    });

    var toggle_buttons_font = document.querySelectorAll(".togglebuttons-font a");
    for (var i = 0; i < toggle_buttons_font.length; i++) {
        var button = toggle_buttons_font[i];
        button.addEventListener("click", function (e) {
            e.preventDefault();

            for (var e = 0; e < toggle_buttons_font.length; e++) {
                toggle_buttons_font[e].classList.remove("active");
            }
            this.classList.add("active");
            var currentSetting = getCurrentSetting();
            sendChangeSetting(currentSetting);
            return false;
        });
    }

    var toggle_buttons_color = document.querySelectorAll(".togglebuttons-col a");
    for (var i = 0; i < toggle_buttons_color.length; i++) {
        var button = toggle_buttons_color[i];
        button.addEventListener("click", function (e) {
            e.preventDefault();

            for (var e = 0; e < toggle_buttons_color.length; e++) {
                toggle_buttons_color[e].classList.remove("active");
            }
            this.classList.add("active");
            var currentSetting = getCurrentSetting();
            _setBackgroundColor(currentSetting.theme);
            sendChangeSetting(currentSetting);
            return false;

        });
    }

    var toggle_buttons_device = document.querySelectorAll(".togglebuttons-device a");
    for (var i = 0; i < toggle_buttons_device.length; i++) {
        var button = toggle_buttons_device[i];
        button.addEventListener("click", function (e) {
            e.preventDefault();

            for (var e = 0; e < toggle_buttons_device.length; e++) {
                toggle_buttons_device[e].classList.remove("active");
            }
            this.classList.add("active");
            var currentSetting = getCurrentSetting();
            sendChangeSetting(currentSetting);
            return false;

        });
    }
    var cta_reportIssue = document.querySelector("#cta_reportIssue");
    cta_reportIssue.addEventListener("click", function (e) {
        e.preventDefault();
        sendReportIssue();
        return false;
    });

}

function getCurrentSetting() {
    var result = { enabled: null, fontstyle: null, theme: null };
    var form_enabled = document.querySelector("a.toggle").classList.contains('off') ? false : true;
    var form_fontstyle = document.querySelector(".togglebuttons-font a.active").getAttribute('fontstyle');
    var form_theme = document.querySelector(".togglebuttons-col a.active").getAttribute('color');
    var form_device = document.querySelector(".togglebuttons-device a.active").getAttribute('device');
    result = { enabled: form_enabled, fontstyle: form_fontstyle, theme: form_theme, device: form_device };
    return result;
}

function hasChange(currentSetting) {
    return !_isEqual(setting, currentSetting)
}

function _setBackgroundColor(theme) {
    if (theme == "medium") {
        document.body.style.backgroundColor = "#404040";
    } else {
        document.body.style.backgroundColor = "#6d6d6d";
    }
}

function sendChangeSetting(currentSetting) {
    if (hasChange(currentSetting)) {
        setting = currentSetting;
        browser.runtime.sendMessage({ method: "changeSetting", data: { setting: currentSetting } });
    }
}

async function sendReportIssue() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true, url: ['*://*/*'] });
    if (tabs.length > 0) {
        var tabId = tabs[0] ? tabs[0].id : null;
        if (tabId != null) {
            browser.tabs.sendMessage(tabId, { method: "reportIssue" });
        }
    }
}