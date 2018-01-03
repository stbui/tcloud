
# nest

Nest是一套基于Node.js的强大的Web框架，可帮助你轻松构建出高效的、可扩展的应用程序。它是通过结合OOP（面向对象编程）和FP（函数式编程）的最佳理念，采用现代化JavaScript，使用TypeScript构建的。

Nest不仅仅只是一套框架，因为它是基于绝妙的，著名的流行库Express和Socket.io构建的（你也可以根据自己的需求选择任何其他库），所以无需等待大型社区，可以直接使用，无需担心第三方库的缺失。

# 安装
```
$ git clone https://github.com/kamilmysliwiec/nest-typescript-starter.git project
$ cd project
$ npm install
$ npm run start
```

```
$ npm i --save @nestjs/core @nestjs/common @nestjs/microservices @nestjs/websockets @nestjs/testing reflect-metadata rxjs
```

# 理念
Javascript是一门非常神奇的计算机语言。它不再是一门只能在浏览器上创建简单动画的语言。现在，前端领域已经开发出了多种绝妙的高性能的框架/库，例如Angular、React 和 Vue, 这些工具大大地提高了我们的开发进程，并且使我们的应用程序变得快速而灵活。

通过Node.Js，我们可以在服务器端使用JavaScript。虽然现在有很多基于Node的库、助手和工具，但是没有任何一个可以解决主要问题-结构体系问题。

我们希望创建出可扩展的、松散耦合的、易于维护的应用程序。让我们一起来看看Node.js的潜能吧！


# 特点

便于学习-语法结构类似Angular。
基于TypeScript构建，同时兼容普通的ES6（强烈建议使用TypeScript).
基于著名的（Express/Scoket.io)库，所以可以分享经验。
非常有用的依赖注入，内置控制反转容器。
分层注入器器—通过使用类型注入创建可重用、松耦合的模块，从而在应用程序中增加抽象性。
WebScokets模块（基于scoket.io，虽然你可以使用任何其他使用适配器的库。
独特的模块化系统（将你的系统分割成克重用的模块）。
消息类型支持的反应微服务（内置transport属性，决定使用TCP或者Redis，但是你可以选择使用任何其他使用CustomTransportStrategy的交流形式）。
异常处理layer，异常过滤器，同步和异步pipes layer。
测试工具