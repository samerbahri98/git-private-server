const conn = require("../config/conn");
if (process.env.NODE_ENV == "development") require("dotenv").config();

class Repo {
	#id;
	#name;
	#createdById;
	#createdByUsername;
	#createdByEmail;
	#createdAt;
	constructor(
		name,
		createdById,
		id,
		createdByUsername,
		createdByEmail,
		createdAt
	) {
		this.setAttributes(
			name,
			createdById,
			id,
			createdByUsername,
			createdByEmail,
			createdAt
		);
	}

	setAttributes = (
		name,
		createdById,
		id,
		createdByUsername,
		createdByEmail,
		createdAt
	) => {
		this.#id = id;
		this.#name = name;
		this.#createdById = createdById;
		this.#createdByUsername = createdByUsername;
		this.#createdByEmail = createdByEmail;
		this.#createdAt = createdAt;
	};
	info = () => ({
		id: this.#id,
		name: this.#name,
		createdById: this.#createdById,
		createdByUsername: this.#createdByUsername,
		createdByEmail: this.#createdByEmail,
		createdByUser: `${this.#createdByUsername}<${this.#createdByEmail}>`,
		createdAt: this.#createdAt,
		ssh: `git@${process.env.GIT_HOST}:/var/git/${this.#name}.git`,
		http: `http://${process.env.GIT_HOST}/git/${this.#name}.git/`,
	});

	search = () => {
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
				WHERE repo_name=$1;
				`,
				[this.#name],
				(err, res) => {
					if (err) console.log(err);
					const data = res.rows[0];

					this.setAttributes(
						data.name,
						data.createdybid,
						data.id,
						data.createdbyusername,
						data.createdbyemail,
						data.createdat
					);
					resolve(this.info());
				}
			);
		});
	};
	create = () => {};
}

module.exports = Repo;
