// check ว่ามีการ set cookies หรือยังถ้ามีจะไปยัง feed.html แต่ถ้าไม่มีจะกลับไปที่ index.html
function checkCookie(){
	var username = "";
	if(getCookie("username")==false){
		window.location = "index.html";
	}
}

checkCookie();
window.onload = pageLoad;

function getCookie(name){
	const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function pageLoad(){
	document.getElementById('postbutton').onclick = getData;

	document.getElementById('displayPic').onclick = fileUpload;
	document.getElementById('fileField').onchange = fileSubmit;
	
	var username = getCookie('username');

	document.getElementById("username").innerHTML = username;
	console.log(getCookie('img'));
	showImg('img/'+getCookie('img'));
	readPost();
	setInterval(readPost, 1000);
}

function getData(){
	var msg = document.getElementById("textmsg").value;
	document.getElementById("textmsg").value = "";
	writePost(msg);
}

function fileUpload(){
	document.getElementById('fileField').click();
}

function fileSubmit(){
	document.getElementById('formId').submit();
}

// แสดงรูปในพื้นที่ที่กำหนด
function showImg(filename){

    const imgFileName = getCookie('img');

    const imgElement = document.querySelector("#displayPic img");
    if (imgElement && imgFileName) {
        imgElement.src = `img/${imgFileName}`;
    }
}

// อ่าน post จาก file
// complete it
async function readPost(){
	try {
        let response = await fetch('/readPost');
        let data = await response.json();
        showPost(data);
    } catch (error) {
        console.error("Error reading posts:", error);
    }
}

// เขียน post ใหม่ ลงไปใน file
// complete it
async function writePost(msg){
	let username = getCookie('username');
    let postData = { user: username, message: msg };

    try {
        await fetch('/writePost', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        });
        readPost();
    } catch (error) {
        console.error("Error writing post:", error);
    }
}

// แสดง post ที่อ่านมาได้ ลงในพื้นที่ที่กำหนด
function showPost(data){
	var keys = Object.keys(data);
	var divTag = document.getElementById("feed-container");
	divTag.innerHTML = "";
	for (var i = keys.length-1; i >=0 ; i--) {

		var temp = document.createElement("div");
		temp.className = "newsfeed";
		divTag.appendChild(temp);
		var temp1 = document.createElement("div");
		temp1.className = "postmsg";
		temp1.innerHTML = data[keys[i]]["message"];
		temp.appendChild(temp1);
		var temp1 = document.createElement("div");
		temp1.className = "postuser";
		
		temp1.innerHTML = "Posted by: "+data[keys[i]]["user"];
		temp.appendChild(temp1);
		
	}
}