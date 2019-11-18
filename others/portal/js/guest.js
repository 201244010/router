var guestElement = document.getElementById('guest');
var confirmElement = document.getElementById('confirm');
var toast = document.getElementById('toast');

confirmElement.disabled = true;
var list = document.getElementsByClassName('inputw');
var code = '';

for (var index = 0, len = list.length; index < len; index++) {
	var input = list[index];
	input.addEventListener('keyup', (function() {
		code = '';
		var temp = index;
		return function(e) {
			if (e.keyCode !== 8 && temp + 2 <= len && e.target.value.length === 1) {
				document.getElementById('i' + (temp + 2)).focus();
			}
			code = getCode();
			if (code.length < 6) {
				confirmElement.disabled = true;
			} else {
				confirmElement.disabled = false;
			}

			if (code.length === 6) {
				document.getElementById('i' + (temp + 1)).blur();
			}
		}
	})());

	input.addEventListener('keydown', (function() {
		code = '';
		var temp = index;
		return function(e) {
			if (e.keyCode === 8){
				e.preventDefault();
				if (e.target.value === '') {
					if (temp > 0) {
						document.getElementById('i' + temp).focus();
					}
					document.getElementById('i' + temp).value = '';
				} else {
					e.target.value = '';
					code = 
					document.getElementById('i' + (temp + 1)).focus();
				}
				code += document.getElementById('i' + (temp + 1)).value;
			}
		}		
	})())
}

confirmElement.addEventListener('click', function(){
	ajax({
		type: 'POST',
		url: '/api/DP_CODE_VERIFY',
		params: JSON.stringify({params: [{param: {code: getCode(), mac: parseUrl('mac')}, opcode: "0x20a5"}], count: "1"}),
		callback: function (response) {
			if (response.errcode === 0) {
				var result = response.data[0].result.success;
				if (result === 'true') {
					window.location.href = 'message.html?mac=' + parseUrl('mac');
				} else {
					showToast('Coauthorization code Error')
				}
			} else {
				showToast('Coauthorization code Error')
			}
		}
	});
})

function getCode() {
	var codeValue = '';
	for (var index = 0 ; index < 6; index++) {
		codeValue += document.getElementById('i' + (index + 1)).value;
	}

	return codeValue;
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
