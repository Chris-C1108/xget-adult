## outputs limits
 - 生成代码或输出文档时分段输出，每次不要超过 200 行
 - 修改代码或文档时，仅修改变化的行，不要重新输出全文

## 项目概况
 - 项目代码托管在GitHub 
 - 需要部署测试前 需要使用git命令将代码提交到github https://github.com/Chris-C1108/xget-adult  用户github key = [REDACTED]
 - 项目部署在cloudflare Workers , github 仓库代码提交后，会自动重新构建应用 需要约 3分钟，你需要等待用户确认成功重新构建后再继续排错
 - 需要构建和不部署代码 请先提交git 到仓库，然后让用户自行构建
 - 你可以使用 chrome mcp 

## 用户期望的最终效果
 - 以https://missav.ai/cn/sone-815 为例， 成功标准为：
   - 成功跳转 https://xget-adult.uni-kui.shop/missav/cn/sone-815
   - 网页渲染成功
   - 视频可以正常播放，视频流由原来的 https://surrit.com/... 改为使用 https://xget-adult.uni-kui.shop/missav-cdn/...
   