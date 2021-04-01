import FastAverageColor from 'fast-average-color';
import _ from 'lodash';

function identifiers(el){
    return el.id + " "+ Array.prototype.slice.call(el.classList).join(",")
}
function get_size(el){
    let rect = el.getBoundingClientRect()
    return rect.width * rect.height - rect.top * 5
}

function extract_img_svg(el){
    if(el.tagName.toLowerCase() == "img"){
        let ret = document.createElement("img")
        //ret.crossOrigin = "anonymous"
        ret.src = el.src
        return ret
    }else if(el.tagName.toLowerCase() == "svg"){
        return el.cloneNode(true);
    }
}

function hexToRgb(hex) {
    if(hex.length == 4){
        hex = hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
    }
    var res = hex.match(/[a-f0-9]{2}/gi);
    return res && res.length === 3
        ? res.map(function(v) { return parseInt(v, 16) })
        : null;
}  

function isDark(color) {
    // http://www.w3.org/TR/AERT#color-contrast
    const result = (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000;
    return result < 128;
}

function find_within(el){
    var candidates = []
    // find images within
    let imgs = el.querySelectorAll("img,svg");
    for(const item of imgs){
        candidates.push({
            el:extract_img_svg(item),
            size:get_size(item),
            prio:8,
            orig:item,
        })
    }
    // find background images within
    for(const item of el.querySelectorAll("*")){
        let style = getComputedStyle(item)
        var bgimg = style.getPropertyValue('background-image');
        if(typeof bgimg !== "undefined" && bgimg && bgimg != "none"){
            // console.log(bgimg)
            let img = document.createElement("img")
            //img.crossOrigin = "anonymous"
            let url = bgimg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
            img.src = url
            candidates.push({
                el:img,
                size:get_size(item),
                prio:7,
                orig:img
            })
        }
    }
    return candidates
}

function extract_logo(){
    var keywords = ['logo','brand',"identity"];

    // candidates
    let candidates = []

    // try and find images with classes that are like this
    var image_elements = [];
    for(const el of document.querySelectorAll('[role="banner"] img,header img,[role="banner"] svg, header svg')) {
        var meta = identifiers(el)
        var found = false
        for(const keyword of keywords){
            if(meta.includes(keyword)){
                found = true
                candidates.push({
                    el:extract_img_svg(el),
                    size:get_size(el),
                    prio:10,
                    orig:el,
                })
                break
            }
        }
        if(!found){
            candidates.push({
                el:extract_img_svg(el),
                size:get_size(el),
                prio:1,
                orig:el
            })
        }
    }

    // logo images
    for(const el of document.querySelectorAll('[class*="logo"] img,[class*="logo"] svg,[id*="logo"] img,[id*="logo"] svg,img[id*="logo"],svg[id*="logo"]')){
        candidates.push({
            el:extract_img_svg(el),
            size:get_size(el),
            prio:9,
            orig:el,
        })
    }

    // try and find other elements with the keyword
    for(const el of document.querySelectorAll('[role="banner"] *, header *')){
        var meta = identifiers(el)
        for(const keyword of keywords){
            if(meta.includes(keyword)){
                let tag = el.tagName.toLowerCase()
                if(tag == "img"){
                    candidates.push({
                        el:extract_img_svg(el),
                        size:get_size(el),
                        prio:8,
                        orig:el
                    })
                }else{
                    let style = getComputedStyle(el)
                    var bgimg = style.getPropertyValue('background-image');
                    if(typeof bgimg !== "undefined" && bgimg && bgimg != "none"){
                        // console.log(bgimg)
                        let img = document.createElement("img")
                        //img.crossOrigin = "anonymous"
                        let url = bgimg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                        img.src = url
                        candidates.push({
                            el:img,
                            size:get_size(el),
                            prio:7,
                            orig:img
                        })
                    }else{
                        for(const it of find_within(el)){
                            candidates.push(it)
                        }
                    }
                }
                break
            }
        }
    }

    //console.log("candidates",candidates)
    //console.log(candidates)

    if(candidates.length > 0){
        candidates = _.sortBy(candidates, [(item) => {
            return -item.size
        }])
        candidates = _.sortBy(candidates, [(item) => {
            item.prio
        }])
        //console.log("sorted",candidates)
        let chosen = candidates[0].el
        // check color
        if(candidates[0].orig.tagName.toLowerCase() == "svg"){
            var elements = candidates[0].orig.querySelectorAll("*")
            var sum = [0,0,0]
            var num = 0
            for(var el of elements){    
                if(typeof el.attributes.fill !== "undefined"){
                    var fillval = el.attributes.fill.value
                    if(fillval != "none"){
                        var rgb = hexToRgb(fillval)
                        if(rgb){
                            sum[0] += rgb[0]
                            sum[1] += rgb[1]
                            sum[2] += rgb[2]
                            num += 1
                        }
                    }
                }
            }
            if(num){
                sum[0] /= num
                sum[1] /= num
                sum[2] /= num
            }
            if(isDark(sum)){
                chosen.classList.add("invert")
            }
        }else{
            const fac = new FastAverageColor()
            let color = fac.getColor(candidates[0].orig,{
                defaultColor:[0,0,0,0]
            })
            if(color.isDark){
                chosen.classList.add("invert")
            }
        }
        let element = candidates[0].el.cloneNode(true)
        element.classList.add("widerweb-logo")
        return element
    }else{
        var p = document.createElement("p")
        p.classList.add("widerweb-logo")
        p.textContent = window.location.hostname
        return p
    }
}

export default extract_logo