
var clsSlider = (function () {
    function init() {
        swiper_init();
        owl_init();
    }

    ////////////////////////////
    // swiper
    function swiper_init() {
        swiper_check();
        setTimeout(function(){
            swiper_check();
        },100)
        setTimeout(function(){
            swiper_check();
        },500)
        setTimeout(function(){
            swiper_check();
        },1000)
        setTimeout(function(){
            swiper_check();
        },2000)
        setTimeout(function(){
            swiper_check();
        },5000)
        setTimeout(function(){
            swiper_check();
        },10000)
    }

    function swiper_check() {
        var code = `
            var swiper = document.querySelectorAll('.swiper-container, .swiper-hero-container')
            for(let item of swiper){
                if(typeof item.swiper != "undefined" && typeof item.swiper.stopAutoplay == "function"){
                    item.swiper.stopAutoplay();
                }
                if(item.swiper && item.swiper.autoplay && typeof item.swiper.autoplay.stop == "function"){
                    item.swiper.autoplay.stop();
                }
            }
        `
        let script = document.createElement("script")
        script.textContent = code
        document.body.appendChild(script)
        script.remove();
    }

    ////////////////////////////
    // owl-carousel

    function owl_init() {
        

        $(window).on('load', function () {
            owl_stop();
        });
    }

    function owl_stop() {
        
        if($('.owl-carousel').length > 0) {
            var code = `
                try {
                    $('.owl-carousel').trigger('stop.owl.autoplay');         
                    
                } catch (error) {
                    
                }
                
            `
            let script = document.createElement("script");
            script.textContent = code;
            document.body.appendChild(script);
            script.remove();
            
            setTimeout(() => {
                owl_stop();
            }, 2000);
        }
        
    }

    // NOTE
    function note_delete() {
        try {
            document.getElementById("etisalatslidernote").remove();                 
        } catch (error) {
            
        }
    }
    function note_init() {
        if(window.self == window.top ) {
            note_create()
            note_event()
            
        }
    }

    function note_create() {
        if(typeof document.getElementById("etisalatslidernote") !== 'undefined' && document.getElementById("etisalatslidernote") != null){
            return ;
        }
        var image_url = chrome.extension.getURL("popup/assets/logo.svg");

            const div = document.createElement('div');
            div.id = 'etisalatslidernote';
            div.className = 'simplyweb-checked';

            div.innerHTML = `
                <img class='simplyweb-checked' src="${image_url}" width="100" />
                <p class='simplyweb-checked'>Click and Drag on carousels</p>
            `;

            div.addEventListener("click", function(){
                document.getElementById("etisalatslidernote") && (document.getElementById("etisalatslidernote").style.display = "none");
            });
            
          
            document.body.appendChild(div);
        
    }

    function note_event() {
        
        var code = `
            var slider_l = document.querySelectorAll("[class*='slide'], [class*='carousel']").length; 
            
            // slider_l = 1; // testing

            if(slider_l > 0) {
                document.getElementById("etisalatslidernote") && (document.getElementById("etisalatslidernote").style.display = 'block');
          
                setTimeout(() => {
                    document.getElementById("etisalatslidernote") && (document.getElementById("etisalatslidernote").style.display = "none");
        
                }, 5000);
            }
            

            try {
                
                             
            } catch (error) {
                
            }
            
        `
        let script = document.createElement("script")
        script.textContent = code

        document.body.appendChild(script)
        script.remove();
    }

    //RETURN
    return {
        init: init,
        note_init:note_init,
        note_delete:note_delete
    }
})();

export default clsSlider
