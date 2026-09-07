import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import {JSONEditor} from '.';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <JSONEditor tabSize={2} onChange={console.log} />
  </StrictMode>
);
