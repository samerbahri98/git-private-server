const express = require("express");
const router = express.Router();
const Repo = require("../models/Repo");
const conn = require("../config/conn");
if (process.env.NODE_ENV == "development") require("dotenv").config();

router.get("/repo/:name", async (req, res) => {
	const rep = new Repo(req.params.name);
	await rep.search();
	res.json(rep.info()).send();
});

router.get("/:page", async (req, res) => {
	const rows = await getRows(req.params.page);
	res.json(rows.map((row) => row.info())).send();
});

router.get("/", async (req, res) => {
	const rows = await getRows(0);
	res.json(rows.map((row) => row.info())).send();
});

const getRows = (num) => {
    return new Promise(async (resolve,reject)=>{
        const payload = await getRepos(num);
        const rows = payload.rows.map(
            (row) =>
                new Repo(
                    row.name,
                    row.createdbyid,
                    row.id,
                    row.createdbyusername,
                    row.createdbyemail,
                    row.createdat
                )
        );
        resolve(rows);
    })
	
};
const getRepos = (page) => {
	return new Promise((resolve, reject) => {
		conn.query(
			`SELECT 
				repos.id AS id, 
				repos.repo_name AS name, 
				repos.created_by AS createdById,
				repos.created_at AS createdAt,
				users.username AS createdByUsername,
				users.email AS createdByEmail
				FROM repos JOIN users
				ON repos.created_by = users.id
				LIMIT 10 OFFSET $1;
				`,
			[page * 10],
			(err, res) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(res);
			}
		);
	});
};

module.exports = router;
