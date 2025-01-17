import { useEffect, useState } from 'react';

/**
 * 输入框显示隐藏
 */
export const useVisible = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        e.stopPropagation();
        setVisible(true);
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return { visible, setVisible };
};
