(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){"use strict";var _rubberBand=require("rubber-band");(0,_rubberBand.content)()},{"rubber-band":5}],2:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var defaults={name:"rubberband",domain:"*",throttle:300};exports["default"]=defaults;module.exports=exports["default"]},{}],3:[function(require,module,exports){"use strict";var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key]}}}return target};function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++)arr2[i]=arr[i];return arr2}else{return Array.from(arr)}}var _lodashThrottle=require("lodash.throttle");var _lodashThrottle2=_interopRequireDefault(_lodashThrottle);var _measurements=require("../measurements");var _defaults=require("../defaults");var _defaults2=_interopRequireDefault(_defaults);function content(){var config=arguments.length<=0||arguments[0]===undefined?_defaults2["default"]:arguments[0];var measurementElements=[document.body,document.documentElement];var measurementFunctions=[_measurements.measureScrollHeight,_measurements.measureClientHeight,_measurements.measureOffsetHeight];var options=_extends({},_defaults2["default"],config);var observer=null;function getHeight(){var measurements=measurementElements.reduce(function measureElement(results,element){var elementMeasurements=measurementFunctions.map(function applyMeasurement(measurementFunction){return measurementFunction(element)}).filter(function(measurement){return typeof measurement!=="undefined"});return[].concat(_toConsumableArray(results),_toConsumableArray(elementMeasurements))},[]);return Math.max.apply(Math,_toConsumableArray(measurements))}function send(){if(!window.frameElement){return}window.parent.postMessage({type:options.name,height:getHeight(),id:window.frameElement.id},options.domain)}var throttledSend=(0,_lodashThrottle2["default"])(send,options.throttle);function onMessage(e){if(e.data.type!==options.name){return}if(!window.frameElement||e.data.id!==window.frameElement.id){return}throttledSend(e)}function stop(){var api={observer:observer,stop:stop,start:start};window.removeEventListener("message",onMessage);window.removeEventListener("load",throttledSend);window.removeEventListener("resize",throttledSend);document.body.removeEventListener("transitionend",throttledSend);if(!observer){return api}observer.disconnect();return api}function start(){var api={observer:observer,stop:stop,start:start};if(!("frameElement"in window)){return api}if(!("parent"in window)){return api}if(!("postMessage"in window.parent)){return api}if(!("addEventListener"in window)){return api}measurementElements.forEach(function(measurementElement){return measurementElement.style.margin=0});measurementElements.forEach(function(measurementElement){return measurementElement.style.padding=0});window.addEventListener("message",onMessage);window.addEventListener("load",throttledSend);window.addEventListener("resize",throttledSend);document.body.addEventListener("transitionend",throttledSend);if(!("MutationObserver"in window)){return api}observer=observer||new window.MutationObserver(throttledSend);observer.observe(document.body,{childList:true,attributes:true,characterData:true,subtree:true});return api}return start()}module.exports=content},{"../defaults":2,"../measurements":7,"lodash.throttle":10}],4:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key]}}}return target};function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}var _defaults=require("../defaults");var _defaults2=_interopRequireDefault(_defaults);function host(frame){var config=arguments.length<=1||arguments[1]===undefined?_defaults2["default"]:arguments[1];var options=_extends({},config,_defaults2["default"]);var callback=options.callback||function defaultCallback(iframe,height){if(iframe){iframe.style.height=height+"px"}};function onMessage(e){if(e.data.type!==options.name){return}if(e.data.id!==frame.id){return}window.requestAnimationFrame(function(){callback(frame,e.data.height)})}function request(){frame.contentWindow.postMessage({type:options.name,id:frame.id},options.domain)}function stop(){var api={start:start,stop:stop,request:request};window.removeEventListener("message",onMessage);return api}function start(){var api={start:start,stop:stop,request:request};window.addEventListener("message",onMessage,false);return api}return start()}exports["default"]=host;module.exports=exports["default"]},{"../defaults":2}],5:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}var _environmentsContent=require("./environments/content");var _environmentsContent2=_interopRequireDefault(_environmentsContent);var _environmentsHost=require("./environments/host");var _environmentsHost2=_interopRequireDefault(_environmentsHost);exports["default"]={content:_environmentsContent2["default"],host:_environmentsHost2["default"]};module.exports=exports["default"]},{"./environments/content":3,"./environments/host":4}],6:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports["default"]=function(element){return element.clientHeight};module.exports=exports["default"]},{}],7:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{"default":obj}}var _scrollHeight=require("./scroll-height");var _scrollHeight2=_interopRequireDefault(_scrollHeight);var _clientHeight=require("./client-height");var _clientHeight2=_interopRequireDefault(_clientHeight);var _offsetHeight=require("./offset-height");var _offsetHeight2=_interopRequireDefault(_offsetHeight);exports["default"]={measureScrollHeight:_scrollHeight2["default"],measureClientHeight:_clientHeight2["default"],measureOffsetHeight:_offsetHeight2["default"]};module.exports=exports["default"]},{"./client-height":6,"./offset-height":8,"./scroll-height":9}],8:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports["default"]=function(element){return element.offsetHeight};module.exports=exports["default"]},{}],9:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});function scrollHeight(element){return element.scrollHeight}exports["default"]=scrollHeight;module.exports=exports["default"]},{}],10:[function(require,module,exports){var debounce=require("lodash.debounce");var FUNC_ERROR_TEXT="Expected a function";function throttle(func,wait,options){var leading=true,trailing=true;if(typeof func!="function"){throw new TypeError(FUNC_ERROR_TEXT)}if(options===false){leading=false}else if(isObject(options)){leading="leading"in options?!!options.leading:leading;trailing="trailing"in options?!!options.trailing:trailing}return debounce(func,wait,{leading:leading,maxWait:+wait,trailing:trailing})}function isObject(value){var type=typeof value;return!!value&&(type=="object"||type=="function")}module.exports=throttle},{"lodash.debounce":11}],11:[function(require,module,exports){var getNative=require("lodash._getnative");var FUNC_ERROR_TEXT="Expected a function";var nativeMax=Math.max,nativeNow=getNative(Date,"now");var now=nativeNow||function(){return(new Date).getTime()};function debounce(func,wait,options){var args,maxTimeoutId,result,stamp,thisArg,timeoutId,trailingCall,lastCalled=0,maxWait=false,trailing=true;if(typeof func!="function"){throw new TypeError(FUNC_ERROR_TEXT)}wait=wait<0?0:+wait||0;if(options===true){var leading=true;trailing=false}else if(isObject(options)){leading=!!options.leading;maxWait="maxWait"in options&&nativeMax(+options.maxWait||0,wait);trailing="trailing"in options?!!options.trailing:trailing}function cancel(){if(timeoutId){clearTimeout(timeoutId)}if(maxTimeoutId){clearTimeout(maxTimeoutId)}lastCalled=0;maxTimeoutId=timeoutId=trailingCall=undefined}function complete(isCalled,id){if(id){clearTimeout(id)}maxTimeoutId=timeoutId=trailingCall=undefined;if(isCalled){lastCalled=now();result=func.apply(thisArg,args);if(!timeoutId&&!maxTimeoutId){args=thisArg=undefined}}}function delayed(){var remaining=wait-(now()-stamp);if(remaining<=0||remaining>wait){complete(trailingCall,maxTimeoutId)}else{timeoutId=setTimeout(delayed,remaining)}}function maxDelayed(){complete(trailing,timeoutId)}function debounced(){args=arguments;stamp=now();thisArg=this;trailingCall=trailing&&(timeoutId||!leading);if(maxWait===false){var leadingCall=leading&&!timeoutId}else{if(!maxTimeoutId&&!leading){lastCalled=stamp}var remaining=maxWait-(stamp-lastCalled),isCalled=remaining<=0||remaining>maxWait;if(isCalled){if(maxTimeoutId){maxTimeoutId=clearTimeout(maxTimeoutId)}lastCalled=stamp;result=func.apply(thisArg,args)}else if(!maxTimeoutId){maxTimeoutId=setTimeout(maxDelayed,remaining)}}if(isCalled&&timeoutId){timeoutId=clearTimeout(timeoutId)}else if(!timeoutId&&wait!==maxWait){timeoutId=setTimeout(delayed,wait)}if(leadingCall){isCalled=true;result=func.apply(thisArg,args)}if(isCalled&&!timeoutId&&!maxTimeoutId){args=thisArg=undefined}return result}debounced.cancel=cancel;return debounced}function isObject(value){var type=typeof value;return!!value&&(type=="object"||type=="function")}module.exports=debounce},{"lodash._getnative":12}],12:[function(require,module,exports){var funcTag="[object Function]";var reIsHostCtor=/^\[object .+?Constructor\]$/;function isObjectLike(value){return!!value&&typeof value=="object"}var objectProto=Object.prototype;var fnToString=Function.prototype.toString;var hasOwnProperty=objectProto.hasOwnProperty;var objToString=objectProto.toString;var reIsNative=RegExp("^"+fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function getNative(object,key){var value=object==null?undefined:object[key];return isNative(value)?value:undefined}function isFunction(value){return isObject(value)&&objToString.call(value)==funcTag}function isObject(value){var type=typeof value;return!!value&&(type=="object"||type=="function")}function isNative(value){if(value==null){return false}if(isFunction(value)){return reIsNative.test(fnToString.call(value))}return isObjectLike(value)&&reIsHostCtor.test(value)}module.exports=getNative},{}]},{},[1]);
