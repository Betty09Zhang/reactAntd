import React from 'react';
import { BtnSize, Button, ButtonType } from './component/Button';
// import './App.css';
import { SubMenu, Menu, MenuItem } from './component/Menu';
function App() {
  return (
    <div className="App">
      <Menu>
        <MenuItem index={0} disabled={false} >111</MenuItem>
        <SubMenu></SubMenu>
      </Menu>
      <Button onClick={() => alert(11)}>Default</Button>
      <Button disabled>Default disabled</Button>
      <Button btnType={ ButtonType.Success} size={ BtnSize.Large}>Test</Button>
      <Button btnType={ ButtonType.Primary} size={ BtnSize.Large}>Test</Button>
      <Button btnType={ButtonType.Link} href='http://www.baidu.com' target='_blank' size={BtnSize.Small}>link</Button>
    </div>
  ); 
}

export default App;
