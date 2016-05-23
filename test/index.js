import Easymock from 'src/easymock';
import reqwest from 'reqwest';
let testUrl1 = 'www.testmock1.com?appId=12345';
let testUrl2 = 'www.testmock2.com?appId=12345';
let testUrl3 = 'www.testmock3.com?appId=12345';
Easymock.mock(testUrl1, {result: 'success'});
Easymock.mock(testUrl2, {result: 'success2'});

let app  = document.createElement('div');
app.innerHTML = '<h1>Hello World1</h1>';
reqwest({
	url: testUrl1,
	success: (data) => {
		let div = document.createElement('div');
		div.innerHTML = 'test1 result:' + data.result;
		app.appendChild(div);
	}
})

// reqwest({
// 	url: testUrl2,
// 	success: (data) => {
// 		let div = document.createElement('div');
// 		div.innerHTML = data.result;
// 		app.appendChild(div);
// 	},
// 	error: (error)=> {
// 		// let div = document.createElement('div');
// 		// div.innerHTML = error;
// 		// app.appendChild(div);
// 	}
// })

let xhr2 = new XMLHttpRequest();
xhr2.open('get', testUrl2, true)
xhr2.send();
xhr2.onreadystatechange = function () {
	if (xhr2.readyState !== 4) return;
	let result = xhr2.status;
	if (result === 200) {
		result = JSON.parse(xhr2.responseText).result;
	}
	let div = document.createElement('div');
	div.innerHTML = 'test2 result:' + result;
	app.appendChild(div);
}

let xhr3 = new XMLHttpRequest();
xhr3.open('get', testUrl3, true)
xhr3.send();
xhr3.onreadystatechange = function () {
	if (xhr3.readyState !== 4) return;
	let result = xhr3.status;
	if (result === 200) {
		result = JSON.parse(xhr3.responseText).result;
	}
	let div = document.createElement('div');
	div.innerHTML = 'test3 result:' + xhr3.status;
	app.appendChild(div);
}


// let xhr = new XMLHttpRequest();
// xhr.open('get', 'http://10.253.8.85:6080/api/cfg/resource/VirtualInsuredType', true)
// xhr.send();
// xhr.onreadystatechange = function () {
// 	console.log(xhr)
// }





document.body.appendChild(app);