const ssh = require("../config/ssh");
const Repo = require("../models/Repo");

class Git {
	#localRepo;
	#cloneUrl;
	#localRepoInfo;
	constructor(_localRepo, _cloneUrl) {
		this.#cloneUrl = _cloneUrl;
		this.#localRepo = _localRepo;
		this.#localRepoInfo = this.#localRepo.info()
	}

	githubClone = () => {
		ssh(`git clone --bare ${this.#cloneUrl} /var/git/${this.#localRepoInfo.name}.git`)
	};
}

module.exports = Git;
