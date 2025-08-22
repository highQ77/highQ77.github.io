import { node } from "./node.js"

/** 
 * 🟢 分頁元件 vm_pager
 * @param {*} nodeId 使用者定義 nodeId 名稱 user defined Id
 * @param {*} jsdom_tpl jsdom 方法模板 jsdom function template
 * @param {*} proxy_data 使用 proxy 方法產生的資料集 proxy data by using node.proxy function
 * @param {*} itemCountPerPage 每個分頁的展示數量 the count of items per page
 */
function vm_pager(nodeId, jsdom_tpl, proxyData, itemCountPerPage = 5) {

    let theme = {
        vm_pager: {
            background: { background: '#222', padding: '5px', borderRadius: '5px', padding: '10px' },
            pageNumberButtonSelected: 'rgb(187, 253, 111)',
        }
    }

    node.appendClasses({
        '.pager-number-before::before': { content: `'...'` },
        '.pager-number-after::after': { content: `'...'` }
    })

    let vmList = node.vm_list('', jsdom_tpl, proxyData)
    let currentPage = 1
    let totalPages = Math.ceil(proxyData.length / itemCountPerPage)

    let setPage = (idx) => {
        if (idx < 1) idx = 1
        if (idx > totalPages) idx = totalPages
        currentPage = idx

        // show hide control
        let startIndex = (currentPage - 1) * itemCountPerPage
        let endIndex = startIndex + itemCountPerPage - 1
        vmList.getChildren().forEach((item, idx) => {
            if (idx >= startIndex && idx <= endIndex) {
                item.setStyle({ display: 'block' })
            } else {
                item.setStyle({ display: 'none' })
            }
        })
        // update info
        info.setText(' ' + currentPage + ' / ' + totalPages + ' - ' + itemCountPerPage + ' rows per page')

        // num buttons update
        numButtons.forEach((b, idx) => {
            if (numButtons.length > 9) {
                b.setClass('')
                b.setStyle({ display: 'none' })
                if (idx < 3) {
                    if (idx == 2) b.setClass('pager-number-after')
                    b.setStyle({ display: 'inline-flex' })
                }
                if (idx > numButtons.length - 4) {
                    if (idx == numButtons.length - 3) b.setClass('pager-number-before')
                    b.setStyle({ display: 'inline-flex' })
                }
                if (idx > currentPage - 3 && idx < currentPage + 1) {
                    b.setStyle({ display: 'inline-flex' })
                }
                let afterIndex = numButtons.findIndex(b => b.getClass() == 'pager-number-after')
                let beforeIndex = numButtons.findIndex(b => b.getClass() == 'pager-number-before')
                let between = numButtons.filter((b, idx) => idx > afterIndex && idx < beforeIndex && b.getHtmlTag().style.display == 'inline-flex')
                if (between.length < 3) {
                    if (currentPage < 5) {
                        Array(3).fill(0).forEach((i, idx) => numButtons[idx + afterIndex + 1].setStyle({ display: 'inline-flex' }))
                    } else if (currentPage > numButtons.length - 5) {
                        Array(3).fill(0).forEach((i, idx) => numButtons[beforeIndex - (3 - idx)].setStyle({ display: 'inline-flex' }))
                    }
                }
            }
            b.getChildren()[0].setStyle({ outline: '1px solid #333' })
        })
        numButtons[currentPage - 1].getChildren()[0].setStyle({ outline: '1px solid ' + theme.vm_pager.pageNumberButtonSelected })
    }

    // center num buttons
    let numButtons = Array(totalPages).fill(0).map((i, idx) => node.div().setStyle({ display: 'inline-flex', alignItems: 'center' }).setChildren([node.button().setText(idx + 1).on('click', (e, t) => setPage(idx + 1))]))

    // pager jsdom
    let jsdom = node.div(nodeId ? nodeId : '')
    let id = jsdom.getNodeId()

    // ui buttons
    jsdom.setChildren([
        vmList,
        node.hr().setStyle({ margin: '5px 0 15px 0' }),
        node.div().setStyle({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }).setChildren([
            node.div().setChildren([
                node.button().setText('<<').on('click', _ => setPage(1)),
                node.button().setText('<').on('click', _ => setPage(currentPage - 1)),
                ...numButtons,
                node.button().setText('>').on('click', _ => setPage(currentPage + 1)),
                node.button().setText('>>').on('click', _ => setPage(totalPages)),
            ]),
            node.div(id + '__info'),
        ]),
    ]).setStyle(theme.vm_pager.background)

    let info = jsdom.getChildById(id + '__info')

    // init page
    requestAnimationFrame(() => {
        // default page set
        setPage(1)
        // height set
        vmList.setStyle({ height: vmList.getHtmlTag().getBoundingClientRect().height + 'px' })
    })

    return jsdom
}

/** 
 * 🟢 banner 輪播器 carousel
 * @param {*} nodeId 使用者定義 nodeId 名稱 user defined Id
 * @param {*} pageNodes 存放多個 jsdom 節點 
 */
function carousel(nodeId, pageNodes = []) {

    // skin
    let theme = {
        carousel: {
            default: { width: '100%', height: '300px' },
            indicatorColor: 'rgb(187, 253, 111)',
            pagerColor: '#FFFFFF33',
            uiIndex: '5',
        }
    }

    // default page nodes style
    pageNodes.forEach((node, idx, arr) => node.setStyle({ position: 'absolute', left: idx ? '-100%' : '0px', top: '0px', transition: 'all 1s', zIndex: (arr.length - idx) + '' }))

    // state
    let currentIndex = 0
    let pageTotal = pageNodes.length

    // carousel jsdom
    let jsdom = node.div(nodeId ? nodeId : '')
    let id = jsdom.getNodeId()

    jsdom.setStyle({ position: 'relative', overflow: 'hidden' }).setChildren([
        node.div().setStyle({ ...theme.carousel.default, display: 'flex', position: 'absolute', top: '0px', left: '0px', width: '100%' }).setChildren(pageNodes),
        node.div(id + '__trianglePager').setStyle({ ...theme.carousel.default, display: 'inline-flex', position: 'relative', transition: 'all .5s', zIndex: theme.carousel.uiIndex }).setChildren([
            node.div().setClass('stop-select').setStyle({ position: 'absolute', left: '0px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontSize: '60px', color: '#FFFFFF66', background: '#00000033', cursor: 'pointer' }).setChildren([
                node.div().setText('◃')
            ]).on('click', () => {

                let oldIdx = currentIndex
                currentIndex--
                if (currentIndex < 0) currentIndex = pageTotal - 1
                indicatorGroup.getChildren()[currentIndex].dispatch('click')
                // animation
                pageNodes[oldIdx].setStyle({ left: '-100%' })
                pageNodes[currentIndex].setStyle({ transition: 'all 0s' })
                pageNodes[currentIndex].setStyle({ left: '100%' })
                requestAnimationFrame(() => {
                    pageNodes[currentIndex].setStyle({ transition: 'all .5s' })
                    pageNodes[currentIndex].setStyle({ left: '0%' })
                })
                pageNum.setText((currentIndex + 1) + ' / ' + pageTotal)
                indicatorGroup.getChildren()[currentIndex].dispatch('click')

            }),
            node.div().setClass('stop-select').setStyle({ position: 'absolute', right: '0px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontSize: '60px', color: '#FFFFFF66', background: '#00000033', cursor: 'pointer' }).setChildren([
                node.div().setText('◃').setStyle({ transform: 'scale(-1, 1)' })
            ]).on('click', () => {

                let oldIdx = currentIndex
                currentIndex++
                if (currentIndex > pageTotal - 1) currentIndex = 0
                indicatorGroup.getChildren()[currentIndex].dispatch('click')
                // animation
                pageNodes[oldIdx].setStyle({ left: '100%' })
                pageNodes[currentIndex].setStyle({ transition: 'all 0s' })
                pageNodes[currentIndex].setStyle({ left: '-100%' })
                requestAnimationFrame(() => {
                    pageNodes[currentIndex].setStyle({ transition: 'all .5s' })
                    pageNodes[currentIndex].setStyle({ left: '0%' })
                })
                pageNum.setText((currentIndex + 1) + ' / ' + pageTotal)
                indicatorGroup.getChildren()[currentIndex].dispatch('click')
            }),
        ]),
        node.div(id + '__indicatorGroup').setStyle({ position: 'absolute', bottom: '10px', display: 'flex', justifyContent: 'center', width: '100%', gap: '10px', zIndex: theme.carousel.uiIndex }).setChildren(
            Array(pageTotal).fill(0).map((_, idx) =>
                node.div().setStyle({ display: 'flex', alignItems: 'center', height: '20px', cursor: 'pointer' }).setChildren([
                    node.div().setStyle({ transition: 'all .2s', width: '20px', height: '3px', background: '#FFFFFF66', borderRadius: '3px' })
                ]).on('click', (e, t) => {

                    let oldIdx = currentIndex
                    currentIndex = idx

                    t.getParent().getChildren().forEach(c => c.getChildren()[0].setStyle({ background: '#FFFFFF66', width: '20px' }))
                    t.getChildren()[0].setStyle({ background: theme.carousel.indicatorColor, width: '70px' })

                    pageNum.setText((idx + 1) + ' / ' + pageTotal)

                    if (oldIdx < currentIndex) {
                        pageNodes[oldIdx].setStyle({ left: '-100%' })
                        pageNodes[currentIndex].setStyle({ transition: 'all 0s' })
                        pageNodes[currentIndex].setStyle({ left: '100%' })
                    } else if (oldIdx > currentIndex) {
                        pageNodes[oldIdx].setStyle({ left: '100%' })
                        pageNodes[currentIndex].setStyle({ transition: 'all 0s' })
                        pageNodes[currentIndex].setStyle({ left: '-100%' })
                    }
                    requestAnimationFrame(() => {
                        pageNodes[currentIndex].setStyle({ transition: 'all 1s' })
                        pageNodes[currentIndex].setStyle({ left: '0%' })
                    })
                })
            )
        ),
        node.div().setStyle({ position: 'absolute', bottom: '30px', display: 'flex', justifyContent: 'center', width: '100%', pointerEvents: 'none', zIndex: theme.carousel.uiIndex }).setChildren([
            node.div(id + '__pageNum').setText('Carousel').setStyle({ color: theme.carousel.pagerColor })
        ])
    ])

    // auto slide 
    jsdom.on('mouseenter', () => {
        trianglePager.setStyle({ opacity: '1' })
        clearInterval(tid)
    }).on('mouseleave', () => {
        trianglePager.setStyle({ opacity: '0' })
        clearInterval(tid)
        tid = setInterval(() => {
            trianglePager.getChildren()[1].dispatch('click')
        }, 3000)
    })
    let tid = setInterval(() => {
        trianglePager.getChildren()[1].dispatch('click')
    }, 3000)

    // get child
    let pageNum = jsdom.getChildById(id + '__pageNum')

    let indicatorGroup = jsdom.getChildById(id + '__indicatorGroup')
    indicatorGroup.getChildren()[currentIndex]?.dispatch('click')

    let trianglePager = jsdom.getChildById(id + '__trianglePager')
    trianglePager.setStyle({ opacity: '0' })

    // observe dom status
    const observer = new MutationObserver((mutation) => {
        if (!document.body.contains(jsdom.getHtmlTag())) {
            observer.disconnect()
            clearInterval(tid)
        }
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return jsdom
}


/** 
 * 🟢 對話框系統 dialogue system
 * @param {*} nodeId 使用者定義 nodeId 名稱 user defined Id
 * @param {*} onInitCallback 回傳播放函式 pass runSchedule function
 * @param {*} onFinishCallback 播放結束觸發 trigger callback function when finish the schedule
 */
function dialogue(nodeId, onInitCallback, onFinishCallback) {

    let theme = {
        dialogue: {
            letterSpacing: '5px'
        }
    }

    // dialogue jsdom
    let jsdom = node.div(nodeId ? nodeId : '')
    let id = jsdom.getNodeId()

    async function runSchedule(schedule) {

        let cmds = schedule.split(';').map(i => i.trim()).filter(i => i)
        let result = []

        // cmd parser
        cmds.forEach(cmdStr => {
            let segs = cmdStr.split(':')
            let cmd = segs[0].trim()
            let propsStart = segs[1].indexOf('[')
            let propsEnd = segs[1].indexOf(']')
            let propsStr = segs[1].slice(propsStart + 1, propsEnd)
            let reg = propsStr.match(/\(.+\)/)
            reg?.forEach(s => propsStr = propsStr.replace(s, s.replace(/,/ig, '@')))
            let props = propsStr.split(',').map(i => i.trim()).filter(i => i).map(i => i.replace(/@/ig, ','))
            result.push({ cmd, props })
        })

        // cmd switch
        for (let i = 0; i < result.length; i++) {
            let script = result[i]
            switch (script.cmd) {
                case 'text': await doTextAni(...script.props); break
                case 'shake': await doShakeAni(...script.props); break
                case 'delay': await doDelayAni(...script.props); break
            }
        }

        // finish schedule
        onFinishCallback && onFinishCallback()

        return

        async function doTextAni(speed, color, text) {
            let chars = text.split('')
            while (chars.length) {
                let char = chars.shift()
                displayText.setText(displayText.getText() + `<span style='color:${color}'>${char == ' ' ? '&nbsp;' : char}</span>`)
                await sleep(speed)
            }
        }

        async function doShakeAni(speed, power, times = '1') {
            let n = node.app().getChildren()[0]
            times = parseInt(times)
            n.setStyle({ transition: `transform ${speed / 1000}s` })
            while (times) {
                n.setStyle({ transform: `translate(${-power}px,${-power}px)` })
                await sleep(speed)
                n.setStyle({ transform: `translate(${power}px,${-power}px)` })
                await sleep(speed)
                n.setStyle({ transform: `translate(${-power}px,${power}px)` })
                await sleep(speed)
                n.setStyle({ transform: `translate(${power}px,${power}px)` })
                await sleep(speed)
                n.setStyle({ transform: `translate(${0}px,${0}px)` })
                times--
            }
        }

        async function doDelayAni(speed) {
            sleep(speed)
        }

        function sleep(time) {
            return new Promise(r => setTimeout(r, time))
        }
    }

    jsdom.setChildren([
        node.div('displayText').setStyle({ display: 'flex', alignItems: 'center', letterSpacing: theme.dialogue.letterSpacing, flexWrap: 'wrap' })
    ])

    let displayText = jsdom.getChildById('displayText')

    onInitCallback && onInitCallback(runSchedule)

    return jsdom
}

/** 簡易 API 操作入口 an easy API entry */
export const pro = {
    vm_pager,
    carousel,
    dialogue,
}