const puppeteer = require("puppeteer");
const { ssr, init } = require("../util/ssr");

let browserWSEndpoint = null;

exports.prerender = async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res
            .status(400)
            .send("Invalid url param: Example: ?url=https://binge.app");
    }

    // console.time(`URL_START:${url}`)
    // console.log(`browserWSEndpoint is::${(browserWSEndpoint)}`)
    // Spin new instance if we dont have an active one
    if (!browserWSEndpoint) {
        const browser = await puppeteer.launch();
        browserWSEndpoint = await browser.wsEndpoint();
    }

    const { html, status } = await ssr(url, browserWSEndpoint);
    // console.timeEnd(`URL_START:${url}`)
    return res.status(status).send(html);
};
