g6可视化-Realm中所有对象：

https://xxy1121.github.io/g6-Realm/index.html



课上作业，编写一个HTTP Client

构建HTTP请求和生成响应

```
/**
 * HTTP1.1标准: https://tools.ietf.org/html/rfc2616
 * Request的组成：
 * POST / HTTP/1.1                                     Request line: 
 * Host: 127.0.0.1                                     headers: 
 * Content-Type: application/x-www-form-urlencoded
 * 这里有一段空行
 * field1=aaa&code=x%3D1                               body： 
 * 
 * HTTP是一个文本协议，发的都是文本，而TCP是发的是流。只需要构建文本的格式
 * options：method, url = host + port + path
   body: k/v
   headers
 */
```

Content-Type支持4种格式：

* application/x-www-form-urlencoded

* application/json

* multipart/form-data

* text/xml

```
/**
 * 由于无法确定返回的Response会分成多少个包，不确定是否一次就拿到，所以需要判断，将buffer拼接
 * ResponseParser负责生成完整的response，它的原理是状态机
 * Response的组成：
 * HTTP/1.1 200 OK                                                 status line: 
 * Content-Type: text/html                                         headers：
 * Date: Mon, 23 Dec 2019 06:46:19 GMT
 * Connnection: keep-alive
 * Tranfer-Encoding: chunked 这个是body的Encode
 * 1个空行
 * 26 一个数字表示下一行有多少个字符，一个数字一行字符就是一个chunked         body：
 * <html><body>helloworld<body></html>
 *       
 * 0
 */
```

