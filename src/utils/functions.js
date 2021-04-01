import axios from 'axios';
import _find from 'lodash/find';
import { BASE_API_URL } from './config';
import extractDomain from 'extract-domain';
const browser = require("webextension-polyfill");
export const callApi = ({ method = 'GET', url = '', baseURL = BASE_API_URL, headers = {}, params = {}, data = {} }) => {
    return axios({
        method,
        baseURL,
        url,
        headers,
        params,
        data
    })
}

export const _loadUserAgentDomain = async () => {
    let jsonUserAgentURL = browser.extension.getURL("/assets/json/domain-user-agent.json");
    return await (await axios.get(jsonUserAgentURL)).data;
}

export const _checkSupportedDomain = async (hostname) => {
    let listDomainUserAgent = await _loadUserAgentDomain();
    var result = _find(listDomainUserAgent, function (domain) { return domain.m == hostname || domain.d.indexOf(hostname) != -1 });
    return typeof (result) == 'object' ? result : false;
}

export const _loadBlacklistDomain = async () => {
    let jsonUserAgentURL = browser.extension.getURL("/assets/json/domain-blacklist.json");
    return await (await axios.get(jsonUserAgentURL)).data;
}

export const _checkBlacklistDomain = async (fullUrl) => {
    const rootHostName = extractDomain(fullUrl).toLowerCase();
    let listBlacklist = await _loadBlacklistDomain();
    let parseUrl = new URL(fullUrl);
    let pathName = parseUrl.pathname.toLowerCase();
    let index = (listBlacklist || []).findIndex(({ domain = [], path }) => {
        let findomainIndex = domain.findIndex((item) => { return item.replace('www.', '').toLowerCase() === rootHostName });
        if (typeof path == "undefined") {
            return findomainIndex != -1;
        } else {
            if (findomainIndex == -1) {
                return false;
            } else {
                return (path || []).findIndex((currentPath) => pathName.includes(currentPath.toLowerCase())) != -1
            }
        }
    });
    return index != -1 ? listBlacklist[index].block : false;
}

export const _changeBrowserIcon = async (setting, tabId, checkBlacklistDomain, callback) => {
    //console.log('_changeBrowserIcon',setting, tabId, checkBlacklistDomain, callback);
    let status = typeof setting != 'undefined' && typeof setting.enabled != 'undefined' && setting.enabled ? 'active' : 'inactive';
    if (status == 'active' && checkBlacklistDomain == 'all') {
        status = 'blacklisted';
    }
    var icons = {};
    if (status == 'active') {
        icons = {
            "16": browser.extension.getURL("/assets/images/icons/icon16.png"),
            "48": browser.extension.getURL("/assets/images/icons/icon48.png"),
            "128": browser.extension.getURL("/assets/images/icons/icon128.png")
        }
    }
    else if (status == 'inactive') {
        icons = {
            "16": browser.extension.getURL("/assets/images/icons/icon_inactive_16.png"),
            "48": browser.extension.getURL("/assets/images/icons/icon_inactive_48.png"),
            "128": browser.extension.getURL("/assets/images/icons/icon_inactive_128.png")
        }
    }
    else if (status == 'blacklisted') {
        icons = {
            "16": browser.extension.getURL("/assets/images/icons/icon_blacklisted_16.png"),
            "48": browser.extension.getURL("/assets/images/icons/icon_blacklisted_48.png"),
            "128": browser.extension.getURL("/assets/images/icons/icon_blacklisted_128.png")
        }
    }
    browser.browserAction.setIcon({ path: icons, tabId: tabId });
    if (typeof callback == 'function') {
        callback();
    }
}

export const _getDomain = (url) => {
    let domain = (new URL(url));
    return domain.hostname;;
}
