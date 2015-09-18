/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	let React = __webpack_require__(1);
	let Timeline = __webpack_require__(2);
	let HttpDetail = __webpack_require__(8);
	let data = __webpack_require__(15);
	let event = __webpack_require__(5);
	
	// let TimelineMockData = require('./data/timeline-mock')
	
	__webpack_require__(16);
	
	class Main extends React.Component {
	
	  constructor(props) {
	    super(props);
	
	    this.state = {
	      timeline: data.getTimeline()
	    };
	
	    this.listenTimeline();
	  }
	
	  listenTimeline() {
	    var _this = this;
	
	    event.on('timeline-update', function () {
	      let timeline = data.getTimeline();
	      _this.setState({
	        timeline: timeline
	      });
	    });
	  }
	
	  render() {
	    return React.createElement(
	      'div',
	      { className: 'layout' },
	      React.createElement(
	        'aside',
	        null,
	        React.createElement(Timeline, { data: this.state.timeline })
	      ),
	      React.createElement(
	        'div',
	        { className: 'main' },
	        React.createElement(HttpDetail, { id: 'xxx' })
	      )
	    );
	  }
	}
	
	React.render(React.createElement(Main, null), document.getElementById('target'));

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	let React = __webpack_require__(1);
	var remote = __webpack_require__(3);
	var Menu = remote.require('menu');
	let clipboard = __webpack_require__(4);
	let event = __webpack_require__(5);
	
	__webpack_require__(7);
	
	class TimelineItem extends React.Component {
	
	  constructor(props) {
	    super(props);
	
	    let request = props.request;
	    let scheme = props.ssl ? 'https' : 'http';
	    let port = request.port;
	    let isDefaultPort = !port || port === 80;
	    let url = scheme + '://' + request.hostname + (isDefaultPort ? '' : ':' + port);
	
	    this.state = {
	      url: url
	    };
	  }
	
	  render() {
	    let props = this.props;
	    let request = props.request;
	    let response = props.response || {};
	
	    return React.createElement(
	      'li',
	      { onContextMenu: this.handleContextMenu.bind(this),
	        onClick: this.handleClick.bind(this),
	        className: props.active ? 'active' : ''
	      },
	      React.createElement(
	        'div',
	        { className: 'url' },
	        React.createElement(
	          'span',
	          { className: 'host' },
	          this.state.url
	        ),
	        React.createElement(
	          'span',
	          { className: 'path' },
	          request.path
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'aside' },
	        React.createElement(
	          'span',
	          { className: 'method' },
	          request.method
	        ),
	        React.createElement(
	          'span',
	          { className: 'status' },
	          response.status
	        )
	      )
	    );
	  }
	
	  handleContextMenu(e) {
	    var _this = this;
	
	    Menu.buildFromTemplate([{
	      label: 'Copy Link Address',
	      // submenu: [],
	      click: function click() {
	        _this.copy();
	      }
	    }]).popup(remote.getCurrentWindow());
	  }
	
	  handleClick() {
	    this.props.onClick(this.props);
	  }
	
	  copy() {
	    console.log('copy');
	    clipboard.writeText(this.state.path, 'selection');
	  }
	}
	
	TimelineItem.defaultProps = {
	  onClick: function onClick() {}
	};
	
	class Timeline extends React.Component {
	  constructor(props) {
	    super(props);
	
	    this.state = {
	      activeId: null
	    };
	  }
	
	  render() {
	    var _this2 = this;
	
	    return React.createElement(
	      'ul',
	      { className: 'timeline' },
	      this.props.data.map(function (item) {
	        return React.createElement(TimelineItem, _extends({ key: item.id }, item, { active: item.id === _this2.state.activeId, onClick: _this2.handleItemClick.bind(_this2) }));
	      })
	    );
	  }
	
	  handleItemClick(item) {
	    this.setState({
	      activeId: item.id
	    });
	    event.emit('timeline-item-click', item);
	  }
	}
	
	exports['default'] = Timeline;
	
	Timeline.defaultProps = {
	  data: []
	};
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("remote");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("clipboard");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	let EventEmitter = __webpack_require__(6).EventEmitter;
	
	module.exports = new EventEmitter();

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("events");

/***/ },
/* 7 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	let React = __webpack_require__(1);
	let Tabs = __webpack_require__(9);
	let Tab = Tabs.Item;
	let Pages = __webpack_require__(11);
	let Page = Pages.Item;
	let Panel = __webpack_require__(12);
	// let event = require('../utils/event')
	let ipc = __webpack_require__(14);
	
	class HttpDetail extends React.Component {
	
	  constructor(props) {
	    super(props);
	
	    this.state = {
	      selectedId: 'headers'
	    };
	
	    ipc.on('response-body-data', this.setState.bind(this));
	
	    ipc.on('test-emit', function (date) {
	      // console.log(date)
	    });
	  }
	
	  // 获取 HTTP body 的数据
	  updateBodyData() {
	    ipc.send('get-body-data', this.props.id);
	  }
	
	  render() {
	    let code = `function() {\n  a()\n}`;
	
	    return React.createElement(
	      'div',
	      { style: { marginLeft: '15px' } },
	      React.createElement(
	        Tabs,
	        { defaultValue: this.state.selectedId, onChange: this.handleTabChange.bind(this) },
	        React.createElement(
	          Tab,
	          { value: 'headers' },
	          'Headers'
	        ),
	        React.createElement(
	          Tab,
	          { value: 'request' },
	          'Request'
	        ),
	        React.createElement(
	          Tab,
	          { value: 'response' },
	          'Response'
	        )
	      ),
	      React.createElement(
	        Pages,
	        { value: this.state.selectedId },
	        React.createElement(
	          Page,
	          { value: 'headers' },
	          React.createElement(
	            Panel,
	            null,
	            'General'
	          ),
	          React.createElement(
	            Panel,
	            null,
	            'Request Headers'
	          ),
	          React.createElement(
	            Panel,
	            null,
	            'Response Headers'
	          )
	        ),
	        React.createElement(
	          Page,
	          { value: 'request' },
	          React.createElement(
	            'code',
	            null,
	            React.createElement(
	              'pre',
	              null,
	              'empty'
	            )
	          )
	        ),
	        React.createElement(
	          Page,
	          { value: 'response' },
	          React.createElement(
	            'code',
	            null,
	            React.createElement(
	              'pre',
	              null,
	              code
	            )
	          )
	        )
	      )
	    );
	  }
	
	  handleTabChange(tabValue) {
	    this.setState({
	      selectedId: tabValue
	    });
	  }
	}
	
	module.exports = HttpDetail;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	let React = __webpack_require__(1);
	
	__webpack_require__(10);
	
	class Empty extends React.Component {}
	
	class TabItem extends React.Component {
	
	  render() {
	    return React.createElement(
	      'a',
	      _extends({ href: '#', className: this.props.selected ? 'selected' : '' }, this.props),
	      this.props.children
	    );
	  }
	
	}
	
	TabItem.defaultProps = {
	  selected: false,
	  onClick: function onClick() {}
	};
	
	class Tab extends React.Component {
	
	  constructor(props) {
	    super(props);
	
	    this.state = {
	      value: props.defaultValue
	    };
	  }
	
	  render() {
	    var _this = this;
	
	    return React.createElement(
	      'div',
	      { className: 'tab-set' },
	      this.props.children.map(function (item) {
	        let value = item.props.value;
	        return React.createElement(
	          TabItem,
	          { onClick: _this.handleClick.bind(_this, value), key: value, selected: _this.state.value === value },
	          item.props.children
	        );
	      })
	    );
	  }
	
	  handleClick(value) {
	    if (value !== this.state.value) {
	      this.setState({
	        value: value
	      });
	      this.props.onChange(value, this);
	    }
	  }
	}
	
	Tab.defaultProps = {
	  defaultValue: null,
	  onChange: function onChange() {}
	};
	
	Tab.Item = Empty;
	module.exports = Tab;

/***/ },
/* 10 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	let React = __webpack_require__(1);
	
	class Empty extends React.Component {}
	
	class Pages extends React.Component {
	  render() {
	    var _this = this;
	
	    return React.createElement(
	      'div',
	      null,
	      this.props.children.map(function (item) {
	        let value = item.props.value;
	        return React.createElement(
	          'section',
	          { key: value, className: _this.props.value === value ? '' : 'hide' },
	          item.props.children
	        );
	      })
	    );
	  }
	}
	
	Pages.Item = Empty;
	module.exports = Pages;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/*!
	 * 可折叠的 panel
	 **/
	
	let React = __webpack_require__(1);
	
	let addClass = function addClass(className, condition) {
	  return condition ? className : '';
	};
	
	__webpack_require__(13);
	
	class Panel extends React.Component {
	
	  constructor(props) {
	    super();
	
	    this.state = {
	      open: props.defaultOpen
	    };
	  }
	
	  render() {
	    return React.createElement(
	      'section',
	      { className: `panel ${ addClass('closed', !this.state.open) }` },
	      React.createElement(
	        'h3',
	        { onClick: this.handleToggleClick.bind(this) },
	        this.props.children
	      ),
	      React.createElement(
	        'dl',
	        null,
	        React.createElement(
	          'dt',
	          null,
	          'Cache-Control'
	        ),
	        React.createElement(
	          'dd',
	          null,
	          'max-age=86400'
	        ),
	        React.createElement(
	          'dt',
	          null,
	          'Cache-Control'
	        ),
	        React.createElement(
	          'dd',
	          null,
	          'private'
	        ),
	        React.createElement(
	          'dt',
	          null,
	          'Connection'
	        ),
	        React.createElement(
	          'dd',
	          null,
	          'Keep-Alive'
	        ),
	        React.createElement(
	          'dt',
	          null,
	          'Content-Length'
	        ),
	        React.createElement(
	          'dd',
	          null,
	          '160'
	        ),
	        React.createElement(
	          'dt',
	          null,
	          'Content-Type'
	        ),
	        React.createElement(
	          'dd',
	          null,
	          'text/html'
	        ),
	        React.createElement(
	          'dt',
	          null,
	          'Date'
	        ),
	        React.createElement(
	          'dd',
	          null,
	          'Thu, 27 Aug 2015 13:03:42 GMT'
	        ),
	        React.createElement(
	          'dt',
	          null,
	          'Expires'
	        ),
	        React.createElement(
	          'dd',
	          null,
	          'Fri, 28 Aug 2015 13:03:42 GMT'
	        ),
	        React.createElement(
	          'dt',
	          null,
	          'Location'
	        ),
	        React.createElement(
	          'dd',
	          null,
	          'https://www.baidu.com/'
	        ),
	        React.createElement(
	          'dt',
	          null,
	          'Server'
	        ),
	        React.createElement(
	          'dd',
	          null,
	          'bfe/1.0.8.5'
	        )
	      )
	    );
	  }
	
	  handleToggleClick() {
	    this.setState({
	      open: !this.state.open
	    });
	  }
	
	}
	
	Panel.defaultProps = {
	  defaultOpen: true
	};
	
	module.exports = Panel;
	
	// usage
	/*
	<Panel name="Request header">
	  <dt>Cache-Control</dt>:<dd>max-age=86400</dd>
	  <dt>Cache-Control</dt>:<dd>private</dd>
	  <dt>Connection</dt>:<dd>Keep-Alive</dd>
	  <dt>Content-Length</dt>:<dd>160</dd>
	  <dt>Content-Type</dt>:<dd>text/html</dd>
	  <dt>Date</dt>:<dd>Thu, 27 Aug 2015 13:03:42 GMT</dd>
	  <dt>Expires</dt>:<dd>Fri, 28 Aug 2015 13:03:42 GMT</dd>
	  <dt>Location</dt>:<dd>https://www.baidu.com/</dd>
	  <dt>Server</dt>:<dd>bfe/1.0.8.5</dd>
	</Panel>

	*/

/***/ },
/* 13 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("ipc");

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	let ipc = __webpack_require__(14);
	let event = __webpack_require__(5);
	
	let timeline = []; // Map -> React Elements 性能较低
	
	timeline.get = function (id) {
	  return this.find(function (item) {
	    return item.id === id;
	  });
	};
	var __count = 0;
	ipc.on('http-data', function (data) {
	  console.log(`ipc.on('http-data', data => {\n`, data);
	
	  // 根据 data 的属性，往 timeline 插入 或者 更新
	  if (data.state === 'BEFORE_REQUEST') {
	    let item = Object.assign({}, data);
	
	    item.request = item.data;
	    item.data = null;
	
	    timeline.unshift(item);
	
	    console.log(__count++);
	  } else {
	    let item = timeline.get(data.id);
	
	    if (!item) {
	      return; // Ignore error.
	    }
	
	    Object.assign(item, data);
	
	    switch (item.state) {
	
	      case 'RESPONSE':
	        item.response = item.data;
	        break;
	
	      case 'MODIFIED_RESPONSE':
	        item.rawResponse = item.response;
	        item.response = item.data;
	    }
	
	    item.data = null;
	  }
	
	  event.emit('timeline-update');
	});
	
	// setInterval(() => {
	//   timeline.push({
	//     id: Date.now(),
	//     host: 'https://rennet.com',
	//     path: '/taintworm/unipara?a=sphenotribe&b=soapboxer#indocility',
	//     status: '200',
	//     method: 'GET'
	//   })
	//   event.emit('timeline-update')
	// }, 2000)
	
	exports.getTimeline = function () {
	  return timeline;
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map