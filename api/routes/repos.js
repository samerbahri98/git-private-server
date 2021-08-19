const express = require("express");
const router = express.Router();
const Repo = require("../models/Repo");

router.get("/:name", async (req, res) => {
    const rep = new Repo(req.params.name)
    await rep.search()
    res.json(rep.info()).send()


});

module.exports = router;
