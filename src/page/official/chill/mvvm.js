import { node } from "../../../core/node.js"

export function mvvm() {

    // view and data for VMSingleBase
    const single_view = item => node.div().setText(item).setStyle({ border: '1px solid #AA9900', padding: '3px', marginBottom: '5px' })
    const single_view2 = item => node.div().setText(item).setStyle({ border: '1px solid #cc7700ff', padding: '3px', marginBottom: '5px' })
    const single_model = node.proxy([])

    // view and data for VMListBase
    const list_view = item => node.div().setText(item).setStyle({ border: '1px dashed #82ec5188', padding: '3px', marginBottom: '5px' })
    const list_view2 = item => node.div().setText(item).setStyle({ border: '1px dashed #518aec88', padding: '3px', marginBottom: '5px', width: 'calc(100% / 5 - 10px)', minWidth: '200px' })
    const test_model = node.proxy([])

    // jsdoms
    const jsdom = node.div().setChildren([
        node.h2().setText('MVVM'),
        node.div().setText('透過 MVVM 設計的機制，讓您方便設計強健的應用程式，採用 Model Operation，可以快速讓資料與介面進行同步更新').setStyle({ margin: '20px 0', color: '#CCC', background: '#000', padding: '5px', border: '1px solid #666' }),
        node.hr().setStyle({ margin: '20px 0' }),
        node.h4().setText('👽 A. 單一物件，相同資料不同視圖 single object, same data, different views').setStyle({ color: 'rgb(187, 253, 111)' }),
        node.div().setChildren([
            node.div().setText('method 1 - VMSingleBase - VM Object Operation').setStyle({ margin: '20px 0' }),
            node.vm_single('vms', single_view, single_model),
            node.button().setText('Set').on('click', _ => vms.setData('set:' + Date.now())),
            node.button().setText('Remove').on('click', _ => vms.removeData()),
        ]),
        node.div().setChildren([
            node.div().setText('method 2 - VMSingleBase - Model Operation').setStyle({ margin: '20px 0' }),
            node.vm_single('vms2', single_view2, single_model),
            node.button().setText('Set').on('click', _ => single_model[0] = 'set:' + Date.now()),
            node.button().setText('Remove').on('click', _ => single_model.length = 0),
        ]),
        node.hr().setStyle({ margin: '20px 0' }),
        node.h4().setText('👽 B. 列表物件，相同資料不同視圖 list object, same data, different views').setStyle({ color: 'rgb(187, 253, 111)' }),
        node.div().setChildren([
            node.div().setText('method 1 - VMListBase - VM Object Operation').setStyle({ margin: '20px 0' }),
            node.vm_list('vm', list_view, test_model),
            node.button().setText('Push').on('click', _ => vm.pushChild('push:' + Date.now())),
            node.button().setText('Pop').on('click', _ => vm.popChild()),
            node.button().setText('Shift').on('click', _ => vm.shiftChild()),
            node.button().setText('Unshift').on('click', _ => vm.unshiftChild('unshhift:' + Date.now())),
            node.button().setText('AddAt1').on('click', _ => vm.addChildAt('addAt:' + Date.now(), 1)),
            node.button().setText('RemoveAt1').on('click', _ => vm.removeChildAt(1)),
            node.button().setText('ReplaceAt1').on('click', _ => vm.replaceChildAt('replaceAt:' + Date.now(), 1)),
            node.button().setText('Reverse').on('click', _ => vm.reverseChildren()),
            node.button().setText('Sort').on('click', _ => vm.sortChildren((a, b) => b.value - a.value)),
            node.button().setText('Clear').on('click', _ => vm.removeChildren()),
            node.button().setText('Fetch').on('click', _ => fakeFetch('https://localhost/api', test_model, true)),
        ]),
        node.div().setChildren([
            node.div().setText('method 2 - VMListBase - Model Operation').setStyle({ margin: '20px 0' }),
            node.vm_list('vm2', list_view2, test_model).setStyle({ display: 'flex', flexWrap: 'wrap' }),
            node.button().setText('Push').on('click', _ => test_model.push('push:' + Date.now())),
            node.button().setText('Pop').on('click', _ => test_model.pop()),
            node.button().setText('Shift').on('click', _ => test_model.shift()),
            node.button().setText('Unshift').on('click', _ => test_model.unshift('unshhift:' + Date.now())),
            node.button().setText('AddAt1').on('click', _ => test_model.splice(1, 0, 'addAt:' + Date.now())),
            node.button().setText('RemoveAt1').on('click', _ => test_model.splice(1, 1)),
            node.button().setText('ReplaceAt1').on('click', _ => test_model[1] = 'replaceAt:' + Date.now()),
            node.button().setText('Reverse').on('click', _ => test_model.reverse()),
            node.button().setText('Sort').on('click', _ => test_model.sort((a, b) => b.value - a.value)),
            node.button().setText('Clear').on('click', _ => test_model.length = 0),
        ]),
    ])

    let vms = jsdom.getChildById('vms')
    let vm = jsdom.getChildById('vm')

    return jsdom
}

// 測試用，建議使用其他專門的 ajax 套件，如 axios
function fakeFetch(url, proxyData, isAppend) { // mode - append or replace
    if (url == 'https://localhost/api') {
        let data = [1, 2, 3]
        setTimeout(() => {
            if (!isAppend)
                proxyData.length = 0
            while (data.length)
                proxyData.push(data.shift())
        }, 200)
    }
}