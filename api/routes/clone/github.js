const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const sshConfig = require("../../config/ssh");
const db_conn = require("../../config/conn");
const Repo = require("../../models/Repo");
const Git = require("../../services/Git")

router.get("/:user", async (req, res) => {
	const [githubToken, username] = [req.headers.authorization, req.params.user];
	const githubRepos = await fetch(
		`https://api.github.com/users/${username}/repos`,
		{
			method: "get",
			headers: {
				authorization: githubToken,
				accept: "application/vnd.github.v3+json",
			},
		}
	).then((data) => data.json());
	const repos = githubRepos.map((repo) => new Repo(repo.name));
	const reposGithubSSH = githubRepos.map((repo) => repo.ssh_url);
	await repos.forEach(async (repo) => {
		await repo.create("samerbahri98");
		
	});

	await reposGithubSSH.forEach(async (link,index)=>{
		const git = new Git(repos[index],link)
		await git.githubClone()
	})
	res.json(repos.map(repo=>repo.info())).send()
});

module.exports = router;
