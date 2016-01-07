(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var React = require('react');
var tabs_1 = require('./tabs');
var pages_1 = require('./pages');
var panel_1 = require('./panel');
var _ = require('../../utils/utils');
class HttpDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedId: 'headers'
        };
    }
    render() {
        let code = `function() {\n  a()\n}`;
        let data = this.props.data;
        if (data) {
            let requestHeaders = data.request.headers;
            let responseHeaders = data.response.headers;
            return (React.createElement("div", {style: { marginLeft: '15px' }}, React.createElement(tabs_1.Tab, {defaultValue: this.state.selectedId, onChange: this.handleTabChange.bind(this)}, React.createElement(tabs_1.TabItem, {value: "headers"}, "Headers"), React.createElement(tabs_1.TabItem, {value: "request"}, "Request"), React.createElement(tabs_1.TabItem, {value: "response"}, "Response")), React.createElement(pages_1.Page, {value: this.state.selectedId}, React.createElement(pages_1.PageItem, {value: "headers"}, React.createElement(panel_1.default, {name: "General"}, React.createElement("dt", null, "Method"), React.createElement("dd", null, data.request.method), React.createElement("dt", null, "URL"), React.createElement("dd", null, _.genUrl(data.ssl, data.request.hostname, data.request.port, data.request.path)), React.createElement("dt", null, "Status"), React.createElement("dd", null, data.response.status)), React.createElement(panel_1.default, {name: "Request Headers"}, Object.keys(requestHeaders).map(key => {
                return ([
                    React.createElement("dt", null, key),
                    React.createElement("dd", null, requestHeaders[key])
                ]);
            })), React.createElement(panel_1.default, {name: "Response Headers"}, Object.keys(responseHeaders).map(key => {
                return ([
                    React.createElement("dt", null, key),
                    React.createElement("dd", null, responseHeaders[key])
                ]);
            }))), React.createElement(pages_1.PageItem, {value: "request"}, React.createElement("code", null, React.createElement("pre", null, data.requestBody))), React.createElement(pages_1.PageItem, {value: "response"}, React.createElement("code", null, React.createElement("pre", null, data.responseBody))))));
        }
        else {
            return null;
        }
    }
    handleTabChange(tabValue) {
        this.setState({
            selectedId: tabValue
        });
    }
}
HttpDetail.defaultProps = {
    data: null
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HttpDetail;

},{"../../utils/utils":11,"./pages":2,"./panel":3,"./tabs":4,"react":undefined}],2:[function(require,module,exports){
'use strict';
var React = require('react');
class PageItem extends React.Component {
}
exports.PageItem = PageItem;
class Page extends React.Component {
    render() {
        return (React.createElement("div", null, this.props.children.map(item => {
            let value = item.props.value;
            return React.createElement("section", {key: value, className: this.props.value === value ? '' : 'hide'}, item.props.children);
        })));
    }
}
exports.Page = Page;

},{"react":undefined}],3:[function(require,module,exports){
'use strict';
/*!
 * 可折叠的 panel
 **/
var React = require('react');
var utils_1 = require('../../utils/utils');
class Panel extends React.Component {
    constructor(props) {
        super();
        this.state = {
            open: props.defaultOpen
        };
    }
    render() {
        return (React.createElement("section", {className: `panel ${utils_1.addClass('closed', !this.state.open)}`}, React.createElement("h3", {onClick: this.handleToggleClick.bind(this)}, this.props.name), React.createElement("dl", null, this.props.children)));
    }
    handleToggleClick() {
        this.setState({
            open: !this.state.open
        });
    }
}
Panel.defaultProps = {
    name: null,
    defaultOpen: true
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Panel;
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

},{"../../utils/utils":11,"react":undefined}],4:[function(require,module,exports){
'use strict';
var React = require('react');
class TabItem extends React.Component {
}
exports.TabItem = TabItem;
class TabContent extends React.Component {
    render() {
        return React.createElement("a", React.__spread({href: "#", className: this.props.selected ? 'selected' : ''}, this.props), this.props.children);
    }
}
class Tab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.defaultValue
        };
    }
    render() {
        return (React.createElement("div", {className: "tab-set"}, this.props.children.map(item => {
            let value = item.props.value;
            return React.createElement(TabContent, {onClick: this.handleClick.bind(this, value), key: value, selected: this.state.value === value}, item.props.children);
        })));
    }
    handleClick(value) {
        if (value !== this.state.value) {
            this.setState({
                value: value
            });
            this.props.onChange(value);
        }
    }
}
exports.Tab = Tab;

},{"react":undefined}],5:[function(require,module,exports){
'use strict';
var React = require('react');
var electron_1 = require('electron');
var event_1 = require('../../utils/event');
class TimelineItem extends React.Component {
    constructor(props) {
        super(props);
        let request = props.request;
        let scheme = props.ssl ? 'https' : 'http';
        let port = request.port;
        let isDefaultPort = !port || port === 80;
        let baseUrl = scheme + '://' + request.hostname + (isDefaultPort ? '' : ':' + port);
        this.baseUrl = baseUrl;
    }
    getFullUrl() {
        return this.baseUrl + this.props.request.path;
    }
    render() {
        let props = this.props;
        let request = props.request;
        let response = props.response || {};
        return (React.createElement("li", {onContextMenu: this.handleContextMenu.bind(this), onClick: this.handleClick.bind(this), className: props.active ? 'active' : ''}, React.createElement("div", {className: "url"}, React.createElement("span", {className: "host"}, this.baseUrl), React.createElement("span", {className: "path"}, request.path)), React.createElement("div", {className: "aside"}, React.createElement("span", {className: "method"}, request.method), React.createElement("span", {className: "status"}, response.status))));
    }
    handleContextMenu(e) {
        electron_1.Menu.buildFromTemplate([{
                label: 'Copy Link Address',
                // submenu: [],
                click: () => {
                    this.copy();
                }
            }]).popup(electron_1.remote.getCurrentWindow());
    }
    handleClick() {
        this.props.onClick(this.props);
    }
    copy() {
        electron_1.clipboard.writeText(this.getFullUrl(), 'selection');
    }
}
TimelineItem.defaultProps = {
    onClick() { },
    request: {},
    response: {},
    ssl: false,
    active: false
};
class Timeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeId: null
        };
    }
    renderEmpty() {
        return (React.createElement("div", {className: "timeline empty"}, "Waiting for connect..."));
    }
    renderList() {
        return (React.createElement("ul", {className: "timeline"}, this.props.data.map(item => {
            return React.createElement(TimelineItem, React.__spread({key: item.id}, item, {active: item.id === this.state.activeId, onClick: this.handleItemClick.bind(this)}));
        })));
    }
    render() {
        if (this.props.data.length) {
            return this.renderList();
        }
        else {
            return this.renderEmpty();
        }
    }
    handleItemClick(item) {
        this.setState({
            activeId: item.id
        });
        event_1.default.emit('timeline-item-click', item);
    }
}
Timeline.defaultProps = {
    data: []
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Timeline;

},{"../../utils/event":9,"electron":undefined,"react":undefined}],6:[function(require,module,exports){
'use strict';
var electron_1 = require('electron');
var event_1 = require('../../utils/event');
var storage = require('../../utils/storage');
var typed_1 = require('../../typed/typed');
const timeline = []; // Map -> React Elements 性能较低
const find = (id) => timeline.find(item => item.id === id);
electron_1.ipcRenderer.on('http-data', (sender, data) => {
    console.log('ipc.on \'http-data\' data => ', data);
    let detail;
    /**
     * create a new detail
     */
    if (data.state === typed_1.ipcDataState.open) {
        detail = data;
        timeline.unshift(data);
    }
    else {
        detail = find(data.id);
        if (!detail) {
            return; // Ignore error.
        }
        Object.assign(detail, data);
    }
    event_1.default.emit('timeline-update', detail);
});
// 获取 TimeLine
exports.getTimeline = () => timeline;
// 获取记录细则
// TODO: 缓存最近几次的 bodyData
exports.getItem = (id) => {
    let detail = find(id);
    let bodies = {};
    if (detail.request && detail.request.storageId) {
        bodies.requestBody = storage.readFile(detail.request.storageId).toString();
    }
    if (detail.response && detail.response.storageId) {
        bodies.responseBody = storage.readFile(detail.response.storageId).toString();
    }
    return Object.assign(bodies, detail);
};

},{"../../typed/typed":8,"../../utils/event":9,"../../utils/storage":10,"electron":undefined}],7:[function(require,module,exports){
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var timeline_1 = require('./components/timeline');
var http_detail_1 = require('./components/http-detail');
var data = require('./data/data');
var event_1 = require('../utils/event');
// require('./css/index.less')
class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeline: data.getTimeline()
        };
        this.listenEvents();
    }
    listenEvents() {
        // 监听 timeline 数据的更新
        event_1.default.on('timeline-update', item => {
            // 更新到最新的 timeline
            let timeline = data.getTimeline();
            this.setState({
                timeline: timeline
            });
            // 如果发生更新的数据和当前详情的数据一致，则更新详情
            if (item.id === this.state.detailId) {
                this.updateDetail();
            }
        });
        event_1.default.on('timeline-item-click', item => {
            this.updateDetail(item.id);
        });
    }
    updateDetail(id) {
        id = id || this.state.detailId;
        let detail = data.getItem(id);
        this.setState({
            detail: detail,
            id: id
        });
    }
    render() {
        return (React.createElement("div", {className: "layout"}, React.createElement("aside", null, React.createElement(timeline_1.default, {data: this.state.timeline})), React.createElement("div", {className: "main"}, React.createElement(http_detail_1.default, {data: this.state.detail}))));
    }
}
ReactDOM.render(React.createElement(Main, null), document.getElementById('target'));

},{"../utils/event":9,"./components/http-detail":1,"./components/timeline":5,"./data/data":6,"react":undefined,"react-dom":undefined}],8:[function(require,module,exports){
'use strict';
(function (ipcDataState) {
    /** 代理收到下游请求 */
    ipcDataState[ipcDataState["open"] = 0] = "open";
    /** 代理往上游服务器发送请求完毕 */
    ipcDataState[ipcDataState["requestFinish"] = 1] = "requestFinish";
    /** 上游开始返回响应 */
    ipcDataState[ipcDataState["response"] = 2] = "response";
    /** 上游返回响应完成 */
    ipcDataState[ipcDataState["responseFinish"] = 3] = "responseFinish";
    /** 返回给下游结束 */
    ipcDataState[ipcDataState["finish"] = 4] = "finish";
})(exports.ipcDataState || (exports.ipcDataState = {}));
var ipcDataState = exports.ipcDataState;

},{}],9:[function(require,module,exports){
'use strict';
var events_1 = require('events');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new events_1.EventEmitter();

},{"events":undefined}],10:[function(require,module,exports){
'use strict';
var os = require('os');
var fs = require('fs');
var path = require('path');
var uuidtools = require('uuid');
var tempDir = path.resolve(os.tmpdir(), 'myproxy');
try {
    fs.mkdirSync(tempDir);
}
catch (e) {
    console.log(e);
}
// 获取文件相对路径
function getPhysicPath(relativePath) {
    return path.resolve(tempDir, relativePath);
}
function filePath(...args) {
    return args.join('.');
}
exports.filePath = filePath;
function readStream(p) {
    return fs.createReadStream(getPhysicPath(p));
}
exports.readStream = readStream;
function writeStream(p) {
    return fs.createWriteStream(getPhysicPath(p));
}
exports.writeStream = writeStream;
function uuid() {
    return uuidtools.v1();
}
exports.uuid = uuid;
function readFile(p) {
    return fs.readFileSync(getPhysicPath(p));
}
exports.readFile = readFile;
function getTempDir() {
    return tempDir;
}
exports.getTempDir = getTempDir;

},{"fs":undefined,"os":undefined,"path":undefined,"uuid":undefined}],11:[function(require,module,exports){
(function (Buffer){
'use strict';
var dateformat_1 = require('dateformat');
function none() { }
exports.none = none;
// debounce(100)(function() {})
// debounce(100, function() {})()
function debounce(wait, fun) {
    var timer, func0, waitMs;
    if (typeof fun === 'function') {
        func0 = fun;
        waitMs = wait;
    }
    else {
        func0 = null;
        waitMs = fun;
    }
    return (func1) => {
        clearTimeout(timer);
        var fun = func1 || func0;
        fun && (timer = setTimeout(fun, waitMs));
    };
}
exports.debounce = debounce;
function log(...arg) {
    arg.unshift(`[${dateformat_1.default('h:MM:ss')}]`);
    console.log.apply(console, arg);
}
exports.log = log;
function parseHost(host) {
    var tuple = host.split(':');
    return {
        host: tuple[0],
        port: parseInt(tuple[1] || '80', 10)
    };
}
exports.parseHost = parseHost;
function streamReadAll(readable) {
    return new Promise(function (resolve, reject) {
        var buffers = [];
        readable.on('data', function (data) {
            buffers.push(data);
        });
        readable.on('end', function () {
            resolve(Buffer.concat(buffers));
        });
        readable.on('error', function (e) {
            reject(e);
        });
    });
}
exports.streamReadAll = streamReadAll;
function genUrl(ssl, host, port, path) {
    let portPart = (!port || Number(port) === 80) ? '' : (':' + port);
    return (ssl ? 'https' : 'http') + '://' + host + portPart + path;
}
exports.genUrl = genUrl;
function parseQS(url) {
    var qs = url.replace(/.*\?/, '');
    return qs.split('&').reduce(function (obj, item) {
        var kv = item.split('=');
        obj[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
        return obj;
    }, {});
}
exports.parseQS = parseQS;
function addClass(className, condition) {
    return condition ? className : '';
}
exports.addClass = addClass;

}).call(this,require("buffer").Buffer)
},{"buffer":undefined,"dateformat":undefined}]},{},[7]);
