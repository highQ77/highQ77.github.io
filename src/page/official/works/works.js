import { node } from "../../../core/node.js"
import { router } from "../../../core/router.js"

export function works() {

    // let primaryColor = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
    let primaryColor = `rgb(187, 253, 111)`

    // works list data
    let vmItemDatas = node.proxy(getData())
    let vmItemChillDatas = node.proxy(getChillData())

    // works list view
    let vmItemView = (item) => node.div().setClass('rwd-sm:width[100%] rwd-lg:width[50%]').setStyle({ display: 'inline-flex', padding: '5px', width: '50%' }).setChildren([
        node.div().setStyle({ background: '#00000055', padding: '20px', border: '1px solid transparent', width: '100%', transition: 'all .5s' }).setChildren([
            node.div().setStyle({ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }).setChildren([
                node.div().setChildren([
                    node.div().setStyle({ fontFamily: 'impact', fontSize: '1.5em' }).setChildren([
                        node.span().setText('❖ ').setStyle({ color: primaryColor }),
                        node.span().setText(item.title)
                    ]),
                    node.div().setStyle({ display: 'flex', alignItems: 'center', fontSize: '14px', marginTop: '10px' }).setChildren([
                        node.div().setText(item.desc).setStyle({ marginRight: '10px' }),
                        node.div().setText(item.commments).setStyle({ color: primaryColor }),
                    ]),
                ]),
                node.div().setChildren([
                    ...Object.keys(item.buttonlinks).map(k => node.div().setChildren([
                        node.button('', '',
                            {
                                border: '1px solid ' + primaryColor,
                                borderBottom: '2px solid gray',
                            },
                        ).setText(k).setStyle({ marginBottom: '5px', width: '100%' }).on('click', _ => {
                            if (item.buttonlinks[k]) {
                                if (item.buttonlinks[k].indexOf('http') == 0)
                                    window.open(item.buttonlinks[k], '_blank')
                                else {
                                    router.go(item.buttonlinks[k])
                                }
                            }
                        })
                    ]))
                ]),
            ]),
            node.hr().setStyle({ background: '#FFFFFF22', width: '100%', marginTop: '10px' })
        ]).on('mouseenter', (e, t) => {
            t.setStyle({ boxShadow: '0 0 150px ' + primaryColor, border: '1px solid ' + primaryColor })
        }).on('mouseleave', (e, t) => {
            t.setStyle({ boxShadow: '0 0 0 white', border: '1px solid transparent' })
        }),
    ])

    // image item
    let imgItem = (path) => {
        return node.divimg('', path).setStyle({ width: '90px', transition: 'width 1s', backgroundPosition: '50% 50%', filter: 'grayscale(1)' })
            .on('mouseenter', (e, t) => {
                t.setStyle({ width: '900px', filter: 'grayscale(0)' })
            }).on('mouseleave', (e, t) => {
                t.setStyle({ width: '90px', filter: 'grayscale(1)' })
            })
    }

    // jsdon - all page structure 
    let jsdom = node.div().setChildren([
        node.div().setStyle({ background: primaryColor, height: '5px' }),
        node.div().setStyle({ position: 'sticky', top: '0px', zIndex: '1000', backdropFilter: 'blur(5px)', background: '#33402299', color: primaryColor, padding: '5px 25px', margin: '10px 0px', fontSize: '14px' }).setText('News 2025/08/21 : 歡迎使用最新發表的 chill.js 開發網頁應用程式或是網頁遊戲'),
        node.div().setStyle({ padding: '20px' }).setChildren([
            node.div().setStyle({ margin: '0px 5px' }).setChildren([
                node.h1().setText('William77 x Works').setStyle({ fontFamily: 'impact', fontSize: '3em' }),
                node.div().setText('William77 個人作品涵蓋攝影、藝術、遊戲、網站、軟體、視覺'),
                node.hr().setStyle({ margin: '20px 0px', background: primaryColor }),
                node.div().setStyle({ display: 'flex' }).setChildren([
                    imgItem('official/works/1.png'),
                    imgItem('official/works/2.png'),
                    imgItem('official/works/3.png'),
                    imgItem('official/works/4.png'),
                    imgItem('official/works/5.png'),
                    imgItem('official/works/6.png'),
                    imgItem('official/works/7.png'),
                    imgItem('official/works/8.png'),
                    imgItem('official/works/9.png'),
                    imgItem('official/works/10.png'),
                    imgItem('official/works/11.png'),
                    imgItem('official/works/12.png'),
                    imgItem('official/works/a.png'),
                    imgItem('official/works/b.png'),
                    imgItem('official/works/c.png'),
                    imgItem('official/works/d.png'),
                ]),
                node.hr().setStyle({ margin: '20px 0px' }),
            ]),
            node.div().setText('▶︎ 以 chill.js 開發的專案').setStyle({ margin: '30px 5px' }),
            node.vm_list('', vmItemView, vmItemChillDatas),
            node.div().setText('▶︎ 過往作品').setStyle({ margin: '30px 5px' }),
            node.vm_list('', vmItemView, vmItemDatas),
        ])
    ])

    return jsdom

    function getChillData() {
        return [
            {
                title: 'Animation Tool',
                desc: '嘗試以 chill.js 設計一款動畫編輯軟體的介面 ( layout only )',
                commments: '2025/08/22',
                buttonlinks: {
                    'demo': 'anitool',
                }
            },
            {
                title: 'Pro Beat',
                desc: '嘗試以 chill.js 設計一款節奏 DJ 遊戲',
                commments: '2025/09/06',
                buttonlinks: {
                    'demo': 'probeat_home',
                }
            },
            {
                title: 'Gen Artist',
                desc: '嘗試以 chill.js 設計一款生成式藝術軟體',
                commments: '2025/09/06',
                buttonlinks: {
                    'demo': 'genart',
                }
            },
        ]
    }

    function getData() {
        return [
            {
                title: 'MyMD 🔥',
                desc: 'md 檔 editor 與 viewer',
                commments: '2025/10/12',
                buttonlinks: {
                    'github': 'https://github.com/highQ77/mymd',
                }
            },
            {
                title: 'CutKit 🔥',
                desc: '切版輔助工具 for 切版師',
                commments: '2025/09/29',
                buttonlinks: {
                    'github': 'https://github.com/highQ77/cutkit',
                    'demo': 'https://highq77.github.io/cutkit/output/',
                }
            },
            {
                title: 'Image Packker 🔥',
                desc: '圖集資源生成 for 網站與遊戲',
                commments: '2025/09/27',
                buttonlinks: {
                    'github': 'https://github.com/highQ77/image-packer/',
                    'demo': 'https://highq77.github.io/image-packer/',
                }
            },
            {
                title: 'UIUX Checker 🔥',
                desc: '建立 UI/UX 與前後端工程師溝通橋樑',
                commments: '2025/09/20',
                buttonlinks: {
                    'github': 'https://github.com/highQ77/uiux-checker/',
                    'demo': 'https://highq77.github.io/uiux-checker/',
                }
            },
            {
                title: 'Chill.js 🔥',
                desc: '超簡單 MVVM+JSDOM SPA 前端框架',
                commments: '2025/08/01',
                buttonlinks: {
                    'github': 'https://github.com/highQ77/highQ77.github.io',
                    'demo': 'chill',
                }
            },
            {
                title: 'Image Shield',
                desc: '圖片保護工具',
                commments: '2025/07/23',
                buttonlinks: {
                    'github': 'https://github.com/highQ77/image-shield/',
                    'demo': 'https://highq77.github.io/image-shield/',
                }
            },
            {
                title: 'Static Generative Art',
                desc: '靜態生成藝術',
                commments: '2025/07/20',
                buttonlinks: {
                    'github': 'https://github.com/highQ77/william77-paintings/',
                    'demo': 'https://highq77.github.io/william77-paintings/',
                }
            },
            {
                title: 'MASCOT',
                desc: '唯讀字串載體',
                commments: '2025/07/20',
                buttonlinks: {
                    'github': 'https://github.com/highQ77/mascot/',
                    'demo': 'https://highq77.github.io/mascot/',
                }
            },
            {
                title: 'Webpage Inspector',
                desc: '網頁檢視工具',
                commments: '2024/12/29',
                buttonlinks: {
                    'github': 'https://github.com/highQ77/web-inspector/',
                    'demo': 'https://highq77.github.io/web-inspector/',
                }
            },
            {
                title: 'ShaderToy Playground with ThreeJS',
                desc: 'ShaderToy 範例整合至 ThreeJS 測試',
                commments: '2024/12/09',
                buttonlinks: {
                    'github': 'https://github.com/highQ77/small-effect-toy/',
                    'demo': 'https://highq77.github.io/small-effect-toy/',
                }
            },
            {
                title: 'Chain.js 鏈式網頁建構 x Bootstrap5',
                desc: '透過鏈式方法建立網頁的 jsdom',
                commments: '2024/12/09 - 請改用 chill.js',
                buttonlinks: {
                    'github': 'https://github.com/highQ77/chain.js/',
                    'demo': 'https://highq77.github.io/chain.js-demo/',
                }
            },
            {
                title: 'Digital Art Creator Online / DACO',
                desc: '大口數位藝術圖像生成創作網站',
                commments: '尚未公開',
                buttonlinks: {
                    'github': 'https://github.com/highQ77/digital-art-creator-online/',
                    'demo': 'https://highq77.github.io/digital-art-creator-online/',
                }
            },
            {
                title: 'Artworks in Instagram',
                desc: '個人藝術創作',
                commments: '2024/12/09',
                buttonlinks: {
                    'demo': 'https://www.instagram.com/william77.ninja/',
                }
            },
            {
                title: 'Photography in Instagram',
                desc: '個人攝影創作',
                commments: '2024/12/09',
                buttonlinks: {
                    'demo': 'https://www.instagram.com/william77.fun/',
                }
            },
            {
                title: 'BMS Player',
                desc: '音樂遊戲 BMS 解析器、播放器',
                commments: '免費軟體',
                buttonlinks: {
                    'github': 'https://github.com/highQ77/music-game-bms-player/',
                    'demo': 'https://highq77.github.io/music-game-bms-player/',
                }
            },
            {
                title: 'Div Sprite Engine',
                desc: '非 canvas 的 h5 遊戲引擎框架',
                commments: '免費軟體',
                buttonlinks: {
                    'github': 'https://github.com/highQ77/div-sprite/',
                    'demo': 'https://highq77.github.io/div-sprite/',
                }
            },
            {
                title: 'Be-Tween.js',
                desc: '適用於 html element 的動畫系統',
                commments: '免費軟體',
                buttonlinks: {
                    'github': 'https://github.com/highQ77/be-tween.js/',
                    'demo': 'https://highq77.github.io/be-tween.js/',
                }
            },
            {
                title: 'New Open CSS Library',
                desc: '最小可用CSS庫，包含響應式、設計準則、實作元件範例、部落格頁面範例等',
                commments: '免費軟體',
                buttonlinks: {
                    'github': 'https://github.com/highQ77/open-css-library/',
                    'demo': 'https://highq77.github.io/open-css-library/',
                }
            },
            {
                title: 'ClassGen',
                desc: '適合遵循 uiux design guideline 進行 css 生成設定，如字級、間距、顏色等等',
                commments: '免費軟體',
                buttonlinks: {
                    'github': 'https://github.com/highQ77/classgen/',
                    'demo': 'https://highq77.github.io/classgen/',
                }
            },
            {
                title: 'Open Cute Framework',
                desc: 'React / Vue / Angular 以外的新選擇',
                commments: '免費軟體 - 請改用 chill.js',
                buttonlinks: {
                    'github': 'https://github.com/highQ77/open-cute-framework/',
                    'demo': 'https://highq77.github.io/open-cute-framework/',
                }
            },
            {
                title: 'New Accessibility Tool',
                desc: '無障礙工具的設計',
                commments: '免費軟體',
                buttonlinks: {
                    'github': 'https://github.com/highQ77/accessibility-tool',
                    'demo': 'https://highq77.github.io/accessibility-tool/',
                }
            },
            {
                title: 'Wireframe Pro',
                desc: '自製切版軟體',
                commments: '尚未開放原始碼',
                buttonlinks: {
                    'github': 'https://github.com/highQ77/page-wireframe-pro',
                    'demo': 'https://highq77.github.io/page-wireframe-pro/',
                }
            },
            {
                title: 'Calligraphy',
                desc: '書法藝術筆刷設計',
                commments: '免費軟體',
                buttonlinks: {
                    'github': 'https://github.com/highQ77/artwork-calligraphy',
                    'demo': 'https://highq77.github.io/artwork-calligraphy/',
                }
            },
            {
                title: 'Step by Step Tour Guide',
                desc: '軟體教學導覽功能',
                commments: '免費軟體',
                buttonlinks: {
                    'github': 'https://github.com/highQ77/step-by-step/',
                    'demo': 'https://highq77.github.io/step-by-step/',
                }
            },
            {
                title: 'Useful Tiny Utilities',
                desc: '整理個人過往實戰經驗使用的相關小工具設計',
                commments: '免費軟體',
                buttonlinks: {
                    'github': 'https://github.com/highQ77/useful-tiny-tools/',
                    'demo': 'https://highq77.github.io/useful-tiny-tools/',
                }
            },
        ]
    }
}

