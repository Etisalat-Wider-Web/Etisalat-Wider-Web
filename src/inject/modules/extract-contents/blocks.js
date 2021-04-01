
function scan_for_blocks(el){
    // console.log("scan",el);
    // too high, scan for children
    if(el.getBoundingClientRect().height > 1000){
        var blocks = []
        for(let child of el.childNodes){
            blocks.concat(scan_for_blocks(child));
        }
        return blocks
    // fits criteria, try extraction
    }else{
        if(el.getBoundingClientRect().height <= 20){
            return [];
        }else{
            // console.log("valid block?",el);
            return [];
        }
    }

}

function extract_blocks(){
    var blocks = []

    if(window.location.hostname == "www.etisalat.ae"){
        let hero = document.querySelector(".hero-banner-section")
        if(hero){
            var slides = []
            for(let slide of hero.querySelectorAll(".swiper-slide")){
                let title = null
                let title_el = slide.querySelector(".hero-title")
                if(title_el){
                    title = title_el.textContent
                }
                let desc = null
                let desc_el = slide.querySelector(".hero-description")
                if(desc_el){
                    desc = desc_el.textContent
                }
                let cta_text = null
                let cta_link = null
                let cta_el = slide.querySelector(".hero-cta a")
                if(cta_el){
                    cta_text = cta_el.textContent
                    cta_link = cta_el.href
                }
                let image = null
                let image_el = slide.querySelector(".hero-bg-images picture source")
                if(image_el){
                    image = image_el.srcset
                }
                slides.push({
                    title:title,
                    description:desc,
                    cta_text:cta_text,
                    cta_link:cta_link,
                    image:image,
                })
            }
            blocks.push({
                type:"carousel",
                slides:slides,
            })
        }
        
        let herolinks = document.querySelector(".hero-links-secton")
        if(herolinks){
            var icons = []
            for(let item of herolinks.querySelectorAll("a")){
                let label = item.querySelector("span").textContent
                let url = item.href
                let img = item.querySelector("svg").cloneNode(true)
                icons.push({
                    img:img,
                    label:label,
                    url:url,
                })
            }
            // console.log("icons",icons)
            blocks.push({
                type:"floaticon",
                icons:icons,
            })
        }

        let productgrid = document.querySelector(".product-grid-text-section.devices")
        if(productgrid){
            let title = null
            let title_el = productgrid.querySelector(".wst-main-headings h2")
            if(title_el){
                title = title_el.textContent
            }
            let description = null
            let desc_el = productgrid.querySelector(".main-text-content-wrapper")
            if(desc_el){
                description = desc_el.textContent
            }
            let cta_link = null
            let cta_label = null
            let cta_el = productgrid.querySelector(".main-text-section a.learn-more")
            if(cta_el){
                cta_link = cta_el.href
                cta_label = cta_el.textContent
            }
            let products = []
            // console.log("products",productgrid.querySelectorAll(".swiper-slide"))
            for(let item of productgrid.querySelectorAll(".swiper-slide")){
                let subtitle = null
                let subtitle_el = item.querySelectorAll(".catagory")
                if(subtitle_el){
                    subtitle = subtitle_el.textContent
                }

                let title = null
                let title_el = item.querySelector("h2")
                if(title_el){
                    title = title_el.textContent
                }

                let priceline = null
                let priceline_el = item.querySelector(".from")
                if(priceline_el){
                    priceline = priceline_el.textContent
                }

                let price = null
                let price_el = item.querySelectorAll(".detail-price-new")
                if(price_el){
                    price = price_el.textContent
                }

                let priceinfo = null
                let priceinfo_el = item.querySelector(".bottom-text")
                if(priceinfo_el){
                    priceinfo = priceinfo_el.textContent
                }

                let extra = null
                let extra_el = item.querySelector(".smile-points")
                if(extra_el){
                    extra = extra_el.textContent
                }

                let cta_label = null
                let cta_label_el = item.querySelector(".read-more")
                if(cta_label_el){
                    cta_label = cta_label_el.textContent
                }

                let url = null
                let url_el = item.querySelector("a.tile")
                if(url_el){
                    url = url_el.href
                }
                
                let img = null
                let img_el = item.querySelector(".product-img")
                if(img_el){
                    img = img_el.getAttribute("data-src")
                }
                products.push({
                    subtitle:subtitle,
                    title:title,
                    priceline:priceline,
                    price,
                    priceinfo,
                    extra,
                    cta_label,
                    img,
                    url,
                })
            }

            blocks.push({
                type:"productgrid",
                title:title,
                description:description,
                cta_link:cta_link,
                cta_label:cta_label,
                products:products
            })
        }
        
    }else if(window.location.hostname == "economist.com"){

    }

    // turns all blocks into markup blocks
    //var elements = document.querySelectorAll("body > *")
    
    /*var bodyheight = document.querySelector("body").getBoundingClientRect().height;
    
    console.log("body height",bodyheight);

    for(var el of elements){
        var toblock = ["script","style","iframe"]
        if(toblock.includes(el.tagName.toLowerCase())){
            continue
        }
        let cloned = el.cloneNode(true)
        cloned.querySelectorAll(".skip-link, #nav-access, iframe, style, script, nav, header").forEach((child) => {
            child.remove()
        })
        cloned.querySelectorAll("a").forEach((el) => {
            el.target = "_parent"
        })

        var blocks = scan_for_blocks(el);

        console.log("element",el,el.getBoundingClientRect().height);
        

        //blocks.push({
        //    type:"markup",
        //    markup:cloned
        //})
    }*/

    return blocks
}

export default extract_blocks;