### 学习旅程
```
> 初次建项目
> npm install -g nx
> cd 2022
> npx create-nx-workspace
> 输入组织名 nestjs-study-nestjs-full-scaffold
> 选择项目为 nest
> 输入第一个应用名 nestjs-full-scaffold
> 打开 vscode
> 装nx插件, serve
> 访问 http://localhost:3335/nestjs-full-scaffold
> 装nx插件, build 项目的 production 环境
> 运行正式项目 `node dist/apps/nestjs-full-scaffold/main.js`

> 拥有 .env 的能力, .env文件用来设置敏感的服务器配置, 如数据库用户名密码. 支持多环境, 如.env是生产环境, .env.development是测试环境(可覆盖.env中的值), .env.development.local是本地开发环境(可覆盖前2份的值)
> npm install --save @nestjs/config

> 拥有 logger 的能力, 每天记录一份日志, 服务器上通过crontab定期清理历史日志, 每条日志自动追加环境信息: 如进程号, 主机名, 当前请求的信息(如url, 用户id, 请求id等)
> npm install --save nest-winston winston winston-daily-rotate-file

> Exception过滤, 如果是正式环境, response的时候不返回详细的错误信息

> 请求级别的全局变量, 如唯一的请求id(链路id), 应该要在任意文件中获取到, 而不是把request变量到处传, 破坏代码结构. 在response的头中也添加请求id(链路id)
> npm i nestjs-request-context

> mail
> queue
```