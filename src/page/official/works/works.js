import { node } from "../../../core/node.js"
import { router } from "../../../core/router.js"

export function works() {

    injectWorksStyle()

    const chillData = getChillData()
    const pastData = getData()

    // works list data
    let vmItemDatas = node.proxy(pastData.slice())
    let vmItemChillDatas = node.proxy(chillData.slice())

    const openLink = (link) => {
        if (!link) return
        if (link.indexOf('http') == 0) window.open(link, '_blank')
        else router.go(link)
    }

    // works list view
    let vmItemView = (item) => {
        const card = node.div().setClass('w77-card').setChildren([
            node.div().setClass('w77-card-body').setChildren([
                node.div().setClass('w77-card-title').setText(item.title),
                node.div().setClass('w77-card-desc').setText(item.desc),
            ]),
            node.div().setClass('w77-card-foot').setChildren([
                node.div().setClass('w77-chip').setText(item.commments),
                node.div().setClass('w77-actions').setChildren(
                    Object.keys(item.buttonlinks).sort((a, b) => {
                        const order = { github: 0, demo: 1 }
                        return (order[a] ?? 2) - (order[b] ?? 2)
                    }).map(k => {
                        const btn = node.div().setClass('w77-btn' + (k == 'demo' ? ' is-primary' : ''))
                            .setText(k == 'demo' ? 'Demo ↗' : k == 'github' ? 'GitHub' : k)
                            .on('click', e => { e.stopPropagation(); openLink(item.buttonlinks[k]) })
                        const tag = btn.getHtmlTag()
                        tag.setAttribute('role', 'link')
                        tag.setAttribute('tabindex', '0')
                        tag.addEventListener('keydown', e => { if (e.key == 'Enter' || e.key == ' ') { e.preventDefault(); openLink(item.buttonlinks[k]) } })
                        return btn
                    })
                ),
            ]),
        ]).on('mousemove', (e, t) => {
            const r = t.getHtmlTag().getBoundingClientRect()
            t.getHtmlTag().style.setProperty('--mx', (e.clientX - r.left) + 'px')
            t.getHtmlTag().style.setProperty('--my', (e.clientY - r.top) + 'px')
        })
        return card
    }

    // gallery image item
    let imgItem = (path) => node.divimg('', path).setClass('w77-shot').setStyle({ width: 'auto', height: '100%', backgroundPosition: '50% 50%' })

    const sectionHead = (label, en, count) => node.div().setClass('w77-section-head').setChildren([
        node.div().setClass('w77-section-title').setChildren([
            node.span().setClass('w77-section-en').setText(en),
            node.span().setText(label),
        ]),
        node.div().setClass('w77-count').setText(String(count).padStart(2, '0') + ' items'),
    ])

    const shots = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'a', 'b', 'c', 'd']

    // jsdom - all page structure
    let jsdom = node.div().setClass('w77').setChildren([
        node.div().setClass('w77-topline'),
        node.div().setClass('w77-news').setChildren([
            node.span().setClass('w77-news-badge').setText('NEWS'),
            node.span().setClass('w77-news-text').setText('2025/08/21 · 歡迎光臨 William77 x Works 作品集，這裡收錄了我過往的作品與專案。'),
        ]),
        node.div().setClass('w77-wrap').setChildren([
            node.div().setClass('w77-hero').setChildren([
                node.div().setClass('w77-eyebrow').setText('Portfolio · Since 2024'),
                node.h1().setClass('w77-title').setStyle({ fontSize: '' }).setText('William77 x Works'),
                node.div().setClass('w77-lead').setText('William77 個人作品涵蓋攝影、藝術、遊戲、網站、軟體、視覺'),
                node.div().setClass('w77-meta').setChildren([
                    node.span().setText('Threads'),
                    node.span().setClass('w77-meta-link').setText('@william77.fun')
                        .on('click', _ => window.open('https://www.threads.net/@william77.fun', '_blank')),
                ]),
            ]),
            node.div().setClass('w77-gallery').setChildren(shots.map(n => imgItem('official/works/' + n + '.png'))),
            sectionHead('新進行的專案', 'Latest', chillData.length),
            node.vm_list('', vmItemView, vmItemChillDatas).setClass('w77-grid'),
            sectionHead('過往作品', 'Archive', pastData.length),
            node.vm_list('', vmItemView, vmItemDatas).setClass('w77-grid'),
            node.div().setClass('w77-footer').setText('© William77 · Built with chill.js'),
        ])
    ])

    return jsdom

    function injectWorksStyle() {
        if (document.getElementById('w77-works-style')) return
        const font = document.createElement('link')
        font.rel = 'stylesheet'
        font.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Noto+Sans+TC:wght@400;500;700&display=swap'
        document.head.appendChild(font)
        const style = document.createElement('style')
        style.id = 'w77-works-style'
        style.textContent = `
.w77 {
    --accent: rgb(187, 253, 111);
    --accent-rgb: 187, 253, 111;
    --bg: #1c2119;
    --surface: rgba(255,255,255,.07);
    --surface-hover: rgba(255,255,255,.11);
    --line: rgba(255,255,255,.14);
    --text: #F6F8F3;
    --muted: #B4BCB0;
    position: relative; min-height: 100%;
    background: var(--bg); color: var(--text);
    font-family: 'Noto Sans TC', -apple-system, 'PingFang TC', Arial, sans-serif;
    -webkit-font-smoothing: antialiased; isolation: isolate; overflow-x: clip;
}
.w77::before {
    content: ''; position: fixed; inset: 0; z-index: -1; pointer-events: none;
    background:
        radial-gradient(900px 500px at 85% -10%, rgba(var(--accent-rgb), .2), transparent 60%),
        radial-gradient(700px 500px at -10% 30%, rgba(90, 140, 255, .14), transparent 60%),
        linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px) 0 0 / 48px 48px,
        linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px) 0 0 / 48px 48px;
    -webkit-mask-image: linear-gradient(to bottom, #000 0%, rgba(0,0,0,.35) 70%);
            mask-image: linear-gradient(to bottom, #000 0%, rgba(0,0,0,.35) 70%);
}
.w77-topline { height: 3px; background: linear-gradient(90deg, transparent, var(--accent) 30%, #6fe3fd 70%, transparent); }
.w77-news {
    position: sticky; top: 0; z-index: 1000;
    display: flex; align-items: center; gap: 12px;
    padding: 10px 32px; font-size: 13px; color: var(--muted);
    background: rgba(28,33,25,.75);
    -webkit-backdrop-filter: blur(14px) saturate(140%); backdrop-filter: blur(14px) saturate(140%);
    border-bottom: 1px solid var(--line);
}
.w77-news-badge {
    flex: none; font: 700 10px/1 'Space Grotesk', sans-serif; letter-spacing: .14em;
    color: #0d0f0c; background: var(--accent); padding: 5px 8px; border-radius: 999px;
}
.w77-news-text { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.w77-wrap { max-width: 1320px; margin: 0 auto; padding: 0 32px 64px; }

.w77-hero { padding: 72px 0 40px; }
.w77-eyebrow {
    font: 500 12px/1 'Space Grotesk', sans-serif; letter-spacing: .22em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 18px; display: flex; align-items: center; gap: 10px;
}
.w77-eyebrow::before { content: ''; width: 28px; height: 1px; background: var(--accent); }
.w77-title {
    margin: 0; font: 700 clamp(44px, 7.5vw, 96px)/.95 'Space Grotesk', sans-serif; letter-spacing: -.035em;
    background: linear-gradient(180deg, #fff 30%, #c9d1c3 120%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
}
.w77-lead { margin-top: 22px; font-size: 17px; line-height: 1.7; color: #DCE1D8; max-width: 640px; }
.w77-meta { margin-top: 14px; display: flex; gap: 8px; font-size: 13px; color: var(--muted); }
.w77-meta-link { color: var(--text); cursor: pointer; border-bottom: 1px solid rgba(var(--accent-rgb), .5); transition: color .2s; }
.w77-meta-link:hover { color: var(--accent); }

.w77-gallery {
    display: flex; gap: 6px; height: 320px; margin: 8px 0 24px;
    padding: 6px; border-radius: 18px; background: var(--surface); border: 1px solid var(--line);
}
.w77-shot {
    flex: 1 1 0; min-width: 0; border-radius: 12px; cursor: zoom-in;
    filter: grayscale(.6) brightness(.95);
    transition: flex-grow .8s cubic-bezier(.22,1,.36,1), filter .5s ease;
}
.w77-shot:hover { flex-grow: 14; filter: grayscale(0) brightness(1); }

.w77-section-head {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin: 64px 0 20px; padding-bottom: 14px; border-bottom: 1px solid var(--line);
}
.w77-section-title { display: flex; align-items: baseline; gap: 14px; font-size: 22px; font-weight: 700; }
.w77-section-en { font: 500 12px/1 'Space Grotesk', sans-serif; letter-spacing: .2em; text-transform: uppercase; color: var(--accent); }
.w77-count { font: 500 12px/1 'Space Grotesk', sans-serif; letter-spacing: .08em; color: var(--muted); }

.w77-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(360px, 100%), 1fr)); gap: 16px; }
.w77-grid > * { min-width: 0; }
.w77-card {
    position: relative; overflow: hidden;
    display: flex; flex-direction: column; justify-content: space-between; gap: 22px;
    padding: 22px 22px 18px; border-radius: 16px;
    background: var(--surface); border: 1px solid var(--line);
    transition: transform .35s cubic-bezier(.22,1,.36,1), border-color .35s, background .35s, box-shadow .35s;
    animation: w77-in .6s cubic-bezier(.22,1,.36,1) both;
}
.w77-card::before {
    content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity .35s;
    background: radial-gradient(380px circle at var(--mx, 50%) var(--my, 0%), rgba(var(--accent-rgb), .12), transparent 60%);
}
.w77-card:hover {
    transform: translateY(-3px); background: var(--surface-hover);
    border-color: rgba(var(--accent-rgb), .35);
    box-shadow: 0 24px 60px -28px rgba(var(--accent-rgb), .45), 0 2px 0 rgba(255,255,255,.03) inset;
}
.w77-card:hover::before { opacity: 1; }
.w77-card-title { font: 700 19px/1.35 'Space Grotesk', 'Noto Sans TC', sans-serif; letter-spacing: -.01em; }
.w77-card-desc { margin-top: 8px; font-size: 14px; line-height: 1.65; color: var(--muted); }
.w77-card-foot { position: relative; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.w77-chip {
    font: 500 12px/1 'Space Grotesk', 'Noto Sans TC', sans-serif; color: var(--accent);
    padding: 6px 10px; border-radius: 999px; background: rgba(var(--accent-rgb), .08); border: 1px solid rgba(var(--accent-rgb), .18);
}
.w77-actions { display: flex; gap: 8px; }
.w77-btn {
    cursor: pointer; user-select: none; font: 500 13px/1 'Space Grotesk', sans-serif;
    padding: 9px 14px; border-radius: 10px; color: var(--text);
    background: rgba(255,255,255,.04); border: 1px solid var(--line);
    transition: background .2s, border-color .2s, color .2s, transform .15s;
}
.w77-btn:hover { background: rgba(255,255,255,.09); border-color: rgba(255,255,255,.2); }
.w77-btn:active { transform: scale(.96); }
.w77-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.w77-btn.is-primary { color: #0d0f0c; background: var(--accent); border-color: var(--accent); font-weight: 700; }
.w77-btn.is-primary:hover { background: #d2ff9c; border-color: #d2ff9c; }

.w77-footer { margin-top: 80px; padding-top: 24px; border-top: 1px solid var(--line); font-size: 12px; color: var(--muted); letter-spacing: .04em; }

@keyframes w77-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

@media (max-width: 768px) {
    .w77-news { padding: 10px 16px; }
    .w77-wrap { padding: 0 16px 48px; }
    .w77-hero { padding: 48px 0 28px; }
    .w77-grid { grid-template-columns: 1fr; }
    .w77-gallery { height: 200px; overflow-x: auto; }
    .w77-shot { flex: 0 0 64px; }
    .w77-shot:hover { flex-basis: 260px; }
}
@media (prefers-reduced-motion: reduce) {
    .w77-card, .w77-shot, .w77-btn { animation: none; transition: none; }
}
`
        document.head.appendChild(style)
    }

    function getChillData() {
        return [
            // claude-0014-stg-level-editor
            {
                title: 'Claude STG Level Editor 🔥',
                desc: '一個用 Claude 設計的 shooting game level editor',
                commments: '2026/11/07',
                buttonlinks: {
                    'demo': 'https://highq77.github.io/claude-0014-stg-level-editor/',
                    'github': 'https://github.com/highQ77/claude-0014-stg-level-editor',
                }
            },
            {
                title: 'Claude Accessibility Tools Pro 🔥',
                desc: '一個用 Claude 設計的超強網頁無障礙輔助設計工具',
                commments: '2026/11/06',
                buttonlinks: {
                    'demo': 'https://highq77.github.io/claude-0013-accessibility-tools-pro/',
                    'github': 'https://github.com/highQ77/claude-0013-accessibility-tools-pro',
                }
            },
            {
                title: 'Claude Web Terminal 🔥',
                desc: '一個用 Claude 輔助設計的 Web 終端機',
                commments: '2026/11/05',
                buttonlinks: {
                    'demo': 'https://highq77.github.io/claude-0012-web-terminal/',
                    'github': 'https://github.com/highQ77/claude-0012-web-terminal',
                }
            },
            {
                title: 'Claude MyDashboard 🔥',
                desc: '一個用 Claude 輔助設計的個人儀表板',
                commments: '2026/11/05',
                buttonlinks: {
                    'demo': 'https://highq77.github.io/claude-0011-my-dashboard/',
                    'github': 'https://github.com/highQ77/claude-0011-my-dashboard',
                }
            },
            {
                title: 'Claude Motion Master 🔥',
                desc: '一個用 Claude 輔助設計的動畫編輯器',
                commments: '2026/11/05',
                buttonlinks: {
                    'demo': 'https://highq77.github.io/claude-0010-motion-master/',
                    'github': 'https://github.com/highQ77/claude-0010-motion-master',
                }
            },
            {
                title: 'Claude NovaEditor 🔥',
                desc: '一個用 Claude 輔助設計的生成藝術濾鏡編輯器',
                commments: '2026/11/04',
                buttonlinks: {
                    'demo': 'https://highq77.github.io/claude-0009-nova-editor/',
                }
            },
            {
                title: 'Claude webgl2d.js 🔥',
                desc: '一個用 Claude 設計的擁有 canvas2d API 的 webgl 版本 API - webgl2d.js',
                commments: '2026/11/03',
                buttonlinks: {
                    'demo': 'https://highq77.github.io/claude-0008-webgl2d.js/',
                    'github': 'https://github.com/highQ77/claude-0008-webgl2d.js',
                }
            },
            {
                title: 'Claude Juicy.js 🔥',
                desc: '一個用 Claude 設計的全新 鏈式 + VDOM + MVVM API - Juicy.js',
                commments: '2026/11/03',
                buttonlinks: {
                    'demo': 'https://highq77.github.io/claude-0007-juicy/',
                    'github': 'https://github.com/highQ77/claude-0007-juicy',
                }
            },
            {
                title: 'Claude TUI-ThreeJS UI Editor 🔥',
                desc: '一個用 Claude 設計的 ThreeJS UI 編輯器（半成品）',
                commments: '2026/11/02',
                buttonlinks: {
                    'demo': 'https://highq77.github.io/claude-0006-tui/',
                }
            },
            {
                title: 'Claude PowerMIDI workstation 🔥',
                desc: '一個用 Claude 設計的 MIDI 工作站',
                commments: '2026/11/02',
                buttonlinks: {
                    'demo': 'https://highq77.github.io/claude-0005-power-midi/',
                }
            },
            {
                title: 'Claude 黎明原野 Dawnfield 🔥',
                desc: '一個用 Claude 設計的遊戲場景',
                commments: '2026/11/02',
                buttonlinks: {
                    'demo': 'https://highq77.github.io/claude-0004-dawnfield/',
                }
            },
            {
                title: 'Claude PageWeaver 🔥',
                desc: '一個用 Claude 設計的 網頁編輯器，支援多個網頁元素的組合與即時預覽',
                commments: '2026/11/02',
                buttonlinks: {
                    'demo': 'https://highq77.github.io/claude-0003-page-weaver/',
                }
            },
            {
                title: 'Claude Shader Composer 🔥',
                desc: '一個用 Claude 設計的 shader composer，支援多個 shader 效果的組合與即時預覽',
                commments: '2026/11/01',
                buttonlinks: {
                    'demo': 'https://highq77.github.io/claude-0002-shader-composer/',
                }
            },
            {
                title: 'Claude 初探 - audio-visual-spa 🔥',
                desc: '一個用 Claude 設計的音視覺 spa',
                commments: '2026/10/31',
                buttonlinks: {
                    'demo': 'https://highq77.github.io/claude-0001-audio-visual/',
                }
            },
            {
                title: '威廉的創意點子 🔥',
                desc: '一些有趣的創意提案',
                commments: '2026/10/28',
                buttonlinks: {
                    'demo': 'https://highq77.github.io/ideas/',
                }
            },
            {
                title: '威廉密碼 🔥',
                desc: '自製的英文轉數字編碼',
                commments: '2026/10/30',
                buttonlinks: {
                    'demo': 'https://highq77.github.io/w77code/',
                }
            },
            {
                title: '生成藝術作品 🔥',
                desc: '透過程式碼進行平面藝術創作',
                commments: '2026/10/23',
                buttonlinks: {
                    'demo': 'https://highq77.github.io/algo-party/',
                }
            },
            {
                title: '威廉的諧音玩法整理 🔥',
                desc: '流行的諧音玩法整理',
                commments: '2026/10/30',
                buttonlinks: {
                    'demo': 'https://highq77.github.io/w77slogan/',
                }
            },
            // {
            //     title: 'CV 🔥',
            //     desc: '2027 最新 CV',
            //     commments: '2027/07/10',
            //     buttonlinks: {
            //         'demo': 'https://highq77.github.io/cv/',
            //     }
            // },
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
            {
                title: 'HTMLWeaver 🔥',
                desc: '動態 HTML 生成器',
                commments: '2025/10/26',
                buttonlinks: {
                    'github': 'https://github.com/highQ77/html-weaver',
                    'demo': 'https://highQ77.github.io/html-weaver',
                }
            },
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

