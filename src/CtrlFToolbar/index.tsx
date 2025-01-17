import React, { useEffect, useRef, useState } from 'react';
import { useVisible } from './hooks/useVisible';

export default function CtrlFToolbar(props: React.PropsWithChildren) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const markContainerRef = useRef<HTMLDivElement>(null);

  const [markEles, setMarkEles] = useState<HTMLElement[]>([]);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const lastMarkEle = markContainerRef.current?.querySelector<HTMLElement>('[mark=true]');
    lastMarkEle?.removeAttribute('mark');
    lastMarkEle?.style.setProperty('background-color', 'rgb(253 253 6 / 50%)');
    const markEle = markEles[index];
    markEle?.scrollIntoView({ block: 'center' });
    markEle?.setAttribute('mark', 'true');
    markEle?.style.setProperty('background-color', 'rgb(255 124 0 / 60%)');
  }, [index, markEles]);
  const markHandle = (value: string) => {
    const contentEle = contentRef.current!;
    // 清空所有mark标记
    markContainerRef.current?.replaceChildren();
    if (!value) return;

    // 通过xpath查找相关节点
    const xpath = `//*[contains(text(),"${value}")]`;
    const targetElements = document.evaluate(xpath, contentEle, null, XPathResult.ANY_TYPE, null);
    let result = targetElements.iterateNext() as HTMLElement;
    const eles = [];
    while (result) {
      eles.push(result);
      result = targetElements.iterateNext() as HTMLElement;
    }
    // 创建mark标记
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
      markContainerRef.current?.appendChild(span);
      marks.push(span);
    });
    setIndex(0);
    setMarkEles(marks);
  };

  const entering = useRef(false);
  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (entering.current) return;
    markHandle(e.target.value);
  };
  const onCompositionStart = () => {
    entering.current = true;
  };
  const onCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    entering.current = false;
    markHandle((e.target as HTMLInputElement).value);
  };

  const { visible, setVisible } = useVisible();
  const onClose = () => {
    setVisible(false);
    markContainerRef.current?.replaceChildren();
    setMarkEles([]);
    setIndex(0);
  };

  return (
    <div ref={wrapperRef} style={{ height: '100%', position: 'relative' }}>
      {visible && (
        <div
          style={{
            position: 'absolute',
            top: 30,
            right: 50,
            background: '#fff',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 8px',
            borderRadius: 4,
            border: '1px solid #d9d9d9',
            backgroundColor: '#fff',
          }}
        >
          <input
            type="text"
            style={{ width: 260, height: 22, lineHeight: '22px', border: 'none', padding: 0, outline: 'none' }}
            autoFocus
            onInput={onInput}
            onCompositionStart={onCompositionStart}
            onCompositionEnd={onCompositionEnd}
          />
          <span>
            {markEles.length ? index + 1 : 0}/{markEles.length}
          </span>
          <div style={{ width: 1, backgroundColor: '#d9d9d9', height: '100%' }}></div>
          <button
            type="button"
            onClick={() => {
              if (markEles.length === 0) return;
              if (index === 0) {
                setIndex(markEles.length - 1);
              } else {
                setIndex(index - 1);
              }
            }}
          >
            上一个
          </button>
          <button
            type="button"
            onClick={() => {
              if (markEles.length === 0) return;
              if (index === markEles.length - 1) {
                setIndex(0);
              } else {
                setIndex(index + 1);
              }
            }}
          >
            下一个
          </button>
          <button type="button" onClick={onClose}>
            关闭
          </button>
        </div>
      )}
      <div ref={contentRef} style={{ height: '100%', overflow: 'auto', position: 'relative' }}>
        {props.children}
        <div
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 998, height: 0, pointerEvents: 'none' }}
          ref={markContainerRef}
        />
      </div>
    </div>
  );
}
