const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const sshConfig = require("../../config/ssh");
const db_conn = require("../../config/conn");
const Repo = require("../../models/Repo");
const Git = require("../../services/Git");

router.get("/:user", async (req, res) => {
	const [githubToken, username] = [req.headers.authorization, req.params.user];
	let formdata = {
		query: `{user(login: \"${username}\") {repositories(first: 26) { totalCount }}}`,
	};

	const totalCountRequest = await fetch("https://api.github.com/graphql", {
		method: "post",
		headers: {
			authorization: githubToken,
			accept: "application/vnd.github.v3+json",
		},
		body: JSON.stringify(formdata),
	}).then(data=>data.json());
	console.log(totalCountRequest)
	const totalCount = totalCountRequest.data.user.repositories.totalCount;

	formdata = {
		query: `{user(login: \"${username}\") {repositories(first: ${totalCount}) {edges {node {id name sshUrl}}}}}`,
	};
	const githubRepos = await fetch("https://api.github.com/graphql", {
		method: "post",
		headers: {
			authorization: githubToken,
			accept: "application/vnd.github.v3+json",
		},
		body: JSON.stringify(formdata),
	}).then((data) => data.json());
	console.log(githubRepos);
	const repos = githubRepos.data.user.repositories.edges.map(
		(repo) => new Repo(repo.node.name)
	);
	const reposGithubSSH = githubRepos.data.user.repositories.edges.map(
		(repo) => repo.node.sshUrl
	);
	await repos.forEach(async (repo) => {
		await repo.create("samerbahri98");
	});

	await reposGithubSSH.forEach(async (link, index) => {
		const git = new Git(repos[index], link);
		await git.githubClone();
	});
	res.json(repos.map((repo) => repo.info())).send();
});

module.exports = router;
