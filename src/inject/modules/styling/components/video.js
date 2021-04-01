var clsVideos = (function () {
    /////////////////////////
    //INIT
    function init() {
        color_init();
        stopall();
        ad_clearall() ;
        
        $(window).on('load', function () {
            yt_init();    
        });
    }

    function stopall() {
        var videos = document.querySelectorAll("video");
        for (var video of videos) {
            video.pause();
        }
    }

    /////////////////////////
    // COLOR
    function color_init() {
        $("body").on('play', "video", function() {
            // code here
            
        });
    }

    /////////////////////////
    // iframe youtube
    function yt_init() {
        $('iframe').each(function (index, element) {
            // element == this
            if($(this).attr('src')){
                var src = $(this).attr('src');
                src = src.replace("autoplay=1", "autoplay=0");
                $(this).attr('src', src);
                // console.log('src', src);
            }
            

            if($(this).attr('allow')){
                var allow = $(this).attr('allow');
                allow = allow.replace("autoplay", "");
    
                $(this).attr('allow', allow);
            }
            
        });
    }
    
    /////////////////////////
    // AD
    function ad_clearall() {
        ad_jwplayer_clear()
        ad_videobasic_clear()
    }

    function ad_videobasic_clear() {
        $(window).on('load', function () {
            $('video[title="Advertisement"]').each(function (index, element) {
                this.remove();
            });    
        });
     
        
        $("body").on('DOMSubtreeModified', ".article-videoproduction", function() {
            // code here
            // console.log('DOMSubtreeModified');
        });
        
    }
    function ad_jwplayer_clear() {
        var code = `
                try {
                    var playlist = jwplayer().getPlaylist()
                    // console.log('video_clearad', playlist[0].file);
                    var testplayer = jwplayer('player');
                            
                    testplayer.setup({
                                "width": "100%",
                                "aspectratio": "16:9",
                                "file" : playlist[0].file,
                                "autostart" : false,
                                "advertising": {
                                    "client": "",
                                    "adscheduleid": ""
                                }
                            });
                } catch (error) {
                    
                }
    `

    
        let script = document.createElement("script")
        script.textContent = code
        document.body.appendChild(script)
    }

    //RETURN
    return {
        init: init
    }
})();

export default clsVideos
