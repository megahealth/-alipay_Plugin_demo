import {useEffect} from 'react'
import Taro from "@tarojs/taro";
import {Button, ScrollView, View} from '@tarojs/components'
import './index.scss'
// eslint-disable-next-line import/first
import {useDispatch, useSelector} from 'react-redux';
import {
  addToScanList,
  clear,
  setClient,
  setDevice,
  setDeviceInfo,
  setHeadBeat,
  setMode,
  setOtherDeviceInfo,
  setReportList,
  SetRestartConnect,
  setScanClient,
  SetUserInfo,
  SetV2LiveSleep,
  SetV2LiveSpoMonitor
} from '../../store/action';


const plugin: any = Taro.requirePlugin('megable')
const Index = () => {
    const client = useSelector((state: any) => state.client);
    const scanClient = useSelector((state: any) => state.scanClient);
    const scanList = useSelector((state: any) => state.scanList);
    const deviceInfo = useSelector((state: any) => state.deviceInfo);
    const otherDeviceInfo = useSelector((state: any) => state.otherDeviceInfo);
    const heardBeat = useSelector((state: any) => state.heardBeat);
    const mode = useSelector((state: any) => state.mode);
    const RealTimeNotify = useSelector((state: any) => state.RealTimeNotify);
    const V2LiveSpoMonitor = useSelector((state: any) => state.V2LiveSpoMonitor);
    const V2LiveSleep = useSelector((state: any) => state.V2LiveSleep);
    const device = useSelector((state: any) => state.device);
    const restartConnect = useSelector((state: any) => state.restartConnect);
    const userInfo = useSelector((state: any) => state.userInfo);
    const reportList = useSelector((state: any) => state.reportList);
    const dispatch = useDispatch();
    const {initSdk, MegaBleScanner} = plugin.ble

    //cdk回调
    const callBack = () => {
        return {
            //  监听本机蓝牙状态变化事件。
            onAdapterStateChange: (res) => {
                console.log('ble adapter state change: ', res)
                // 蓝牙重新可用了，看看该采取什么操作
            },
            //蓝牙变化回调（/连接/断开）
            onConnectionStateChange: (res) => {
                // 监听低功耗蓝牙连接状态改变事件
                if (res.connected) {
                    Taro.hideLoading()
                    console.log('连接蓝牙成功')
                    dispatch(addToScanList([]))
                    dispatch(SetRestartConnect(false))
                } else {
                    dispatch(SetRestartConnect(true))
                }
            },
            //获得token
            onTokenReceived: (token) => {
                console.log('onTokenReceived: ', token)
                Taro.setStorage({key: 'token', data: token})
                Taro.hideLoading()
            },
            //摇晃提醒
            onKnockDevice: () => {
                console.log('onKnockDevice')
                Taro.showLoading({title: 'shake target device', mask: true})
            },
            //请求status
            onOperationStatus: (cmd, status) => {
                console.info("🚀 ~ file:index line:84 -----> ", cmd, status)
                if (status !== 0) {
                    console.error('onOperationStatus: ' + cmd.toString(16) + ' - ' + status.toString(16));
                }
            },
            onBatteryChanged: (value, status) => {
                console.info("🚀 ~ file:index line:82 -----> BatteryChanged ", value, status)
            },
            onEnsureBindWhenTokenNotMatch: () => {
            },
            onError: (status) => {
                console.log('onError: ', status)
            },
            onCrashLogReceived: () => {
            },
            //收取监测报告的进度
            onSyncingDataProgress: (progress) => {
                if (progress <= 100) {
                    console.log('onSyncingDataProgress... ' + progress);
                    Taro.showLoading({title: progress + '%'})
                }
            },
            // 收取报告 reportId可以使用
            // https://raw.megahealth.cn/parse/parsemhn?objId= 进行解析报告
            onSyncMonitorDataComplete: (res) => { // 构建formdata方法
                console.info("🚀 ~ file:index line:101 -----> res ", res)
            },
            onSyncDailyDataComplete: (bytes) => {
                console.log('onSyncDailyDataComplete: ', bytes)
            },
            onSyncNoDataOfMonitor: () => {
                Taro.showToast({title: "no Data"})
                console.info("🚀 ~ file:index line:134 -----> onSyncNoDataOfMonitor",)
            },
            onSyncNoDataOfDaily: () => {
                console.log('onSyncNoDataOfDaily')
            },
            onV2BootupTimeReceived: () => {
            },
            //心跳包（电量/电池状态/当前模式）
            onHeartBeatReceived: heartBeat => {
                console.info("🚀 ~ file:index line:160 -----> heartBeat ", heartBeat)
                if (heartBeat.mode) dispatch(setMode(heartBeat.mode))
                dispatch(setHeadBeat(heartBeat))
            },
            onV2PeriodSettingReceived: () => {
            },
            onV2PeriodEnsureResponsed: () => {
            },
            onV2PeriodReadyWarning: () => {
            },
            onLiveDataReceived: live => {
                console.log('onLiveDataReceived: ', live)
            },
            //血氧监测实时回调
            onV2LiveSleep: v2LiveSleep => {
                console.log('onV2LiveSleep: ', v2LiveSleep)
                Taro.hideLoading()
                dispatch(setMode(1))
                dispatch(SetV2LiveSleep(v2LiveSleep))
            },
            // 运动实时回调
            onV2LiveSport: v2LiveSport => {
                console.log('onV2LiveSport: ', v2LiveSport)
            },
            // 血氧仪实时回调
            onV2LiveSpoMonitor: v2LiveSpoMonitor => {
                //实时血氧
                Taro.hideLoading()
                dispatch(setMode(4))
                dispatch(SetV2LiveSpoMonitor(v2LiveSpoMonitor))
                console.log('onV2LiveSpoMonitor: ', v2LiveSpoMonitor)
            },
            //设置个人信息回调
            onSetUserInfo: () => {
                dispatch(SetUserInfo(true))
            },
            //进入idle
            onIdle: () => {
                console.log('idle')
                //判断重新连接

            },
            //解析获取{sn、mac}
            onDeviceInfoUpdated: info => {
                console.info("🚀 ~ file:index line:198 -----> onDeviceInfoUpdated ", info)
                if (info.otherInfo) {
                    dispatch(setOtherDeviceInfo(info))
                } else {
                    dispatch(setDeviceInfo(info))
                }
            },
            onRawdataReceiving: (count, bleCount, rawdataDuration) => {
                console.log('onRawdataReceiving', count, bleCount, rawdataDuration);
            },
            onRawdataComplete: info => {
                console.log(info);
            },
            onDfuProgress: progress => {
                console.log('onDfuProgress', progress);
            },
            //拿到连接后拿到之前的mode状态
            onV2ModeReceived: (info) => {
                dispatch(setMode(info.mode))
                console.info("🚀 ~ file:index line:207 ----->onV2ModeReceived info ", info)
            }
        }
    }

    useEffect(() => {
        const user = Taro.getStorageSync('user')
        console.info("🚀 ~ file:index line:228 -----> user ", user)
        if (!user) Taro.redirectTo({url: `/pages/login/index`,})
        if (scanClient) scanClient.stopScan()
        if (user) init()
    }, [])

    //设置个人信息
    useEffect(() => {
        if (userInfo) {
            client.setUserInfo(25, 1, 170, 60, 0)
            dispatch(SetUserInfo(false))
            client.enableRealTimeNotify(RealTimeNotify)
            if (mode === 0) {
                client.enableLive(false)
                dispatch(setMode(3))
            }
            client.getV2Model()
        }
    }, [userInfo]);
//开启重新连接
    useEffect(() => {
        if (client && scanClient && restartConnect && device) {
            Taro.showLoading({title: "connect...", mask: true})
            restartScan()
        }
    }, [client, scanClient, restartConnect]);


    //cdk 初始化
    const init = async () => {

        const AppId = 'ZURNaXgbXw'
        const AppKey = '&e)CPKK?z;|p0V3'
        //ble搜索初始化

        // @ts-ignore
        await initSdk(AppId, AppKey, my).then((bleClient: any) => {
            bleClient.setCallback(callBack());
            dispatch(setClient(bleClient));
            //判断是否存在连接信息，直接连接
            if (device) {
                dispatch(SetRestartConnect(true))
            }
        })
            .catch((err: any) => console.error(err))
        const a = new MegaBleScanner((devices: any) => {
            dispatch(addToScanList(devices));
        })
        dispatch(setScanClient(a));
    }
    const restartScan = async () => {
        // connectToken(device,client)
        await connectBle(device, client)
        // scanClient.restartScan(device).then(async () => {
        //   //开始连接
        //   await connectBle(device, client)
        //   scanClient.stopScan()
        // })
    }
    //搜索
    const search = async () => {
        //蓝牙搜索初始化
        scanClient.initBleAdapter().then(() => {
            //开始搜索
            scanClient.scan()
            //10秒关闭搜索
            setTimeout(() => {
                scanClient.stopScan()
            }, 10000)
        }).catch(err => {
            console.info("🚀 ~ file:index line:287 -----> err ", err)
        })
    }
//摇晃绑定连接戒指
    const connectToken = async (item, client) => {
        if (scanList.length > 0) dispatch(addToScanList([]))
        if (client) {
            const token = Taro.getStorageSync('token');
            const user = Taro.getStorageSync('user')
            if (token && token.indexOf(',') != -1) {
                console.info("🚀 ~ file:index line:299 -----> token ", token)
                await client.startWithToken(user.objectId, token)
            } else {
                console.info("🚀 ~ file:index line:303 -----> mac ")
                await client.startWithoutToken(user.objectId, item.mac)
            }
        }
    }
    //ble连接
    const connectBle = async (item: any, client) => {
        console.info("🚀 ~ file:index line:318 -----> item ", item)
        console.info("🚀 ~ file:index line:318 -----> client ", client)
        if (scanClient) scanClient.stopScan()
        dispatch(setDevice(item))
        //连接的信息
        Taro.setStorage({key: "connectInfo", data: item})
        Taro.showLoading({title: 'connect', mask: true})
        if (!client) return
        await client.connect(item.name, item.deviceId, item.manufacturerData).then(() => {
            connectToken(item, client)
        }).catch((err) => {
            dispatch(SetRestartConnect(true))
            console.info("🚀 ~ file:index line:318 -----> err ", err)
        })
    }
    //实时通道
    /**
     * @param enable
     * 开关实时通道
     * */
        // const enableRealTimeNotify = (enable) => {
        //     if (client) {
        //         client.enableRealTimeNotify(enable)
        //         Taro.setStorage({key: 'RealTimeNotify', data: enable})
        //     }
        // }

        //血氧实时模式
    const enableLive = (enable) => {
            if (client) {
                if (enable) {
                    Taro.showLoading({title: '开启中。。。', mask: true})
                }
                client.enableLive(enable)

                dispatch(SetV2LiveSleep(null))
                dispatch(SetV2LiveSpoMonitor(null))
                if (!enable) {
                    setMode(3)
                }
            }
        }
    //血氧监测
    const enableMonitor = (enable) => {
        if (client) {
            if (enable) {
                Taro.showLoading({title: '开启中。。。', mask: true})
            }
            client.enableMonitor(enable)
            dispatch(SetV2LiveSleep(null))
            dispatch(SetV2LiveSpoMonitor(null))
            if (!enable) {
                dispatch(setMode(3))
            }
        }
    }
    //收取监测报告
    const syncData = () => {
        if (client) {
            client.syncData()
        }
    }

    const modelHandel = (mode) => {
        switch (mode) {
            case 0:
                return '默认'
            case 1:
                return '监测模式(血氧)'
            case 2:
                return '运动模式'
            case 3:
                return '空闲模式'
            case 4:
                return '实时模式(血氧)'
            case 5:
                return 'bp模式'
        }
    }
    const deviceStatus = (deviceStatus) => {
        switch (deviceStatus) {
            case 0:
                return '电量正常'
            case 1:
                return '充电中'
            case 2:
                return '充满'
            case 3:
                return '低电'
            case 4:
                return '异常'
            case 5:
                return '休眠'
        }
    }

    // 时间处理
    function secondsToHMS(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        const hoursStr = String(hours).padStart(2, '0');
        const minutesStr = String(minutes).padStart(2, '0');
        const secondsStr = String(remainingSeconds).padStart(2, '0');
        return `${hoursStr}:${minutesStr}:${secondsStr}`;
    }

    const STATUS_LIVE = (STATUS) => {
        switch (STATUS) {
            case 0:
                return '实时值有效'
            case 1:
                return '值准备中'
            case 2:
                return '无效/离手'
            default:
                return '--'
        }
    }
    const closeble = async () => {
        dispatch(clear())
        client.disconnect().then((res) => {
            console.info("🚀 ~ file:index line:440 -----> res ", res)
            // client.closeBluetoothAdapter()
        }).cache(e => {
            console.info("🚀 ~ file:index line:442 -----> e ", e)
        })
    }
    const getReport = () => {
        const options: any = {
            page: 1,
            limit: 10
        }
        client.getReport(options).then(res => {
            console.info("🚀 ~ file:index line:430 -----> res", res.results[0])
            dispatch(setReportList(res.results))
        })
    }

    const parseReport = (item) => {
        client.parseReport(item.objectId).then((res) => {
            console.info("🚀 ~ file:index line:416 -----> res ", res)
        })
        // Taro.navigateTo({
        //   url: `/pages/web/index?objectId=${item.objectId}`,
        // });
    }

    const layout = () => {
        // dispatch(SetRestartConnect(false))
        if (client) client.disconnect()
        if (scanClient) scanClient.stopScan()

        Taro.removeStorage({
            key: 'user', success: () => {
                Taro.redirectTo({url: `/pages/login/index`})
            }
        })
    }
    return (
        <>
            {/* 开始搜索*/}
            <View className='index'>
                <Button onClick={search} type='primary'>搜索</Button>
            </View>
            <ScrollView
                scrollY
                scrollWithAnimation
                className='devices-list'
            >
                {
                    scanList && scanList.map((item: any) => {
                        return (
                            <View key={item.deviceId} className='device-item' onClick={() => connectBle(item, client)}>
                                <View>{item.name}</View>
                                <View>信号强度: {item.RSSI}dBm ({Math.max(0, item.RSSI + 100)}%)</View>
                                <View>Mac: {item.mac}</View>
                                <View>Service数量: {item.advertisServiceUUIDs.length}</View>
                            </View>
                        )
                    })
                }
            </ScrollView>
            {
                deviceInfo && deviceInfo.name ? (
                        <>
                            <View className='flex'>
                                <View className='flex-item'>
                                    <View>name: {deviceInfo.name}</View>
                                    <View>mac: {deviceInfo.mac}</View>
                                    <View>sn: {otherDeviceInfo?.sn ?? '--'}</View>
                                </View>
                                <View className='flex-item'>
                                    <View>hwVer: {otherDeviceInfo?.hwVer ?? '--'}</View>
                                    <View>blVer: {otherDeviceInfo?.blVer ?? '--'}</View>
                                    <View>fwVer: {otherDeviceInfo?.fwVer ?? '--'}</View>

                                </View>
                            </View>
                            <View className='flex'>
                                <View className='flex-item'>

                                    <View>模式:{modelHandel(mode || 0)}</View>
                                    <View>实时通道: {RealTimeNotify ? RealTimeNotify ? '开启' : "关闭" : "--"}</View>
                                    <View>电量:{heardBeat ? heardBeat.battPercent : '--'}</View>
                                    <View>电池状态:{heardBeat ? deviceStatus(heardBeat.deviceStatus) : "--"}</View>

                                </View>
                                <View className='flex-item'>
                                    {
                                        V2LiveSpoMonitor && V2LiveSpoMonitor.pr ? (
                                            <>
                                                <View>状态:{STATUS_LIVE(V2LiveSpoMonitor.status)}</View>
                                                <View>血氧饱和度:{V2LiveSpoMonitor.spo || 0}</View>
                                                <View>心率(次/分钟):{V2LiveSpoMonitor.pr || 0}</View>
                                            </>
                                        ) : ''
                                    }
                                    {
                                        V2LiveSleep && V2LiveSleep.duration ? (
                                            <>
                                                <View>状态:{STATUS_LIVE(V2LiveSleep.status)}</View>
                                                <View>血氧饱和度:{V2LiveSleep.spo || 0}</View>
                                                <View>心率(次/分钟):{V2LiveSleep.pr || 0}</View>
                                                <View>持续:{secondsToHMS(V2LiveSleep.duration || 0) || '--'}</View>

                                            </>
                                        ) : ''
                                    }
                                </View>
                            </View>

                            {/*<View className='flex'>*/}
                            {/*    <Button className='flex-item' type='primary'*/}
                            {/*            disabled={RealTimeNotify}*/}
                            {/*            onClick={() => enableRealTimeNotify(true)}>开启实时通道</Button>*/}
                            {/*    <Button className='flex-item' type='primary'*/}
                            {/*            disabled={!RealTimeNotify}*/}
                            {/*            onClick={() => enableRealTimeNotify(false)}>关闭实时通道</Button>*/}
                            {/*</View>*/}

                            <View className='flex'>
                                <Button className='flex-item' type='primary'
                                        disabled={mode === 1}
                                        onClick={() => enableLive(true)}>开启血氧实时模式</Button>
                                <Button className='flex-item' type='primary'
                                        disabled={mode === 1}
                                        onClick={() => enableLive(false)}>关闭血氧实时模式</Button>
                            </View>
                            <View className='flex'>
                                <Button className='flex-item' type='primary'
                                        disabled={mode === 1}
                                        onClick={() => enableMonitor(true)}>开启血氧监测模式</Button>
                                <Button className='flex-item' type='primary'
                                        onClick={() => enableMonitor(false)}>关闭血氧监测模式</Button>
                            </View>
                            <View className='flex'>
                                <Button className='flex-item' type='primary'
                                        disabled={(mode === 1)}
                                        onClick={() => syncData()}>收取血氧监测</Button>
                                <Button className='flex-item' type='primary' onClick={closeble}>解绑</Button>
                            </View>
                            <View className='flex'>
                                <Button type='primary' className='flex-item' onClick={getReport}>查看所有报告</Button>
                                <Button type='primary' className='flex-item' onClick={layout}>退出登录</Button>
                            </View>
                            <ScrollView
                                scrollY
                                scrollWithAnimation
                                className='devices-list'
                                style='height: 400px'
                            >
                                {
                                    reportList && reportList.map((item: any) => {
                                        return (
                                            <View key={item.createdAt} className='device-item'
                                                  onClick={() => parseReport(item)}>
                                                <View>{item.remoteDevice.sn}</View>
                                                <View>startAt: {item.startAt}</View>
                                                <View>endAt: {item.endAt}</View>
                                                <View>stopType: {item.stopType}</View>
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                        </>)
                    : ""
            }
        </>
    )
}

export default Index

