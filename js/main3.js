const url = "https://api.github.com/users/";

userNameButton();
function userNameButton() {

	var searchButton = document.getElementById("searchButton");
	searchButton.addEventListener("click", searchUserName);

}

function searchUserName() {

	var userName = document.getElementById("searchField").value;
	if (userName != '' && (userName.search("/") == -1)) {
		searchGithub(userName);
	} else {
		alert("Not Allowed");
		removeHistory();
	}

	document.getElementById("searchField").value = "";
	removeUserNotExistBox();

}

function searchGithub(apiGitSubPath) {
	let exactUserUrl = url + apiGitSubPath;

	fetch(exactUserUrl)
	.then((response) => {
		if(response.ok) {
			return response.json();
		}
	})
	.then((data) => {
		if(!(apiGitSubPath.endsWith("/repos"))) {
			createName(data);
		}
		else {
			createRepository(data);
		}
	})
	.catch((error) => {
		removeHistory();
		addUserNotExistBox();
		console.log(error.message);
	});
}

function searchRepo(repo) {
	let exactUserUrl = url + repo;

	fetch(exactUserUrl)
	.then((response) => {
		if(response.ok) {
			return response.json();
		}
	})
	.then((data) => {
			createRepository(data);
	})
}


function addUserNotExistBox() {
	var errorBox = document.getElementsByClassName("errorBox")[0];
	errorBox.classList.remove("hidden");
}

function removeUserNotExistBox() {
	var errorBox = document.getElementsByClassName("errorBox")[0];
	errorBox.classList.add("hidden");
}

function removeHistory() {
	var response = document.getElementById("response");
	response.innerHTML = "";

	var repositories = document.getElementById("repositories");
	repositories.innerHTML = "";
}


function createName(exactUser) {

	var responseElement = document.getElementById("response");
	responseElement.innerHTML = "";
	response.classList.remove("hidden");

	//create exactUser card
	var responseDiv = createElement("div", "responseInformation");
	responseElement.appendChild(responseDiv);

	//create exactUser photo
	var imgPhoto = createElement("img", "logoStyle");
	imgPhoto.src = exactUser.avatar_url;
	responseDiv.appendChild(imgPhoto);

	//create exactUser info
	var InfoBoxElement = createElement("div", "informationBox");

	var userNameElement = createElement("p", "userNameText");
	var loginPageElement = document.createElement("a");
	loginPageElement.href = exactUser.html_url;
	var userNameText = createTextElement("@" + exactUser.login, loginPageElement, userNameElement);
	InfoBoxElement.appendChild(userNameElement);

	if(exactUser.name != null) {
		var fullNameElement = createElement("p", "fullNameText");
		var fullNameText = createTextElement(exactUser.name, fullNameElement, InfoBoxElement);
	}

	if(exactUser.bio != null) {
		var bioElement = createElement("p", "bioText");
		var bioText = createTextElement(exactUser.bio, bioElement, InfoBoxElement);
	}

	responseDiv.appendChild(InfoBoxElement);

	var repositories = exactUser.login + "/repos";
	searchRepo(repositories);
}

function createRepository(repo) {

	var repositoryElement = document.getElementById("repositories");
	repositoryElement.innerHTML = "";
	repositoryElement.classList.remove("hidden");

	var statement = document.createElement("p");
	var statementText = document.createTextNode("User doesn't have public repositories");
	statement.appendChild(statementText);

	var titleElement = createElement("div", "repositoryInformation");
	repositoryElement.appendChild(titleElement);

	var repositoryTitle = document.createElement("h2");
	var repositoryTitleText = document.createTextNode("Respositories:");
	repositoryTitle.classList.add("title");
	repositoryTitle.appendChild(repositoryTitleText);
	titleElement.appendChild(repositoryTitle);

	var repositoriesBox = createElement("div", "repositoryBox");
	titleElement.appendChild(repositoriesBox);

	//set scroll scrollbar and statement
	if (repo.length == 0) {
		repositoriesBox.appendChild(statement);
	}
	repo.forEach(function(element) {

		var divElement = createElement("div", "reposDivParent");
		var repoTitleElement = createElement("div", "reposDiv");
		var repoTitle = document.createTextNode(element.name);
		var repoPage = document.createElement("a");
		repoPage.href = element.html_url;
		repoPage.appendChild(repoTitle);
		repoTitleElement.appendChild(repoPage);
		divElement.appendChild(repoTitleElement);
		repositoriesBox.appendChild(divElement);

		//set star icon
		var starIcon = createElement("img", "starStyle");
		starIcon.src = "/images/star_icon.png";
		divElement.appendChild(starIcon);

		var starNumberElement = document.createElement('p');
		var starNumber = createTextElement(element.stargazers_count, starNumberElement, divElement);
		//set fork icon
		var forkIcon = createElement("img", "forkStyle");
		forkIcon.src = "/images/fork_icon.png";
		divElement.appendChild(forkIcon);

		var forkNumberElement = document.createElement('p');
		var forkNumber = createTextElement(element.forks_count, forkNumberElement, divElement);
	});
}

function createElement(tag, classes) {
	var element = document.createElement(tag);
	element.classList.add(classes);
	return element;
}

function createTextElement(text, childElement, parentElement) {
	var textElement = document.createTextNode(text);
	childElement.appendChild(textElement);
	parentElement.appendChild(childElement);
	return textElement;
}
