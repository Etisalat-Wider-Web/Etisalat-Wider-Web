class LoadingOverplayer {
    constructor() {       
    }
    init() {      
        // console.log('LoadingOverplayer');
    }
    appendOverplay(themeColor){
        if(typeof document.getElementById("simplyweb-overplay") !== 'undefined' && document.getElementById("simplyweb-overplay") != null){
            return ;
        }
        var overplayColor = '#101010' // dark
        if(themeColor == 'light') { // light
            overplayColor = '#bcbec0'
        }else if(themeColor == 'medium') { // medium
            overplayColor = '#6e6e6e'
        }
    
        var objhtml = document.getElementsByTagName("html")[0];

        var overplayNode = document.createElement("div");
        overplayNode.id = 'simplyweb-overplay';
        overplayNode.style.position = 'fixed';
        overplayNode.style.width = '100vw';
        overplayNode.style.height = '100vh';
        overplayNode.style.left = 0;
        overplayNode.style.top = 0;
        overplayNode.style.opacity = 1;
        overplayNode.style.backgroundColor = overplayColor;
        overplayNode.style.zIndex = '2147483647987';
        objhtml.appendChild(overplayNode);  
    }
    removeOverlay(){
        if(typeof document.getElementById("simplyweb-overplay") !== 'undefined' && document.getElementById("simplyweb-overplay") != null){
            document.getElementById("simplyweb-overplay").remove();
        }
    }
}
let loadingOverplayer = new LoadingOverplayer();
//export {loadingOverplayer,LoadingOverplayer} 
//export default  loadingOverplayer
//module.exports = {loadingOverplayer,LoadingOverplayer} 
module.exports = {loadingOverplayer,LoadingOverplayer} 
