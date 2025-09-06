import { GlobalEvent } from "../../../core/config.js"
import { node } from "../../../core/node.js"
import { store } from "../../../core/store.js"

// Store & Pub/Sub & Router
// doc 如何開新專案

export function misc() {

    // page jsdom
    const jsdom = node.div().setStyle({ marginBottom: '50px' }).setChildren([
        node.h2().setText('Misc'),
        node.div().setText('全域資料存取與不同層級元件溝通方法')
            .setStyle({ margin: '20px 0', color: '#CCC', background: '#000', padding: '5px', border: '1px solid #666' }),
        node.hr().setStyle({ margin: '20px 0' }),

        // store
        node.h4().setText('👽 Store').setStyle({ color: 'rgb(187, 253, 111)' }),
        node.div().setChildren([
            node.div().setText('請點擊按鈕並嘗試切換 Home / Demo 分頁觀察，router view 在切換時會清空資料，所以若有設計需求可以將資料存在 store 確保資料不會遺失').setStyle({ margin: '20px 0' }),
            node.button().setText('Set Border Color - no store').on('click', () => {
                node.getPageNodeById('demoRouter').setStyle({
                    borderBottom: '1px solid #660000'
                })
            }),
            node.button().setText('Set Border Color - keep state with store').on('click', () => {
                node.color(c => node.pubsub.publish(GlobalEvent.CUSTOM_CHANGE_NAV_BORDER_COLOR, c))
            }),
        ]),
        node.div().setStyle({ marginTop: '50px' }).setChildren([
            node.div().setText('若離開網站仍需要儲存資料在本機，可以使用 store.saveStore() 將所有 store 資料存下來 / store.clearStore() 將記憶資料移除').setStyle({ margin: '20px 0' }),
            node.button().setText('Save').on('click', () => {
                store.saveStore()
                node.alert('all store datas saved into local storage', () => { })
            }),
            node.button().setText('Clear').on('click', () => {
                store.clearStore()
                node.alert('all store datas cleared', () => { })
            }),
        ]),
        node.hr().setStyle({ margin: '20px 0' }),

        // router
        node.h4().setText('👽 Router').setStyle({ color: 'rgb(187, 253, 111)' }),
        node.div().setChildren([
            node.div().setText('router 配置中，有一個 default 參數，在路徑 chill 下有 chill/home 與 chill/demo 可以設置預設顯示頁面').setStyle({ margin: '20px 0' }),
            node.div().setText(`'chill': { jsdom_tpl: chill, default: 'chill/home' },`),
            node.div().setText(`'chill/home': { jsdom_tpl: home },`),
            node.div().setText(`'chill/demo': { jsdom_tpl: demo },`),
        ]),
        node.hr().setStyle({ margin: '20px 0' }),

    ])

    return jsdom
}