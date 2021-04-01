import extract_nav from '../../extract-contents/nav'
import extract_logo from '../../extract-contents/logo'

class Nav {

    constructor() {
       this._init();
       var _intervalObj = null;
       window.addEventListener('load', (event) => { 
            this._intervalObj = setInterval(()=>{
                if(document.querySelector('div.widerweb-nav-icon') == null){ 
                    this._init(); //re-call extract nav   
                }
                else{
                    if(this._intervalObj != null){
                        clearInterval(this._intervalObj);
                    }                    
                }
            },500);                
      });       
    }

    _init (){
        this.nav_open = false;
        this.items = extract_nav();
        this.logo = null;
        if(this.items.length > 0){
            // add list nav 
            this.nav_icon = document.createElement("div")
            this.nav_icon.classList.add("widerweb-nav-icon")
            let hamburger = document.createElement("div")
            hamburger.classList.add("widerweb-hamburger")
            this.nav_icon.appendChild(hamburger)
            document.body.appendChild(this.nav_icon)

            this.nav = document.createElement("div")
            this.nav.classList.add("widerweb-nav")
            this.nav.id = 'simplywebnav'
            this.nav_wrap = document.createElement("div")
            this.nav_wrap.classList.add("widerweb-nav-inner")
            this.nav.appendChild(this.nav_wrap)

            for(var column of this.items){
                let col = document.createElement("div")
                col.classList.add("widerweb-nav-list")
                this.nav_wrap.appendChild(col)

                let title = document.createElement("div")
                title.classList.add("widerweb-nav-title")
                title.textContent = column.text
                col.appendChild(title)

                for(var child of column.children){
                    let item = document.createElement("div")
                    item.classList.add("widerweb-nav-list-item")
                    let link = document.createElement("a")
                    link.classList.add("widerweb-nav-list-item-link")
                    link.href = child.href
                    link.textContent = child.text
                    item.appendChild(link)

                    if( $.trim( link.textContent ).length ) {
                        col.appendChild(item)
                    }
                }
            }
            document.body.appendChild(this.nav);
            
            // extract logo
            this.create_logo()
        
            //events for icon
            this.nav_icon.addEventListener("click",(e) => {
                e.preventDefault();
                this.nav_open = !this.nav_open
                if(this.nav_open){
                    document.body.style.overflow = "hidden"
                    this.nav.style.display = "flex"
                    this.nav_icon.classList.add("widerweb-active-nav")
                }else{
                    this.nav.style.display = ""
                    document.body.style.overflow = ""
                    this.nav_icon.classList.remove("widerweb-active-nav")
                }
                return false;
            })

           
            this.resize_init();
        }
    }

    //LOGO 
    create_logo = () => {
        if(location.hostname == "www.etisalat.ae"){
            /* this.logo = extract_logo()
            document.body.appendChild(this.logo) */

            //////////// will be remove
            // trick to display logo for this website
            var objlogo = $('svg[class*="etisalat-logo"]').first();
            var newlogo = objlogo.clone();
            objlogo.attr('simplywebdisplay', 'hide')
            newlogo.addClass('widerweb-logo').appendTo('body');
        }

        /*var objlogo = $('[class*="logo"] img,[class*="logo"] svg,[id*="logo"] img,[id*="logo"] svg,img[id*="logo"],svg[id*="logo"]').first();
        objlogo.attr('id', 'simplywebnav-logo');
        $('body').append(objlogo);
        var hostname = window.location.origin;
        $("#simplywebnav-logo").wrap("<a href='"+hostname+"'></a>");*/
    }

    //RESIZE
    resize_init = () => {
        this.resize_menu();

        $(window).resize(()=> { 
            this.resize_menu();
        }).bind(this);
    }

    resize_menu = () => {
        /*var window_width = $(window).width();
        var nav_width = window_width - window_width % 300; // 300: width of item nav*/
        //$('#simplywebnav .widerweb-nav-inner').css('width', nav_width);
    }

    remove = () => {
        if(this.nav_icon){
            this.nav_icon.remove()
        }
        if(this.nav){
            this.nav.remove()
        }
        if(this.logo){
            this.logo.remove()
        }
    }
}

export default Nav;
