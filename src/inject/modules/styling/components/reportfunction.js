import { callApi } from '../../../../utils/functions';
let ajaxCall = false;
var clsReportFunction = (function () {
    /////////////////////////
    //INIT
    function init() {
        create();
        events();
    }

    /////////////////////////
    //FUNCTIONS
    function events() {
        $('html').on('click', '.js-reportfunction-close', function () {
            hide();
        });
        $('html').on('click', '.js-reportfunction-report', async function () {
            if (!ajaxCall) {
                let textarea = document.querySelector('#reportfunction textarea[name=report]');
                if (textarea && textarea.value) {
                    try {
                        ajaxCall = true;
                        let { data: { success } } = await callApi({ method: 'POST', url: 'report', data: { description: textarea.value } });
                        if (success) {
                            textarea.value = '';
                            $('#reportfunction-inner-form').hide();
                            $('#reportfunction-inner-thanks').css('display','block');
                            setTimeout(()=>{
                                hide();
                            },3000)
                        }
                        ajaxCall = false;
                    } catch (error) {
                        ajaxCall = false;
                    }
                }
            }
        });
    }
    function create() {
        $('#reportfunction').remove();

        var html = `
            <div id="reportfunction" class="simplyweb-checked" style="display:none">
                <div class="reportfunction-inner simplyweb-checked">
                    
                    <div class="inner-content simplyweb-checked" id="reportfunction-inner-form" style="display:flex">
                        <div class="simplyweb-checked">
                            <h1 class="simplyweb-checked">Report an issue</h1>
                            <p class="simplyweb-checked">
                            We know we're not perfect but together we can build a more seamless experience. Please leave your feedback below and we'll make sure to address it. 
                            </p>

                            <footer>
                                <button class="simplywebbutton js-reportfunction-report simplyweb-checked">Report</button>
                                <button class="simplywebbutton js-reportfunction-close simplyweb-checked">Cancel</button>
                            </footer>
                        </div>
                        <div class="simplyweb-checked">
                            <textarea class="simplyweb-checked" name="report" id="simplyweb-report-txt"></textarea>
                        </div>
                        
                    </div>

                    <div class="inner-content simplyweb-checked" id="reportfunction-inner-thanks" style="display:none">
                     <h1 class="simplyweb-checked">Thanks for <br>
                     your feedback.</h1>  
                        <p class="simplyweb-checked">
                        You’ll be quickly redirected <br>
to the webpage you were browsing.
                        </p>
                    </div>
                   
                </div>
                
            </div>
        `;

        $(html).appendTo('html');
    }

    const getScrollPosition = (el = window) => ({
        x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
        y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop
    });

    function show() {        
        $('#simplyweb-report-txt').val('');
        $('#reportfunction-inner-thanks').hide();
        $('#reportfunction-inner-form').css('display','');
        $('#reportfunction').show();
    }

    function hide() {
        $('#reportfunction').hide();
    }

    //RETURN
    return {
        init: init,
        hide: hide,
        show: show
    }
})();

export default clsReportFunction
