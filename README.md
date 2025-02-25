# 微信挪车通知 OR 电话
作用是在使用 Cloudflare 的 Workers 免费部署通知车主挪车功能。

**更新时间：2024年11月13日 14:25:16**

这是受吾爱大佬启发，在源代码基础上优化的。
### 优化项

1. **敏感参数的管理**  
   不在页面中填写敏感参数，而是在项目设置中填写环境变量来配置 `wxpusher` 参数和电话号码。所需的环境变量参数名如下：
   - `PHONE_NUMBER`
   - `WXAPPTOKEN`
   - `WXPUSHER_UIDS`

2. **防止重复发送通知**  
   针对点击“微信发送通知”按钮时，网络延迟可能导致的多次点击现象，避免因多次点击发送多条信息的问题。

### 备注
- 使用环境变量获取参数，不能使用 JS 加密。

### 部署
- 直接复制worker.js的代码到worker中新建项目粘贴代码
- 添加环境变量，手机号码：`PHONE_NUMBER`，WXPUSHER的PPTOKEN：`WXAPPTOKEN`，WXPUSHER的UIDS：`WXPUSHER_UIDS`，添加完成后重新部署。
