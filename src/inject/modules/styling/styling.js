import Nav from "./components/nav";
import sliderclsSlider from "./components/slider";
import videosclsVideos from "./components/video";
import reportclsReportFunction from "./components/reportfunction";
import {loadingOverplayer} from '../styling/components/loading';
const browserBuild = process.env.BROWSER_ENV || 'chrome';

var clsStyling = (function () {
    /////////////////////////
    //INIT
    function init() {
        request_init();
        check_content_emtpy();
        check_videos();
    }


    function run() {
        clsStyling.bg_check();
        videosclsVideos.init();
        sliderclsSlider.init();
        reportclsReportFunction.init();

        // reportclsReportFunction.show(); // TESTING
        loadingOverplayer.removeOverlay();
    }

    function disable(){
        if(typeof(this.navigation) != "undefined" && this.navigation){
            this.navigation.remove();
            this.navigation = null;
        }
    }


    /////////////////////////
    // text
    function text_checkisonimage(el) {

        var domRect = el.getBoundingClientRect();
        var x = domRect.x;
        var y = domRect.y;

        var window_h = $(window).height();

        var all_elements = getAllElementsFromPoint(x, y);
        for (var element of all_elements) {
            var obj = $(element);

            if (element.clientHeight > window_h) {
                break;
            }

            // find video or image
            if (obj.find("img").length > 0 || obj.find("picture").length > 0 || obj.find("video").length > 0) return true;
        }

        return false;

    }

    function getAllElementsFromPoint(x, y) {
        var elements = [];
        var display = [];
        var item = document.elementFromPoint(x, y);
        while (item && item !== document.body && item !== window && item !== document && item !== document.documentElement) {
            elements.push(item);
            display.push(item.style.display);
            item.style.visibility = "hidden";
            item = document.elementFromPoint(x, y);
        }
        // restore display property
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.visibility = display[i];
        }
        return elements;
    }


    /////////////////////////
    // Request
    var request_para = {
        running: false
    }

    function request_init() {
        new MutationObserver(() => {
            revert_bg_dot();
            bg_check();
        }).observe(document, {
            subtree: true,
            childList: true
        });
    }


    /////////////////////////
    // Background
    function bg_check() {
        // console.log('browserBuild - ', browserBuild);
      
        $("body *:not(.simplyweb-checked):not(picture):not(img):not(source)").each(function (i, e) {
            var background = $(this).css("background");

            if(background == '') {
                background = $(this).css("background-color"); 
            }
            // var bgColor = $(this).css("background-color");

            $(this).addClass('simplyweb-checked');

            console.log($(this).attr('class'), background);

            var hasBgImage = background.includes('url(');
            var hasImportant = background.includes('!important');

            if (!background.includes('rgba(0, 0, 0, 0)') && !hasBgImage && !hasImportant) {
                $(this).attr('simplywebbg', 'main')
            }

          
        });
    }

    function revert_bg_dot() {
        $(".colorList li, .selector-feature-label").attr( "simplywebbg", "convert_bg" );
    }

    //COLOR
    /* 
    https://jeromejaglale.com/shared/jeromejaglale/color_tool/
    https://stackoverflow.com/questions/13586999/color-difference-similarity-between-two-values-with-js
    */
    var color_para = {
        dark : {
            color1 : [16,16,16],
            color2 : [169,169,169]
        },
        medium : {
            color1 : [110,110,110],
            color2 : [0,0,12]
        },
        light : {
            color1 : [188,190,192],
            color2 : [231,231,231]
        }
    }
    
    function deltaE(rgbA, rgbB) {
        let labA = rgb2lab(rgbA);
        let labB = rgb2lab(rgbB);
        let deltaL = labA[0] - labB[0];
        let deltaA = labA[1] - labB[1];
        let deltaB = labA[2] - labB[2];
        let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
        let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
        let deltaC = c1 - c2;
        let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
        deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
        let sc = 1.0 + 0.045 * c1;
        let sh = 1.0 + 0.015 * c1;
        let deltaLKlsl = deltaL / (1.0);
        let deltaCkcsc = deltaC / (sc);
        let deltaHkhsh = deltaH / (sh);
        let i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
        return i < 0 ? 0 : Math.sqrt(i);
    }

    function rgb2lab(rgb) {
        let r = rgb[0] / 255,
            g = rgb[1] / 255,
            b = rgb[2] / 255,
            x, y, z;
        r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
        g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
        b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
        x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
        y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
        z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
        x = (x > 0.008856) ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
        y = (y > 0.008856) ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
        z = (z > 0.008856) ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;
        return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
    }

    function extract_navigation(domain){        
        if(typeof(this.navigation) == "undefined" || !this.navigation){
            // this.navigation = new Nav();
        }
    }

    //Check content null for estisalas
    function check_content_emtpy() {
        var content = $('.hero-image-section.hero-image .hero-details .c-left');
        content.each(function(){            
            if ($.trim($(this).text()) == "") {
                $(this).hide();
            }
          })
        
    }

    function check_videos() {
        $('video').removeAttr("autoplay");
        $('video').currentTime = 0;
    }

    //RETURN
    return {
        init: init,
        run:run,
        disable:disable,
        bg_check: bg_check,
        extract_navigation: extract_navigation,
    }
})();

export default clsStyling
