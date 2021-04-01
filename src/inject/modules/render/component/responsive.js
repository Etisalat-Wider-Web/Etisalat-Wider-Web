const iFrameResize = require('iframe-resizer')
import { v4 as uuidv4 } from 'uuid';
import { createBrowserHistory } from 'history/history.production.min.js';
let history = createBrowserHistory();
import _reduce from 'lodash/reduce';
import _isEqual from 'lodash/isEqual';
import extractDomain from 'extract-domain';
import { IFRAME_DOMAIN_SANBOX } from '../../../../utils/config'
import { _checkSupportedDomain, _checkBlacklistDomain } from '../../../../utils/functions'
import sliderclsSlider from "../../styling/components/slider";

class Responsive {
    watchingIframeURLChange_interval;
    watchingIframeURLChange_URL = '';
    etisalatUID = '';
    currentSetting = {};
    deviceDesktopLoaded;
    responsiveTabletOverplayID = 'etisalat-Responsive-TabletOverplay';
    responsiveTabletIframeID = 'etisalat-Responsive-TabletIframe';
    responsiveTabletIframeObj;
    responsiveMobileOverplayID = 'etisalat-Responsive-MobileOverplay';
    responsiveMobileIframeID = 'etisalat-Responsive-MobileIframe';
    responsiveMobileIframeObj;
    checkResponsiveDomain;
    checkBlacklistDomain;
    constructor() {
        this.watchingIframeURLChange_URL = window.location.href;
        this.etisalatParentUID = 'etisalatUUID-'+uuidv4();
        
    }
    async init() {   
        let _self = this;   
        this.checkResponsiveDomain = await _checkSupportedDomain(extractDomain(window.location.href));
        this.checkBlacklistDomain = await _checkBlacklistDomain(window.location.href);
        //console.log('Responsive');
        if(window.self == window.top){ //is top document - Parent 
            window.addEventListener("message", (event) => {  
                let action = typeof(event.data.action) != 'undefined' ? event.data.action : '';
                if(action == 'Iframe-Change-URL' && event.data.etisalatParentUID ==  _self.etisalatParentUID){
                    if(typeof _self.currentSetting.enabled != "undefined"){                        
                        let newURL = event.data.iframeLocation;
                        if(window.location.href != newURL && newURL != ''){
                            if(event.data.device == _self.currentSetting.device){
                                history.push({
                                    pathname: newURL,
                                    search: '',
                                    hash : ''
                                });
                                if(extractDomain(window.location.href).toLowerCase() == extractDomain(newURL).toLowerCase()){
                                    window.scrollTo(0,0);
                                }
                            }
                            //return content loaded false
                            _self.deviceDesktopLoaded = false;
                        }
                    }                    
                }        
            }, false);
        }
        else{ //for Iframe            
            if(typeof window.name == 'string' && window.name.indexOf('etisalatUUID-') == 0){
                document.querySelector('body').setAttribute('etisalatparent', 'false');

                let iframe_name = window.name;
                let iframe_name_arr = iframe_name.split(':device:');
                let tmpEtisalatParentUID = iframe_name_arr[0];
                let tmpDevice = iframe_name_arr[1];
                window.parent.postMessage({action:'Iframe-Change-URL',device:tmpDevice,etisalatParentUID:tmpEtisalatParentUID,iframeLocation:window.location.href}, "*");
            }
        }
    }
    process(setting,loadType){
        if(window.self == window.top){
            let _self = this;
            if(window.self == window.top){
                if(setting.enabled){
                    _self.enable(setting,loadType);
                }
                else{
                    _self.disable();
                }        
            
                if(loadType == 'onload'){                                  
                    _self.currentSetting = setting;
                    if(setting.enabled == true && setting.device != 'desktop'){
                        _self.deviceDesktopLoaded = false;
                        let reponsiveIframe = this.createIFrame(setting);
                        let reponsiveOverplay = _self.createdOverplay(setting,reponsiveIframe);                        
                    }else{
                        _self.deviceDesktopLoaded = true;
                    }         
                    // window.addEventListener("load",function(event) {   },false);      
                }
                else if(loadType == 'changeSetting'){                    
                    let settingChanges = _reduce(setting, function(result, value, key) {
                        return _isEqual(value, _self.currentSetting[key]) ?
                            result : result.concat(key);
                    }, []); 
                    //alert(settingChanges);
                    if(settingChanges.indexOf('enabled') != -1){
                        if(setting.enabled == true){
                            if(setting.device != 'desktop'){
                                let reponsiveIframe = this.createIFrame(setting);
                                let reponsiveOverplay = _self.createdOverplay(setting,reponsiveIframe);
                                if(_self.checkBlacklistDomain == false){
                                    sliderclsSlider.note_init();
                                }                                
                            }                         
                        }
                        else{
                            sliderclsSlider.note_delete();
                            if(_self.checkResponsiveDomain != false){
                                window.location.href = 'https://'+_self.checkResponsiveDomain.d[0];
                            }
                            else if(_self.deviceDesktopLoaded == false){
                                window.location.reload();
                            }                            
                        }
            
                    }else if(settingChanges.indexOf('device') != -1){  
                        if(setting.enabled == true){
                            if(setting.device != 'desktop'){
                                let reponsiveIframe = this.createIFrame(setting);
                                let reponsiveOverplay = _self.createdOverplay(setting,reponsiveIframe);
                                if(_self.checkBlacklistDomain == false){
                                    sliderclsSlider.note_init();
                                }    

                            } 
                            else{
                                sliderclsSlider.note_delete();
                                if(_self.checkResponsiveDomain != false){
                                    window.location.href = 'https://'+_self.checkResponsiveDomain.d[0];
                                }
                                else if(_self.deviceDesktopLoaded == false){
                                    window.location.reload();
                                }                   
                            }    
                        }                        
                    }
                } 
                _self.currentSetting = setting; 
            }   
        }  
    }
    enable(setting,loadType){
       let _self = this;
        if(window.self == window.top){ //is top document - Parent 
            document.querySelector('body').setAttribute('etisalatparent', 'true');
            document.querySelector('body').setAttribute('etisalatParentUID', _self.etisalatParentUID);  
            if(document.getElementById(this.responsiveTabletOverplayID)){
                document.getElementById(this.responsiveTabletOverplayID).style.display = "";                
            }
            if(document.getElementById(this.responsiveMobileOverplayID)){
                document.getElementById(this.responsiveMobileOverplayID).style.display = "";
            }   
        }
         
    }
    disable(){
        if(window.self == window.top){ //is top document
            document.querySelector('body').removeAttribute('etisalatparent');
            document.querySelector('body').removeAttribute('etisalatParentUID');
            if(document.getElementById(this.responsiveTabletOverplayID)){
                document.getElementById(this.responsiveTabletOverplayID).style.display = "none";
            }
            if(document.getElementById(this.responsiveMobileOverplayID)){
                document.getElementById(this.responsiveMobileOverplayID).style.display = "none";
            }
        }
    }

    _getThemeColor(setting){
        var themeColor = '#101010' // dark
        if(setting.theme == 'light') { // light
            themeColor = '#bcbec0'
        }else if(setting.theme == 'medium') { // medium
            themeColor = '#6e6e6e'
        }
        return themeColor;
    }

    createdOverplay(setting,reponsiveIframe){
        if(setting.device != 'desktop'){
            let responsiveOverplayID = setting.device == 'tablet' ?  this.responsiveTabletOverplayID : this.responsiveMobileOverplayID;
            let responsiveIframeID = setting.device == 'tablet' ?  this.responsiveTabletIframeID : this.responsiveMobileIframeID;
            if(typeof document.getElementById(responsiveOverplayID) !== 'undefined' && document.getElementById(responsiveOverplayID) != null){
                return false;
                //document.getElementById(responsiveOverplayID).remove();     
            }
            var overplayNode = document.createElement("div");
            overplayNode.id = responsiveOverplayID;
            /* overplayNode.style.position = 'fixed';
            overplayNode.style.width = '100%';
            overplayNode.style.height = '100%';
            overplayNode.style.left = 0;
            overplayNode.style.top = 0;
            overplayNode.style.opacity = 1;
            overplayNode.style.backgroundColor = this._getThemeColor(setting);
            overplayNode.style.zIndex = '999999'; */
    
            
            overplayNode.appendChild(reponsiveIframe);        
            document.body.appendChild(overplayNode);
            
            this.responsiveTabletIframeObj = iFrameResize.iframeResizer({ 
                log: false,
                checkOrigin: false
            }, '#'+responsiveIframeID) ;
            //watching url change
            //this._iframeChangeWatching();
        }
    }

    createIFrame = (setting) => {
        let responsiveIframeID = setting.device == 'tablet' ?  this.responsiveTabletIframeID : this.responsiveMobileIframeID;
        if(setting.device != 'desktop'){
            if(typeof document.getElementById(responsiveIframeID) !== 'undefined' && document.getElementById(responsiveIframeID) != null){
                if(document.getElementById(responsiveIframeID).src != window.location.href){
                    document.getElementById(responsiveIframeID).src = window.location.href;
                }
                else{
                    if(typeof this.responsiveTabletIframeObj != 'undefined' && typeof this.responsiveTabletIframeObj[0] != 'undefined'){
                        this.responsiveTabletIframeObj[0].iFrameResizer.resize();
                    }                    
                }
                return false;
                //document.getElementById(responsiveIframeID).remove();     
            }  
            const iframe = document.createElement('iframe');
            iframe.name = this.etisalatParentUID+':device:'+setting.device;
            iframe.id = responsiveIframeID;
            iframe.src = window.location.href;
            this.watchingIframeURLChange_URL = iframe.src;
            if(IFRAME_DOMAIN_SANBOX.includes(extractDomain(window.location.href))){
                iframe.setAttribute('sandbox',"allow-scripts allow-forms allow-same-origin allow-presentation allow-orientation-lock allow-modals allow-popups allow-popups-to-escape-sandbox allow-pointer-lock"); //allow-top-navigation allow-top-navigation-by-user-activation
            }
            /* iframe.style.height = "100%";
            iframe.style.width = "60%";
            iframe.style.position = "fixed";
            iframe.style.top = "0px";
            iframe.style.right = "20%";
            iframe.style.zIndex = "999999";
            iframe.style.backgroundColor = this._getThemeColor(setting);
            iframe.style.border = 0; */
            //document.body.appendChild(iframe);
            //addHeaderTag(iframe.contentWindow.document);
            //iframe.contentWindow.document.body.style.zoom =2;
            
            // iframe.addEventListener("load",function(event) {  
            //     //history.push(this.contentWindow.location.href);
            //     //console.log('iframe.addEventListener-"load"',window.location.href,this.contentWindow.location.href);
            //     //document.getElementById("etisalat-Responsive-Iframe").contentWindow.document.body.style.zoom = 1.3;  
            // },false);        
            return iframe;   
        }     
    }
    /* _iframeChangeWatching(){        
        let _self = this;
        if(typeof _self.watchingIframeURLChange_interval != 'undefined'){
            clearInterval(_self.watchingIframeURLChange_interval);
        }
        _self.watchingIframeURLChange_interval = setInterval(() => {
            if(typeof document.getElementById("etisalat-Responsive-Iframe") !== 'undefined'){
                //console.log('location.href',document.getElementById("etisalat-Responsive-Iframe").contentWindow.location.href,_self.watchingIframeURLChange_URL);
                let newURL = document.getElementById("etisalat-Responsive-Iframe").contentWindow.location.href;
                if(_self.watchingIframeURLChange_URL != newURL && newURL != '' && newURL != 'about:blank' && _self.watchingIframeURLChange_URL != ''){
                    history.push(newURL);
                    _self.watchingIframeURLChange_URL = newURL;
                }
                //console.log('location.href',document.getElementById("etisalat-Responsive-Iframe").contentWindow.location.href);
            }
        }, 200);  
    }    */ 
}
let responsive = new Responsive();
responsive.init();
export {responsive,Responsive} 
export default  Responsive
//module.exports = {responsive,Responsive} 
// module.exports = {responsive,Responsive} 
