const fs = require("fs");
const { Client } = require("ssh2");
require("dotenv").config();

const sshConfig = {
	host: `${process.env.GIT_HOST}`,
	port: 22,
	username: "git",
	privateKey: fs.readFileSync("/home/samer/.ssh/id_rsa"),
};



function execute(command) {
	const conn = new Client();
	conn.on("error", (err) => {
		console.log("SSH - Connection Error: " + err);
	});

	conn.on("end", () => {
		console.log("SSH - Connection Closed");
	});
	conn.on("close", (code, signal) => {
		console.log("Stream :: close :: code: " + code + ", signal: " + signal);
		conn.end();
	});

	conn.on("ready", () => {
		console.log("Client :: ready");
		conn.exec(command, (err, stream) => {
			if (err) throw err;
			stream
				.on("close", (code, signal) => {
					console.log(
						"Stream :: close :: code: " + code + ", signal: " + signal
					);
					conn.end();
				})
				.on("data", (data) => {
					console.log("STDOUT: " + data);
				})
				.stderr.on("data", (data) => {
					console.log("STDERR: " + data);
				});
		});
	});
	conn.connect(sshConfig)
}

module.exports = execute;
