import { GlobalEvent, router_config } from "./config.js"
import { node } from "./node.js"

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** 目前的路由位置 current router path */
let currentPageId

/** 路由 API router API */
export let router = {
    /** 初次渲染 init router - render init view */
    init() {
        requestAnimationFrame(popstate)
    },
    /** 跳轉指定路由頁面 go to new page */
    async go(pageId, sceneTransition, isReplace) {
        if (!pageId) return
        currentPageId = pageId
        let loc = location.href.split('/#/')[1]
        if (loc == pageId) return  // check repeat mouse click
        if (loc == undefined) loc = pageId
        let loc_sp = loc.split('/')
        let pid_sp = pageId.split('/')
        if (loc.indexOf(pageId) > -1 && (loc_sp.length != pid_sp.length)) return // compare path
        pageId = router_config[pageId].default || pageId // if u have default page
        let url = location.protocol + '//' + location.host + '/#/' + pageId
        if (isReplace)
            history.replaceState({}, '', url)
        else
            history.pushState({}, '', url);
        if (sceneTransition) {
            await sceneTransition.doTransition(() => {
                window.dispatchEvent(new Event('popstate'))
            })
            sceneTransition.remove()
        } else
            window.dispatchEvent(new Event('popstate'))
    },
    /** 將路由按鈕包起來 apply routerView id */
    group(viewId, btns, nodeId) {
        btns.forEach(btn => {
            // auto add viewId, it can associate btn with specific router view
            router_config[btn.routerPageId].viewId = viewId
        })
        return node.div(nodeId).setChildren(btns)
    }
}

/** 路由切換時觸發 trigger function when switch router pageId  */
function popstate() {
    let pageId = location.href.split('/#/')[1] || Object.keys(router_config)[0]
    changeContent(pageId)
}
window.addEventListener('popstate', popstate)


/** 根據路由位址渲染指定區塊內容 render view by specific page id */
function changeContent(pageId) {
    // get pageId segements
    let seg = pageId.split('/')
    let segResult = ''
    let len = seg.length
    let pageIds = []
    for (let i = 0; i < len; i++) {
        segResult += '/' + seg.shift()
        pageIds.push(segResult)
    }
    pageIds = pageIds.map(pid => pid.slice(1))
    // update designated block by currentPageId
    let searchIndex = pageIds.indexOf(currentPageId)
    if (searchIndex == -1) searchIndex = 0
    node.pubsub.publish(GlobalEvent.SYSTEM_LEAVE_ROUTER_VIEW)
    for (let i = searchIndex; i < pageIds.length; i++) {
        let seg_pageId = pageIds[i]
        let t = router_config[seg_pageId].jsdom_tpl()
        if (i == 0) {
            let defId = router_config[seg_pageId].default
            node.app().setChildren([t])
            if (pageIds.length == 1 && defId) {
                let t2 = router_config[defId].jsdom_tpl()
                let vid = router_config[defId].viewId
                node.app().getChildById(vid).setChildren([t2])
            }
        } else {
            let vid = router_config[seg_pageId].viewId
            vid && node.app().getChildById(vid).setChildren([t])
        }
    }
    node.pubsub.publish(GlobalEvent.SYSTEM_JSDOM_READY)
}