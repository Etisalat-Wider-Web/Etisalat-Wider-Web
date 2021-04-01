class BlacklistOverplayer {
    constructor() {       
    }
    init() {      
        // console.log('BlacklistOverplayer');
    }
    appendBlacklistOverplay(themeColor){
        var overplayColor = 'rgba(15,15,15, .95)' // dark
        var textColor = '#e7e7e7'

        if(themeColor == 'light') { // light
            overplayColor = 'rgba(188, 190, 192, .95)'
            textColor = '#6e6e6e'
        }else if(themeColor == 'medium') { // medium
            overplayColor = 'rgba(110, 110, 110, .95)'
            textColor = '#e7e7e7'
        }

        if(typeof document.getElementById("simplyweb-overplayBlacklist") !== 'undefined' && document.getElementById("simplyweb-overplayBlacklist") != null){
            document.getElementById("simplyweb-overplayBlacklist").style.backgroundColor = overplayColor;
            return;
        }
        
    
        var objhtml = document.getElementsByTagName("html")[0];

        var overplayNode = document.createElement("div");
        overplayNode.id = 'simplyweb-overplayBlacklist';
        overplayNode.className = 'simplyweb-checked';
        overplayNode.style.position = 'fixed';
        overplayNode.style.width = '100vw';
        overplayNode.style.height = '100vh';
        overplayNode.style.left = 0;
        overplayNode.style.top = 0;
        overplayNode.style.opacity = 1;
        overplayNode.style.backgroundColor = overplayColor;
        overplayNode.style.zIndex = '2147483647987';
        objhtml.appendChild(overplayNode);  

        var overplayText = document.createElement("div");
        overplayText.style.position = 'absolute';
        overplayText.style.width = '80%';
        overplayText.style.maxWidth = '500px';
        overplayText.style.top = '50%';
        overplayText.style.left = '10%';
        overplayText.style.transform = 'translate(0, -50%)';
        overplayText.style.textAlign = 'left';
        overplayText.style.lineHeight = 1.2;
        overplayNode.style.color = textColor;
        overplayText.innerHTML = `
            <h1 class='simplyweb-checked' style='font-family: Nunito, Arial, Helvetica, sans-serif;font-weight: bold; font-size:30px; color:#fff; line-height: 1.2;margin-bottom: 20px;'>Unfortunately our extension is not adaptable to this website.</h1> <p class='simplyweb-checked' style='font-family: Nunito, Arial, Helvetica, sans-serif;font-weight: normal; font-size:20px; color:#fff; line-height: 1.4;margin-bottom: 20px;'>We strive to make the whole web autistic friendly and encourage you to request adaptability from the website manager.</p>`;  
        overplayNode.appendChild(overplayText);
    }
    removeBlacklistOverlay(){
        if(typeof document.getElementById("simplyweb-overplayBlacklist") !== 'undefined' && document.getElementById("simplyweb-overplayBlacklist") != null){
            document.getElementById("simplyweb-overplayBlacklist").remove();
        }
    }
}
let blacklistOverplayer = new BlacklistOverplayer();
//export {loadingOverplayer,LoadingOverplayer} 
//export default  loadingOverplayer
//module.exports = {loadingOverplayer,LoadingOverplayer} 
module.exports = {blacklistOverplayer,BlacklistOverplayer} 
