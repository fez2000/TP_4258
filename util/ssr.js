const puppeteer = require("puppeteer");
const RENDER_CACHE = new Map();
const axios = require("axios");
exports.ssr = async function(url, browserWSEndpoint) {
    if (RENDER_CACHE.has(url)) {
        let a = RENDER_CACHE.get(url);

        RENDER_CACHE.delete(url);
        exports.ssr(url, browserWSEndpoint);
        return { html: a, status: 200 };
    }
    const browser = await puppeteer.connect({ browserWSEndpoint });

    try {
        const page = await browser.newPage();

        // Inject <base> on page to relative resources load properly.
        await page.evaluate(url => {
            const base = document.createElement("base");
            base.href = url;
            // Add to top of head, before all other resources.
            document.head.prepend(base);
        }, url);

        // Remove scripts and html imports. They've already executed.
        /*await page.evaluate(() => {
            const elements = document.querySelectorAll(
                'script, link[rel="import"]'
            );
            elements.forEach(e => e.remove());
        });*/
        await page.setRequestInterception(true);

        page.on("request", req => {
            // 2. Ignore requests for resources that don't produce DOM
            // (images, stylesheets, media).
            const whitelist = ["document", "script", "xhr", "fetch"];
            //console.log(req.resourceType());
            if (!whitelist.includes(req.resourceType())) {
                return req.abort();
            }
            const whiturl = [
                process.env.BASE_URL + "sw-precache.js",
                "https://fr.monetbil.com/widget/v2/monetbil.min.js",
                "https://www.paypal.com/sdk/js?client-id=ATPOXO5gEo-aL7_mCsyHbXmRvZ574dJxl7iJbvYvzrRR_0pvDW4eh09naeVMWbjOGE8MfvvwDGg7K5Ma",
                process.env.BASE_URL + "/assets/js/installSDK.js"
            ];
            if (whiturl.includes(req.url())) {
                return req.abort();
            }

            // 3. Pass through all other requests.
            req.continue();
        });
        const response = await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 900000
        });

        await page.waitForSelector("#material-kit");
        const html = await page.content();

        // Close the page we opened here (not the browser).
        await page.close();
        RENDER_CACHE.set(url, html);
        return { html, status: response.status() };
    } catch (e) {
        const html = e.toString();
        console.log(e);
        console.warn({ message: `URL: ${url} Failed with message: ${html}` });
        return { html, stat2s: 500 };
    }
};
exports.fullUrl = function(req) {
    return `${process.env.BASE_URL}${req.originalUrl}`;
};
exports.init = function() {
    RENDER_CACHE.clear();
    axios
        .get(`${process.env.BASE_URL}ssr?url=${process.env.BASE_URL}home`)
        .then(() => {});
};
