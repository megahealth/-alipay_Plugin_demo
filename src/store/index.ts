import {createStore} from "redux";
import Taro from "@tarojs/taro";

let initial = {
    client: null,
    scanClient: null,
    scanList: [],
    deviceInfo: null,
    otherDeviceInfo: null,
    heardBeat: null,
    mode: null,
    device: null,
    RealTimeNotify: true,
    V2LiveSpoMonitor: null,
    V2LiveSleep: null,
    restartConnect: false,
    userInfo: false,
    reportList: []
};


const reducer = function reducer(state = initial, action) {
    // 浅拷贝，不直接修改容器中的状态,而是在return 时再修改
    state = {...state};
    switch (action.type) {
        case "SET_CLIENT":
            state.client = action.payload
            break;
        case "SET_SCAN_CLIENT":
            state.scanClient = action.payload;
            break;
        case "SET_SCAN_LIST":
            if (action.payload.length == 0) {
                state.scanList = action.payload
            } else {
                // Check if the item already exists in scanList
                const existingItemIndex = state.scanList.findIndex((item: any) => item.mac === action.payload.mac);
                if (existingItemIndex !== -1) {
                    // If item exists, update it
                    let updatedScanList = [...state.scanList];
                    // @ts-ignore
                    updatedScanList[existingItemIndex] = action.payload;
                    state.scanList = updatedScanList.sort((a: any, b: any) => b.RSSI - a.RSSI)
                } else {
                    // If item doesn't exist, add it
                    // @ts-ignore
                    state.scanList = [...state.scanList, action.payload].sort((a, b) => b.RSSI - a.RSSI)
                }
            }
            break;
        case "SET_DEVICE_INFO":
            state.deviceInfo = action.payload;
            break;
        case "SET_OTHER_DEVICE_INFO":
            state.otherDeviceInfo = action.payload;
            break;
        case "SET_HEARD_BEAT":
            state.heardBeat = action.payload;
            break;
        case "SET_MODE":
            state.mode = action.payload;
            break;
        case "SET_DEVICE":
            if (action.payload) {
                Taro.setStorage({key: 'device', data: action.payload})
            }
            state.device = action.payload;
            break;
        case "SET_REAL_TIME_NOTIFY":
            state.RealTimeNotify = action.payload;
            break;
        case "SET_V2_LIVE_SPO_MONITOR":
            state.V2LiveSpoMonitor = action.payload;
            break;
        case "SET_V2_LIVE_SLEEP":
            state.V2LiveSleep = action.payload;
            break;
        case "SET_RESTART_CONNECT":
            state.restartConnect = action.payload;
            break;
        case "SET_USER_INFO":
            state.userInfo = action.payload
            break;
        case "SET_REPORT_LIST":
            state.reportList = action.payload
            break;
        case "CLEAR":
            // @ts-ignore
            state.scanList = []
            state.deviceInfo = null
            state.otherDeviceInfo = null
            state.heardBeat = null
            state.mode = null
            state.device = null
            state.RealTimeNotify = true
            state.V2LiveSpoMonitor = null
            state.V2LiveSleep = null
            state.restartConnect = false
            state.userInfo = false

            Taro.removeStorage({key: 'connectInfo'})
            Taro.removeStorage({key: 'device'})
            Taro.removeStorage({key: 'token'})

            break;
        default:
            if (Taro.getStorageSync('device')) state.device = Taro.getStorageSync('device')
            break;
    }
    return state;
};
const store = createStore(reducer);

export default store;
