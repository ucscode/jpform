/**
 * Copyright (c) 2019 ucscode
 * http://ucscode.com
 * @author uchenna ajah
 * @version 1.0.0
 * @name JPForm
**/
 
 "use strict";
 
function JPForm(OBJ) {
	if(typeof OBJ !== 'object' && OBJ !== null && !Array.isArray(OBJ)) {
		console.error("JPForm requires argument type to be object");
		return;
	};
	
	if(OBJ.el == undefined || OBJ.el == '') {
		console.error("Form element is not defined in JPForm argument");
		return;
	};
	
	var __form__ = document.querySelector(OBJ.el);
	if(!__form__) {
		console.error("Form element (" + OBJ.el + ") not found");
		return;
	}
	
	if(__form__.tagName !== 'FORM') {
		console.error("selected element (" + OBJ.el + ") is not a Form element");
		return;
	}
	
	var __self__ = this;
	
	this.preventSend = false;
	
	if(!OBJ.action) OBJ.action = __form__.action;
	OBJ.json = OBJ.json === true ? true : false;
	
	var __success__, __fail__;
	
	var validInputs = [];
	
	function convertExp(regx) {
		switch(regx) {
			case "word":
				regx = /^\w+$/i;
				break;
			case "text":
				regx = /^[a-z0-9_\s\-.,]+$/i;
				break;
			case "number":
				regx = /^\d+(?:\.\d+)?$/i;
				break;
			case "email":
				regx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				break;
			case "url":
				regx = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+$/i;
				break;
			case "date":
				regx = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/i;
				break;
			case "BTC":
				regx = /^[13][a-km-zA-HJ-NP-Z0-9]{26,33}$/i;
				break;
		}
		return regx;
	}
	
	function elExist($el){
		var x;
		for(x = 0; x < validInputs.length; x++) {
			var el = validInputs[x].el;
			if(el == $el) return {
				index: x,
				obj: validInputs[x]
			};
		};
		return false;
	};
	
	function object_merge(obj1, obj2) {
		var x;
		for(x in obj2) {
			if(obj1[x] != null && obj2[x] === undefined) continue;
			obj1[x] = obj2[x];
		};
		return obj1;
	};
	
	(function() {
		var tags = ['input:not([type]), input[type=search], input[type=text], textarea'], i;
		var elems = document.querySelectorAll(tags);
		for(i = 0; i < elems.length; i++) {
			(function(i) {	
				var el = elems[i]; 
				el.__proto__.validate = function(obj) {
					if(obj == undefined) obj = {};
					var expression = {
						exp: convertExp(obj.exp),
						good: obj.good,
						bad: obj.bad,
						el: this
					};
					var elx = elExist(this);
					if(!elx) {
						if(expression.exp == undefined) expression.exp = /[\s\S]+/i;
						validInputs.push(expression);
					} else {
						var oldExpression = validInputs[elx.index];
						var expression = object_merge(oldExpression, expression);
						validInputs[elx.index] = Object.seal(expression);
					}
					return expression;
				};
			})(i);
		}
	})();
	
	Object.defineProperties(__self__, {
		action: {
			value: OBJ.action
		},
		form: {
			value: __form__
		},
		json: {
			value: OBJ.json
		},
		getElem: {
			value: function(elem) {
				if(elem.slice(0,1) === '!') {
					elem = elem.slice(1);
					var getElemByName = "[name=" + elem + "]";
					elem = __form__.querySelector(getElemByName);
				} else 
					elem = document.querySelector(elem);
				return elem;
			}
		},
		getValue: {
			value: function(elem) {
				var elem = __self__.getElem(elem);
				var tags = ['select', 'input', 'textarea', 'button'];
				if(!tags.includes(elem.tagName.toLowerCase())) console.log("No value for " + elem);
				else return elem.value;
			}
		},
		success: {
			value: function(func) {
				__success__ = func;
			}
		},
		fail: {
			value: function(func) {
				__fail__ = func;
			}
		}
	});
	
	
	function noErrors(expArray) {
		var x;
		for(x = 0; x < expArray.length; x++) {
			var err = (function(x) {
				var obj = expArray[x];
				var valid = obj.exp.test(obj.el.value);
				if(valid && typeof obj.good == 'function') obj.good();
				else if(!valid && typeof obj.bad == 'function') obj.bad();
				return valid;
			})(x);
			if(!err) return err;
		};
		return true;
	};
	
	function objectToQueryString(data) {
		var string = [], x;
		for(x in data) {
			var queryNote = x + "=" + encodeURIComponent(data[x]);
			string.push(queryNote);
		};
		string = string.join("&");
		return string;
	}
	
	validInputs.__proto__.organize = function() {
		var formElems = document.querySelectorAll("input, select, textarea, button");
		formElems = Array.from(formElems);
		this.sort(function(next, current) {
			var nElem = next.el;
			var n = formElems.indexOf(nElem);
			var cElem = current.el;
			var c = formElems.indexOf(cElem);
			return n > c ? 1 : -1;
		});
	}
	
	function convert(data) {
		var x, dataObject = {};
		for(x = 0; x < data.length; x++) {
			(function(x) {
				var elem = data[x]; 
				var name = elem.getAttribute('name');
				var value = elem.value;
				dataObject[name] = value;
			})(x);
		};
		return (__self__.json) ? JSON.stringify(dataObject) : objectToQueryString(dataObject);
	}
	
	function sendFormData(data) {
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange = function() {
			if(this.status == 200 && this.readyState == 4) {
				var response = this.responseText;
				if(typeof __success__ == 'function') __success__(response);
			} else if(typeof __fail__ == 'function') __fail__();
		}
		ajax.open("POST", __self__.action, true);
		var content_type = (__self__.json) ? "application/json" : "application/x-www-form-urlencoded";
		ajax.setRequestHeader("content-type", content_type);
		ajax.send(data);
	}
	
	__form__.addEventListener('submit', function(event) {
		event.preventDefault();
		validInputs.organize();
		var noErr = noErrors(validInputs);
		if(!noErr || __self__.preventSend) return;
		
		var inputs = document.querySelectorAll("input[name], textarea[name], select[name]");
		var data = convert(inputs);
		sendFormData(data);
	});
}
 
var jpform = new JPForm({
	el:"#form",
	action: "test.php",
	json: false
})


jpform.getElem("!firstname");
jpform.getValue('!message');
//jpForm.getElem("!name").setRegx('word');



