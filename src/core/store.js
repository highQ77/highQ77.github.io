import { store_config } from "./config.js"

// store 用於管理全域資料，且畫面切換資料不會消失
export const store = {
    init() {
        let storeData = getStoreData()
        if (storeData)
            store.store_config = autoConvert(JSON.parse(storeData))
        else
            store.store_config = autoConvert(store_config)
    },
    /** get original data - has code completion (you can use this for code completion, and then change function name get to get$) */
    get() {
        return store_config
    },
    /** get auto convert data - no code completion */
    get$() {
        return store.store_config
    },
    saveStore() {
        let save = {}
        restore(JSON.parse(JSON.stringify(store.store_config)), null, null, save)
        localStorage.setItem('chill.js', JSON.stringify(save))
    },
    clearStore() {
        localStorage.removeItem('chill.js')
    }
}

function getStoreData() {
    return localStorage.getItem('chill.js')
}

// auto change single value into array with only one element
function autoConvert(obj, parent, key) {
    if (obj === null || typeof obj !== 'object') {
        // console.log('not array here', obj, parent, key)
        parent[key] = [obj]
        return obj
    }
    if (Array.isArray(obj) && Array.length) {
        // console.log('array', obj)
    } else {
        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                autoConvert(obj[key], obj, key)
            }
        }
    }
    return obj
}

// restore data
function restore(obj, parent, key, restoreData, restoreDataParent) {
    if (obj === null || typeof obj !== 'object') {
        // console.log('not array here', obj, parent, key)
        return obj
    }
    if (Array.isArray(obj) && Array.length) {
        // console.log('array', obj)
        if (obj.length == 1 && (typeof obj[0] == 'number' || typeof obj[0] == 'string')) {
            restoreDataParent[key] = restoreData[0]
            // console.log(restoreDataParent, restoreData, key)
        }
    } else {
        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                restoreData[key] = obj[key]
                restore(obj[key], obj, key, restoreData[key], restoreData)
            }
        }
    }
}