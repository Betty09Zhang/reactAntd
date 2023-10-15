import React from 'react';
import { BtnSize, Button, ButtonType } from './component/Button';
// import './App.css';
function App() {
  return (
    <div className="App">
      <Button onClick={() => alert(11)}>Default</Button>
      <Button disabled>Default disabled</Button>
      <Button btnType={ ButtonType.Success} size={ BtnSize.Large}>Test</Button>
      <Button btnType={ ButtonType.Primary} size={ BtnSize.Large}>Test</Button>
      <Button btnType={ButtonType.Link} href='http://www.baidu.com' target='_blank' size={BtnSize.Small}>link</Button>
    </div>
  ); 
}

export default App;
