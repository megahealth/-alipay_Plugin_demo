import Taro from "@tarojs/taro";
import {Button, Input, Text, View} from "@tarojs/components";
import api from "../../utils/api";
import './index.scss'
import {useEffect} from "react";

const index = () => {
  let phone = null
  let password = null

  useEffect(() => {
    const user=Taro.getStorageSync('user')
    if(user&&user.username){
      Taro.redirectTo({url: `/pages/index/index`})
    }
  }, []);

  const setPhone = (e) => {
    if (!e.target.value) return
    phone = e.target.value
  }
  const setPassword = (e) => {
    if (!e.target.value) return
    password = e.target.value
  }
  const Login = () => {
    api.post('/login', {
      'mobilePhoneNumber': phone,
      'password': password,
    }).then(res=>{
      if (res.statusCode === 200) {
        Taro.setStorage({key:"user",data:res.data})
        Taro.redirectTo({url: `/pages/index/index`})
      } else {
        Taro.showToast({ title: res.data.error, duration: 2000, icon: 'none', })
      }
    })
  }
  return (<>
    <View className='container'>
      <View className='text'>
        <Text>登录兆观健康账号</Text>
      </View>
      <View>
      <Input type='number' placeholder='手机号' focus onInput={setPhone}/>
      <Input type='password' className='password' placeholder='密码' maxLength='15' onInput={setPassword}/>
      <Button className='btn-login'
              onClick={Login}>登录</Button>
      </View>
    </View>
  </>)
}

export default index
