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

	var url = "https://api.github.com/users/";
	var exactUserUrl = url + apiGitSubPath;

	var http = new XMLHttpRequest();
	http.open("GET", exactUserUrl, true);

	http.onload = function () {
		if (http.status == 200) {
			var exactUser = JSON.parse(http.responseText);
			if (apiGitSubPath.search("/repos") == -1) {
				createName(exactUser);
			} else {
				createRepository(exactUser);
			}

		} else if (http.status == 404) {
			addUserNotExistBox();
			removeHistory();
		} else {
			alert("Unexpected response: " + http.status);
			removeHistory();
		}
	};
	http.send();
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
	var userNameText = document.createTextNode("@" + exactUser.login);
	loginPageElement.append(userNameText);
	userNameElement.appendChild(loginPageElement);
	InfoBoxElement.appendChild(userNameElement);

	if(exactUser.name != null) {
		var fullNameElement = createElement("p", "fullNameText");
		var fullNameText = document.createTextNode(exactUser.name);
		fullNameElement.appendChild(fullNameText);
		InfoBoxElement.appendChild(fullNameElement);
	}

	if(exactUser.bio != null) {
		var bioElement = createElement("p", "bioText");
		var bioText = document.createTextNode(exactUser.bio);
		bioElement.appendChild(bioText);
		InfoBoxElement.appendChild(bioElement);
	}

	responseDiv.appendChild(InfoBoxElement);

	var repositories = exactUser.login + "/repos";
	searchGithub(repositories);
}

function createRepository(exactUser) {

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
	if (exactUser.length == 0) {
		repositoriesBox.appendChild(statement);
	}

	for (var i = 0; i < exactUser.length; i++) {

		//set the name of the repositories
		var divElement = createElement("div", "reposDivParent");
		var repoTitleElement = createElement("div", "reposDiv");
		var repoTitle = document.createTextNode(exactUser[i].name);
		var repoPage = document.createElement("a");
		repoPage.href = exactUser[i].html_url;
		repoPage.appendChild(repoTitle);
		repoTitleElement.appendChild(repoPage);
		divElement.appendChild(repoTitleElement);
		repositoriesBox.appendChild(divElement);

		//set star icon
		var starIcon = createElement("img", "starStyle");
		starIcon.src = "/images/star_icon.png";
		divElement.appendChild(starIcon);

		var starNumberElement = document.createElement('p');
		var starNumber = document.createTextNode(exactUser[i].stargazers_count);
		starNumberElement.appendChild(starNumber);
		divElement.appendChild(starNumberElement);

		//set fork icon
		var forkIcon = createElement("img", "forkStyle");
		forkIcon.src = "/images/fork_icon.png";
		divElement.appendChild(forkIcon);

		var forkNumberElement = document.createElement('p');
		var forkNumber = document.createTextNode(exactUser[i].forks_count);
		forkNumberElement.appendChild(forkNumber);
		divElement.appendChild(forkNumberElement);
	}
}

function createElement(tag, classes) {

	var element = document.createElement(tag);
	element.classList.add(classes);
	return element;

}
