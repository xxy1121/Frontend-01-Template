# 重学 HTML

## HTML 的定义： XML 与 SGML

- DTD 与 XML namespace

  [DTD](http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd)

   [xhtml-lat1.ent](http://www.w3.org/TR/xhtml1/DTD/xhtml1-lat1.ent)

   ` ` `\u00A0`

   `no-break space` 不间断空格，任何 HTML 中都不推荐使用 ` ` 代替 `white-space`，推荐使用以下解决方案：

  ```
  <pre>hello                    world</pre>
  <div style="white-space: pre-wrap;">hello        中国</div>
  ```

   [xhtml-symbol.ent](http://www.w3.org/TR/xhtml1/DTD/xhtml-symbol.ent)

   `λ` λ `\u03BB`

   [xhtml-special.ent](http://www.w3.org/TR/xhtml1/DTD/xhtml-special.ent)

   应知应会

  | Entity |      | HTML | JavaScript |
  | ------ | ---- | ---- | ---------- |
  | quot   | "    | `"`  | `\u0022`   |
  | amp    | &    | `&`  | `\u0026`   |
  | lt     | <    | `<`  | `\u003c`   |
  | gt     | >    | `>`  | `\u003e`   |

  [XML](http://www.w3.org/1999/xhtml)

## HTML 标签 - 语义

可参考 [WHATWG HTML Standard](https://html.spec.whatwg.org/multipage/sections.html)

| Tag     | Description                                                  |
| ------- | ------------------------------------------------------------ |
| header  | 通常出现在前部，表示导航或者介绍性的内容。                   |
| nav     | 导航链接的部分。                                             |
| aside   | 表示跟文章主体不那么相关的部分，它可能包含导航、广告等工具性质的内容。 |
| article | 它表示具有一定独立性质的文章。                               |
| main    | 整个页面只出现一个，表示页面的主要内容，可以理解成特殊的 div。 |
| section | 一个文档或应用程序的通用部分。                               |
| time    | 时间                                                         |
| address | 表示“文章（作者）的联系方式”，address 明确地只关联到 article 和 body。 |
| footer  | 通常出现在尾部，包含一些作者信息、相关链接、版权信息等。     |

## HTML 语法

### 合法元素

- Element：......
- Text：text
- Comment：
- DocumentType：<!Doctype html>
- ProcessingInstruction：
- CDATA：

### 字符引用

- lt
- gt
- quot
- amp

------

# 重学 DOM

## DOM

[W3C](https://github.com/double202/Frontend-01-Template/blob/master/week09)

### Node

- Element：元素型节点，跟标签对应。namespace 划分
  - HTMLElement
  - SVGElement
  - ...
- Document：文档根节点
- CharacterDate：字数数据
  - Text：文本节点
  - Comment：注释
  - ProcessingInstruction：处理信息
- DocumentFragment：文档片段 ---- 批量添加处理元素
- DocumentType：文档类型

### 导航类操作

| Node (推荐)     | Element                |
| --------------- | ---------------------- |
| parentNode      | ParentElement          |
| childNodes      | children               |
| firstChild      | firstElementChild      |
| lastChild       | lastElementChild       |
| nextSibling     | nextElementSibling     |
| previousSibling | previousElementSibling |

### 修改操作

- appendChild
- insertBefore
- removeChild
- replaceChild

> *tips*

**所有的 DOM 元素默认只有一个父元素，不能两次被插入到 DOM trees 中，同一个节点先插入到 DOM trees 中 A 位置，再插入到 B 位置，会默认从 A 位置 remove 掉。**

**childNodes 是一个 living Collection，执行 removeChild 或者其他修改操作后，childNodes 会实时改变。**

### 高级操作

- compareDocumentPosition 是一个用于比较两个节点中关系的函数。
- contains 检查一个节点是否包含另一个节点的函数。
- isEqualNode 检查两个节点是否完全相同。
- isSameNode 检查两个节点是否是同一个节点，实际上在 JavaScript 中可以用 `===`。
- cloneNode 复制一个节点，如果传入参数为 `true`，则会连同子元素做深拷贝。