var questions = {
	"1" : {
		id: 1,
		title: 'JSON & Web Storage',
		text: 'How to use web Storage',
		votes: 1,
		responses: [
			{
				name: 'Amit',
				comment: 'Local storage can only save strings, so storing objects requires that they be turned into strings using JSON.'
			},
			{
				name: 'Rahul',
				comment: 'Thanks!'
			}
		],
		resolved: false,
		favorite:false
	},
	"2" : {
		id: 2,
		title: 'Web Development',
		text: 'What is Web?',
		votes: 3,
		responses: [
			{
				name: 'Amit',
				comment: 'Web is the Internet.'
			},
			{
				name: 'Rahul',
				comment: 'Thanks!'
			}
		],
		resolved: false,
		favorite:true
	},
	"3" : {
		id: 3,
		title: 'Backend Development',
		text: 'What is Backend?',
		votes: 2,
		responses: [
			{
				name: 'Amir',
				comment: 'Backend is power of a web.'
			},
			{
				name: 'Rahul',
				comment: 'Thanks Amir!'
			}
		],
		resolved: false,
		favorite:false
	}
};

var rightContainer = document.getElementById("right");
var description = document.getElementById("description");
var welcome = document.getElementById("welcome");
var questionItems = document.querySelectorAll(".que-item");
var totalQuestions = 3;

var queTitle = document.getElementById("que-title");
var queText = document.getElementById("que-text");
var responseView = document.getElementById("responses");
var questionView = document.getElementById("questions");
var showWelcomeBtn = document.getElementById("show-welcome");
var addQuestionBtn = document.getElementById("add-que");
var addResponseBtn = document.getElementById("add-res");
var resolveBtn = document.getElementById("resolve");
var search = document.getElementById("search");
var upvote = document.getElementById("upvote");
var downvote = document.getElementById("downvote");
var favorite = document.getElementById("favorite");
var showFavBtn = document.getElementById("show-favorites");

var activeQuestion;

function setupQuestions(){
	questionItems = document.querySelectorAll(".que-item");
	for(let i = 0; i < questionItems.length; i++){
		questionItems[i].addEventListener("click", function(e){
			activeQuestion = questions[this.id];
			console.log(activeQuestion);
			showDescription();
		});
	}
}

function loadQuestions(){

	let data = [];
	questionView.innerText = "";
	for(let queNo in questions){
		let question = questions[queNo];
		data.push(question);
		// questionView.innerHTML += `<div class="que-item" id="${queNo}"><h2 class="que-title">${question.title}</h2><p class="que-text">${question.text}</p></div>`;
	}
	data.sort((a, b)=>{
		return b.votes-a.votes;
	});
	data.forEach((que)=>{
		questionView.innerHTML += `<div class="que-item" id="${que.id}"><h2 class="que-title">${que.title}</h2><p class="que-text">${que.text}</p>${(que.favorite)?"<i class='fa fa-heart active fav'></i>":"<i></i>"}</div>`;
	})
	console.log(data);
	setupQuestions();
}

function addQuestion(event){
	event.preventDefault();
	let form = document.getElementById("formAdd");
	let title = form.subject.value;
	let que = form.question.value;
	if(title.length < 1 || que.length < 1) return false;
	totalQuestions++;
	let id = totalQuestions;
	let newQue = {
		id: id,
		title: title,
		text: que,
		votes: 0,
		responses: [],
		resolved: false
	};
	questions[id] = newQue;
	questionView.innerHTML += `<div class="que-item" id="${newQue.id}"><h2 class="que-title">${newQue.title}</h2><p class="que-text">${newQue.text}</p>${(que.favorite)?"<i class='fa fa-heart active fav'></i>":"<i></i>"}</div>`;
	setupQuestions();
}

function loadActiveQuestion(){
	queTitle.innerText = activeQuestion.title;
	queText.innerText = activeQuestion.text;
	document.getElementById("votes").innerText = activeQuestion.votes;
	loadResponses();
	let form = document.getElementById("resForm");
	form.subject.value = "";
	form.question.value = "";
}

function loadResponses(){
	responseView.innerText = "";
	let responses = activeQuestion.responses;
	responses.forEach((res) => {
		responseView.innerHTML += `<div class="response"><h3 class="res-name">${res.name}</h3><p class="res-text">${res.comment}</p></div>`;
	});
}

function addResponse(event){
	event.preventDefault();
	let form = document.getElementById("resForm");
	let name = form.subject.value;
	let comment = form.question.value;
	if(name.length < 1 || comment.length < 1) return false;
	let newRes = {
		name: name,
		comment: comment
	};
	activeQuestion.responses.push(newRes);
	form.subject.value="";
	form.question.value="";
	loadResponses();
	console.log(questions);
}

function resolveQuestion(){
	delete questions[activeQuestion.id];
	activeQuestion = {};
	loadQuestions();
	showWelcome();
}

function searchQuery(){
	let query = search.value.toLowerCase();
	console.log(query);
	let data = [];
	for(let queNo in questions){
		let question = questions[queNo];
		if(((question['title'].toLowerCase()).indexOf(query) != -1) || ((question['text'].toLowerCase()).indexOf(query) != -1)){
			data.push(question);
		}
	}
	console.log("Data = ", data);

	if(data.length == 0){
		questionView.innerText = "";
		questionView.innerHTML = `<div class="que-item"><h2>No match found!</h2></div>`;
	}else{
		// loading questions 
		questionView.innerText = "";
		data.forEach((que) => {
			let title = que.title;
			let text = que.text;
			title = title.replace(new RegExp(query, 'gi'), '<span class="yellow">' + query + '</span>');
			text = text.replace(new RegExp(query, 'gi'), '<span class="yellow">' + query + '</span>');
			questionView.innerHTML += `<div class="que-item" id="${que.id}"><h2 class="que-title">${title}</h2><p class="que-text">${text}</p>${(que.favorite)?"<i class='fa fa-heart active fav'></i>":"<i></i>"}</div>`;
		});
		setupQuestions();	
	}
}

function showDescription(){
	welcome.style.display="none";
	description.style.display="block";
	loadActiveQuestion();
	setFavorite();
}

function showWelcome(){
	description.style.display="none";
	welcome.style.display="block";
	let form = document.getElementById("formAdd");
	form.subject.value = "";
	form.question.value = "";
}

function upVote(){
	activeQuestion.votes = activeQuestion.votes+1;
	document.getElementById("votes").innerText = activeQuestion.votes;
}

function downVote(){
	activeQuestion.votes = activeQuestion.votes-1;
	document.getElementById("votes").innerText = activeQuestion.votes;
}

function setFavorite(){
	if(activeQuestion.favorite)
		favorite.classList.add("active");
	else
		favorite.classList.remove("active");
}

function addFavorite(){
	activeQuestion.favorite = !activeQuestion.favorite;
	if(activeQuestion.favorite)
		favorite.classList.add("active");
	else
		favorite.classList.remove("active");
	loadQuestions();
}

function showFavorite(){
	if(this.innerText == "View All"){
		loadQuestions();
		this.innerText = "Favorites";
		return;
	}
	//else
	this.innerText = "View All";
	let data = [];
	questionView.innerText = "";
	for(let queNo in questions){
		let question = questions[queNo];
		if(question.favorite)
			data.push(question);
		// questionView.innerHTML += `<div class="que-item" id="${queNo}"><h2 class="que-title">${question.title}</h2><p class="que-text">${question.text}</p></div>`;
	}
	data.sort((a, b)=>{
		return b.votes-a.votes;
	});
	data.forEach((que)=>{
		questionView.innerHTML += `<div class="que-item" id="${que.id}"><h2 class="que-title">${que.title}</h2><p class="que-text">${que.text}</p>${(que.favorite)?"<i class='fa fa-heart active fav'></i>":"<i></i>"}</div>`;		
	})
	console.log(data);
	setupQuestions();
}

function init(){
	loadQuestions();
	showWelcomeBtn.addEventListener("click", showWelcome);
	addQuestionBtn.addEventListener("click", addQuestion);
	addResponseBtn.addEventListener("click", addResponse);
	resolveBtn.addEventListener("click", resolveQuestion);
	search.addEventListener("keyup", searchQuery);
	upvote.addEventListener("click", upVote);
	downvote.addEventListener("click", downVote);
	favorite.addEventListener("click", addFavorite);
	showFavBtn.addEventListener("click", showFavorite);
}

init();