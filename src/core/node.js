import { router } from "./router.js"
import { GlobalEvent, rwdMap, zIndex, theme } from "./config.js"

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// window event
{
    let loop = () => {
        node.pubsub.publish(GlobalEvent.SYSTEM_LOOP)
        requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)

    window.addEventListener('resize', e => {
        node.pubsub.publish(GlobalEvent.SYSTEM_RESIZE_WINDOW, e)
    })
    window.addEventListener('mousemove', e => {
        node.pubsub.publish(GlobalEvent.SYSTEM_MOUSE_MOVE, e)
    })
    window.addEventListener('mouseleave', e => {
        node.pubsub.publish(GlobalEvent.SYSTEM_MOUSE_LEAVE, e)
    })
    window.addEventListener('mouseup', e => {
        node.pubsub.publish(GlobalEvent.SYSTEM_MOUSE_UP, e)
    })
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** 全域樣式設定 global css settings (you can modify it) */
let sysClassNames = {
    'body *': { boxSizing: 'border-box' },
    'body': { margin: '0' },
    'img': { verticalAlign: 'top' },
    '::-webkit-scrollbar': { width: '0px', height: '0px' },
    '.stop-select': { userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', MsUserSelect: 'none' },
};

appendClasses(sysClassNames)

function appendClasses(classes) {
    // apend default style
    Object.keys(classes).forEach(cssPath => {
        let style = classes[cssPath]
        let styleStr = ''
        Object.keys(style).forEach(key => {
            styleStr += transformCssKey(key) + ':' + style[key] + ';'
        })
        let result = cssPath + ' {' + styleStr + '}'
        appendClassNameStyle(result)
    })
}

// ex: boxSizing -> box-sizing
function transformCssKey(key) {
    key = key.split('').map(i => {
        let code = i.charCodeAt(0)
        if (code >= 65 && code <= 90)
            i = '-' + i.toLowerCase()
        return i
    }).join('')
    return key
}

/** append className style */
function appendClassNameStyle(style) {
    let id = 'globalstyle'
    let styleObj = document.getElementById(id) || document.createElement('style')
    styleObj.id = id
    if (styleObj.textContent.indexOf(style) > -1) return
    styleObj.textContent += ' ' + style
    !styleObj.parentNode && document.body.appendChild(styleObj)
}

/** 🟢 define gradient background animation with className */
function gradientBackgroundAnimation(className, rotateDegree = '237deg', speed = '18s', colors = ['#8a7946ff', '#9eab8f', '#aaab8fff']) {
    appendClassNameStyle(`
        .${className}{
            background: linear-gradient(${rotateDegree}, ${colors.join(',')});
            background-size: 240% 240%;
            animation: gradient-animation-${className} ${speed} ease infinite;
        }
        @keyframes gradient-animation-${className} {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `)
}

// user define here
gradientBackgroundAnimation('ani-bg-default', '270deg', '8s', ['#335e66ff', '#520096ff'])

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// DOM cache
// page change and get all node id, speed up nnode id search

let nodes = [];
(() => {
    function deepSearch(node) {
        // user define nodeId
        if (node.__nodeId.indexOf('tag-') == -1) {
            nodes.push(node)
        }
        if (node.getChildren) {
            let chs = node.getChildren()
            for (let i = 0; i < chs.length; i++) {
                nodes = deepSearch(chs[i])
            }
        }
        return nodes
    }
    let updateNodes = () => {
        nodes.length = 0
        nodes = deepSearch(node.app())
        return nodes.length
    }
    window.addEventListener('popstate', updateNodes)
    requestAnimationFrame(() => requestAnimationFrame(updateNodes))
})()

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// RWD by js , ex: rwd-sm:width![100px] 
// ! = !important

let rwdNodes = [];
(() => {
    // state
    let prefix = 'rwd-'
    let prefixLen = prefix.length
    let rwdLevel = ''
    let preRwdLevel = ''

    // info (debug usage)
    let isShowInfo = false
    let info = document.createElement('div')
    if (isShowInfo) {
        info.style.display = 'inline-flex'
        info.style.height = '1em'
        info.style.position = 'fixed'
        info.style.left = '0px'
        info.style.top = '0px'
        info.style.background = 'green'
        info.style.color = 'white'
        info.innerText = 'test'
        document.body.append(info)
    }

    const keys = Object.keys(rwdMap)

    function deepRWDSearch(node) {
        // user define nodeId
        let cls = node.getClass()
        if (cls?.indexOf(prefix) > -1) {
            rwdNodes.push(node)
        }
        if (node.getChildren) {
            let chs = node.getChildren()
            for (let i = 0; i < chs.length; i++) {
                deepRWDSearch(chs[i])
            }
        }
        return rwdNodes
    }

    let resize = _ => {

        keys.forEach(level => {
            if (window.innerWidth < rwdMap[level]) rwdLevel = level
        })

        // level log
        info.innerText = rwdLevel + ':' + window.innerWidth + ' (' + rwdMap[rwdLevel] + ')'

        if (preRwdLevel != rwdLevel) {
            rwdNodes.length = 0
            requestAnimationFrame(() => {
                deepRWDSearch(node.app()).forEach(i => {

                    // replace rwd-{level}:xxxx[A B] to rwd-{level}:xxxx[A@B] , use @ charactor
                    let clsstr = i.getClass()
                    let startIndex = 0
                    for (let j = 0; j < clsstr.length; j++) {
                        if (clsstr[j] == '[') {
                            startIndex = j
                            while (clsstr[++startIndex] != ']') {
                                if (clsstr[startIndex] == ' ') {
                                    clsstr = clsstr.slice(0, startIndex) + '@' + clsstr.slice(startIndex + 1)
                                }
                            }
                            j = startIndex
                        }
                    }

                    let clses = clsstr.split(' ')

                    // get closely rwd level when there are no rwd-{level}:xxxx[xxxx] 
                    let f = clses.filter(i => i.indexOf(':') > -1).map(i => i.slice(prefixLen, i.indexOf(':')))
                    let rigisterLevelValuesDiff = f.map(i => Math.abs(rwdMap[i] - rwdMap[rwdLevel]))
                    let min = Math.min(...rigisterLevelValuesDiff)
                    let minIndex = rigisterLevelValuesDiff.findIndex(i => i == min)
                    let closeLevel = f[minIndex]

                    // init css style
                    clses.forEach(cls => {
                        if (cls.indexOf(prefix) > -1) {
                            // full class => rwd-sm:width[100px] -> sm:width[100px]
                            let rwd = cls.slice(prefixLen) // ex: sm:width[100px] -> sm:width[100px]
                            let propQIdx = rwd.indexOf(':') // : index
                            let level = rwd.slice(0, propQIdx) // ex: sm
                            let propIdx = rwd.indexOf('[') // [ index
                            if (level == '' || propIdx == -1) return
                            let prop = rwd.slice(level.length + 1, propIdx) // ex: width
                            let pLen = prop.length
                            let imp = ''
                            if (prop[pLen - 1] == '!') {
                                prop = prop.slice(0, pLen - 1)
                                imp = '!important'
                            }
                            let value = rwd.slice(propIdx + 1, rwd.length - 1)
                            value = value.replaceAll('@', ' ') // remove @ charactor
                            if (level == closeLevel) {
                                // console.log(level, prop, rwd, value)
                                i.setStyle({ [prop]: value + ' ' + imp })
                            }
                            if (level == rwdLevel) {
                                // console.log(level, prop, rwd, value)
                                i.setStyle({ [prop]: value + ' ' + imp })
                            }
                        }
                    })
                })
            })
        }

        preRwdLevel = rwdLevel
    }

    let update = () => {
        if (!node.app().getChildren()[0])
            requestAnimationFrame(update)
        else resize()
    }
    requestAnimationFrame(update)
    window.addEventListener('resize', resize)
    window.addEventListener('popstate', () => { preRwdLevel = '', update() })
})()

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** 🟢 get assets */
function getAssetsPath(assetSrc) {
    if (location.host.indexOf('127.0.0.1') > -1 || location.host.indexOf('localhost') > -1)
        return location.protocol + '//' + location.host + '/assets/' + assetSrc;
    else if (location.host.indexOf('github') > -1)
        return location.protocol + '//' + location.host + '/assets/' + assetSrc;
    return ''
}

/** 🟢 create app */
function createApp(plugins = []) {
    plugins.forEach(p => p.init())
    node.div()
}

/** 🟢 pub & sub tool */
let pubsubCounter = 0
class PubSub {

    static __allsub = {}

    static subscribe(msgTitle, subscriber) {
        if (!PubSub.__allsub[msgTitle]) {
            PubSub.__allsub[msgTitle] = [subscriber]
        } else {
            PubSub.__allsub[msgTitle].push(subscriber)
        }
        subscriber.token = 'pubsub-' + (++pubsubCounter)
        return subscriber.token
    }

    static publish(msgTitle, data) {
        if (PubSub.__allsub[msgTitle]) {
            PubSub.__allsub[msgTitle].forEach(subscriber => subscriber(data));
        }
    }

    // PubSub.unsubscribe(token); // delete 1
    // PubSub.unsubscribe(mySubscriber); // delete all
    static unsubscribe(tokenOrSubscriber) {
        if (typeof tokenOrSubscriber == 'function') {
            // delete subscriber
            Object.keys(PubSub.__allsub).forEach(msgTitle => {
                PubSub.__allsub[msgTitle] = PubSub.__allsub[msgTitle].filter(subscriber => subscriber != tokenOrSubscriber)
            })
        } else {
            // delete token
            Object.keys(PubSub.__allsub).forEach(msgTitle => {
                PubSub.__allsub[msgTitle] = PubSub.__allsub[msgTitle].filter(subscriber => subscriber.token != tokenOrSubscriber)
            })
        }
    }

    // clearAll - call this function when change page, and then subscribe again in new page 
    static clearAllSubscriptions() {
        Object.keys(PubSub.__allsub).forEach(msgTitle => {
            PubSub.__allsub[msgTitle].length = 0
            delete PubSub.__allsub[msgTitle]
        })
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** 🟢 節點生成編號 number of nodes you create */
let genCounter = 0

/** 🟢 節點父類 the base class of node */
class NodeBase {
    /** 根節點 root node  */
    static __app = null
    /** 使用者自訂節點名稱 user define node id in constructor */
    __nodeId = ''
    /** html 文件節點 html document tag */
    __tag = null
    /** 儲存子節點 store child nodes */
    __children = []
    /** 儲存父節點 store parent node */
    __parent = null
    /** 儲存事件 store event handler */
    __eventList = []
    /** 儲存事件 store global event handler */
    __globalEventList = []
    /** 生成編號 */
    __genId = -1

    /** 
     * @param {*} nodeId 使用者定義 node 名稱 user defined Id
     */
    constructor(nodeId) {
        genCounter++
        this.__nodeId = nodeId || `tag-${genCounter}`
        this.__genId = genCounter
    }

    /** 記憶體釋放 release memory, clear timer, and remove event listener here  */
    remove() {
        // delete children & parent
        if (this.removeChildren)
            this.removeChildren()
        this.__parent = null

        // remove event
        this.__eventList.forEach(e => {
            this.__tag.removeEventListener(e.eventName, e.event)
            delete e.event.exe
        })
        this.__eventList.length = 0
        delete this.__eventList

        // remove global event
        this.__globalEventList.forEach(token => {
            node.pubsub.unsubscribe(token)
        })
        this.__globalEventList.length = 0
        delete this.__globalEventList

        // remove tag
        this.__tag.remove()
        delete this.__tag
    }

    /** 取得 node 生成資訊 get node generation info */
    getGenInfo() {
        return this.__nodeId + '- genId: ' + this.__genId + ' / total: ' + genCounter
    }

    /** 取得 html 標籤 get html tag object */
    getHtmlTag() {
        return this.__tag
    }

    /** 取得使用者定義 nodeId 名稱 get nodeId */
    getNodeId() {
        return this.__nodeId
    }

    /** 取得父節點 get parent node */
    getParent() {
        return this.__parent
    }

    /** 
     * 設置 inline 樣式 set inline style 
     * @param {*} styleObj ex: {background: 'orange'}
     */
    setStyle(styleObj) {
        if (this.__tag)
            Object.keys(styleObj).forEach(k => {
                this.__tag.style[k] = styleObj[k]
            })
        return this
    }

    /** 取得 inline 樣式 get inline style */
    getStyle() {
        return this.__tag?.style
    }

    /** 
     * 設置 css 類名 set css class 
     * @param {*} classStr ex: 'p-1 m-1'
     */
    setClass(classStr) {
        if (this.__tag)
            this.__tag.className = classStr
        return this
    }

    /** 取得 css 類名 get css class */
    getClass() {
        return this.__tag?.className
    }

    /** 
     * 註冊事件 rigister event 
     * @param {*} eventName ex: 'click'
     * @param {*} execFun ex: ()=>{alert('hi')}
     */
    on(eventName, execFun) {
        if (!this.__tag) return this
        const event = e => execFun(e, this)
        event.exe = execFun
        this.__tag.addEventListener(eventName, event)
        this.__eventList.push({ eventName, event })
        return this
    }

    /** 取消事件 cancel event */
    off(eventName, execFun) {
        let e = this.__eventList.filter(e => e.eventName == eventName && e.event.exe == execFun)[0]
        if (!e) return this
        let index = this.__eventList.findIndex(ev => ev == e)
        e.event.exe = null
        this.__tag.removeEventListener(e.eventName, e.event)
        this.__eventList.splice(index, 1)
        return this
    }

    /** 是否有事件 has event or not */
    has(eventName) {
        return !!this.__eventList?.filter(e => e.eventName == eventName)[0]
    }

    /** 觸發事件 dispatch event */
    dispatch(eventName) {
        let events = this.__eventList.filter(e => e.eventName == eventName)
        events.forEach(e => e.event(null, this))
    }

    /** 設置文字 set innerHTML */
    setText(str) {
        this.__tag.innerHTML = str
        return this
    }

    /** 取得文字 get innerHTML */
    getText() {
        return this.__tag.innerHTML
    }

    /** set input disabled */
    setDisabled(bool) {
        this.__tag.disabled = bool
    }

    /** get input disabled */
    getDisabled() {
        return this.__tag.disabled
    }

    /** global event */
    onGlobalEvent(eventName, listener) {
        this.__globalEventList.push(node.pubsub.subscribe(eventName, listener))
    }
}

/** 🟢 適用於 web 版面規劃 for web page layout design */
class Div extends NodeBase {

    /** 程式碼提示 code completion */
    __tag = document.createElement('div')

    /** 程式碼提示 code completion */
    getHtmlTag() { return this.__tag }

    /** 
     * @param {*} nodeId 使用者定義 nodeId 名稱 user defined Id
     */
    constructor(nodeId) {
        super(nodeId)
        this.__tag.setAttribute('nodeId', this.__nodeId)
        // app node must be div object
        if (genCounter == 1) {
            // app root
            NodeBase.__app = this
            this.setStyle(theme.app)
            document.body.append(this.__tag)
        }
    }

    /** 取得所有子節點 get all child nodes */
    getChildren() {
        return this.__children
    }

    /** 設置子節點 set children */
    setChildren(nodes = []) {
        if (this.__children.length) {
            this.removeChildren()
        }
        nodes.forEach(node => {
            node.__parent = this
            this.__tag.append(node.__tag)
        })
        this.__children = [...nodes]
        return this
    }

    /** 刪除所有子節點 remove all child nodes */
    removeChildren() {
        this.__children.forEach(node => node.remove())
        this.__children.length = 0
        return this
    }

    /** 取得指定 nodeId 物件 get child by nodeId */
    getChildById(nodeId) {
        if (nodeId == this.__nodeId) { return this }
        let nodes = this.__children
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].__nodeId == nodeId) return nodes[i]
            if (nodes[i].getChildById) {
                let c = nodes[i].getChildById(nodeId)
                if (c) return c
            }
        }
        return null
    }

    /** 新增節點至尾端 push a child node */
    pushChild(node) {
        node.__parent = this
        this.__children.push(node)
        this.getHtmlTag().append(node.getHtmlTag())
    }

    /** 移除尾端節點 pop a child node */
    popChild() {
        if (this.__children[0]) {
            let len = this.__children.length
            let node = this.__children[len - 1]
            node.remove()
            this.__children.pop()
        }
    }

    /** 移除首端節點 shift a child node */
    shiftChild() {
        let node = this.__children[0]
        if (node) {
            this.__children.shift().remove()
        }
    }

    /** 新增節點至首端 unshift a child */
    unshiftChild(node) {
        node.__parent = this
        this.__children.unshift(node)
        this.getHtmlTag().prepend(node.getHtmlTag())
    }

    /** 新增節點在指定索引 add child at target index */
    addChildAt(node, index) {
        if (index > -1) {
            node.__parent = this
            if (this.__children.length == 0) {
                this.__children.push(node)
                this.getHtmlTag().append(node.getHtmlTag())
            } else {
                let newTag = node.getHtmlTag()
                let refTag = this.__children[index]?.getHtmlTag()
                this.__children.splice(index, 0, node)
                this.getHtmlTag().insertBefore(newTag, refTag)
            }
        }
    }

    /** 移除節點在指定索引 remove child at target index */
    removeChildAt(index) {
        let node = this.__children[index]
        if (index > -1 && node) {
            let del = this.__children.splice(index, 1)[0]
            del.remove()
        }
    }

    /** 置換指定索引節點 replace child */
    replaceChildAt(node, index) {
        if (index > -1 && this.__children[index]) {
            this.__children.splice(index, 1, node)[0].remove()
            let tag = this.__children[index].getHtmlTag()
            let tag2 = this.__children[index + 1]?.getHtmlTag()
            if (tag) this.getHtmlTag().insertBefore(tag, tag2)
        }
    }

    /** 翻轉 children. reverse children */
    reverseChildren() {
        this.__children.reverse()
        this.getHtmlTag().innerHTML = ''
        this.__children.forEach(i => this.getHtmlTag().append(i.__tag))
    }

    /** 排序 children. sort children */
    sortChildren(compareFunc) {
        this.__children.sort(compareFunc)
        this.getHtmlTag().innerHTML = ''
        this.__children.forEach(i => this.getHtmlTag().append(i.__tag))
    }

    /** 取得指定索引節點 get child by index */
    getChildAt(index) {
        return this.__children[index]
    }

    /** 取得指定節點索引 get child index */
    getChildIndex(node) {
        return this.__children.findIndex(i => i == node)
    }

}

/** 🟢 行內文字使用 for inline text design */
class Span extends NodeBase {

    /** 程式碼提示 code completion */
    __tag = document.createElement('span')

    /** 程式碼提示 code completion */
    getHtmlTag() { return this.__tag }

    /** 
     * @param {*} nodeId 使用者定義 nodeId 名稱 user defined Id
     */
    constructor(nodeId) {
        super(nodeId)
        this.__tag.setAttribute('nodeId', this.__nodeId)
    }

}

/** 🟢 水平分割線 horizontal rule */
class Hr extends NodeBase {

    /** 程式碼提示 code completion */
    __tag = document.createElement('hr')

    /** 程式碼提示 code completion */
    getHtmlTag() { return this.__tag }

    /** 
     * @param {*} nodeId 使用者定義 nodeId 名稱 user defined Id
     */
    constructor(nodeId, cssLineColor) {
        super(nodeId)
        this.__tag.setAttribute('nodeId', this.__nodeId)
        // 設置線條 line settings
        this.setStyle(theme.hr)
    }

}

/** 🟢 h1 標題 heading text level 1 */
class H1 extends NodeBase {

    /** 程式碼提示 code completion */
    __tag = document.createElement('h1')

    /** 程式碼提示 code completion */
    getHtmlTag() { return this.__tag }

    /** 
     * @param {*} nodeId 使用者定義 nodeId 名稱 user defined Id
     */
    constructor(nodeId) {
        super(nodeId)
        this.__tag.setAttribute('nodeId', this.__nodeId)
        this.setStyle(theme.h1)
    }

}

/** 🟢 h2 標題 heading text level 2 */
class H2 extends NodeBase {

    /** 程式碼提示 code completion */
    __tag = document.createElement('h2')

    /** 程式碼提示 code completion */
    getHtmlTag() { return this.__tag }

    /** 
     * @param {*} nodeId 使用者定義 nodeId 名稱 user defined Id
     */
    constructor(nodeId) {
        super(nodeId)
        this.__tag.setAttribute('nodeId', this.__nodeId)
        this.setStyle(theme.h2)
    }

}

/** 🟢 h3 標題 heading text level 3 */
class H3 extends NodeBase {

    /** 程式碼提示 code completion */
    __tag = document.createElement('h3')

    /** 程式碼提示 code completion */
    getHtmlTag() { return this.__tag }

    /** 
     * @param {*} nodeId 使用者定義 nodeId 名稱 user defined Id
     */
    constructor(nodeId) {
        super(nodeId)
        this.__tag.setAttribute('nodeId', this.__nodeId)
        this.setStyle(theme.h3)
    }

}

/** 🟢 h4 標題 heading text level 4 */
class H4 extends NodeBase {

    /** 程式碼提示 code completion */
    __tag = document.createElement('h4')

    /** 程式碼提示 code completion */
    getHtmlTag() { return this.__tag }

    /** 
     * @param {*} nodeId 使用者定義 nodeId 名稱 user defined Id
     */
    constructor(nodeId) {
        super(nodeId)
        this.__tag.setAttribute('nodeId', this.__nodeId)
        this.setStyle(theme.h4)
    }

}

/** 🟢 h5 標題 heading text level 5 */
class H5 extends NodeBase {

    /** 程式碼提示 code completion */
    __tag = document.createElement('h5')

    /** 程式碼提示 code completion */
    getHtmlTag() { return this.__tag }

    /** 
     * @param {*} nodeId 使用者定義 nodeId 名稱 user defined Id
     */
    constructor(nodeId) {
        super(nodeId)
        this.__tag.setAttribute('nodeId', this.__nodeId)
        this.setStyle(theme.h5)
    }

}

/** 🟢 h6 標題 heading text level 6 */
class H6 extends NodeBase {

    /** 程式碼提示 code completion */
    __tag = document.createElement('h6')

    /** 程式碼提示 code completion */
    getHtmlTag() { return this.__tag }

    /** 
     * @param {*} nodeId 使用者定義 nodeId 名稱 user defined Id
     */
    constructor(nodeId) {
        super(nodeId)
        this.__tag.setAttribute('nodeId', this.__nodeId)
        this.setStyle(theme.h6)
    }

}

/** 🟢 img 物件 img object */
class Image extends NodeBase {

    /** 程式碼提示 code completion */
    __tag = document.createElement('img')

    /** 程式碼提示 code completion */
    getHtmlTag() { return this.__tag }

    /** 
     * @param {*} nodeId 使用者定義 nodeId 名稱 user defined Id
     */
    constructor(nodeId) {
        super(nodeId)
        this.__tag.setAttribute('nodeId', this.__nodeId)
    }

    /** 設置資源位址 set image path under assets folder */
    setSrc(src) {
        this.__tag.onload = () => {
            this.__tag.onload = null
            this.__tag.width = this.__tag.naturalWidth
            this.__tag.height = this.__tag.naturalHeight
        }
        this.__tag.src = getAssetsPath(src)
        return this
    }

}

/** 🟢 canvas 物件 canvas object */
class Canvas extends NodeBase {

    /** 程式碼提示 code completion */
    __tag = document.createElement('canvas')

    /** 程式碼提示 code completion */
    getHtmlTag() { return this.__tag }

    /** 
     * @param {*} nodeId 使用者定義 nodeId 名稱 user defined Id
     */
    constructor(nodeId) {
        super(nodeId)
        this.__tag.setAttribute('nodeId', this.__nodeId)
        this.setSize(250, 250)
        this.__ctx = this.__tag.getContext('2d')
    }

    remove() {
        this.__ctx = null
        super.remove()
    }

    /** 取得繪圖物件 get context 2d object */
    getContext2D() {
        return this.__ctx
    }

    /** 設置尺寸 set canvas size */
    setSize(w, h) {
        let c = this.getHtmlTag()
        c.width = w
        c.height = h
        return this
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** 🟢 View-Model ListBase */
class VMListBase extends Div {

    __jsdom_tpl
    __items

    constructor(nodeId, jsdom_tpl, proxy_data) {
        super(nodeId)
        this.__jsdom_tpl = jsdom_tpl
        this.__items = proxy_data
        this.__observe(proxy_data)
    }

    __observe(items) {

        // init varialble, remember to release memory
        // first / vms / update / lock

        // after first item, use __update funciton to update view
        if (!items.first) {
            items.vms = []
            items.first = this
            items.lock = false

            // insert all initial array elements
            requestAnimationFrame(() => {
                let save = [...items]
                items.length = 0
                save.forEach(i => this.pushChild(i))
            })
        } else {
            items.update = (state) => items.vms.forEach(vm => vm.__update(state))
            items.vms.push(this)
            return
        }

        // ------------------- model operation ------------------- start

        // push
        let pushRef = items.push.bind(this)
        items.push = (item) => {
            this.pushChild(item, true)
            items.update && items.update(['push', item])
            items.lock = true
            items[items.length] = item
            items.lock = false
            return pushRef(item)
        }

        // pop
        let popRef = items.pop.bind(this)
        items.pop = () => {
            if (items.length > 0) {
                this.popChild(true)
                items.update && items.update(['pop'])
                items.lock = true
                items.length -= 1
                items.lock = false
                return popRef()
            } else return null
        }

        // shift
        let shiftRef = items.shift.bind(this)
        items.shift = () => {
            if (items.length > 0) {
                this.shiftChild(true)
                items.update && items.update(['shift'])
                items.lock = true
                let d = [...items]
                d.shift()
                for (let i = 0; i < items.length; i++)
                    d[i] && (items[i] = d[i])
                items.length -= 1
                items.lock = false
                return shiftRef()
            } else return null
        }

        // unshift
        let unshiftRef = items.unshift.bind(this)
        items.unshift = (item) => {
            this.unshiftChild(item, true)
            items.update && items.update(['unshift', item])
            items.lock = true
            for (let i = items.length; i > 0; i--)
                items[i] = items[i - 1]
            items[0] = item
            items.lock = false
            return unshiftRef(item)
        }

        // splice
        let spliceRef = items.splice.bind(this)
        items.splice = (index, delCount, item) => {
            if (index < 0) return
            if (delCount == 1) {
                if (items.length > 0) {
                    if (item) {
                        // console.log('replaceAt 🟠', items)
                    } else {
                        // remove at
                        if (index > items.length - 1) return
                        this.removeChildAt(index, true)
                        items.update && items.update(['removeAt', index])
                        items.lock = true
                        let d = [...items]
                        delete d[index]
                        d = d.filter(i => i)
                        for (let i = 0; i < d.length; i++)
                            items[i] = d[i]
                        items.length -= 1
                        items.lock = false
                    }
                    return spliceRef(index, 0)
                }
            } else {
                // add at
                if (items.length >= index) {
                    this.addChildAt(item, index, true)
                    items.update && items.update(['addAt', item, index])
                    items.lock = true
                    let d = [...items]
                    d.splice(index, 0, item)
                    for (let i = 0; i < d.length; i++)
                        items[i] = d[i]
                    items.lock = false
                    return spliceRef(index, 0, item)
                }
                return []
            }
        }

        // reverse
        let reverseRef = items.reverse.bind(this)
        items.reverse = () => {
            if (items.length <= 1) return reverseRef();
            items.first.reverseChildren()
            return reverseRef()
        }

        // sort
        let sortRef = items.sort.bind(this)
        items.sort = (compareFunc) => {
            if (items.length < 2) return items
            items.first.sortChildren(compareFunc)
            let result = this.__children.map((n, idx) => this.__children[idx].value)
            items.lock = true
            for (let i = 0; i < items.length; i++)
                items[i] = result[i]
            items.lock = false
            return sortRef()
        }

        // ------------------- model operation ------------------- end
    }

    /** vm in vms update without first vm */
    __update(state = []) {
        switch (state[0]) {
            case 'push': this.pushChild(state[1], true); break
            case 'pop': this.popChild(true); break
            case 'shift': this.shiftChild(true); break
            case 'unshift': this.unshiftChild(state[1], true); break
            case 'addAt': this.addChildAt(state[1], state[2], true); break
            case 'removeAt': this.removeChildAt(state[1], true); break
            case 'replaceAt': this.replaceChildAt(state[1], state[2], true); break
            case 'reverse': this.reverseChildren(true); break
            case 'sort': this.sortChildren(state[1], true); break
            case 'clear': this.removeChildren(true), this.__items.length = 0; break
        }
    }

    remove() {
        super.remove()

        // remove dynamic binding value
        this.__children.forEach(i => i.value = null)

        this.__items.first = null
        if (this.__items.vms) this.__items.vms.length = 0
        this.__items.vms = null
        this.__items.update = null

        this.__items.length = 0
        delete this.__items
        this.__jsdom_tpl = null
        delete this.__jsdom_tpl
    }

    pushChild(item, innerUpdate) {
        let jsdom = this.__jsdom_tpl(item, this.__items.length, this.__items)
        super.pushChild(jsdom)
        jsdom.value = item // bind value
        if (innerUpdate == undefined) {
            this.__items[this.__items.length] = item
            this.__items.update && this.__items.update(['push', item])
        }
    }

    popChild(innerUpdate) {
        if (this.__items.length > 0) {
            this.getChildAt(this.__children.length - 1).value = null // del value
            super.popChild()
            if (innerUpdate == undefined) {
                this.__items.length -= 1
                this.__items.update && this.__items.update(['pop'])
            }
        }
    }

    shiftChild(innerUpdate) {
        if (this.__items.length > 0) {
            this.getChildAt(0).value = null // del value
            super.shiftChild()
            if (innerUpdate == undefined) {
                this.__items.lock = true
                let d = [...this.__items]
                d.shift()
                for (let i = 0; i < this.__items.length; i++)
                    d[i] && (this.__items[i] = d[i])
                this.__items.lock = false
                this.__items.length -= 1 // after lock
                this.__items.update && this.__items.update(['shift'])
            }
        }
    }

    unshiftChild(item, innerUpdate) {
        let jsdom = this.__jsdom_tpl(item)
        super.unshiftChild(jsdom)
        jsdom.value = item // bind value
        if (innerUpdate == undefined) {
            this.__items.lock = true
            for (let i = this.__items.length; i > 0; i--)
                this.__items[i] = this.__items[i - 1]
            this.__items[0] = item
            this.__items.lock = false
            this.__items.update && this.__items.update(['unshift', item])
        }
    }

    addChildAt(item, index, innerUpdate) {
        if (index > this.__items.length) return
        let jsdom = this.__jsdom_tpl(item)
        jsdom.value = item // bind value
        super.addChildAt(jsdom, index)
        if (innerUpdate == undefined) {
            this.__items.lock = true
            let d = [...this.__items]
            d.splice(index, 0, item)
            for (let i = 0; i < d.length; i++)
                this.__items[i] = d[i]
            this.__items.lock = false
            this.__items.update && this.__items.update(['addAt', item, index])
        }
    }

    removeChildAt(index, innerUpdate) {
        if (index > -1) {
            this.getChildAt(index).value = null // del value
            super.removeChildAt(index)
            if (innerUpdate == undefined) {
                this.__items.lock = true
                if (index > this.__items.length - 1) return
                let d = [...this.__items]
                delete d[index]
                d = d.filter(i => i)
                for (let i = 0; i < d.length; i++)
                    this.__items[i] = d[i]
                this.__items.length -= 1
                this.__items.lock = false
                this.__items.update && this.__items.update(['removeAt', index])
            }
        }
    }

    replaceChildAt(item, index, innerUpdate) {
        if (index > this.__items.length - 1) return
        let jsdom = this.__jsdom_tpl(item)
        super.replaceChildAt(jsdom, index)
        if (innerUpdate == undefined) {
            this.__items.lock = true
            this.__items[index] = item
            this.__items.lock = false
            this.__items.update && this.__items.update(['replaceAt', item, index])
        }
    }

    reverseChildren(innerUpdate) {
        super.reverseChildren()
        if (innerUpdate == undefined)
            this.__items.update && this.__items.update(['reverse'])
    }

    sortChildren(compareFunc, innerUpdate) {
        super.sortChildren(compareFunc)
        if (innerUpdate == undefined)
            this.__items.update && this.__items.update(['sort', compareFunc])
    }

    removeChildren(innerUpdate) {
        super.removeChildren()
        if (innerUpdate == undefined)
            this.__items.update && this.__items.update(['clear'])
    }

}

/** 🟢 View-Model SingleBase */
class VMSingleBase extends NodeBase {

    /** 程式碼提示 code completion */
    __tag = document.createElement('div')

    /** 程式碼提示 code completion */
    getHtmlTag() { return this.__tag }

    __jsdom_tpl
    __items

    constructor(nodeId, jsdom_tpl, proxy_data) {
        super(nodeId)
        this.__jsdom_tpl = jsdom_tpl
        this.__items = proxy_data
        proxy_data.length = 1 // only 1 value
        this.__observe(proxy_data)
    }

    __observe(items) {
        // init varialble, remember to release memory
        // first / vms / update / lock

        // after first item, use __update funciton to update view
        if (!items.first) {
            items.vms = []
            items.first = this
            items.lock = false

            // insert 1st initial array element
            requestAnimationFrame(() => items[0] && this.setData(items[0]))
        } else {
            items.update = (state) => items.vms.forEach(vm => vm.__update(state))
            items.vms.push(this)
            return
        }

    }

    /** vm in vms update without first vm */
    __update(state = []) {
        switch (state[0]) {
            case 'push': this.setData(state[1], true); break
            case 'pop': this.removeData(true); break
        }
    }

    remove() {
        super.remove()

        this.__items.first = null
        if (this.__items.vms) this.__items.vms.length = 0
        this.__items.vms = null
        this.__items.update = null

        this.__items.length = 0
        delete this.__items
        this.__jsdom_tpl = null
        delete this.__jsdom_tpl
    }

    /** 設置資料 set data */
    setData(item, innerUpdate) {
        if (this.__children[0]) {
            let len = this.__children.length
            let node = this.__children[len - 1]
            node.remove()
            this.__children.pop()
        }
        let node = this.__jsdom_tpl(item)
        node.__parent = this
        this.__children.push(node)
        this.getHtmlTag().append(node.getHtmlTag())
        if (innerUpdate == undefined) {
            this.__items[0] = item
            this.__items.update && this.__items.update(['push', item])
        }
    }

    /** 移除資料 remove data */
    removeData(innerUpdate) {
        if (this.__children.length == 1) {
            if (this.__children[0]) {
                let len = this.__children.length
                let node = this.__children[len - 1]
                node.remove()
                this.__children.pop()
            }
            if (innerUpdate == undefined) {
                this.__items.length = 0
                this.__items.update && this.__items.update(['pop'])
            }
        }
    }

}

/** 
 * 🟢 針對索引與長度的運算子處理 handle [] & length operater
 * @param {*} data 需為陣列
 */
function proxy(data) {
    let items = new Proxy([...data], {
        set(target, prop, val) {
            if (!target.lock && target.first) {
                if (prop == 'length') {  // length operator
                    if (val == 0) {
                        [target.first, ...target.vms].forEach(i => {
                            i.removeData && i.removeData(true) // VMSingleBase
                            i.removeChildren && i.removeChildren(true) // VMListBase
                        })
                    }
                } else if (!isNaN(parseInt(prop))) { // [] operator
                    if (target[prop] != undefined) {
                        let index = parseInt(prop);
                        [target.first, ...target.vms].forEach(i => {
                            i.setData && i.setData(val, true) // VMSingleBase
                            i.replaceChildAt && i.replaceChildAt(val, index, true) // VMListBase
                        })
                    } else {
                        if (target.length < 2 && prop == '0') {
                            [target.first, ...target.vms].forEach(i => {
                                i.setData && i.setData(val, true) // VMSingleBase
                            })
                        }
                    }
                }
            }
            target[prop] = val
            return true
        },
    })
    return items
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** 🟢 UI DatePicker */
class DatePicker extends Div {

    __currentDate = ''
    __selectDate = ''
    __dateArray = [] // string[]

    constructor(nodeId) {
        super(nodeId)
        this.__setup()
    }

    remove() {
        this.__dateArray.length = 0
        this.__dateArray = null
        super.remove()
    }

    __setup() {
        let now = new Date(),
            date = now.getDate(),
            month = now.getMonth() + 1,
            year = now.getFullYear(),
            arr = this.__fillArray(year, month)

        this.__updateCalendar(year, month, date, arr)
        this.__currentDate = this.__selectDate
    }

    getCurrentDate() {
        let [y, m, d] = this.__selectDate.split('-')
        m = m.padStart(2, '0')
        d = d.padStart(2, '0')
        let dd = y + '/' + m + '/' + d
        return this.__getFormatDate(new Date(dd))
    }

    __getFormatDate(date) {
        let dn = date || new Date(Date.now())
        let y = dn.getFullYear()
        let m = (dn.getMonth() + 1).toString().padStart(2, '0')
        let d = (dn.getDate()).toString().padStart(2, '0')
        return `${y}-${m}-${d}`
    }

    __updateDateDatas() {
        let datas = []
        this.__dateArray.forEach(i => {
            datas.push(
                node.div().setStyle({
                    display: 'inline-flex',
                    width: 'calc(100% / 7)',
                    cursor: 'pointer',
                }).setChildren([
                    node.div().setStyle({
                        ...theme.date.default,
                        ...(i == '_' ? theme.date.cannottSelect : (this.__selectDate == i ? theme.date.selected : theme.date.notSelected)),
                        outline: this.__checkCurrrentDate(i) ? theme.date.currentDateOutline : '1px solid transparent',
                    }).on('mouseenter', (e, t) => {
                        if (i == '_') return
                        t.setStyle({ outline: theme.date.mouseenterOutline })
                    }).on('mouseleave', (e, t) => {
                        if (i == '_') return
                        t.setStyle({ outline: this.__checkCurrrentDate(i) ? theme.date.currentDateOutline : '1px solid transparent' })
                    }).on('click', _ => {
                        if (i == '_') return
                        this.__selectDate = i
                        this.__chooseSelectDate()
                    }).setText(i.split('-').pop())
                ])
            )
        });
        return datas
    }

    __fillArray(year, month) {
        const firstDay = new Date(year, month - 1, 1).getDay()
        const lastDay = new Date(year, month, 0).getDate()
        let arr = new Array(42).fill(0)
        let i = 0, j = firstDay
        for (i = 0; i < j; i++) {
            arr[i] = '_'
        }
        for (i = 0; i < lastDay; i++, j++) {
            arr[j] = year + '-' + month + '-' + (i + 1);
        }
        arr = arr.map(i => i == 0 ? '_' : i)
        return arr;
    }

    __nextMonth() {
        let [year, month, date] = this.__cpSelectDate()
        month = month + 1;
        if (month > 12) {
            year += 1;
            month = 1;
        }
        const arr = this.__fillArray(year, month);
        this.__updateCalendar(year, month, date, arr);
    }

    __prevMonth() {
        let [year, month, date] = this.__cpSelectDate()
        month = month - 1;
        if (month < 1) {
            year -= 1;
            month = 12;
        }
        const arr = this.__fillArray(year, month);
        this.__updateCalendar(year, month, date, arr);
    }

    __nextYear() {
        let [year, month, date] = this.__cpSelectDate()
        year = year + 1;
        const arr = this.__fillArray(year, month);
        this.__updateCalendar(year, month, date, arr);
    }

    __prevYear() {
        let [year, month, date] = this.__cpSelectDate()
        year = year - 1;
        const arr = this.__fillArray(year, month);
        this.__updateCalendar(year, month, date, arr);
    }

    __chooseCurrentDate() {
        const [year, month, date] = this.__currentDate.split('-')
        const arr = this.__fillArray(year, month);
        this.__updateCalendar(year, month, date, arr);
    }

    __chooseSelectDate() {
        const [year, month, date] = this.__selectDate.split('-')
        const arr = this.__fillArray(year, month);
        this.__updateCalendar(year, month, date, arr);
    }

    __checkCurrrentDate(date) {
        const [year1, month1, date1] = this.__currentDate.split('-')
        const [year2, month2, date2] = this.__selectDate.split('-')
        return year1 == year2 && month1 == month2 && date.split('-')[2] == date1
    }

    __cpSelectDate() {
        return this.__selectDate.split('-').map(n => parseInt(n))
    }

    __updateCalendar(year, month, date, arr) {
        if (this.__selectDate) {
            const [year1, month1, date1] = this.__currentDate.split('-')
            const [year2, month2, date2] = this.__selectDate.split('-')
            if (year != year2 || month != month2) {
                if (year1 == year && month1 == month) {
                    this.__selectDate = [year, month, date1].join('-')
                } else this.__selectDate = [year, month, 1].join('-')
            }
            else this.__selectDate = arr.filter(d => d && d.split('-')[2] == date)[0];
        } else {
            this.__selectDate = arr.filter(d => d && d.split('-')[2] == date)[0];
        }
        this.__dateArray = arr
        requestAnimationFrame(() => {
            this.getChildById('dateLabel').setText(this.__selectDate);
            this.getChildById('dateData').setChildren(this.__updateDateDatas())
        })
    }
}

/** 🟢 UI ColorPicker */
class ColorPicker extends Div {

    __isMouseDown = false
    __singleColor //canvas
    __allColor //canvas
    __currentColor // no-color
    __colorLabel // label
    __hexColorLabel // label
    x = 255
    y = 0

    constructor(nodeId) {
        super(nodeId)
    }

    remove() {
        this.__singleColor = null
        this.__allColor = null
        this.__currentColor = null
        this.__colorLabel = null
        this.__hexColorLabel = null
        this.__dialog = null
        super.remove()
    }

    __createSingleColorSpectrum(color = 'red') {
        let ctx = this.__singleColor.getContext2D()
        let canvas = ctx.canvas

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!color) color = '#f00'
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let whiteGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        whiteGradient.addColorStop(0, "#fff");
        whiteGradient.addColorStop(1, "transparent");
        ctx.fillStyle = whiteGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let blackGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        blackGradient.addColorStop(0, "transparent");
        blackGradient.addColorStop(1, "#000");
        ctx.fillStyle = blackGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.__singleColor.on('mousedown', e => { this.__isMouseDown = true, this.__spectrumClick(e) })
        this.__singleColor.on('mousemove', e => { this.__isMouseDown && this.__spectrumClick(e) })
        this.__singleColor.on('mouseup', e => { this.__isMouseDown = false, this.__spectrumClick(e) })
        this.__singleColor.on('mouseleave', _ => { this.__isMouseDown = false })
    }

    __createMultiColorSpectrum() {
        let ctx = this.__allColor.getContext2D()
        let canvas = ctx.canvas

        let hueGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        hueGradient.addColorStop(0.00, "#ff0000");
        hueGradient.addColorStop(0.17, "#ff00ff");
        hueGradient.addColorStop(0.33, "#0000ff");
        hueGradient.addColorStop(0.50, "#00ffff");
        hueGradient.addColorStop(0.67, "#00ff00");
        hueGradient.addColorStop(0.83, "#ffff00");
        hueGradient.addColorStop(1.00, "#ff0000");

        ctx.fillStyle = hueGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.__allColor.on('mousedown', e => { this.__isMouseDown = true, this.__hueClick(e) })
        this.__allColor.on('mousemove', e => { this.__isMouseDown && this.__hueClick(e) })
        this.__allColor.on('mouseup', e => { this.__isMouseDown = false, this.__hueClick(e) })
        this.__allColor.on('mouseleave', _ => { this.__isMouseDown = false })
    }

    __hueClick(e) {
        let rect = this.__allColor.getHtmlTag().getBoundingClientRect()
        let y = e ? e.pageY - rect.top : this.y
        const allColorContext = this.__allColor.getContext2D()
        let imgData = allColorContext.getImageData(0, y, 1, 1).data;
        this.__createSingleColorSpectrum('rgb(' + imgData[0] + ', ' + imgData[1] + ', ' + imgData[2] + ')');
        this.__spectrumClick(null)
    }

    __spectrumClick(e) {
        let rect = this.__singleColor.getHtmlTag().getBoundingClientRect()
        let x = e ? e.pageX - rect.left : this.x
        let y = e ? e.pageY - rect.top : this.y
        const singleColorContext = this.__singleColor.getContext2D()
        let imgData = singleColorContext.getImageData(x, y, 1, 1).data;
        this.__currentColor.setStyle({ background: `rgb(${imgData[0]}, ${imgData[1]}, ${imgData[2]})` })
        this.__colorLabel.setText(`rgb(${imgData[0]}, ${imgData[1]}, ${imgData[2]})`)
        this.__hexColorLabel.setText(this.__rgbToHex(imgData[0], imgData[1], imgData[2]))
        this.x = x
        this.y = y
    }

    __componentToHex = (c) => {
        const hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    __rgbToHex = (r, g, b) => {
        return "#" + this.__componentToHex(r) + this.__componentToHex(g) + this.__componentToHex(b);
    }

}

/** 🟢 UI FilePicker */
class FilePicker extends NodeBase {

    static MODE_BASE64 = 0
    static MODE_ARRAYBUFFER = 1
    static MODE_TEXT = 2

    /** 程式碼提示 code completion */
    __tag = document.createElement('input')

    /** 程式碼提示 code completion */
    getHtmlTag() { return this.__tag }

    constructor(nodeId, readerMode = 2, callback) {
        super(nodeId)
        let tag = this.getHtmlTag()
        tag.type = 'file'
        tag.onchange = e => {
            const file = e.target.files[0]
            const reader = new FileReader
            reader.onload = e => {
                reader.onload = null
                callback({ file, content: e.target.result })
                tag.value = null
            }
            switch (readerMode) {
                case FilePicker.MODE_BASE64: // 0
                    reader.readAsDataURL(file)
                    break;
                case FilePicker.MODE_ARRAYBUFFER: // 1
                    reader.readAsArrayBuffer(file)
                    break;
                case FilePicker.MODE_TEXT: // 2
                    reader.readAsText(file)
                    break;
            }
        }
    }

    remove() {
        let tag = this.getHtmlTag()
        tag.onchange = null
        super.remove()
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** 🟢 FormBase */
class FormBase extends NodeBase {

    constructor(nodeId, formKey) {
        super(nodeId)
        this.__formKey = formKey
    }

    /** set placeholder */
    setPlaceHolder(str) {
        this.getHtmlTag().placeholder = str
        return this
    }

    /** set value */
    setValue(val) {
        this.getHtmlTag().value = val
        return this
    }

    /** get value */
    getValue() {
        return this.getHtmlTag()?.value
    }

}

/** 🟢 FormText */
class FormText extends FormBase {

    /** 程式碼提示 code completion */
    __tag = document.createElement('input')

    /** 程式碼提示 code completion */
    getHtmlTag() { return this.__tag }

    constructor(nodeId) {
        super(nodeId)
        this.setStyle({ ...theme.form.default, ...theme.form.textinput })
            .setPlaceHolder('please enter something')
            .setValue('this is a text input')
            .on('focus', () => {
                this.setStyle(theme.form.focusState)
            }).on('blur', () => {
                this.setStyle(theme.form.blurState)
            })
    }

    setAsPasswordMode() {
        this.getHtmlTag().type = 'password'
    }

}

/** 🟢 FormTextArea */
class FormTextArea extends FormBase {

    /** 程式碼提示 code completion */
    __tag = document.createElement('textarea')

    /** 程式碼提示 code completion */
    getHtmlTag() { return this.__tag }

    constructor(nodeId) {
        super(nodeId)
        this.setStyle({ ...theme.form.default, ...theme.form.textarea })
            .setPlaceHolder('please enter something')
            .setValue('this is a text area')
            .on('focus', () => {
                this.setStyle(theme.form.focusState)
            }).on('blur', () => {
                this.setStyle(theme.form.blurState)
            })
    }

}

/** 
 * 🟢 radio 群組元件 radios' group conponent
 * @param {*} nodeId 使用者定義 nodeId 名稱 user defined Id
 * @param {*} proxy_data 使用 proxy 方法產生的資料集 proxy data by using node.proxy function
 * @param {*} callback 按鈕點擊回呼函示 click event callback
 */
function fo_radio_group(nodeId, proxy_data, callback) {
    // jsdom & id
    let jsdom = node.div(nodeId ? nodeId : '')
    let id = jsdom.getNodeId()

    // jsdom template
    const vmItemTemplate = (item, idx) => {
        return node.div().setStyle(theme.form.selectItemDefault).setChildren([
            node.div('__radioItem').setStyle({ ...theme.form.selectItemShape, borderRadius: '100%' }),
            node.div().setStyle({ color: 'white' }).setText(item)
        ])
    }

    let list = node.vm_list(id + 'radio', vmItemTemplate, proxy_data)
    jsdom.setChildren([list])

    // when push item, item will bind a click function
    let originalData = [...proxy_data]
    proxy_data.length = 0
    let push = proxy_data.push
    proxy_data.push = function (item) {
        let index = push(item)
        requestAnimationFrame(() => {
            let allNode = list.getChildren()
            let clickElement = allNode[index - 1]
            clickElement.on('click', (e, t) => {
                let index = t.getParent().getChildren().findIndex(c => c == t)
                allNode.forEach(node => {
                    node.getChildById('__radioItem').setStyle({ background: theme.form.selectItemNotSelectedColor })
                })
                t.getChildById('__radioItem').setStyle({ background: theme.form.selectItemSelectedColor })
                callback && callback(index)
            })
        })
    }
    while (originalData.length != 0) {
        let item = originalData.shift()
        proxy_data.push(item)
    }
    return jsdom
}

/** 
 * 🟢 checkbox 群組元件 checkboxs' group conponent
 * @param {*} nodeId 使用者定義 nodeId 名稱 user defined Id
 * @param {*} proxy_data 使用 proxy 方法產生的資料集 proxy data by using node.proxy function
 * @param {*} callback 按鈕點擊回呼函示 click event callback
 */
function fo_checkbox_group(nodeId, proxy_data, callback) {
    // jsdom & id
    let jsdom = node.div(nodeId ? nodeId : '')
    let id = jsdom.getNodeId()
    // jsdom template
    const vmItemTemplate = (item, idx) => {
        return node.div().setStyle(theme.form.selectItemDefault).setChildren([
            node.div('__checkboxItem').setStyle({ ...theme.form.selectItemShape }),
            node.div().setStyle({ color: 'white' }).setText(item)
        ])
    }

    let list = node.vm_list(id + 'checkbox', vmItemTemplate, proxy_data)
    jsdom.setChildren([list])

    // when push item, item will bind a click function
    let storeArr = []
    let originalData = [...proxy_data]
    proxy_data.length = 0
    let push = proxy_data.push
    proxy_data.push = function (item) {
        let index = push(item)
        requestAnimationFrame(() => {
            let allNode = list.getChildren()
            let clickElement = allNode[index - 1]
            let toggle = false
            clickElement.on('click', (e, t) => {
                let index = t.getParent().getChildren().findIndex(c => c == t)
                if (!toggle) {
                    t.getChildById('__checkboxItem').setStyle({ background: theme.form.selectItemSelectedColor })
                    storeArr.push(index)
                } else {
                    t.getChildById('__checkboxItem').setStyle({ background: theme.form.selectItemNotSelectedColor })
                    storeArr = storeArr.filter(i => i != index)
                }
                toggle = !toggle
                callback && callback(storeArr)
            })
        })
    }
    while (originalData.length != 0) {
        let item = originalData.shift()
        proxy_data.push(item)
    }

    return jsdom
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** 🟠 scene transition */
class SceneTransition {

    __layer
    fadeInTime
    delayTime
    fadeOutTime

    constructor(jsdom, fadeInTime = 500, delayTime = 500, fadeOutTime = 500) {
        this.fadeInTime = fadeInTime
        this.delayTime = delayTime
        this.fadeOutTime = fadeOutTime
        this.__layer = node.div('sceneTransitionLayer')
        this.__layer.setStyle({ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', left: '0px', top: '0', width: '100vw', height: '100dvh', opacity: '0', background: 'black', zIndex: zIndex.sceneTransition })
        jsdom && this.__layer.setChildren([jsdom])
        document.body.append(this.__layer.__tag)
    }

    remove() {
        this.__layer.remove()
    }

    async doTransition(changeScene) {
        await new Promise(r => setTimeout(r))
        await this.setFadeInPhase(this.fadeInTime)
        await this.setDelayPhase(this.delayTime)
        changeScene && changeScene()
        await this.setFadeOutPhase(this.fadeOutTime)
    }

    async setFadeInPhase(time) {
        // console.log('fadein')
        this.__layer.setStyle({ transition: `all ${time / 1000}s`, opacity: '1' })
        return new Promise(r => setTimeout(r, time))
    }

    async setDelayPhase(time) {
        // console.log('delay')
        return new Promise(r => setTimeout(r, time))
    }

    async setFadeOutPhase(time) {
        // console.log('fadeout')
        this.__layer.setStyle({ opacity: '0' })
        return new Promise(r => setTimeout(r, time))
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** 
 * 🟢 按鈕元件 button conponent
 * @param {*} nodeId 使用者定義 nodeId 名稱 user defined Id
 * @param {*} label 按鈕文字 button label
 * @param {*} pageId 路由路徑 router path
 * @param {*} customStyle 自訂預設樣式
 * @param {*} customMouseEnter 自訂滑鼠滑入樣式
 * @param {*} customMouseLeave 自訂滑鼠滑出樣式
 */
function button(nodeId, pageId, customStyle = {}, customMouseEnter = {}, customMouseLeave = {}, customMouseDown = {}, customMouseUp = {}) {
    const btn = node.div(nodeId).setClass('stop-select').setStyle({ position: 'relative' })
    btn.routerPageId = pageId
    if (pageId) {
        // router part
        btn.setStyle({ ...theme.button.default, ...theme.button.unactive, outline: '0px solid none' }).setClass('router-btn')
        const update = () => {
            if (location.href.split('/#/')[1]?.indexOf(pageId) > -1) {
                btn.getParent().getChildren().forEach(e => {
                    e.setStyle(theme.button.unactive)
                })
                btn.setStyle(theme.button.active)
            }
        }
        btn.on('click', () => {
            router.go(pageId); update()
        }).on('mouseenter', _ => btn.setChildren([
            (() => {
                let jsdom = node.div().setStyle({
                    position: 'absolute',
                    display: 'inline-flex',
                    width: '0%',
                    height: '2px',
                    bottom: '0px',
                    transition: 'all .2s',
                    opacity: '0',
                    textShadow: '0 0 100px black',
                    ...theme.button.routerHover
                })
                requestAnimationFrame(() => {
                    jsdom.setStyle({ opacity: '1', width: '100%', bottom: '-1px' })
                })
                return jsdom
            })()
        ])).on('mouseleave', _ => {
            btn.removeChildren()
        })
        requestAnimationFrame(update)
    } else {
        // normal button
        btn.setStyle({ ...theme.button.default, ...theme.button.mouseleave, ...customStyle })
        btn.on('mouseenter', _ => btn.setStyle({ ...theme.button.mouseenter, ...customMouseEnter }))
        btn.on('mouseleave', _ => btn.setStyle({ ...theme.button.mouseleave, ...customMouseLeave }))
        btn.on('mousedown', _ => btn.setStyle({ ...theme.button.mousedown, ...customMouseDown }))
        btn.on('mouseup', _ => btn.setStyle({ ...theme.button.mouseup, ...customMouseUp }))
    }
    return btn
}

/** 
 * 🟢 切換元件 toggle conponent
 * @param {*} nodeId 使用者定義 nodeId 名稱 user defined Id
 * @param {*} isToggleOn 初始開關狀態 initial toggle state ( on = true | off = false )
 * @param {*} callback 按鈕點擊回呼函示 click event callback
 */
function toggle(nodeId, isToggleOn, callback) {
    let jsdom = node.div(nodeId ? nodeId : '')
    let id = jsdom.getNodeId()
    jsdom.setStyle({ position: 'relative', width: '60px', height: '26px', border: theme.toggle.toggleBorder, borderRadius: '30px', padding: '2px', cursor: 'pointer', transition: 'all .2s', boxShadow: 'inset 0 0 15px black' }).setChildren([
        node.div(id + '__toggleThumb').setStyle({ position: 'absolute', left: '2px', top: '2px', width: '20px', height: '20px', background: '#FFF', borderRadius: '26px', transition: 'all .2s' })
    ])
    let thumb = jsdom.getChildById(id + '__toggleThumb')
    let flag = isToggleOn
    jsdom.on('click', (e, t) => {
        if (flag) {
            thumb.setStyle({ left: '36px' })
            jsdom.setStyle({ background: theme.toggle.toggleOnBGColor })
        } else {
            thumb.setStyle({ left: '2px' })
            jsdom.setStyle({ background: theme.toggle.toggleOffBGColor })
        }
        callback && callback(flag)
        flag = !flag
    })
    jsdom.dispatch('click')
    return jsdom
}

/** 
 * 🟢 對話框 dialog component
 * @param {*} title 標題 title text
 * @param {*} contentNode 對話框內容 content area 
 * @param {*} buttons 按鈕群 button group
 * @param {*} extNode 在 button group 左下側的容器 the container at bottom left side  
 * @param {*} cssWidth 對話框寬度 dialog width
 * @param {*} cssHeight 對話框高度 dialog height
 * @param {*} callback 按鈕點擊回呼函示 click event callback
 */
function dialog(title, contentNode, extNode, buttons = [], cssWidth, cssHeight, callback) {
    // background semi-transparent cover
    let backCoverStyle = {
        display: 'flex',
        width: '100vw',
        height: '100dvh',
        position: 'fixed',
        left: '0px',
        top: '0px',
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.dialog.backcover,
        zIndex: zIndex.dialog,
    }
    let backCover = node.div().setStyle(backCoverStyle)
    // dialog backgroud
    const container = node.div().setStyle(theme.dialog.body)
    // dialog title
    const titleBar = node.div().setStyle(theme.dialog.title).setText(title)
    const btnGroup = node.div().setStyle(theme.dialog.btnGroup)
    // buttons
    buttons.forEach(i => btnGroup.pushChild(i.setStyle(theme.button.default)))
    // title bar
    container.pushChild(titleBar)
    // content
    container.pushChild(contentNode.setStyle({ width: cssWidth, height: cssHeight }))
    // bottom container
    container.pushChild(node.div().setStyle(theme.dialog.bottomContainer).setChildren([
        extNode || node.div(),
        btnGroup
    ]))
    backCover.pushChild(container)
    node.app().pushChild(backCover)
    // escape
    let quit = e => {
        if (e.key == 'Escape') {
            backCover.remove(); callback(false)
        }
    }
    document.addEventListener('keyup', quit)
    // observe dom status
    const observer = new MutationObserver((mutation) => {
        if (!document.body.contains(backCover.getHtmlTag())) {
            observer.disconnect()
            document.body.style.overflow = 'auto' // enable scrolling
            document.removeEventListener('keyup', quit)
        }
    })
    observer.observe(document.body, { childList: true, subtree: true })

    document.body.style.overflow = 'hidden' // stop scrolling
    return backCover
}

/** 
 * 🟢 警告視窗 alert component
 * @param {*} message 內容 content message
 * @param {*} callback 按鈕點擊回呼函示 click event callback
 */
function alert(messeage, callback) {
    let content = node.div().setText(messeage).setStyle({ display: 'flex', justifyContent: 'center', alignItems: 'center' })
    let buttons = []
    let btnOK = node.button().setText('ok')
    btnOK.on('click', () => { dlg.remove(); callback(true) })
    buttons.push(btnOK)
    let dlg = dialog('Alert', content, null, buttons, '350px', '150px', callback)
    return dlg
}

/** 
 * 🟢 確認視窗 confirm component
 * @param {*} message 內容 content message
 * @param {*} callback 按鈕點擊回呼函示 click event callback
 */
function confirm(messeage, callback) {
    let content = node.div().setText(messeage).setStyle({ display: 'flex', justifyContent: 'center', alignItems: 'center' })
    let buttons = []
    let btnOK = node.button().setText('ok')
    let btnCancel = node.button().setText('cancel')
    btnOK.on('click', () => { dlg.remove(); callback(true) })
    btnCancel.on('click', () => { dlg.remove(); callback(false) })
    buttons.push(btnCancel)
    buttons.push(btnOK)
    let dlg = dialog('Confirm', content, null, buttons, '350px', '150px', callback)
    return dlg
}

/** 
 * 🟢 日期選擇器 date component
 * @param {*} callback 按鈕點擊回呼函示 click event callback
 */
function date(callback) {
    let content = (new DatePicker).setChildren([
        node.div().setStyle({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '7px 0' }).setChildren([
            node.button('leftx2').setText('<<').setStyle({ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', height: '20px', padding: '3px' }),
            node.button('left').setText('<').setStyle({ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', height: '20px', padding: '3px' }),
            node.div('dateLabel').setText('2025-08-01').setStyle({ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '100px', textAlign: 'center' }),
            node.button('right').setText('>').setStyle({ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', height: '20px', padding: '3px' }),
            node.button('rightx2').setText('>>').setStyle({ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', height: '20px', padding: '3px' })
        ]),
        node.div().setChildren(['日', '一', '二', '三', '四', '五', '六'].map(d =>
            node.div()
                .setStyle({ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', ...theme.date.chWeek })
                .setText(d).setStyle({ width: 'calc(100% / 7)', cursor: 'pointer' }))),
        node.div().setChildren(['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'].map(d =>
            node.div()
                .setStyle({ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', ...theme.date.enWeek })
                .setText(d).setStyle({ width: 'calc(100% / 7)', cursor: 'pointer' }))),
        node.div('dateData')
    ])
    content.getChildById('leftx2').on('click', _ => content.__prevYear())
    content.getChildById('left').on('click', _ => content.__prevMonth())
    content.getChildById('right').on('click', _ => content.__nextMonth())
    content.getChildById('rightx2').on('click', _ => content.__nextYear())
    let buttons = []
    let btnOK = node.button().setText('ok')
    let btnReset = node.button().setText('reset')
    btnOK.on('click', () => {
        dlg.remove()
        callback(content.getCurrentDate())
    })
    btnReset.on('click', () => content.__chooseCurrentDate())
    buttons.push(btnReset)
    buttons.push(btnOK)
    let dlg = dialog('Date Picker', content, null, buttons, '325px', '285px', callback)
    return dlg
}

/** 
 * 🟢 時間選擇器 time component
 * @param {*} callback 按鈕點擊回呼函示 click event callback
 */
function time(callback) {
    let cssWidth = '325px'
    let cssHeight = '285px'
    let content = node.div('timeCircle').setStyle({ position: 'relative', width: cssWidth, height: cssHeight, background: theme.time.background, overflow: 'hidden' })
    let buttons = []
    let result = node.div().setChildren([
        node.div('HH').setText('00').setStyle(theme.time.hh_mm_dn),
        node.div().setText('：').setStyle(theme.time.hh_mm_dn),
        node.div('MM').setText('00').setStyle(theme.time.hh_mm_dn),
        node.div().setStyle({ ...theme.time.hh_mm_dn, width: '10px' }),
        node.div('DN').setText('AM').setStyle(theme.time.hh_mm_dn)
    ]).setStyle({ display: 'flex', background: 'transparent', cursor: 'auto' })
    let btnOK = node.button().setText('ok')
    btnOK.on('click', () => {
        let h_val = hh.getText()
        let m_val = mm.getText()
        let dn_val = dn.getText()
        if (dn_val == '--') dn_val = 'AM'
        dlg.remove()
        callback(h_val + ':' + m_val + ' ' + dn_val)
    })
    buttons.push(btnOK)
    let dlg = dialog('Time Picker', content, result, buttons, cssWidth, cssHeight, callback)

    let timeCircle = content.getChildById('timeCircle')
    let hh = result.getChildById('HH')
    let mm = result.getChildById('MM')
    let dn = result.getChildById('DN')
    requestAnimationFrame(() => {
        let rect = timeCircle.getHtmlTag().getBoundingClientRect()
        let segCount = 12
        let r = 120
        let startAngle = -60
        // HH
        let nodes = Array(segCount).fill(0).map((i, idx) => {
            let rad = (360 / segCount * idx + startAngle) / 180 * Math.PI
            let left = rect.width / 2 + r * Math.cos(rad) + 'px'
            let top = rect.height / 2 + r * Math.sin(rad) + 'px'
            let hhNode = node.div(idx == segCount - 1 ? 'dnSwitcher' : '').setText((idx + 1 + '').padStart(2, '0'))
                .on('mouseenter', (e, t) => { t.setStyle({ background: 'rgba(0,0,0,.3)' }) })
                .on('mouseleave', (e, t) => { t.setStyle({ background: 'rgba(0,0,0,0)' }) })
                .on('click', (e, t) => { nodes.forEach(t => t.setStyle({ border: '1px solid rgba(0,0,0,0)' })); t.setStyle({ border: '1px solid white' }); hh.setText(t.getText()) })
                .setStyle({ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', color: theme.time.digiOutter, left, top, transform: 'translate(-50%, -50%)', width: '30px', height: '30px', borderRadius: '100%', cursor: 'pointer' })
            // initial hour selection
            if (idx == segCount - 1) requestAnimationFrame(() => hhNode.dispatch('click'))
            return hhNode
        })

        r = 80
        startAngle = -90
        // MM
        let nodes2 = Array(segCount).fill(0).map((i, idx) => {
            let rad = (360 / segCount * idx + startAngle) / 180 * Math.PI
            let left = rect.width / 2 + r * Math.cos(rad) + 'px'
            let top = rect.height / 2 + r * Math.sin(rad) + 'px'
            let mmNode = node.div().setText((idx * 5 + '').padStart(2, '0'))
                .on('mouseenter', (e, t) => { t.setStyle({ background: 'rgba(0,0,0,.1)' }) })
                .on('mouseleave', (e, t) => { t.setStyle({ background: 'rgba(0,0,0,0)' }) })
                .on('click', (e, t) => { nodes2.forEach(t => t.setStyle({ border: '1px solid rgba(0,0,0,0)' })); t.setStyle({ border: '1px solid #66330088' }); mm.setText(t.getText()) })
                .setStyle({ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', color: theme.time.digiInner, left, top, transform: 'translate(-50%, -50%)', width: '30px', height: '30px', borderRadius: '100%', cursor: 'pointer' })
            // initial minute selection
            if (idx == 0) requestAnimationFrame(() => mmNode.dispatch('click'))
            return mmNode
        })
        // DN - day (AM) & night (PM)
        let nodes3 = node.div().setStyle({ display: 'flex', justifyContent: 'center', alignItems: 'center', width: cssWidth, height: cssHeight }).setChildren([
            node.div('am').setText('AM').setStyle({ cursor: 'pointer', padding: '5px', color: '#33333388', border: '1px solid #33333333', marginRight: '10px' }).on('click', (e, t) => {
                nodes3.getChildren().forEach(t => t.setStyle({ color: '#33333388', border: '1px solid #33333333' }))
                t.setStyle({ color: 'black', border: '1px solid black' })
                dn.setText(t.getText())
                switcher.setText('00')
                if (hh.getText() == '12') hh.setText('00')
            }),
            node.div('pm').setText('PM').setStyle({ cursor: 'pointer', padding: '5px', color: '#33333388', border: '1px solid #33333333' }).on('click', (e, t) => {
                nodes3.getChildren().forEach(t => t.setStyle({ color: '#33333388', border: '1px solid #33333333' }))
                t.setStyle({ color: 'black', border: '1px solid black' })
                dn.setText(t.getText())
                switcher.setText('12')
                if (hh.getText() == '00') hh.setText('12')
            }),
        ])
        // initial AM selection
        requestAnimationFrame(() => nodes3.getChildById('am').dispatch('click'))

        // thick circle line stroke
        let circleLine = node.div().setStyle(({ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', left: '0px', top: '0px', transform: 'translate(-50%, -50%)', width: '370px', height: '370px', borderRadius: '100%', border: theme.time.decoBorder, left: rect.width / 2 + 'px', top: rect.height / 2 + 'px', pointerEvents: 'none' }))

        let allNodes = [...nodes, ...nodes2, nodes3, circleLine]
        timeCircle.setChildren(allNodes)
        // AM <-> PM switcher
        let switcher = timeCircle.getChildById('dnSwitcher')
    })

    return dlg
}

/** 
 * 🟢 顏色選擇器 color component
 * @param {*} callback 按鈕點擊回呼函示 click event callback
 */
function color(callback) {
    let content = (new ColorPicker).setChildren([
        node.div().setStyle({ display: 'inline-flex', background: '#333', }).setChildren([
            node.canvas('singleColor').setSize(256, 256),
            node.canvas('allColor').setSize(40, 256),
        ]),
        node.div().setStyle({ display: 'flex', alignItems: 'center', padding: '0px 2px' }).setChildren([
            node.div().setStyle({ display: 'flex', width: '60%', alignItems: 'center', marginRight: '3px' }).setChildren([
                node.span().setText('rgb'),
                node.span('colorLabel').setText('rgb(255,0,0)').setStyle({ width: '100%', margin: '0px 2px', padding: '3px', color: 'black', background: '#CCC', borderRadius: '4px' }),
            ]),
            node.div().setStyle({ display: 'flex', width: '40%', alignItems: 'center' }).setChildren([
                node.span().setText('hex'),
                node.div('hexColorLabel').setText('#ff0000').setStyle({ width: '100%', margin: '0px 2px', padding: '3px', color: 'black', background: '#CCC', borderRadius: '4px' }),
            ]),
        ])
    ])
    content.__singleColor = content.getChildById('singleColor').setStyle({ cursor: 'crosshair' })
    content.__allColor = content.getChildById('allColor').setStyle({ cursor: 'crosshair' })
    content.__colorLabel = content.getChildById('colorLabel')
    content.__hexColorLabel = content.getChildById('hexColorLabel')
    content.__createSingleColorSpectrum('red')
    content.__createMultiColorSpectrum()
    content.__currentColor = node.div('currentColor').setStyle({
        display: 'inline-flex',
        width: '25px',
        height: '25px',
        background: 'red',
        borderRadius: '4px',
        border: '1px solid white',
        outline: '1px solid gray',
    })
    let buttons = []
    let btn = node.button().setText('ok')
    btn.on('click', () => {
        let imgData = content.__singleColor.getContext2D().getImageData(content.x, content.y, 1, 1).data;
        dlg.remove()
        callback({ r: imgData[0], g: imgData[1], b: imgData[2] })
    })
    buttons.push(btn)
    let dlg = dialog('Color Picker', content, content.__currentColor, buttons, '296px', '289px', callback)
    return dlg
}

/** 
 * 🟢 檔案選擇器 file component
 * @param {*} nodeId 使用者定義 nodeId 名稱 user defined Id
 * @param {*} readerMode MODE_BASE64 = 0 | MODE_ARRAYBUFFER = 1 | MODE_TEXT = 2
 * @param {*} callback 按鈕點擊回呼函示 click event callback
 */
function file(nodeId, label, readerMode, callback) {
    let jsdom = node.div(nodeId ? nodeId : '')
    let id = jsdom.getNodeId()
    jsdom.setStyle({ display: 'inline-flex' }).setChildren([
        new FilePicker(id + '__file', readerMode, callback).setStyle({ display: 'none' }),
        node.button().setText(label).on('click', () => picker.getHtmlTag().click())
    ])
    let picker = jsdom.getChildById(id + '__file')
    return jsdom
}

/** 
 * 🟢 滾動條 scroller
 * @param {*} nodeId 使用者定義 nodeId 名稱 user defined Id
 * @param {*} cssWidth 滾動條寬度 scroller width
 * @param {*} cssHeight 滾動條高度 scroller height
 * @param {*} cssThumbColor 滾動條滑桿顏色 scroller thumb color - empty string for default style
 * @param {*} cssTrackColor 滾動條滑桿條背景顏色 scroller track color - empty string for default style
 * @param {*} cssTrackVOffsetX 垂直滾動條 x 偏移量 slider vertical bar offset x
 * @param {*} cssTrackHOffsetY 水平滾動條 y 偏移量 slider horizontal bar offset y
 * @param {*} scrollPolicy 滾動條種類 0: 垂直, 1:水平, 2: 兩者都有 scroll policy: 0-vertical, 1-horizontal, 2-both enable, 3-both disable
 * @param {*} contentNode 放在滾動容器內的視圖節點 scroller viewport
 * @param {*} resizeCallback contentNode 寬高更新時觸發 trigger the callback when resize contentNode
 */
function scroller(nodeId, cssWidth, cssHeight, cssThumbColor, cssTrackColor, cssTrackVOffsetX, cssTrackHOffsetY, scrollPolicy, contentNode, resizeCallback) {

    // fit scroll content
    let contentW = 0
    let contentNodeStyle = contentNode.getStyle()
    let w = parseInt(contentNodeStyle.width)
    if (!(!w || isNaN(w))) {
        if (contentNodeStyle.width.slice((w + '').length) == 'px') {
            contentW = contentNodeStyle.width
        }
    }

    let jsdom = node.div(nodeId ? nodeId : '')
    let id = jsdom.getNodeId()

    jsdom.setStyle({ position: 'relative', display: 'inline-flex' }).setChildren([
        node.div(id + '__contentWrapper').setStyle({ position: 'relative', overflow: 'auto', width: cssWidth, height: cssHeight }).setChildren([
            node.div(id + '__content').setStyle({ position: 'absolute', left: '0px', top: '0px', width: contentW ? (contentW + 'px') : cssWidth, height: cssHeight }).setChildren([contentNode]),
        ]),
        node.div(id + '__barV').setStyle({ zIndex: zIndex.scrollerbar, position: 'absolute', background: cssTrackColor || theme.scroller.trackColor, borderRadius: '10px', width: theme.scroller.barWidth, height: '100%', top: '0px', right: cssTrackVOffsetX, transition: 'opacity .2s', opacity: '0', overflow: 'hidden' }).setChildren([
            node.div(id + '__thumbV').setStyle({ position: 'absolute', background: cssThumbColor || theme.scroller.thumbColor, borderRadius: '10px', width: theme.scroller.thumbWidth, height: '100%', top: '0px', right: '1px' })
        ]),
        node.div(id + '__barH').setStyle({ zIndex: zIndex.scrollerbar, position: 'absolute', background: cssTrackColor || theme.scroller.trackColor, borderRadius: '10px', width: '100%', height: theme.scroller.barWidth, top: `calc(${cssHeight} + ${cssTrackHOffsetY})`, transition: 'opacity .2s', opacity: '0', overflow: 'hidden' }).setChildren([
            node.div(id + '__thumbH').setStyle({ position: 'absolute', background: cssThumbColor || theme.scroller.thumbColor, borderRadius: '10px', width: '100%', height: theme.scroller.thumbWidth, bottom: '0px', top: '1px' })
        ]),
    ])
    const barV = jsdom.getChildById(id + '__barV')
    const thumbV = jsdom.getChildById(id + '__thumbV')
    const barH = jsdom.getChildById(id + '__barH')
    const thumbH = jsdom.getChildById(id + '__thumbH')
    const content = jsdom.getChildById(id + '__content')
    const wrapper = jsdom.getChildById(id + '__contentWrapper')

    if (scrollPolicy == 0) {
        // show vertical bar
        barH.setStyle({ display: 'none' })
        wrapper.setStyle({ overflowX: 'hidden' })
    } else if (scrollPolicy == 1) {
        // show horizontal bar
        barV.setStyle({ display: 'none' })
        wrapper.setStyle({ overflowY: 'hidden' })
    } else if (scrollPolicy == 2) {
        // show all bars
    } else if (scrollPolicy == 3) {
        barH.setStyle({ display: 'none' })
        barV.setStyle({ display: 'none' })
        wrapper.setStyle({ overflow: 'hidden' })
    }

    // scroll state
    let timeId
    let timeId2
    let timeId3
    let preTop
    let preLeft

    // width & height info
    function getDimension() {
        let contentRect = content.getHtmlTag().getBoundingClientRect()
        let contentNodeRect = contentNode.getHtmlTag().getBoundingClientRect()
        let contentHeight = contentRect.height // visible height
        let contentNodeHeight = contentNodeRect.height // real height
        let contentWidth = cssWidth.slice((parseInt(cssWidth) + '').length) == 'px' ? parseInt(cssWidth) : contentRect.width // visible width
        let contentNodeWidth = contentNodeRect.width // real width
        return { contentHeight, contentWidth, contentNodeHeight, contentNodeWidth }
    }

    let isV = false
    let isH = false
    let app = node.app()
    let isMouseDown = false
    let appDefaultCss = node.app().getClass()
    let getWrapperRect = () => wrapper.getHtmlTag().getBoundingClientRect()
    let getThumbVRect = () => thumbV.getHtmlTag().getBoundingClientRect()
    let getThumbHRect = () => thumbH.getHtmlTag().getBoundingClientRect()
    barV.on('mousedown', e => { isV = true, isMouseDown = true, app.setStyle({ cursor: 'pointer' }).setClass(appDefaultCss + ' stop-select'), scrollfunc(e) })
    barH.on('mousedown', e => { isH = true, isMouseDown = true, app.setStyle({ cursor: 'pointer' }).setClass(appDefaultCss + ' stop-select'), scrollfunc(e) })
    jsdom.onGlobalEvent(GlobalEvent.SYSTEM_MOUSE_MOVE, e => { isMouseDown && scrollfunc(e) })
    jsdom.onGlobalEvent(GlobalEvent.SYSTEM_MOUSE_UP, e => { isV = false, isH = false, isMouseDown = false, app.setStyle({ cursor: 'auto' }).setClass(appDefaultCss) })
    jsdom.onGlobalEvent(GlobalEvent.SYSTEM_MOUSE_LEAVE, _ => { isMouseDown = false, app.setStyle({ cursor: 'auto' }) })

    const scrollfunc = e => {
        let { contentHeight, contentWidth, contentNodeHeight, contentNodeWidth } = getDimension()

        // thumbV
        let ratioV = contentHeight / contentNodeHeight
        let top = wrapper.getHtmlTag().scrollTop * ratioV
        let emptyspaceV = contentHeight * (1 - ratioV) - 1.5
        if (top < 1.5) top = 1.5
        else if (top > emptyspaceV) top = emptyspaceV

        if (isV && e && e.pageY > -1) {
            let tvRect = getThumbVRect()
            let wRect = getWrapperRect()
            let offsetY = e.pageY - (wRect.top + tvRect.height / 2)
            wrapper.getHtmlTag().scrollTop = offsetY / ratioV
        }
        thumbV.setStyle({ height: contentHeight * ratioV + 'px', top: top + 'px' })

        // thumbH
        let ratioH = contentWidth / contentNodeWidth
        let left = wrapper.getHtmlTag().scrollLeft * ratioH
        let emptyspaceH = contentWidth * (1 - ratioH) - 1.5
        if (left < 1.5) left = 1.5
        else if (left > emptyspaceH) left = emptyspaceH

        if (isH && e && e.pageX > -1) {
            let thRect = getThumbHRect()
            let wRect = getWrapperRect()
            let offsetX = e.pageX - (wRect.left + thRect.width / 2)
            wrapper.getHtmlTag().scrollLeft = offsetX / ratioH
        }
        thumbH.setStyle({ width: contentWidth * ratioH + 'px', left: left + 'px' })

        // content overflow 
        let isNotOverFlow = false
        if (contentNodeHeight < contentHeight) {
            barV.setStyle({ opacity: '0' })
            isNotOverFlow = true
        }
        if (contentNodeWidth < contentWidth) {
            barH.setStyle({ opacity: '0' })
            isNotOverFlow = true
        }
        if (isNotOverFlow) return

        // hide the scrollbar, when the mouse stop moving for 2 seconds
        if (timeId == null &&
            top == preTop &&
            left == preLeft &&
            (barH.getHtmlTag().style.opacity == '1' || barV.getHtmlTag().style.opacity == '1')
        ) {
            clearTimeout(timeId)
            timeId = setTimeout(() => {
                barV.setStyle({ opacity: '0' })
                barH.setStyle({ opacity: '0' })
                timeId = null
                let mm = () => {
                    jsdom.off('mousemove', mm)
                    barV.setStyle({ opacity: '1' })
                    barH.setStyle({ opacity: '1' })
                }
                jsdom.on('mousemove', mm, true)
                let mm2 = () => {
                    clearTimeout(timeId2)
                    timeId2 = setTimeout(() => {
                        if (jsdom.has('mousemove', mm2)) {
                            jsdom.off('mousemove', mm2)
                            barV.setStyle({ opacity: '0' })
                            barH.setStyle({ opacity: '0' })
                        }
                        timeId2 = null
                    }, 1000)
                }
                jsdom.on('mousemove', mm2, true)
            }, 1500)
        }
        barV.setStyle({ opacity: '1' })
        barH.setStyle({ opacity: '1' })
        preTop = top
        preLeft = left
    }

    // scroll events
    wrapper.on('scroll', scrollfunc)
    jsdom.on('mouseenter', scrollfunc)
    jsdom.on('mouseleave', () => {
        barV.setStyle({ opacity: '0' })
        barH.setStyle({ opacity: '0' })
    })

    // content height observer
    let firstTime = true
    const observer = new ResizeObserver(() => {
        if (!content.getHtmlTag()) return
        if (firstTime) { firstTime = false; return }
        let { contentHeight, contentWidth, contentNodeHeight, contentNodeWidth } = getDimension()

        if (contentNodeHeight > contentHeight || contentNodeWidth > contentWidth) {
            barV.setStyle({ opacity: '1' })
            barH.setStyle({ opacity: '1' })
            clearTimeout(timeId3)
            timeId3 = setTimeout(() => {
                barV.setStyle({ opacity: '0' })
                barH.setStyle({ opacity: '0' })
                timeId3 = null
            }, 1000)
        } else {
            barV.setStyle({ opacity: '0' })
            barH.setStyle({ opacity: '0' })
        }
        scrollfunc()
        resizeCallback && resizeCallback((itemsHeight, itemWidth) => {
            if (itemsHeight > theme.vm_select.maxHeight) itemsHeight = theme.vm_select.maxHeight
            content.setStyle({ height: itemsHeight + 'px' })
            wrapper.setStyle({ height: itemsHeight + 'px' })
        })
    })
    observer.observe(contentNode.getHtmlTag())

    // page leave watcher, and observer disconnect
    let storeHref = location.href
    let pageObserver = () => {
        if (location.href != storeHref && !jsdom.getHtmlTag()) {
            observer.disconnect()
            window.removeEventListener('popstate', pageObserver)
        }
    }
    window.addEventListener('popstate', pageObserver)

    return jsdom
}

/** 
 * 🟢 splitterV 垂直分割線 vertical splitter
 * @param {*} nodeId 使用者定義 nodeId 名稱 user defined Id
 * @param {*} cssHeight 分割線高度 splitter height
 * @param {*} initPercentage 初始空間分配百分比 initial percentage of container width
 * @param {*} leftNode 左側節點 left side node
 * @param {*} rightNode 右側節點 right side node
 */
function splitterV(nodeId, cssHeight, initPercentage, leftNode, rightNode) {

    let jsdom = node.div(nodeId ? nodeId : '')
    let id = jsdom.getNodeId()

    jsdom.setStyle({ display: 'flex', height: cssHeight, overflow: 'hidden' }).setChildren([
        leftNode.setStyle({ height: cssHeight, width: `calc(${initPercentage}% - 3px)`, overflow: 'hidden' }),
        node.div(id + '__resizer').setStyle({ width: '6px', cursor: 'ew-resize', background: '#111', display: 'flex', justifyContent: 'center', alignItems: 'center' }).setChildren([
            node.div().setStyle({ width: '1px', height: '20px', background: 'rgb(187, 253, 111)' })
        ]),
        rightNode.setStyle({ height: cssHeight, width: `calc(${100 - initPercentage}% - 3px)`, overflow: 'hidden' }),
    ])

    // update view
    let update = e => {
        let rect = jsdom.getHtmlTag().getBoundingClientRect()
        let x = e.pageX - rect.left
        let percent = x / rect.width * 100
        leftNode.setStyle({ width: `calc(${percent}% - 3px)` })
        rightNode.setStyle({ width: `calc(${100 - percent}% - 3px)` })
        let rect_left = leftNode.getHtmlTag().getBoundingClientRect()
        let rect_right = rightNode.getHtmlTag().getBoundingClientRect()
        leftNode.setStyle({ width: rect_left.width + 'px' })
        rightNode.setStyle({ width: rect_right.width + 'px' })
    }

    let resizer = jsdom.getChildById(id + '__resizer')
    let isMouseDown = false
    let appDefaultCss = node.app().getClass()
    resizer.on('mousedown', e => { isMouseDown = true, node.app().setClass(appDefaultCss + ' stop-select') })
    jsdom.on('mousemove', e => { isMouseDown && update(e) })
    jsdom.on('mouseup', e => { isMouseDown = false, node.app().setClass(appDefaultCss) })
    jsdom.on('mouseleave', _ => { isMouseDown = false })
    return jsdom
}

/** 
 * 🟢 splitterH 水平分割線 horizontal splitter
 * @param {*} nodeId 使用者定義 nodeId 名稱 user defined Id
 * @param {*} cssWidth 分割線寬度 splitter width
 * @param {*} initPercentage 初始空間分配百分比 initial percentage of container height
 * @param {*} topNode 上方節點 top side node
 * @param {*} bottomNode 下方節點 bottom side node
 */
function splitterH(nodeId, cssWidth, initPercentage, topNode, bottomNode) {

    let jsdom = node.div(nodeId ? nodeId : '')
    let id = jsdom.getNodeId()

    jsdom.setStyle({ width: cssWidth, height: '100%', overflow: 'hidden' }).setChildren([
        topNode.setStyle({ width: cssWidth, height: `calc(${initPercentage}% - 3px)`, overflow: 'hidden' }),
        node.div(id + '__resizer').setStyle({ height: '6px', cursor: 'ns-resize', background: '#111', display: 'flex', justifyContent: 'center', alignItems: 'center' }).setChildren([
            node.div().setStyle({ width: '20px', height: '1px', background: 'rgb(187, 253, 111)' })
        ]),
        bottomNode.setStyle({ width: cssWidth, height: `calc(${100 - initPercentage}% - 3px)`, overflow: 'hidden' }),
    ])

    let update = e => {
        let rect = jsdom.getHtmlTag().getBoundingClientRect()
        let y = e.pageY - rect.top
        let percent = y / rect.height * 100
        topNode.setStyle({ height: `calc(${percent}% - 3px)` })
        bottomNode.setStyle({ height: `calc(${100 - percent}% - 3px)` })
        let rect_top = topNode.getHtmlTag().getBoundingClientRect()
        let rect_bottom = bottomNode.getHtmlTag().getBoundingClientRect()
        topNode.setStyle({ height: rect_top.height + 'px' })
        bottomNode.setStyle({ height: rect_bottom.height + 'px' })
    }

    let resizer = jsdom.getChildById(id + '__resizer')
    let isMouseDown = false
    let appDefaultCss = node.app().getClass()
    resizer.on('mousedown', e => { isMouseDown = true, node.app().setClass(appDefaultCss + ' stop-select') })
    jsdom.on('mousemove', e => { isMouseDown && update(e) })
    jsdom.on('mouseup', e => { isMouseDown = false, node.app().setClass(appDefaultCss) })
    jsdom.on('mouseleave', _ => { isMouseDown = false })

    return jsdom
}

/** 
 * 🟢 sliderV 垂直滑桿 vertical slider
 * @param {*} nodeId 使用者定義 nodeId 名稱 user defined Id
 * @param {*} cssHeight 滑桿高度 slider height
 * @param {*} initVal 初始值 initial slider value
 * @param {*} minVal 最小值 min value
 * @param {*} maxVal 最大值 max value
 * @param {*} callback 滑動滑桿回呼函示 slider value callback
 */
function sliderV(nodeId, cssHeight, initVal, minVal, maxVal, callback) {

    let setVal = (val) => {
        let total = maxVal - minVal
        let ratio = (initVal - minVal) / total
        let rect = jsdom.getHtmlTag().getBoundingClientRect()
        thumb.setStyle({ top: (rect.height * (1 - ratio) - 5) + 'px' })
        thumbInfo.setText(Math.round(minVal + total * ratio))
        callback && callback({ ratio, currentVal: initVal, minVal, maxVal })
    }

    let jsdom = node.div(nodeId ? nodeId : '')
    let id = jsdom.getNodeId()
    jsdom.setStyle({ display: 'inline-flex', alignItems: 'center', position: 'relative', width: '2px', height: cssHeight, background: theme.slider.trackColor, margin: '0px 20px' }).setChildren([
        node.div(id + '__thumb').setStyle({ position: 'absolute', left: '-4px', top: '-4px', background: theme.slider.thumbColor, width: '10px', height: '10px', borderRadius: '100%', cursor: 'grab', outline: '1.5px solid ' + theme.slider.thumbOutlineColor }).setChildren([
            node.div(id + '__thumbInfo').setStyle({ display: 'none', position: 'absolute', transform: 'translate(-25%)', left: '1.5em', top: '-9px', ...theme.slider.thumbInfo }).setText('0')
        ])
    ])

    let update = e => {
        let rect = jsdom.getHtmlTag().getBoundingClientRect()
        let y = e.pageY - rect.top
        let total = maxVal - minVal
        let ratio = y / rect.height
        if (ratio > 1) ratio = 1
        else if (ratio < 0) ratio = 0
        thumb.setStyle({ top: (rect.height * ratio - 5) + 'px' })
        let currentVal = Math.round(minVal + total * (1 - ratio))
        thumbInfo.setText(currentVal)
        callback && callback({ ratio: 1 - ratio, currentVal, minVal, maxVal })
    }

    let thumb = jsdom.getChildById(id + '__thumb')
    let thumbInfo = jsdom.getChildById(id + '__thumbInfo')

    let app = node.app()
    let isMouseDown = false
    let appDefaultCss = node.app().getClass()
    thumb.on('mousedown', e => { isMouseDown = true, app.setStyle({ cursor: 'pointer' }).setClass(appDefaultCss + ' stop-select'), thumbInfo.setStyle({ display: 'block' }) })
    jsdom.onGlobalEvent(GlobalEvent.SYSTEM_MOUSE_MOVE, e => { isMouseDown && update(e) })
    jsdom.onGlobalEvent(GlobalEvent.SYSTEM_MOUSE_UP, e => { isMouseDown = false, app.setStyle({ cursor: 'auto' }).setClass(appDefaultCss), thumbInfo.setStyle({ display: 'none' }) })
    jsdom.onGlobalEvent(GlobalEvent.SYSTEM_MOUSE_LEAVE, _ => { isMouseDown = false, app.setStyle({ cursor: 'auto' }), thumbInfo.setStyle({ display: 'none' }) })

    requestAnimationFrame(() => setVal(initVal))

    return jsdom
}


/** 
 * 🟢 sliderH 水平滑桿 horizontal slider
 * @param {*} nodeId 使用者定義 nodeId 名稱 user defined Id
 * @param {*} cssWidth 滑桿寬度 slider width
 * @param {*} initVal 初始值 initial slider value
 * @param {*} minVal 最小值 min value
 * @param {*} maxVal 最大值 max value
 * @param {*} callback 滑動滑桿回呼函示 slider value callback
 */
function sliderH(nodeId, cssWidth, initVal, minVal, maxVal, callback) {

    let setVal = (val) => {
        let total = maxVal - minVal
        let ratio = (val - minVal) / total
        let rect = jsdom.getHtmlTag().getBoundingClientRect()
        thumb.setStyle({ left: (rect.width * ratio - 5) + 'px' })
        thumbInfo.setText(Math.round(minVal + total * ratio))
        callback && callback({ ratio, currentVal: val, minVal, maxVal })
    }

    let jsdom = node.div(nodeId ? nodeId : '')
    let id = jsdom.getNodeId()
    jsdom.setStyle({ display: 'inline-flex', alignItems: 'center', position: 'relative', width: cssWidth, height: '2px', background: theme.slider.trackColor, margin: '20px 0px' }).setChildren([
        node.div(id + '__thumb').setStyle({ position: 'absolute', left: '-4px', top: '-4px', background: theme.slider.thumbColor, width: '10px', height: '10px', borderRadius: '100%', cursor: 'grab', outline: '1.5px solid ' + theme.slider.thumbOutlineColor }).setChildren([
            node.div(id + '__thumbInfo').setStyle({ display: 'none', position: 'absolute', transform: 'translate(-25%)', left: '0px', top: '-2em', ...theme.slider.thumbInfo }).setText('0')
        ])
    ])

    let update = e => {
        let rect = jsdom.getHtmlTag().getBoundingClientRect()
        let x = e.pageX - rect.left
        let total = maxVal - minVal
        let ratio = x / rect.width
        if (ratio > 1) ratio = 1
        else if (ratio < 0) ratio = 0
        thumb.setStyle({ left: (rect.width * ratio - 5) + 'px' })
        let currentVal = Math.round(minVal + total * ratio)
        thumbInfo.setText(currentVal)
        callback && callback({ ratio, currentVal, minVal, maxVal })
    }

    let thumb = jsdom.getChildById(id + '__thumb')
    let thumbInfo = jsdom.getChildById(id + '__thumbInfo')

    let app = node.app()
    let isMouseDown = false
    let appDefaultCss = node.app().getClass()
    thumb.on('mousedown', e => { isMouseDown = true, app.setStyle({ cursor: 'pointer' }).setClass(appDefaultCss + ' stop-select'), thumbInfo.setStyle({ display: 'block' }) })
    jsdom.onGlobalEvent(GlobalEvent.SYSTEM_MOUSE_MOVE, e => { isMouseDown && update(e) })
    jsdom.onGlobalEvent(GlobalEvent.SYSTEM_MOUSE_UP, e => { isMouseDown = false, app.setStyle({ cursor: 'auto' }).setClass(appDefaultCss), thumbInfo.setStyle({ display: 'none' }) })
    jsdom.onGlobalEvent(GlobalEvent.SYSTEM_MOUSE_LEAVE, _ => { isMouseDown = false, app.setStyle({ cursor: 'auto' }), thumbInfo.setStyle({ display: 'none' }) })

    requestAnimationFrame(() => setVal(initVal))

    return jsdom
}

/** 
 * 🟢 下拉式選單 vm_select - dropdown menu
 * @param {*} nodeId 使用者定義 nodeId 名稱 user defined Id
 * @param {*} title 選單標題 selection title
 * @param {*} jsdom_tpl jsdom 方法模板 jsdom function template
 * @param {*} proxy_data 使用 proxy 方法產生的資料集 proxy data by using node.proxy function
 * @param {*} cssWidth 元件寬度 component css width
 * @param {*} callback 按鈕點擊回呼函示 click event callback
 */
function vm_select(nodeId, title, jsdom_tpl, proxy_data, cssWidth, callback) {

    // calculate item height
    let app = node.app()
    app.pushChild(jsdom_tpl('1'))
    let cs = app.getChildren()
    let rect = cs[cs.length - 1].setStyle({ width: cssWidth }).getHtmlTag().getBoundingClientRect()
    let itemHeight = rect.height
    let itemWidth = rect.width
    let itemsHeight = proxy_data.length * itemHeight
    if (itemsHeight > theme.vm_select.maxHeight) itemsHeight = theme.vm_select.maxHeight
    app.popChild()

    // state
    let isOpenMenu = false

    // jsdom & id
    let jsdom = node.div(nodeId ? nodeId : '')
    let id = jsdom.getNodeId()

    jsdom.setStyle({ position: 'relative', width: cssWidth, cursor: 'pointer' }).setChildren([
        node.div(id + '__title').setStyle({ width: cssWidth, ...theme.vm_select.title }).setChildren([
            node.div(id + '__titleText').setText(title),
            node.div().setText('≡')
        ]).on('click', () => {
            if (isOpenMenu) return
            isOpenMenu = true
            selectScroller.setStyle({ display: 'block' })
            selectMenu.setStyle({ display: 'block' })
            let titleRect = selectTitle.getHtmlTag().getBoundingClientRect()
            let scroRect = selectScroller.getHtmlTag().getBoundingClientRect()

            if (scroRect.top + scroRect.height > window.innerHeight) {
                selectScroller.setStyle({ top: -scroRect.height + 'px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' })
                selectTitle.setStyle({ borderTopLeftRadius: '0px', borderTopRightRadius: '0px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' })
            } else {
                selectScroller.setStyle({ top: titleRect.height + 'px', borderTopLeftRadius: '0px', borderTopRightRadius: '0px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' })
                selectTitle.setStyle({ borderTopLeftRadius: '8px', borderTopRightRadius: '8px', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' })
            }
        }),
        node.scroller(id + '__menuScroller', cssWidth, itemsHeight + 'px', '', '', '0px', '0px', 0,
            node.vm_list(id + '__menu', jsdom_tpl, proxy_data).setStyle({ display: 'none', width: cssWidth }), (callback) => callback(proxy_data.length * itemHeight, itemWidth))
            .setStyle({ position: 'absolute', overflow: 'hidden', display: 'none', zIndex: zIndex.menu })
    ]).on('mouseleave', () => {
        isOpenMenu = false
        let titleRect = selectTitle.getHtmlTag().getBoundingClientRect()
        selectTitle.setStyle({ borderTopLeftRadius: '8px', borderTopRightRadius: '8px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' })
        selectScroller.setStyle({ top: titleRect.height + 'px', display: 'none' })
    })

    let selectScroller = jsdom.getChildById(id + '__menuScroller')
    let selectMenu = jsdom.getChildById(id + '__menu')
    let selectTitle = jsdom.getChildById(id + '__title')
    let selectTitleText = jsdom.getChildById(id + '__titleText')

    // when push an item, item will bind a click function
    let originalData = [...proxy_data]
    proxy_data.length = 0
    let push = proxy_data.push
    proxy_data.push = function (item) {
        let index = push(item)
        requestAnimationFrame(() => {
            let allNode = selectMenu.getChildren()
            let clickElement = allNode[index - 1]
            clickElement.setStyle({ borderLeft: '1px solid transparent' })
            clickElement.on('click', (e, t) => {
                allNode.forEach(node => {
                    node.setStyle({ borderLeft: '1px solid transparent' })
                })
                t.setStyle({ borderLeft: '1px solid ' + theme.vm_select.selecedColor })
                callback && callback(t.getText())
                selectTitleText.setText(title + ' - ' + t.getText())
                selectScroller.setStyle({ display: 'none' })
            }).on('mouseenter', (e, t) => {
                t.setStyle({ boxShadow: 'inset 0 0 15px #FFFFFF55' })
            }).on('mouseleave', (e, t) => {
                t.setStyle({ boxShadow: 'inset 0 0 0px transparent' })
            })
        })
    }
    while (originalData.length != 0) {
        let item = originalData.shift()
        proxy_data.push(item)
    }

    return jsdom
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** 簡易 API 操作入口 an easy API entry */
export const node = {
    // ------------------------------------------------------------ 函式集
    /** 生成 root 節點，並初始化 router 與 store */
    createApp,
    /** your image path */
    getAssetsPath,
    /** 生成共享 css 類名, ex: node.appendClasses({div : { background: 'orange' }}) */
    appendClasses,
    /** 漸層背景動畫生成 */
    gradientBackgroundAnimation,
    /** 🟢 取得目前頁面所有有 nodeId 的物件，適用於跨不同層級元件呼叫使用 */
    getPageNodes: () => nodes,
    /** 🟢 取得目前頁面指定 nodeId 的物件，適用於跨不同層級元件呼叫使用 */
    getPageNodeById: (nodeId) => nodes.filter(n => n.__nodeId == nodeId)[0],
    /** 🟢 訂閱與發佈機制，適用於跨不同層級元件呼叫使用 publish / subscribe tool for difference level components communication */
    pubsub: PubSub,
    /** 🟠 過場動畫 */
    sceneTransition: (jsdom, fadeInTime = 500, delayTime = 500, fadeOutTime = 500) => new SceneTransition(jsdom, fadeInTime, delayTime, fadeOutTime),
    // ------------------------------------------------------------ 基礎 html 元素 basic html elements
    app: () => NodeBase.__app,
    div: (nodeId) => new Div(nodeId),
    span: (nodeId) => new Span(nodeId),
    hr: (nodeId) => new Hr(nodeId),
    h1: (nodeId) => new H1(nodeId),
    h2: (nodeId) => new H2(nodeId),
    h3: (nodeId) => new H3(nodeId),
    h4: (nodeId) => new H4(nodeId),
    h5: (nodeId) => new H5(nodeId),
    h6: (nodeId) => new H6(nodeId),
    img: (nodeId) => new Image(nodeId),
    canvas: (nodeId) => new Canvas(nodeId),
    divimg: (nodeId, src) => node.div(nodeId).setStyle({ background: `url(${getAssetsPath(src)})`, width: '299px', height: '299px', backgroundSize: 'cover' }),
    // ------------------------------------------------------------ View Model 物件 view model object
    proxy,
    vm_list: (nodeId, jsdom_tpl, proxy_data) => new VMListBase(nodeId, jsdom_tpl, proxy_data),
    vm_single: (nodeId, jsdom_tpl, proxy_data) => new VMSingleBase(nodeId, jsdom_tpl, proxy_data),
    // ------------------------------------------------------------ 進階 UI 物件 advance ui object
    button,
    toggle,
    dialog,
    alert,
    confirm,
    date,
    time,
    color,
    file,
    scroller,
    splitterV,
    splitterH,
    sliderV,
    sliderH,
    vm_select,
    // ------------------------------------------------------------ 表單物件 form object
    fo_text: (nodeId) => new FormText(nodeId),
    fo_textarea: (nodeId) => new FormTextArea(nodeId),
    fo_radio_group,
    fo_checkbox_group,
}