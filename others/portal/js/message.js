var infoElement = document.getElementById('info');
var purchaseTime = document.getElementById('purchaseTime');
var remainingTime = document.getElementById('remainingTime');
var purchaseData = document.getElementById('purchaseData');
var remainingData = document.getElementById('remainingData');
var macElement = document.getElementById('mac');
var refreshElement = document.getElementById('refresh');
var toast = document.getElementById('toast');

window.onload = function (){
	getMessage();
}

refreshElement.addEventListener('click', function() {
	getMessage();
})

function getMessage() {
	ajax({
		type: 'POST',
		url: '/api/DP_GET_INFO',
		params: JSON.stringify({params: [{param: {mac: parseUrl('mac')}, opcode: "0x20a6"}], count: "1"}),
		callback: function (response) {
			if (response.errcode === 0) {
				var guestInfo = response.data[0].result;
				
				if (parseInt(guestInfo.access) === 1) {
					const bytesLimit = guestInfo.bytes_limit;
					macElement.innerText = guestInfo.mac;
					purchaseTime.innerText = purchasedTime(guestInfo.time_limit);
					remainingTime.innerText = remainTime(guestInfo.time_limit, guestInfo.time_used);
					purchaseData.innerText = parseInt(bytesLimit) === 0 ? 'No Limited' : bytesLimit + 'MB';
					remainingData.innerText = remainData(guestInfo.bytes_limit, guestInfo.bytes_used);
				} else {
					window.location.href = 'guest.html?mac=' + parseUrl('mac');
				}
			} else {
				//todo
			}
		}
	});
}

function showToast(msg, duration) {
    if (undefined === duration) {
        duration = 3000;
    }

    toast.innerText = msg;
    toast.classList.remove('not-show');
    toast.classList.add('show');
    clearTimeout(toast.timer);
    if (0 !== duration) {
        toast.timer = setTimeout(function () {
            toast.classList.remove('show');
            toast.classList.add('not-show');
        }, duration);
    }
}

function parseUrl(name) {
    var url = location.search.slice(0);
	var reg = new RegExp(name + '\=([^&]+)');
	var ret = reg.exec(url);
    return ret ? ret[1] : null;
}

function remainData(bytesLimit, bytesUsed) {
	var tmpData = '';
	var bytesLimit = parseInt(bytesLimit);
	var bytesUsed = parseInt(bytesUsed);
	if (bytesLimit === 0) {
		tmpData = 'No Limited'
	} else {
		const calResult = bytesLimit - bytesUsed / (1024 * 1024)
		if (calResult > 0) {
			tmpData = calResult.toFixed(2) + 'MB';
		} else {
			tmpData = 0;
		}
	}

	return tmpData;
}

function purchasedTime(time) {
	var limitTime = '';
	var time = parseInt(time);
	if (time) {
		var hour = Math.floor(time / 60);
		hour = hour > 9 ? hour : '0' + hour;
		var min = time % 60;
		min = min > 9 ? min : '0' + min;
		limitTime = '' + hour + ':' + min + ':' + '00';
	} else {
		limitTime = 'No Limited'
	}

	return limitTime;
}

function remainTime(limit, time) {
	var remainTotal = '';
	limit = parseInt(limit);
	time = parseInt(time);
	if (limit) {
		var totalTime = limit * 60 - time;
		if (totalTime > 0) {
			var remainHour = Math.floor(totalTime / 3600);
			remainHour = remainHour > 9 ? remainHour : '0' + remainHour;
	
			var remainMin = Math.floor((totalTime - remainHour * 3600) / 60)
			remainMin = remainMin > 9 ? remainMin : '0' + remainMin;
	
			var remainSec = (totalTime - remainHour * 3600) % 60;
			remainSec = remainSec > 9 ? remainSec : '0' + remainSec;
	
			remainTotal = '' + remainHour + ':' + remainMin + ':' + remainSec
		} else {
			remainTotal = 0;
		}
	} else {
		remainTotal = 'No Limited'
	}

	return remainTotal;
}

