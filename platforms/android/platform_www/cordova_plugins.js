cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.phonegap.plugins.PushPlugin/www/PushNotification.js",
        "id": "com.phonegap.plugins.PushPlugin.PushNotification",
        "clobbers": [
            "PushNotification"
        ]
    },
    {
        "file": "plugins/card.io.cordova.mobilesdk/www/cdv-plugin-card-io.js",
        "id": "card.io.cordova.mobilesdk.CardIO",
        "clobbers": [
            "CardIO"
        ]
    },
    {
        "file": "plugins/com.paypal.cordova.mobilesdk/www/cdv-plugin-paypal-mobile-sdk.js",
        "id": "com.paypal.cordova.mobilesdk.PayPalMobile",
        "clobbers": [
            "PayPalMobile"
        ]
    },
    {
        "file": "plugins/plugin.google.maps/www/googlemaps-cdv-plugin.js",
        "id": "plugin.google.maps.phonegap-googlemaps-plugin",
        "clobbers": [
            "plugin.google.maps"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.3-dev",
    "com.phonegap.plugins.PushPlugin": "2.5.0",
    "card.io.cordova.mobilesdk": "2.0.1",
    "com.paypal.cordova.mobilesdk": "3.2.0",
    "plugin.google.maps": "1.3.9"
};
// BOTTOM OF METADATA
});