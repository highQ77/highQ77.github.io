import { node } from "../../../../core/node.js";

export function cButton(nodeId) {
    return node.button(nodeId, '', { background: 'transparent' }, { background: '#111' }, { background: 'transparent' }, { background: 'transparent' }, { background: 'transparent' })
}

export function cRouterButton(nodeId, pageId) {
    return node.button(nodeId, pageId, { background: 'transparent' }, { background: '#111' }, { background: 'transparent' }, { background: 'transparent' }, { background: 'transparent' })
}