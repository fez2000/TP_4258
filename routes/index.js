const express = require("express");
const path = require("path");

const router = express.Router();

router.get("*", (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    res.sendFile(path.resolve(`${req.app.locals.publicDir}/index.html`));
});

module.exports = router;
