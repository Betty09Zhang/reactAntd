import React from 'react';
import { BtnSize, Button, ButtonType } from './component/Button';
// import './App.css';
import { SubMenu, Menu, MenuItem } from './component/Menu';
import FormItem from './component/Form/FormItem';
import { Form } from './component/Form';
import type { RuleItem, ValidateError } from 'async-validator';
import { CustomRule } from './component/Form/useStore';
function App() {
  var data = [
    {
      name:'手机 / 运营商 / 数码',
      child:[
      {name:'热门分类',child:[{name:'手机卡'},{name:'宽带'},{name:'5G套餐'}]},
      {name:'品牌墙',child:[{name:'中国移动',child:[{name:'北京移动'},{name:'广东移动'},{name:'湖北移动'}]},{name:'中国联通',child:[{name:'手机卡'},{name:'5G专区'}]},{name:'中国电信',child:[{name:'流量包'},{name:'5G会员特权',child:[{name:'星卡-大流量'}]}]}]},
      {name:'官方旗舰店',child:[{name:'北京电信'},{name:'上海移动'},{name:'湖北电信'},{name:'四川联通'}]},
      {name:'精选店铺',child:[{name:'落基伟业',child:[{name:'装宽带'},{name:'办号卡'}]},{name:'恒联华峰',child:[{name:'随身WIFI'},{name:'资费专区'}]}]}
      ]
    },
    {
      name:'汽车 / 汽车用品',
      child:[
        {name:'机油养护',child:[{name:'机油'},{name:'添加剂'}]},
        {name:'轮胎配件',child:[{name:'轮胎',child:[{name:'米其林'},{name:'德国马牌'},{name:'普利司通'}]},{name:'配件',child:[{name:'蓄电池'},{name:'火花塞'}]}]},
        {name:'车载电器',child:[{name:'行车记录仪'},{name:'车载充电器'},{name:'车载冰箱'},{name:'车载净化器'}]},
        {name:'汽车装饰',child:[{name:'汽车香水',child:[{name:'朗龙'},{name:'香百年'},{name:'图雅'}]},{name:'车载支架',child:[{name:'飞利浦'}]}]},
      ]
    },
    {
      name:'母婴 / 玩具乐器',
      child:[{name:'母婴',child:[{name:'品质奶粉'},{name:'妈妈专区'},{name:'童车童床'}]},
        {name:'玩具',child:[{name:'益知玩具'},{name:'遥控电动'},{name:'积木拼插'},{name:'动漫模型'}]},
        {name:'乐器'}]
    }];
    const MenuData = (data: any ) => {
      return data.map((item: any, i: number) => {
        if(!item.child) {
         return (
           <MenuItem index={ i }>{ item.name}</MenuItem> 
         )
        } else {
         return (
           <SubMenu title= {item.name} index={ i }>
              { MenuData(item.child)}
           </SubMenu>
         )
        }   
     })
    }

    const initValue = {username:  'cC' }
    const rules :RuleItem[] = [
     {
        type: 'string',
        required: true,
        message: 'Name is required' 
      }
    ]

    // 接受一个对象中包含key 为 getValueField的值 函数，传递进来
    const customRules : CustomRule[] = [
      ({getValueField}) => ({
        asyncValidator(rule, value){
            const name = getValueField('username')
            if (value === name) {
              return Promise.reject('同名。。')
            }
            return Promise.resolve()
        } 
      })
    ]

    const finishForm = (error: ValidateError) => {
      console.log('error', error);
      
    }
  return (
   
    <div className="App">
      {/* <Menu>
        { MenuData(data)}
      </Menu> */}
      {/* <Menu mode='horizontal'>
        <MenuItem index={0} disabled={false} >111</MenuItem>
        <MenuItem index={1} >22</MenuItem>
        <MenuItem index={2} >32</MenuItem>
        <SubMenu title= "2级" index={4}>
          <SubMenu title="3级" index={0}>
            <SubMenu title="4级" index={1}>
              <MenuItem index={3} >41</MenuItem>
              <MenuItem index={4} >42</MenuItem>    
            </SubMenu>
          </SubMenu>
        </SubMenu>
      </Menu> */}
      {/* <Button onClick={() => alert(11)}>Default</Button>
      <Button disabled>Default disabled</Button>
      <Button btnType={ ButtonType.Success} size={ BtnSize.Large}>Test</Button>
      <Button btnType={ ButtonType.Primary} size={ BtnSize.Large}>Test</Button>
      <Button btnType={ButtonType.Link} href='http://www.baidu.com' target='_blank' size={BtnSize.Small}>link</Button> */}
      <Form initialValue= { initValue } onFinishFailed={ finishForm }>
        {({isValid}) => (
          <><FormItem label="用户名" name="username" rules={rules}>
            <input />
          </FormItem><FormItem label="密码" name="password" rules={customRules}>
              <input type="password" />
            </FormItem><Button>{isValid ? 'ok': 'false'}</Button></>

        )}
        </Form>
        
    </div>
  ); 
}

export default App;
