// actions.js
export const setClient = (client) => {
    return {
        type: 'SET_CLIENT',
        payload: client,
    };
};

export const addToScanList = (item) => {
    return {
        type: 'SET_SCAN_LIST',
        payload: item,
    };
};

export const setDeviceInfo = (item) => {

    return {
        type: 'SET_DEVICE_INFO',
        payload: item,
    };
};
export const setOtherDeviceInfo = (item) => {
    return {
        type: 'SET_OTHER_DEVICE_INFO',
        payload: item,
    };
};

export const setHeadBeat = (item) => {
    return {
        type: 'SET_HEARD_BEAT',
        payload: item,
    };
};

export const setMode = (item) => {
    return {
        type: 'SET_MODE',
        payload: item,
    };
};

export const setDevice = (item) => {
    return {
        type: 'SET_DEVICE',
        payload: item,
    };
};

export const setScanClient = (item) => {
    return {
        type: 'SET_SCAN_CLIENT',
        payload: item,
    };
};
export const SetRealTimeNotify = (item) => {
    return {
        type: 'SET_REAL_TIME_NOTIFY',
        payload: item,
    };
};

export const SetV2LiveSpoMonitor = (item) => {
    return {
        type: 'SET_V2_LIVE_SPO_MONITOR',
        payload: item,
    };
};
export const SetV2LiveSleep = (item) => {
    return {
        type: 'SET_V2_LIVE_SLEEP',
        payload: item,
    };
};
export const SetRestartConnect = (item) => {
    return {
        type: 'SET_RESTART_CONNECT',
        payload: item,
    };
};

export const SetUserInfo = (item) => {
    return {
        type: 'SET_USER_INFO',
        payload: item,
    };
};

export const setReportList = (item) => {
    return {
        type: 'SET_REPORT_LIST',
        payload: item,
    };
};

export const clear = () => {
    return {
        type: 'CLEAR',
    };
};




