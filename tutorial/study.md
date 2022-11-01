# 学习旅程

### 初次建项目, 安装nx
```
> npm install -g nx
> mkdir 2022; cd 2022
> npx create-nx-workspace
> 输入组织名 nestjs-study-nestjs-full-scaffold
> 选择项目为 nest
> 输入第一个应用名 nestjs-full-scaffold
> npm install --save-dev @nrwl/nest
> npm install --save-dev @nrwl/node
> npm install --save-dev @nrwl/remix
```

### VS Code 装nx插件
```
> nx serve  (nx run nestjs-full-scaffold:serve)
> 访问 http://localhost:3335/nestjs-full-scaffold/benchmark/hello-world

> nx build nestjs-full-scaffold --configuration production
> 运行正式项目 `node dist/apps/nestjs-full-scaffold/main.js`
```

### 拥有 .env 的能力
.env文件用来设置敏感的服务器配置, 如数据库用户名密码. 支持多环境, 如.env是生产环境, .env.development是测试环境(可覆盖.env中的值), .env.development.local是本地开发环境(可覆盖前2份的值)
```
> npm install --save @nestjs/config
```

### 拥有 logger 的能力
每天记录一份日志, 服务器上通过crontab定期清理历史日志, 每条日志自动追加环境信息: 如进程号, 主机名, 当前请求的信息(如url, 用户id, 请求id等)
```
> npm install --save nest-winston winston winston-daily-rotate-file
```

### Exception要过滤
如果是正式环境, response的时候不返回详细的错误信息

### 要有请求级别的全局变量, 如唯一的请求id(链路id)
应该要在任意文件中获取到, 而不是把request变量到处传, 破坏代码结构. 在response的头中也添加请求id(链路id)
```
> npm install --save nestjs-request-context
```

### 要有代码级别的事件机制, 方便多人开发
how-to: https://progressivecoder.com/how-to-emit-and-listen-to-events-using-the-nestjs-event-emitter/
```
> npm install --save @nestjs/event-emitter
```

### 模拟symfony的dump函数, 创建一个library, 使用jquery把json美观打印出来
```
> npx nx g @nrwl/nest:lib nestjsjsondump
```

### http client
```
> npm install --save @nestjs/axios
```

### php函数 equivalent
```
> npm install --save locutus
```

### 缓存GET/SET: using redis store
```
> npm install --save cache-manager@4.1.0
> npm install --save cache-manager-ioredis
```

### 雪花漂移算法生成数字id
```
> npm install --save simple-flakeid
```

### mail
```
```

### broker to pub & sub

#### mqtt
```
> npm install --save mqtt
> npm install --save aedes
> npm install --save @nestjs/microservices
```

#### redis
```
> npm install --save ioredis
```

## 前端
### remix 建项目
https://www.npmjs.com/package/@nrwl/remix
```
> nx g @nrwl/remix:app remix-full-scaffold
```

### remix 创建一个路由
```
> nx g route web/rfs/hello-world --project=remix-full-scaffold
```


---

# http simple benchmark
```
> ab -n 10000 -c 100 (golang simple web, php simple web, symfony, nestjs, node simple web)
```

### uname -r
5.15.34-amd64-desktop

### node --version
v19.0.0

### cat /proc/cpuinfo | grep processor | wc -l
12

### Result

| enviroment   | target   | req/sec   |
| :-- | :-- | :-- |
| go1.19   | golang_web.go  | 26198   |
| nginx   | static welcome page | 24653   |
| nginx   | content_by_lua_file hello.lua `ngx.say("ok")`  | 24719   |
| nginx+php7.3   | `<?php echo "hello world";`  | 9590   |
| nginx+php7.3+opcache   | `<?php echo "hello world";`  | 19860   |
| nodejs 1 instance   | node_web.js  | 17471   |
| pm2 cluster_mode 1 instance   | node_web.js  | 9933   |
| pm2 cluster_mode 12 instance   | node_web.js  | 15057   |
| nginx+php7.3   | symfony4.4-prod-mode  | 262   |
| nginx+php7.3+opcache   | symfony4.4-prod-mode  | 2900   |
| nodejs 1 instance   | nestjs9  | 5220   |
| pm2 cluster_mode 1 instance   | nestjs9  | 3712   |
| pm2 cluster_mode 12 instance   | nestjs9  | 9522   |
