window.fbAsyncInit = function() {
    FB.init({
        appId: "2651383734976450",
        cookie: true,
        xfbml: true,
        version: "v4.0"
    });
    FB.getLoginStatus(function(response) {
        FB.statePlugin = response;
    });
};
(function(d, s, id) {
    var js,
        fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "facebook-jssdk");
(function(d, s, id) {
    var js,
        fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/fr_FR/sdk/xfbml.customerchat.js";
    fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "facebook-jssdk");
