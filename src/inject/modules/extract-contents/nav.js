
function identifiers(el){
    return el.id + " "+ Array.prototype.slice.call(el.classList).join(",")
}

function extract_links(parent,selector){
    let children = []
    for(let link of parent.querySelectorAll(selector)){
        children.push({
            text:link.textContent,
            href:link.href,
        })
    }
    return children
}

function extract_nav(){
    var columns = []

    if(location.hostname == "www.etisalat.ae"){
        // top
        let children = extract_links(document,'.top-nav-section .top-nav-left a')
        if(children.length > 0){
            columns.push({text:"",children:children})
        }
        document.querySelector('.top-nav-section svg title') && document.querySelector('.top-nav-section svg title').remove()
        children = extract_links(document,'.top-nav-section .top-nav-right a')
        if(children.length > 0){
            columns.push({text:"",children:children})
        }
        // mobile
        children = extract_links(document,'.navbar-nav > li:nth-child(1) div a')
        if(children.length > 0){
            columns.push({text:document.querySelector(".navbar-nav > li:nth-child(1) > a").textContent,children:children})
        }
        // home
        children = extract_links(document,'.navbar-nav > li:nth-child(2) div a')
        if(children.length > 0){
            columns.push({text:document.querySelector(".navbar-nav > li:nth-child(2) > a").textContent,children:children})
        }
        // devices
        children = extract_links(document,'.navbar-nav > li:nth-child(3) div a')
        if(children.length > 0){
            columns.push({text:document.querySelector(".navbar-nav > li:nth-child(3) > a").textContent,children:children})
        }
        // support
        children = extract_links(document,'.navbar-nav.nav-right > li:nth-child(1) div a')
        if(children.length > 0){
            columns.push({text:document.querySelector(".navbar-nav.nav-right > li:nth-child(1) > a").textContent,children:children})
        }
        // my account
        children = extract_links(document,'.navbar-nav.nav-right > li:nth-child(2) div a')
        if(children.length > 0){
            columns.push({text:document.querySelector(".navbar-nav.nav-right > li:nth-child(2) > a").textContent,children:children})
        }
    }else{
        var navs = document.querySelectorAll("nav")
        for(let nav of navs){
            // skip breadcrumb navigations
            var idents = identifiers(nav)
            if(idents.includes("breadcrumb")){
                continue
            }

            let links = [];
            for(let link of nav.querySelectorAll("a")){
                links.push({text:link.textContent,href:link.href})
            }
            if(links.length){
                var label = typeof nav.ariaLabel !== "undefined" ? nav.ariaLabel : null
                if(!label){
                    for(var i = 1; i < 3; i++){
                        let title = nav.querySelector("h"+i)
                        if(title){
                            label = title.textContent
                            break
                        }
                    }
                }
                columns.push({text:label,children:links})
            }
        }
    }
    return columns
}

export default extract_nav