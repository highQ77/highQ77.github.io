///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** 全域設定 zIndex settings */
export let zIndex = {
    sceneTransition: '1000',
    dialog: '999',
    popup: '101',
    menu: '100',
    scrollerbar: '10',
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** 全域設定 rwd settings */
export const rwdMap = {
    'xxl': 999999,
    'xl': 1920,
    'lg': 1440,
    'md': 1024,
    'sm': 768,
    'xs': 575,
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** 客製樣式設定 custom theme settings */
export let theme = {
    app: { background: '#222', color: '#DDD', height: '100dvh', overflow: 'auto', fontFamily: 'Arial' },
    hr: { border: 'none', height: '1px', background: '#333', margin: '0' },
    h1: { fontSize: '2em' },
    h2: { fontSize: '1.5em' },
    h3: { fontSize: '1.17em' },
    h4: { fontSize: '1em' },
    h5: { fontSize: '0.83em' },
    h6: { fontSize: '0.67em' },
    toggle: {
        toggleOnBGColor: 'rgb(187, 253, 111)',
        toggleOffBGColor: 'transparent',
        toggleBorder: '1px solid rgb(187, 253, 111)',
    },
    button: {
        default: {
            display: 'inline-flex',
            margin: '0 2px',
            padding: '5px',
            cursor: 'pointer',
            borderRadius: '3px',
            minWidth: '43px',
            justifyContent: 'center',
            outline: '1px solid #FFFFFF33',
            border: '1px solid transparent'
        },
        mouseenter: { background: '#555', color: 'white', borderBottom: '1px solid #333' },
        mouseleave: { background: '#333', color: 'white', borderBottom: '1px solid #666' },
        mousedown: { border: '1px solid rgb(187, 253, 111)', borderBottom: '1px solid #686868ff' },
        mouseup: { border: '1px solid rgb(187, 253, 111)', borderBottom: '1px solid #686868ff' },
        active: { borderBottom: '1px solid #686868ff', color: 'rgb(187, 253, 111)', borderRadius: '0' },
        unactive: { borderBottom: '1px solid transparent', color: 'white' },
        routerHover: { borderBottom: '1px solid rgb(187, 253, 111)' }
    },
    dialog: {
        backcover: { background: '#00000066' },
        title: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            background: '#000000AA',
            height: '33px',
            borderBottom: '1px solid #666',
        },
        body: {
            background: 'rgba(255,255,255,.3)',
            backdropFilter: 'blur(5px)',
            borderRadius: '5px',
            border: '3px solid #333333',
            outline: '5px solid black',
            overflow: 'hidden',
            boxShadow: '0 0 5px black'
        },
        bottomContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#FFFFFF88',
            padding: '5px',
        },
        btnGroup: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        }
    },
    date: {
        chWeek: { display: 'inline-flex', color: 'white' },
        enWeek: { display: 'inline-flex', color: 'white' },
        default: {
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            width: '46px',
            height: '25px',
            margin: '3px 5px',
            borderRadius: '4px',
        },
        cannottSelect: { color: 'rgba(255,255,255,.3)', border: '1px solid rgba(255,255,255,.3)', background: 'transparent' },
        selected: { color: 'black', border: '1px solid black', background: 'white' },
        notSelected: { color: 'white', border: '1px solid transparent', background: '#333333' },
        currentDateOutline: '1px solid rgb(187, 253, 111)',
        mouseenterOutline: '1px solid #AAA',
    },
    time: {
        background: '#CC9900CC',
        digiOutter: 'white',
        digiInner: '#663300',
        hh_mm_dn: { color: 'black' },
        decoBorder: '50px solid #000000AA',
    },
    scroller: {
        thumbColor: '#333333',
        trackColor: '#666666',
        barWidth: '7px',
        thumbWidth: '5px',
    },
    slider: {
        trackColor: 'rgb(187, 253, 111)',
        thumbColor: '#FFFFFF66',
        thumbOutlineColor: '#FFF',
        thumbInfo: { color: '#FFF', border: '.5px solid rgb(187, 253, 111)', padding: '5px', borderRadius: '3px' }
    },
    vm_select: {
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#222222',
            boxShadow: '0px 0px 2px #666',
            borderRadius: '8px',
            padding: '5px 10px',
            height: '32px',
        },
        selecedColor: 'rgb(187, 253, 111)',
        maxHeight: 250,
    },
    form: {
        default: { verticalAlign: 'top', outline: '0px solid white', caretColor: 'white', color: 'white', fontSize: '14px', width: '250px', background: '#333', border: '1px solid rgb(187, 253, 111)', borderRadius: '5px' },
        textinput: { height: '32px' },
        textarea: { height: '200px' },
        focusState: { boxShadow: '0 0 5px rgb(187, 253, 111)' },
        blurState: { boxShadow: '0 0 5px transparent' },
        selectItemDefault: { display: 'inline-flex', alignItems: 'center', cursor: 'pointer', minWidth: '100px' }, // checkbox or radio button
        selectItemShape: { margin: '5px', width: '12px', height: '12px', background: '#333', border: '1px solid black', outline: '1px solid rgb(187, 253, 111)', boxShadow: 'inset 0 0 5px #00000099' },
        selectItemText: { color: 'white' },
        selectItemSelectedColor: 'rgb(187, 253, 111)',
        selectItemNotSelectedColor: '#333',
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** 使用者定義事件名 */
const custom_event_list = {
    CUSTOM_CHANGE_NAV_BORDER_COLOR: 'custom_change_nav_border_color',
}

/** 系統相關事件集(請勿更動) system relate event list, please do not modify it */
const system_event_list = {
    /** 當頁面載入完畢，意指 jsdom 皆掛載 all jsdom mounted */
    SYSTEM_JSDOM_READY: 'system_jsdom_ready',
    /** 當路由路徑變更 triiger event when router path changed  */
    SYSTEM_LEAVE_ROUTER_VIEW: 'system_leave_router_view',
    /** 當縮放視窗 on window resize */
    SYSTEM_RESIZE_WINDOW: 'system_resize_window',

    /** 當滑鼠在全畫面移動 on mouse move in window */
    SYSTEM_MOUSE_MOVE: 'system_mouse_move',
    /** 當滑鼠離開視窗 on mouse leave window */
    SYSTEM_MOUSE_LEAVE: 'system_mouse_leave',
    /** 當滑鼠放開 on mouse up */
    SYSTEM_MOUSE_UP: 'system_mouse_up',

    /** 迴圈事件 loop event */
    SYSTEM_LOOP: 'system_loop',
}

/** 全域事件 global events */
export let GlobalEvent = {
    ...custom_event_list,
    ...system_event_list,
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ❤️ 新專案可清空 you can clear router_config in new project
// 欄位格式 field format: 'pageId': { page: your jsdom template, default: 'default sub router path' }

// ---- 請依需求請註解下方 ----

// chill website (可註解)
import { chill } from "../page/official/chill/chill.js"
import { demo } from "../page/official/chill/demo.js"
import { home } from "../page/official/chill/home.js"
import { mvvm } from "../page/official/chill/mvvm.js"
import { misc } from "../page/official/chill/misc.js"
import { ui } from "../page/official/chill/ui.js"
import { uipro } from "../page/official/chill/uipro.js"

// your website
import { yourapp } from "../page/yourapp/yourapp.js" // <--- add your own page

// official website (可註解)
import { anitool } from "../page/samples/anitool/anitool.js"
import { works } from "../page/official/works/works.js"
import { probeat_game } from "../page/samples/probeat/probeat_game.js"
import { probeat_home } from "../page/samples/probeat/probeat_home.js"
import { probeat_result } from "../page/samples/probeat/probeat_result.js"
import { genart } from "../page/samples/genart/genart.js"
import { genart_editor } from "../page/samples/genart/genart_editor.js"

export const router_config = {

    // works page
    'works': { jsdom_tpl: works },

    // genart
    'genart': { jsdom_tpl: genart },
    'genart_editor': { jsdom_tpl: genart_editor },

    // probeat
    'probeat_home': { jsdom_tpl: probeat_home },
    'probeat_game': { jsdom_tpl: probeat_game },
    'probeat_result': { jsdom_tpl: probeat_result },

    // official website (可註解)
    'chill': { jsdom_tpl: chill, default: 'chill/home' },
    'chill/home': { jsdom_tpl: home },
    'chill/demo': { jsdom_tpl: demo, default: 'chill/demo/mvvm' },
    'chill/demo/mvvm': { jsdom_tpl: mvvm },
    'chill/demo/ui': { jsdom_tpl: ui },
    'chill/demo/uipro': { jsdom_tpl: uipro },
    'chill/demo/misc': { jsdom_tpl: misc },

    // official animation tool (可註解)
    'anitool': { jsdom_tpl: anitool },

    // add your page here (依需要更名)
    'yourapp': { jsdom_tpl: yourapp }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// please follow rules, the data only store string / number / array / {}
// ❤️ 新專案可清空 you can clear config in new project
export const store_config = {
    chill: {
        home: {
            featureList: [
                {
                    title: '著重於 webapp / webgame / gitpage 快速開發',
                    desc: '本框架的重點不是在 SSR 渲染與 SEO 的建構，而是一個簡單強悍的 SPA 網頁應用程式開發框架 - 適用於網頁應用程式與網頁遊戲開發。好處是一個入口點，可以打造多個應用程式，很適合在 gitpage 發布作品。例如 http://xxx/#/app01, http://xxx/#/app02 代表兩個不同的應用程式，router 設定好即可',
                },
                {
                    title: '學習曲線低的可愛 🤪',
                    desc: '只要會基本的 html / css / js 的概念，就能開始進行開發。在開始專案前，不用急著把 src/page 下的資料夾清空，yourapp 是你的程式進入點，網址是 http://xxx/#/yourapp，可依需要更名：1. 將 src/page/yourapp 資料夾更名。 2. src/page/yourapp/yourapp.js 檔案更名。 3. src/core/config.js 找尋 router_config 設定即可',
                },
                {
                    title: '透過 MVVM 設計，簡化開發困難度',
                    desc: '使用 node.vm_list 生成 ViewModel 物件可以快速同步 model 與視圖的狀態，而只要你會陣列的操作方法即可，譬如 vmData.push, vmData[0] = 10 等等，其中 vmData 為 node.proxy([1,2,3]), view 為 (item)=>node.div().setText(item) 的方法',
                },
                {
                    title: '與傳統 html 差別在標籤生成全在 js 裡完成',
                    desc: '有別於 React 的 jsx 與 vue 的 template 標籤，jsdom 無需編譯即可執行，程式碼視覺排列也有結構，建議使用 vscode 的 format on save 功能自動排版',
                },
                {
                    title: '強大的可覆用模組設計方式',
                    desc: 'export const myModule = ()=>{ let jsdom = node.div().setText(`my module`); return jsdom }，此程式碼片段是一個簡單的模組設計，生成 div 標籤，且文字內容為 my module，模組可以置入在任意程式碼片段',
                },
                {
                    title: '元件模組程式碼易於解耦與分享',
                    desc: '模組的設計方式分為結構 ( jsdom )、樣式 ( inline style )、行為 ( js event binding )，jsdom 負責整體標籤結構，樣式部分分為兩種，一種是共享樣式 className ( node.div().setClass(`my-share-1 my-share-2`) )，一種是內聯樣式 ( node.div().setStyle({color:`white`}) )，若要做成可分享的模組，則建議共享樣式使用框架內的全域樣式，內聯樣式則為主要的採用方式，確保模組在不同專案可以順利執行；行為可以使用 node.div().on(`click`, _=> {...}) 綁定事件',
                },
                {
                    title: '程式碼不用編譯即可直接預覽',
                    desc: '假設您的專案是一個遊戲平台，平台內有 50 個遊戲的原始碼，若是採用 ts 開發，在編譯時可以明顯感受到編譯時間過長，尤其每次修改都要編譯一次，開發體驗不慎理想，這是必須了解的問題',
                },
                {
                    title: '不需要管生命週期',
                    desc: `在目前的框架設計上，並不需要管裡生命週期，僅有切換路由視圖 router view 在必要時，用 jsdom.onGlobalEvent (GlobalEvent.SYSTEM_JSDOM_READY, result => { ... } JSDOM 掛載完畢與 GlobalEvent.SYSTEM_LEAVE_ROUTER_VIEW, result => { ... }) router view 轉換來處理`,
                },
                {
                    title: '不同層級的元件溝通簡單，透過 pub / sub 機制處理',
                    desc: '本框架內有 node.pubsub 模組可以使用，在不同層級元件溝通時可以使用，而 pubsub 模組則可依需要手動用 node.pubsub.unsubscribe 進行取消訂閱，基本上 jsdom.onGlobalEvent 的機制也是使用 pubsub，而且以這種方式註冊的事件都會在 router view 切換時自動 unsubsribe',
                },
                {
                    title: 'node.xx().on 註冊的方法會在換頁時貼心自動釋放',
                    desc: '所有以 .on 或 .onGlobalEvent 註冊的事件在離開頁面 ( 切換路由視圖 router view ) 時都會自動清除，讓開發者可以開心註冊事件，而在 src/core/config.js 裡也可以自訂 global event',
                },
                {
                    title: 'node.xx API 提供基礎 ui 與常用函式',
                    desc: 'node 為主要核心功能提供者，主要有常用 html 標籤生成功能、常用函式集、View Model 物件、進階 UI 物件、表單物件等等',
                },
                {
                    title: 'pro.xx API 提供高級 ui 元件',
                    desc: '提供後台系統常用 UI 或是 web game UI',
                },
                {
                    title: 'router 設計簡單直覺無複雜設定',
                    desc: '請參考 config.js 的 router_config 物件。僅需要設置 router 路徑與 jsdom 模板即可',
                },
                {
                    title: 'store 用於管理全域資料，且畫面切換資料不會消失',
                    desc: '請參考 config.js 的 store_config 物件',
                },
                {
                    title: 'config.js 可以直接調整所有 node.xx()下的 ui 樣式',
                    desc: '客製樣式設定 custom theme settings 部分可以讓你調整所有框架內預設的 ui 樣式，大幅縮減開發時間',
                },
                {
                    title: '可以整合 tailwind 與其他 css 框架，但非必要',
                    desc: '本框架為了讓程式碼做到可攜與解耦，核心設計是用內聯樣式 inline style，實際上框架已提供完整的 css 處理的功能，但可依需求採用你熟悉的 css 框架進行開發',
                },
                {
                    title: '支援所有 css 的 rwd 設置',
                    desc: '透過 node.setClass(`rwd-xs:width![calc(100% / 5)]`) 讓元件寬度設置為 20%，其中 rwd- 為前綴字代表屬性為 rwd 的屬性，xs 為 level 層級包含 xs、sm、md、lg、xl、xxl，width! 表示寬度屬性且為 !important',  // 採用 js 實現
                },
                {
                    title: '可使用 webpack 壓縮與混淆程式碼',
                    desc: '程式碼可採用 webpack 輸出 production code',
                },
            ]
        },
        demo: {
            navbar: { borderBottom: `1px solid transparent` }
        }
    },
    samples: {
        probeat: {
            isAutoPlay: true,
            score: {
                miss: 0,
                bad: 0,
                good: 0,
                great: 0,
                best: 0
            }
        }
    }
}