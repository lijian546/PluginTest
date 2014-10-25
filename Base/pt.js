/**
 * @fileoverview The core module of the PT (Platform Team) JavaScript Library.
 * @author Su Su <gzsusu@corp.netease.com>
 * @version 2.2 2013-12-18
 */
define(['jquery'], function() {"use strict";

	/**
	 * 统一定义页面存储数据的命名空间$ns（NameSpace），每个页面的常量、变量均放在这个
	 * 命名空间下。
	 */
	window.$ns = window.$ns || {};

	var pt = {};

	pt.isBoolean = function(value) {
		return typeof value == 'boolean';
	};
	pt.isNumber = function(value) {
		return typeof value == 'number';
	};
	pt.isString = function(value) {
		return typeof value == 'string';
	};
	pt.isArray = function(value) {
		return value instanceof Array;
	};
	pt.isObject = function(value) {
		return value !== null && typeof value == 'object';
	};
	pt.isFunction = function(value) {
		return typeof value == 'function';
	};
	
	pt.isInt = function(value) {
		return parseInt(value, 10) == value;
	}

	pt.bool = function(value) {
		return !!value;
	};
	pt.i = function(value, radix) {
		radix = radix || 10;
		return parseInt(value, radix);
	};
	pt.f = function(value) {
		return parseFloat(value);
	};
	pt.str = function(value) {
		return String(value);
	};
	pt.array = function(value) {
		if (value === undefined || value === null) {
			return [];
		}
		return pt.isArray(value) ? value : [value];
	};

	/**
	 * 不执行任何操作的函数。
	 */
	pt.noop = function() {
	};

	/**
	 * 未实现的函数。
	 *
	 * @throw {Error} 抛出异常。
	 */
	pt.unimplemented = function() {
		throw Error('Unimplemented function.');
	};

	/**
	 * 恒等函数。
	 */
	pt.identity = function(value) {
		return value;
	};

	/**
	 * 深拷贝。
	 * 对于简单对象，会挨个属性深拷贝。对于数组，会用其副本做赋值。对于其他类型（
	 * 复杂对象、函数、字符串、数字、布尔值），会用等号（=）赋值。
	 * 简单对象一般指用{}或new Object创建的对象。
	 * 复杂对象做浅拷贝是防止循环引用造成无限递归。
	 */
	pt.deepcopy = function(value, target) {
		if (pt.isArray(value)) {
			target = value.slice();
		} else if ($.isPlainObject(value)) {
			target = target || {};
			for (var i in value) {
				if (value.hasOwnProperty(i)) {
					target[i] = pt.deepcopy(value[i], target[i]);
				}
			}
		} else {
			target = value;
		}
		return target;
	};

	/**
	 * 返回对象的键。
	 *
	 * 例如：
	 *
	 * 代码：pt.keys(['a', 'b', 'c']);
	 * 结果：["0", "1", "2"]
	 *
	 * 代码：pt.keys({a:1, b:2, c:3});
	 * 结果：["a", "b", "c"]
	 *
	 * @param {Object} 一个对象。
	 * @return {Array} 对象的键组成的数组。
	 */
	pt.keys = function(obj) {
		var keys = [];
		for (var k in obj) {
			if (obj.hasOwnProperty(k)) {
				keys.push(k);
			}
		}
		return keys;
	};

	/**
	 * 返回对象的值，注意是用赋值符（=）拷贝的值，没有进行深拷贝。
	 *
	 * 例如：
	 *
	 * 代码：pt.values(['a', 'b', 'c']);
	 * 结果：["a", "b", "c"]
	 *
	 * 代码：pt.values({a:1, b:'hello', c:[1,2,3]});
	 * 结果：[1, "hello", [1, 2, 3]]
	 *
	 * @param obj {Object} 一个对象。
	 * @return {Array} 对象的值组成的数组。
	 */
	pt.values = function(obj) {
		var values = [];
		for (var k in obj) {
			if (obj.hasOwnProperty(k)) {
				values.push(obj[k]);
			}
		}
		return values;
	};

	/**
	 * 默认的比较函数，使用大于号（&gt;）和小于号（&lt;）进行比较。
	 *
	 * @todo 根据参数的类型决定比较行为？
	 * @param a {Object} 第一个对象。
	 * @param b {Object} 第二个对象。
	 * @return {Number} a&gt;b时，返回正值；a&lt;b时，返回负值；a=b或无法比较时，返回0。
	 */
	pt.cmp = function(a, b) {
		return a > b ? 1 : a < b ? -1 : 0;
	};

	/**
	 * 返回参数中最大的那一个。使用大于号（&gt;）进行比较。
	 *
	 * @todo 允许传递一个数组作为参数？
	 * @param ... {?} 任意参数
	 * @return {?} 最大的参数。
	 */
	pt.max = function() {
		if (!arguments.length) {
			return undefined;
		}
		var result = arguments[0];
		for (var i = 1; i < arguments.length; ++i) {
			if (arguments[i] > result) {
				result = arguments[i];
			}
		}
		return result;
	};

	/**
	 * 返回参数中最大的那一个。使用大于号（&lt;）进行比较。
	 *
	 * @todo 允许传递一个数组作为参数？
	 * @param ... {?} 任意参数
	 * @return {?} 最小的参数。
	 */
	pt.min = function() {
		if (!arguments.length) {
			return undefined;
		}
		var result = arguments[0];
		for (var i = 1; i < arguments.length; ++i) {
			if (arguments[i] < result) {
				result = arguments[i];
			}
		}
		return result;
	};

	pt.range = function(start, stop, step) {
		if (arguments.length <= 1) {
			stop = start || 0;
			start = 0;
		}
		step = arguments[2] || 1;

		var i = 0, len = Math.max(Math.ceil((stop - start) / step), 0);
		var range = new Array(len);
		while (i < len) {
			range[i++] = start;
			start += step;
		}

		return range;
	};

	/**
	 * 对指定数组进行in-place的稳定排序。
	 *
	 * @param {Array} arr 需要排序的数组。
	 * @param {Function} 比较函数，默认为pt.cmp。
	 * @return {Array} 返回排序后的数组。
	 */
	pt.sort = function(arr, cmp) {
		cmp = cmp || pt.cmp;
		var len = arr.length;
		for (var i = 0; i < len; ++i) {
			if (pt.isObject(arr[i])) {
				arr[i]._ss_i = i;
			}
		}
		arr.sort(function(a, b) {
			return cmp(a, b) || a._ss_i - b._ss_i;
		});
		for (var i = 0; i < len; ++i) {
			delete arr[i]._ss_i;
		}
		return arr;
	};

	/**
	 * 格式化字符串。
	 *
	 * 支持的格式转换类型包括整数（%d）、浮点数（%f）、字符串（%s）。
	 * 格式中的百分号需使用"%%"转义。
	 *
	 * 以下是使用示例：
	 *
	 * pt.format();  // ""
	 * pt.format('string without format');  // "string without format"
	 * pt.format('%f%%', 12.3);  // "12.3%"
	 * pt.format('<div id="%s"></div>', 'hello');  // "<div id="hello"></div>"
	 * pt.format('%s%s', ['hello','world']); // "helloworld"
	 * pt.format('%k'); // 'FORMAT_ERROR'。（报错，错误的格式转换类型）
	 * pt.format('%s'); // 'FORMAT_ERROR'。（报错，格式转换标记与参数数量不匹配）
	 * pt.format('%%test');//'%test'....这个还没处理
	 * pt.format('%%%t');  //报错
	 *
	 * @param {String} 需要格式化字符串的格式。
	 * @param {?} 填入格式的值。
	 * @return {String} 格式化后的字符串。
	 */
	pt.format = function() {
		//无参数
		if (!arguments.length) {
			return '';
		}

		var _formatStr = function() {
			var values = arguments;
			var template = values.length ? pt.str(arguments[0]) : '';
			var pos = 1;
			return template.replace(/%(.)?/g, function() {
				switch (arguments[1]) {
					case '%' :
						return '%';
					case '\\' :
						return '\\';
					case undefined:
						throw new Error('不完整的格式化标记');
				}
				if (pos >= values.length) {
					throw new Error('缺少数据');
				}
				switch (arguments[1]) {
					case 'd' :
						return pt.i(values[pos++]);
					case 'f' :
						return pt.f(values[pos++]);
					case 's' :
						return pt.str(values[pos++]);
					default:
						throw new Error('错误的格式化类型：' + arguments[1]);
				}
			});
		};

		var _formatFunc = function() {
			//无参数
			if (!arguments.length) {
				return '';
			}

			var modes = ['WS-KEEP', 'WS-OUTDENT', 'WS-TRIM'];

			var funcModeFormatter = {
				'WS-KEEP' : function(str) {
					return str;
				},
				'WS-OUTDENT' : function(str) {
					var lines = str.split('\n');
					var min_num = lines[0].length - lines[0].trimLeft().length;
					for (var i = 1; i < lines.length; i++) {
						var tmp = lines[i].length - lines[i].trimLeft().length;
						if (tmp < min_num) {
							min_num = tmp;
						}
					}
					for (var i = 0; i < lines.length; i++) {
						lines[i] = lines[i].substring(min_num);
					}
					str = lines.join('\n');
					return str;
				},
				'WS-TRIM' : function(str) {
					str = funcModeFormatter['TRIM-ENTER'](str);
					var lines = str.split('\n');
					for (var i = 0; i < lines.length; i++) {
						lines[i] = lines[i].trim();
					}
					str = lines.join('\n');
					return str;
				},
				'LEFT-TRIM-SPACE' : function(str) {
					return str.replace(/^ +/, '');
				},
				'RIGHT-TRIM-SPACE' : function(str) {
					return str.replace(/ +$/, '');
				},
				'LEFT-TRIM-ENTER' : function(str) {
					str = funcModeFormatter['LEFT-TRIM-SPACE'](str);
					return str.replace(/^[\r\n]+/, '');
				},
				'RIGHT-TRIM-ENTER' : function(str) {
					str = funcModeFormatter['RIGHT-TRIM-SPACE'](str);
					return str.replace(/[\r\n]+$/, '');
				},
				'TRIM-ENTER' : function(str) {
					str = funcModeFormatter['LEFT-TRIM-ENTER'](str);
					str = funcModeFormatter['RIGHT-TRIM-ENTER'](str);
					return str;
				}
			};

			var snippet = pt.str(arguments[0]);
			var lines = snippet.split(/\r?\n/g);
			if (lines.length < 1) {
				return 'FORMAT_ERROR:多行格式化-配置错误';
			}

			//找开始行
			var begin_line_re = /^[\t ]*\/\*!?<<<[A-Za-z0-9_]{1,}((;?)|((;WS-KEEP)|(;WS-OUTDENT)|(;WS-TRIM)))$/g;
			var begin_line_num = -1;
			for (var i = 0; i < lines.length; i++) {
				var tmp = lines[i];
				var begin_line_test = begin_line_re.test(tmp);
				if (begin_line_test) {
					begin_line_num = i;
					break;
				}
			}
			if (begin_line_num <= 0) {
				return 'FORMAT_ERROR:多行格式化-找不到开始标记行';
			}

			//找到标记
			if (lines[begin_line_num].trimLeft()[2] == '!') {
				var begin_line = lines[begin_line_num].trimLeft().substring(6);
			} else {
				var begin_line = lines[begin_line_num].trimLeft().substring(5);
			}
			var flag = '';
			var re = /[^A-Za-z0-9_]/g;
			var ilgChar = re.exec(begin_line);
			if (ilgChar != null) {
				flag = begin_line.substring(0, ilgChar.index);
			} else {
				flag = begin_line;
			}

			//找结束行
			var end_line_re = new RegExp('^[\t ]*' + flag + '[\*]\/', 'g');
			var end_line_num = begin_line_num;
			for (var i = begin_line_num + 1; i < lines.length; i++) {
				var tmp = lines[i];
				var end_line_test = end_line_re.test(tmp);
				if (end_line_test) {
					end_line_num = i;
					break;
				}
			}
			if (end_line_num == begin_line_num) {
				return 'FORMAT_ERROR:多行格式化-找不到结束标记行';
			}

			//找格式化的模式
			var mode = 'WS-OUTDENT';
			var semi_index = begin_line.indexOf(';');
			if (semi_index >= 0) {
				var mode = begin_line.substring(begin_line.indexOf(';') + 1);
				if (mode.trim() == '') {
					mode = 'WS-OUTDENT';
				}
			}
			if ($.inArray(mode, modes) < 0) {
				return 'FORMAT_ERROR:多行格式化-配置错误';
			}

			var newLines = [];
			for (var i = begin_line_num + 1; i <= end_line_num - 1; i++) {
				newLines.push(lines[i]);
			}
			var content = newLines.join('\n');

			//做格式化处理
			arguments[0] = content;
			content = _formatStr.apply(this, arguments);

			//模式化处理
			return funcModeFormatter[mode].call(this, content);
		};

		if (pt.isFunction(arguments[0])) {
			return _formatFunc.apply(this, arguments);
		} else if (pt.isString(arguments[0])) {
			return _formatStr.apply(this, arguments);
		} else {
			return 'FORMAT_ERROR';
		}
	};

	/**
	 * 格式化数字。
	 *
	 * 以下是使用实例：
	 *
	 * format_number();  // "-"
	 * format_number(123123.456);  // "123,123.456"
	 * format_number('123.456');  // "123.456"
	 * format_number(123.456, 0);  // "123"
	 * format_number(123.456, 2);  // "123.46"，四舍五入
	 * format_number(123.456, 5);  // "123.45600"
	 * format_number(0.4567, 1, true);  // "45.7%"，转百分数后依然是保留fixed位小数
	 * format_number(0.5, 2, true);  // "50.00%"
	 * format_number(123123.456, 1, false, false);  // "123123.456"
	 * format_number('invalid_number', 1, false, false, NaN);  // NaN
	 *
	 * 如果没有指定需要保留的小数位数，当数字大于等于100时，不保留小数；小于100，
	 * 但大于等于10时，保留1位小数；小于10时，保留2位小数。
	 *
	 * @param {Number|String} number 需要格式化的数字。
	 * @param {Integer} fixed 保留的小数位数；默认为NaN，此时将自动保留0-2位小数。
	 * @param {Boolean} is_percentage 是否显示为百分数，默认为false。
	 * @param {Boolean} grouping 是否分组，即添加千分位逗号，默认为true。
	 * @param {Object} nan_result 当number不是数字时返回的值，默认为“-”。
	 * @return {String} 格式化后的数字，以字符串表示。
	 */
	pt.formatNumber = function(number, fixed, is_percentage, grouping, nan_result) {
		number = parseFloat(number);

		if (number < 0) {
			var sign = '-';
			number = -number;
		} else {
			var sign = '';
		}

		fixed = parseInt(fixed);
		if (grouping === undefined) {
			grouping = true;
		}
		if (nan_result === undefined) {
			nan_result = '-';
		}

		if (isNaN(number)) {
			return nan_result;
		}

		if (is_percentage) {
			number = number * 100;
		}
		if (isNaN(fixed)) {
			// fixed未指定时，自动保留0到2位小数，以保证最低从个位算起的3位有效数字
			if (number >= 100) {
				fixed = 0;
			} else if (number >= 10) {
				fixed = 1;
			} else {
				fixed = 2;
			}
		}

		number = number.toFixed(fixed);

		if (grouping) {
			var pos = number.indexOf('.');
			if (pos < 0) {
				pos = number.length;
			}
			pos -= 3;
			while (pos > 0) {
				number = number.substring(0, pos) + ',' + number.substring(pos);
				pos -= 3;
			}
		}

		return sign + ( is_percentage ? number + '%' : number);
	};

	/**
	 * 获取页面上的唯一元素。
	 * <p>
	 * 如果传参是字符串，那么会首先尝试将其作为id取元素。如果未成功则用jQuery取元素。
	 *
	 * @param {String|DOM|jQuery} selector 选择条件
	 * @return {DOM} 返回选择到的唯一DOM元素。
	 */
	pt.getUniqueElement = function(selector) {
		if (!selector) {
			return false;
		}
		var element = [];
		if (pt.isString(selector)) {
			element = $(document.getElementById(selector));
		}
		if (element.length < 1) {
			element = $(selector);
		}
		if (element.length < 1) {
			return false;
		} else if (element.length > 1) {
			return false;
		}
		return element.get(0);
	};

	/**
	 * 获得一个元素的zIndex值。
	 * <p>
	 * jQuery的.css('zIndex')的返回值并不可靠，jQuery UI的.zIndex()的返回值更可靠。
	 * 本函数采用与jQuery UI的.zIndex()相同的逻辑。
	 * <p>
	 * 本函数逐层查找指定元素及其各父级，返回第一个有效的zIndex值。如果找不到有效的
	 * zIndex值，则返回0。有效指元素的position是absolute、relative或fixed，并且
	 * zIndex有指定值。
	 * <p>
	 * 对于未指定zIndex的元素，IE会认为它的zIndex是0。因此本函数假定元素不会被显式
	 * 指定zIndex为0，以保证在各环境下均工作正常。
	 *
	 * @param {String|DOM|jQuery} selector 元素或元素选择器
	 * @return {Integer} zIndex值。
	 */
	pt.getZIndex = function(selector) {
		var elem = $(selector);
		if (elem.length) {
			var elem = $(elem[0]), position, value;
			while (elem.length && elem[0] !== document) {
				position = elem.css("position");
				if (position === "absolute" || position === "relative" || position === "fixed") {
					value = parseInt(elem.css("zIndex"), 10);
					if (!isNaN(value) && value !== 0) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}
		return 0;
	};

	/**
	 * 报错。
	 */
	pt.error = function() {
		throw new Error(pt.format.apply(this, arguments));
	};

	////////////////////////////////////////////////////////////
	// 为老版本的浏览器（特别是天杀的IE8）添加新特性的支持。
	////////////////////////////////////////////////////////////

	/**
	 * 添加Array的filter()和map()兼容。
	 */
	if (!Array.prototype.filter) {
		Array.prototype.filter = function(callback, thisArg) {
			if (this == null) {
				throw new TypeError('Array.prototype.filter called on null or undefined');
			}
			if ( typeof callback !== 'function') {
				throw new TypeError(callback + ' is not a function');
			}
			var res = [];
			for (var i = 0, len = this.length; i < len; ++i) {
				if ( i in this && !!callback.call(thisArg, this[i], i, this)) {
					res.push(this[i]);
				}
			}
			return res;
		};
	}
	if (!Array.prototype.map) {
		Array.prototype.map = function(callback, thisArg) {
			if (this == null) {
				throw new TypeError("Array.prototype.map called on null or undefined");
			}
			if ( typeof callback !== 'function') {
				throw new TypeError(callback + ' is not a function');
			}
			var res = [];
			for (var i = 0, len = this.length; i < len; ++i) {
				if ( i in this) {
					res.push(callback.call(thisArg, this[i], i, this));
				}
			}
			return res;
		};
	}

	/**
	 * 添加String的trim()、trimLeft()和trimRight()兼容。
	 */
	if (!String.prototype.trim) {
		String.prototype.trim = function() {
			return this.replace(/^\s+|\s+$/g, '');
		};
	}
	if (!String.prototype.trimLeft) {
		String.prototype.trimLeft = function() {
			return this.replace(/^\s+/, '');
		};
	}
	if (!String.prototype.trimRight) {
		String.prototype.trimRight = function() {
			return this.replace(/\s+$/, '');
		};
	}

	/**
	 * 添加console兼容。默认无输出，但在DEBUG为真时使用alert展示信息。
	 */
	(function() {

		if (!window.console) {
			window.console = {};
		}

		var log_function_names = ['debug', 'error', 'info', 'log', 'warn'];

		var log_function = function() {
			if (window.DEBUG) {
				var msg = arguments.join(' ');
				alert(msg);
			}
		};

		for (var i = 0; i < log_function_names.length; ++i) {
			var name = log_function_names[i];
			if (!window.console[name]) {
				window.console[name] = log_function;
			}
		}

		if (!window.console.assert) {
			window.console.assert = function(assertion, msg) {
				if (msg) {
					msg = 'Assertion Failed: ' + msg;
				} else {
					msg = 'Assertion Failed';
				}
				if (!assertion) {
					window.console.error(msg);
				}
			};
		}

	})();

	/**
	 * 添加Date.now()兼容。
	 */
	if (!Date.now) {
		Date.now = function() {
			return new Date().getTime();
		};
	}

	/**
	 * 从list中查找元素
	 * source源数据
	 * attribute属性字段
	 * value 字段值
	 */
	pt.findItemFromList = function(source, attributeValue, attribute) {
		var targetObject = null;
		attribute = attribute || 'id';
		if (source) {
			$.each(source, function(key, value) {
				if (value[attribute] == attributeValue) {
					targetObject = value;
				}
			});
		}
		return targetObject;
	}
	
	/**
	 * 从list中查找元素key
	 * source源数据
	 * attribute属性字段
	 * value 字段值
	 */
	pt.findKeyFromList = function(source, attributeValue, attribute) {
		var targetKey = -1;
		attribute = attribute || 'id';
		if (source) {
			$.each(source, function(key, value) {
				if (value[attribute] == attributeValue) {
					targetKey = key;
				}
			});
		}
		return targetKey;
	}
	
	/**
	 * 去国际化语句
	 * _(174@title)
	 */
	pt.formatDjText = function(orgText) {
		var text = orgText;
		if (pt.isString(orgText)) {
			var re = new RegExp(/(?=@).*?(?=\))/g);
			var tempText = orgText.match(re);
			if (tempText && tempText.length > 0 && tempText[0]) {
				text = tempText[0].split('@')[1];
			}
		}
		return text;
	}
	/**
	 * 替换国际化值
	 * orgText = _(174@orgText)
	 * newText = newText
	 * return _(174@newText)
	 */
	
	pt.replaceDjtext = function(orgText, newText) {
		var rText = newText;
		if (pt.isString(orgText) && newText) {
			if (orgText.indexOf('@') > -1) {
				var text = pt.formatDjText(orgText);
				if (newText == text) {
					rText = orgText;
				} else {
					rText = newText;
				}
			}
		}
		return rText;
	}
	return pt;
});
