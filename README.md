[在线demo](https://hp-future.github.io/ctrl-f/)

**核心逻辑：利用 `xpath`+`range` 标记相关节点**

1、首先通过`xpath`查找相关节点

```typescript
/**
 * value: 关键词
 * contentContainer：内容区域
 * eles：查找的节点集合
 */
const xpath = `//*[contains(text(),"${value}")]`;
const targetElements = document.evaluate(xpath, contentContainer, null, XPathResult.ANY_TYPE, null);
let result = targetElements.iterateNext() as HTMLElement;
const eles = [];
while (result) {
    eles.push(result);
    result = targetElements.iterateNext() as HTMLElement;
}
```

2、遍历查找的节点集合，使用`range`标记节点

```typescript
/**
 * marks：标记集合
 * markContainer：标记容器
 */
const marks: HTMLElement[] = [];
eles.forEach((ele) => {
  const startNode = ele.firstChild!;
  const index = ele.textContent!.indexOf(value);
  const range = document.createRange();
  range.setStart(startNode, index);
  range.setEnd(startNode, index + value.length);
  const { width, height, top, left } = range.getBoundingClientRect();
  const span = document.createElement('span');
  span.style.cssText = `width:${width}px;height:${height}px;position:absolute;top:${top}px;left:${left}px;background-color:rgb(253 253 6 / 50%);`;
  markContainer.appendChild(span);
  marks.push(span);
});
```

注意：`markContainer`应处于`contentContainer`的滚动区域内，否则标记的位置计算不准
