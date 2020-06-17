面试题：把一个元素所有的子元素逆序

#### Range API

Range API属于DOM API，是比DOM的节点API更为强大的一组API，range的意思是范围，区段，在DOM中也是，它表示一个片段且不用遵循DOM的层级关系，比如可以取第一个元素的某个子元素开始，一直到第二个元素的某个子元素结束这个片段，也可以操作文本结点中的文本，取某一段文本



```
var range = new Range()
range.setStart(element, 9) 设置片段的起点
range.setEnd(element, 4) 设置片段的终点
var range = document.getSelection().getRangeAt(0)
```

Range 用于辅助的快捷的api

```
range.setStartBefore(node) range的起点设置在node的前面
range.setEndBefore(node)
range.setStartAfter(node)
range.setEndAfter(node)
range.selectNode 直接选中结点
range.selectNodeContents 选中结点的内容
```

Range API 能干什么

```
var fragment = range.extractContents() 主要是extractContents，它能把这个片段从DOM树中摘出来，变成一个fragment
range.insertNode(document.createTextNode('a'))
```

实践

总结：什么时候选择使用range api，当有海量结点或大量dom操作的时候，当需要精确操作元素的内容的时候。它在富文本编辑器上的运用很广泛，range api的兼容性很好，因为它是html5之前出现的特性



#### CSSOM

分类：

##### 纯CSSOM

document.styleSheets：它返回页面的StyleSheetList，这个列表里主要是CSSStyleSheet实例（通过style标签或link标签引入的css，就是一个styleSheet），除CSSStyleSheet类有其他类但不常见CSSStyleSheet继承自StyleSheet，必须通过HTML或dom api去创建style结点或link结点，才能有styleSheet，这是非常严格的定义



CSSStyleSheet的属性：

* cssRules（只读）。它是一个CSSRuleList，里面主要是CSSStyleRule（还有其他类型），一个CSSStyleRule代表样式表中的一个选择器，它的索引就是该选择器的位置
* ownerNode，指CSSStyleSheet是在哪个结点中定义的，有两种类型：style和link

CSSStyleSheet的cssRules属性虽然是只读不能改，但CSSStyleSheet下面有方法可以改cssRules：

* insertRule("p { color: red; }", 0)，它设置样式时是用字符串格式，而不是对象，因为这个api比较老了，第二个参数是设置这个选择器在样式表中的位置

* removeRule(0)，删除指定索引位的选择器和样式



##### css Rule的类型整理（非全部）

* CSSStyleRule（普通Rule，最重要）
* CSSCharsetRule
* CSSImportRule
* CSSMediaRule
* CSSFontFaceRule
* CSSPageRule
* CSSNamespaceRule
* CSSKeyframesRule
* CSSKeyframeRule
* CSSSupportsRule



##### getComputedStyle

- window.getComputedStyle(elt, pseudoElt); elt 想要获取的元素
- pseudoElt可选，伪元素

##### CSSOM View (视图)

窗口api

```
let childWindow = window.open("about:blank", "_blank", "width=100,height=100,left=100,top=100");

childWindow.moveBy(-50, -50); // 向右下移动

childWindow.resizeBy(50, 50); // 长宽增加50
```

视口滚动api

```
window.scrollX

window.scrollY

window.scroll(0, 30)

window.scrollBy(0, 50)
```

元素滚动api

```
$0.scrollTo(0, 100)

$0.scrollTop

$0.scrollLeft

$0.scrollHeight

$0.getClientRects() // 元素在端上占据的位置 最准确

$0.getBoundingClientRect() // 实际渲染的区域
```

其他

```
window.innerHeight

window.innerWidth

window.outerHeight

window.outerWidth

window.devicePixelRatio
```

所有API

```
let names = Object.getOwnPropertyNames(window);
```