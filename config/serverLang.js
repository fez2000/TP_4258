module.exports = {
    locales: ["en", "fr"],
    defaultLocale: "fr",
    logDebugFn(msg) {
        console.log("debug", msg);
    },

    // setting of log level WARN - default to require('debug')('i18n:warn')
    logWarnFn(msg) {
        console.log("warn", msg);
    },

    // setting of log level ERROR - default to require('debug')('i18n:error')
    logErrorFn(msg) {
        console.log("error", msg);
    },
    objectNotation: true
};
