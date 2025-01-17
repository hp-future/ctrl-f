import ReactDOM from 'react-dom/client';
import htmlText from '../html.txt?raw';
import CtrlFToolbar from './CtrlFToolbar';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <CtrlFToolbar>
    <div dangerouslySetInnerHTML={{ __html: htmlText }}></div>
  </CtrlFToolbar>
);
