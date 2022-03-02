window.browser = (() => window.msBrowser ||
	window.browser ||
	window.chrome)()
browser.tabs.query({
	active: true,
	currentWindow: true
}, tabs => {
	document.getElementById('urlinput').value = tabs[0].url
})
const erbox = document.getElementById('erbox')
const custominput = document.getElementById('custominput')
const output = document.getElementById('output')
const rotate = document.getElementById('rotate')
const status = document.getElementById('status')
const alias = document.getElementById('alias')
const sucess = document.getElementById('sucess')
const shortenedURL = document.getElementById('shortenedURL')
const sbtn = document.getElementById('sbtn')

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

var today = new Date();
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date + ' ' + time;
let geturl = () => {
	let url = document.getElementById('urlinput').value
	return url
}
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

let copyer = (containerid) => {
	let elt = document.getElementById(containerid)
	if (document.selection) { // IE
		if (elt.nodeName.toLowerCase() === 'input') {
			elt.select()
			document.execCommand('copy')
		} else {
			let range = document.body.createTextRange()
			range.moveToElementText(elt)
			range.select()
			document.execCommand('copy')
		}
	} else if (window.getSelection) {
		if (elt.nodeName.toLowerCase() === 'input') {
			elt.select()
			document.execCommand('copy')
		} else {
			let range_ = document.createRange()
			range_.selectNode(elt)
			window.getSelection().removeAllRanges()
			window.getSelection().addRange(range_)
			document.execCommand('copy')
		}
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}
let shorturl = async () => {
	erbox.innerHTML = ''
	sucess.innerHTML = ''
	rotate.style.display = 'inline-block'
	rotate.setAttribute('class', 'spinning')
	status.innerHTML = ''
	output.style.display = 'none'
	await sleep(500)
	let longurl = geturl()
	let re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
	let cre = /^([a-zA-Z0-9 _-]+)$/
	let protocol_ok = re.test(longurl)
	if (!protocol_ok) {
		erbox.innerHTML = 'Invalid url'
		rotate.classList.remove('spinning')
		rotate.style.display = 'none'
		status.innerHTML = 'Shorten'
		sucess.innerHTML = ''
		output.style.display = 'none'
	} else {
		erbox.innerHTML = ''
		if (custominput.value == '') {
			const cc = makeid(5)
            console.log(cc);
			alias.innerHTML = 'Shortened'
			send_request(cc);
			console.log('done');
		} else {
			if (cre.test(custominput.value)) {
				firebase.database().ref("shortenurl/" + custominput.value).limitToFirst(1).once("value", snapshot=>{
                if (snapshot.exists()) {
					erbox.innerHTML = 'Alias already in use, choose another'
					custominput.placeholder = custominput.value
					custominput.value = ''
					rotate.classList.remove('spinning')
					rotate.style.display = 'none'
					status.innerHTML = 'Shorten'
					sucess.innerHTML = ''
					output.style.display = 'none'
				} else {
					alias.innerHTML = 'Alias available'
					rotate.classList.remove('spinning')
					rotate.style.display = 'none'
					status.innerHTML = 'Shorten'
					const cc = custominput.value
					console.log(cc);
					send_request(cc)
					
				}
				})
			} else {
				erbox.innerHTML = 'Invalid custom alias, use only alphanumerics & underscore'
				custominput.placeholder = custominput.value
				custominput.value = ''
				rotate.classList.remove('spinning')
				rotate.style.display = 'none'
				status.innerHTML = 'Shorten'
				sucess.innerHTML = ''
				output.style.display = 'none'
			}
		}
	}
}

sbtn.addEventListener('click', shorturl)
document.querySelector('#go-to-options').addEventListener('click', () => {
	if (browser.runtime.openOptionsPage) {
		browser.runtime.openOptionsPage()
	} else {
		window.open(browser.runtime.getURL('options.html'))
	}
})
const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]')
if (currentTheme) {
	document.documentElement.setAttribute('data-theme', currentTheme)
}

let send_request = async (cc) => {
	let longurl = geturl()
	await firebase.database().ref("shortenurl/" + cc).set({
                'url': longurl,
                'time': dateTime,
                'click': ('0')
            });
	output.style.display = 'block'
	shortenedURL.value = 'https://qminh.xyz/' + cc
	copyer('shortenedURL')
	sucess.innerHTML = 'Short url copied to clipboard'
	rotate.classList.remove('spinning')
	rotate.style.display = 'none'
	status.innerHTML = 'Shorten'
}
