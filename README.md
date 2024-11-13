# mtc挪车
cloudfare workers挪车

2024年11月13日14:25:16
  这是受吾爱大佬启发，在源代码基础上优化的。作用是在使用cloudfare的workers免费部署通知车主挪车。
  优化项如下：
    不在页面中填写敏感参数，在项目设置中，填写环境变量来设置wxpusher参数和电话号码，参数名：PHONE_NUMBER，WXAPPTOKEN，WXAPPTOKEN
    点击微信发送通知按钮时，网络延迟，多次点击会发送多条信息的问题。
