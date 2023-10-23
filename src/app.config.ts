export default defineAppConfig({
  pages: [
    "pages/login/index",
    'pages/index/index',
  ],
  plugins: {
    megable: {
      version: "*",
      provider: "2021004119689171"
    }
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
