import Easymock from 'src/easymock';
import reqwest from 'reqwest';
let testUrl1 = 'www.testmock1.com?appId=12345';
let testUrl2 = 'www.testmock2.com?appId=12345';
let testUrl3 = 'www.testmock3.com?appId=12345';
let testUrl4 = 'www.testmock4.com?appId=12345';
let testUrl5 = 'www.testmock5.com?appId=12345';
let easymock = new Easymock();

easymock.mock({
	url: testUrl1,
	result: {result: 'success'},
	timeout: 5000
})

easymock.mock({
	url: testUrl2,
	result: {result: 'success2'},
	timeout: 500
})
// 批量mock
easymock.mock([{
	url: testUrl4,
	timeout: 3000,
	result: {
		result: 'success4'
	}
}, {
	url: testUrl5,
	timeout: 20,
	result: {
		result: 'success5'
	}
}])
let app  = document.createElement('div');
app.innerHTML = '<h1>Easymock Test2</h1>';

// 使用reqwest的mock展示
reqwest({
	url: testUrl1,
	success: (data) => {
		let div = document.createElement('div');
		let success = (data.result === 'success');
		div.innerHTML = 'reqwest mocked test:' + success;
		div.style.width = '250px'
		div.style.backgroundColor = success ? '#1DD41D' : 'red';
		app.appendChild(div);
	}
})

reqwest({
	url: 'http://10.139.110.99:6080/api/cfg/resource/GroupPolicyType',
	success: (data) => {
		console.log(data)
	}
})
// 使用xhr的mock展示
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
	let success = (result === 'success2');
	div.innerHTML = 'xhr mocked test:' + success;
	div.style.width = '250px'
	div.style.backgroundColor = success ? '#1DD41D' : 'red';
	app.appendChild(div);
}

// 批量mock
reqwest({
	url: testUrl4,
	success: (data) => {
		let div = document.createElement('div');
		let result = (data.result === 'success4');
		div.innerHTML = 'batch mocked test:' + result;
		div.style.width = '250px'
		div.style.backgroundColor = result ? '#1DD41D' : 'red';
		app.appendChild(div);
	}
})
reqwest({
	url: testUrl5,
	success: (data) => {
		let div = document.createElement('div');
		let result = (data.result === 'success5');
		div.innerHTML = 'batch mocked test:' + result;
		div.style.width = '250px'
		div.style.backgroundColor = result ? '#1DD41D' : 'red';
		app.appendChild(div);
	}
})
document.body.appendChild(app);