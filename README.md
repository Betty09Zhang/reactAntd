

# 构建前端组件库

## react hook

💡 hooks 解决class组件 加入 state 数据状态 改为FC函数组件引入 state hooks 方案,实现数据解耦。

useState，useEffect

- 支持导入导出 `markdown` 文件。
- 无需清除副作用

eg: 更新异步state 数据。在class 组件中，需要在componentDidMount 和 componentDidUpdate 中更新 异步数据渲染， 

- 需要清除副作用。

eg: 事件监听

每次组件渲染就会调用一次 effect

清除一个组件的Effect

```typescript
const mouseTrackFC : React.FC = (props) => {
  const { position, setPosition } = useState({ x: 0, y: 0})
  useEffect(() => {
    const updateMouse = (e: MouseEvent) => {
      setPosition({x: e.clientX, y: e.clientY})
    }
    document.addEventListener('click', updateMouse)

    return () => {
      document.removeEventListener('click', updateMouse)
    }
  })
  return (
    <span>X:{ position.x}, Y: { position.y }</span>
  )
}
```

react 组件卸载，移除清除effect

- 限制effect  调用次数

eg: 抽取公共逻辑代码，降低需要编写高阶组件带来的复杂度。比如我们想要给请求增加loading 效果。如果考虑 class 写法，利用HOC, 传入wrapped 组件，返回新的组件，十分繁琐如下：

```javascript
import React from "react"
export const DogCom = ({ data }) => {
  return (
    <div>
      <p>{data}</p>
    </div>
  )
}
export const hocCom = (WrappedComponent, url) => {

  return class LoaderComponent extends React.Component {
    constructor(props) {
      super()
      this.state = {
        data: null,
        loading: false
      }
    }
    componentDidMount() {
      this.setState({
        data: 'success',
        loading: true,
      })
      setTimeout(() => {
        console.log('test axios request');
        this.setState({
          data: 'success',
          loading: false
        })
      }, 4000)
    }
    render() {
      const { data, loading } = this.state
      return (
        <div>
          {loading ? <span>加载。。。</span> :
            <WrappedComponent {...this.props
          } data={data}></WrappedComponent>}
        </div>
      )
    }
  }
}
import  './App.css';
import { DogCom, hocCom } from './Hello'
function App() {
  const WrappedCom = hocCom(DogCom)
  return (
    <div className="App">
    <WrappedCom /> 
    </div>
  );
}

export default App;
```



## creat-react-app

💡 Tips：可通过 markdown 语法（```+ `code` + ``` + `空格`）或者快捷键 `ctrl/cmd` + `E`快速插入行内代码。

- 添加样式文件（https://create-react-app.dev/docs/adding-a-css-modules-stylesheet）

在以webpack 构建的应用中，一般通过 import 导入样式文件。但是在React中不支持，对于以[name].module.css 文件允许 import，在jsx 中以js  的方式引入。项目引用 sass 模块样式（https://create-react-app.dev/docs/adding-a-sass-stylesheet）。node-sass 会编译scss 后缀文件为 css, 对于 partial 以_variable.scss 下划线命名的文件，会跳过编译，以下划线开头命名的文件只能import 导入。**Sass可以把Sass文件当做一个组件引入而不会把这个组件单独编译成css文件，而想要实现这个功能只需要在文件名前面加上一个下划线就可以了**。并且@import 的文件不会有html请求，且不需要加下划线，import 导入css 文件则会有这个问题。Sass 中的 @import 规则在生成 CSS 文件时就把相关文件导入进来，不需要额外的 HTTP 请求。

在jsx 中给组件增加class 样式， 手动拼接会很麻烦，可以通过 className小工具(https://github.com/JedWatson/classnames)

## 组件库文档搭建与打包

💡 Tips：采用storybook, 底层通过webpack 构建静态服务器

https://storybook.js.org/tutorials/intro-to-storybook/react/zh-CN/get-started/

1. 打包工具module bundle 原理：

tsx ->tsc 编译 es6 module jsx -> 入口文件引入需要的文件 -> webpack/ rollup module bundle 生成一系列 js 文件 -> js 文件插入html中

commonjs es6module （用户使用特殊的module bundle 才能使用，如 webpack/rollup）amd(通过require.js 使用)

umd(可在浏览器直接使用，通用 javascript 模块格式)

在组件打包之前，我们需要在package.json 的 main 属性中添加引入的文件，这里为 index.js。在根目录的 index.js 文件中需要导出所有打包的组件，对于一些组件，想要挂载在另外的组件上需要新建一个交叉类型

```jsx
import { Menu, MenuProps}  from './Menu'
import { MenuItem, MenuItemProps } from './MenuItem'
import { FC }  from 'react'
export type IMenuComponent = FC<MenuProps> & {
  Item: FC<MenuItemProps>,
}
const TransMenu = Menu as IMenuComponent
TransMenu.Item = MenuItem
```

1. tsx 文件编译打包

创建 tsconfig.build.json 文件，包含compileOptions 等 files 文件属性，运行 tsc 命令。tsc -p tsconfig.build.json

```json
{
  "compilerOptions": {
    "outDir": "build",
    "target": "es5",
    "module": "ESNext",
    "declaration": true,
    "jsx": "react-jsx",
    "moduleResolution": "node", // 以node 的方式寻找依赖；默认typescript 会沿着相对路径向上寻找
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true, // 将 import React from 'react' 自动转化为 import * as React from 'react'
    // "isolatedModules": true,
    "noEmit": true,
  },
  "include": [
    "src"
  ],
  "exclude": [
    "src/**/*.stories.tsx",
    "src/**/*.test.tsx",
  ]
}
```



1. scss样式文件编译为css

通过 node-sass 编译。（https://github.com/sass/node-sass）

node-sass [options] <input> [output] Or: cat <input> | node-sass > output

Example:

node-sass src/style.scss dest/style.css

```json
{
  "name": "component-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/classnames": "^2.3.1",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.18.58",
    "@types/react": "^18.2.25",
    "@types/react-dom": "^18.2.11",
    "classnames": "^2.3.2",
    "node-sass": "^7.0.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "sass": "^1.69.3",
    "typescript": "^4.9.5",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "clean": "rimraf ./build",
    "build": "npm run clean && npm run build-ts && npm run build-sass",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "build-ts": "tsc -p tsconfig.build.json",
    "build-sass": "node-sass ./src/style/index.scss ./build/index.css "
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest",
      "plugin:storybook/recommended"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "@storybook/addon-essentials": "^7.4.6",
    "@storybook/addon-interactions": "^7.4.6",
    "@storybook/addon-links": "^7.4.6",
    "@storybook/addon-onboarding": "^1.0.8",
    "@storybook/blocks": "^7.4.6",
    "@storybook/preset-create-react-app": "^7.4.6",
    "@storybook/react": "^7.4.6",
    "@storybook/react-webpack5": "^7.4.6",
    "@storybook/testing-library": "^0.2.2",
    "babel-plugin-named-exports-order": "^0.0.2",
    "eslint-plugin-storybook": "^0.6.15",
    "prop-types": "^15.8.1",
    "storybook": "^7.4.6",
    "webpack": "^5.89.0"
  }
}
```

Form 表单组件构思：

1. 组件结构

伪代码：

```tsx
<Form>
	<Item>
    	<Input/>
    </Item>
</Form>
```

2. 组件内维护的数据结构

```tsx
// Field store 结构
store = {
    username: { name: '', value: '', rules: [], isValid: false, errors: []}
}
```

每个表单Item 维护一个唯一的prop

3. 数据传递

react 为单向数据流，我们在顶级Form 中通过注入Context ,在各代子组件中中可以拿到响应式数据。同时Context 中传递的变量, 通过state 维护。在Input 、Radio、Select 等受控组件中，我们可以通过Context注入设置初始值，与此同时我们触发受控组件的change 事件 或其他事件时，我们更新注入的变量值以此来达到数据的动态更新。（此处为触发一个方法，可利用useReducer 来实现）

4. 表单校验

使用 async-validator 三方件，验证数据。

 5. 实现

    逻辑的处理写在 hooks 中。其中包含一些typescript 技巧的使用。

    5.1 在useStore.ts 中 考虑提供验证、异步分发

​		FieldDetail 结构

```tsx
export interface FieldDetail {
    name: string;
    value: string;
    rules: CustomRule[];
    isValid: boolean;
    errors: any[];
}
```

通过 useReducer 分发事件

```tsx
function fieldsReducer(state: FieldsState, action: FormAction) {
    switch (action.type) {
        case 'addField': 
            return {
                ...state,
                [action.name]: {
                    ...action.value
                }
            }
        case 'updateField':
            return {
                ...state,
                [action.name]: {
                    ...state[action.name],
                    value: action.value
                }
            }
        case 'updateValidateFields':
            console.log('updateValidateFields', state[action.name])
            return {
                ...state,
                [action.name]: {
                    ...state[action.name],
                    isValid: action.value.isValid,
                    errors: action.value.errors,
                    value: action.value.value
                }
            }
        default: return state

    }
}

function useStore() {
    // 更新表单form 信息
    const [form, setForm] = useState<FormState>({ isValid: false})
    // 更新各个fields 信息
    const [fields, dispatch ] = useReducer(fieldsReducer, {})
    let isValid = true
    let errors: ValidateError[] = []
    const getValueField = (name: string) => {
        return fields[name].value
    }
    const transfromRules = (rules: CustomRule[]) => {
        return rules.map(rule => {
            if(typeof rule === 'function') {
                return rule({getValueField})
            }
            return rule
        })
    }
    const validateFields = async (name: string) => {
        const {value, rules} = fields[name]
        const descriptorRules = transfromRules(rules)
        const validator = new Schema({[name]: descriptorRules[0]})
        try {
            await validator.validate({[name]: value}) 
        } catch (e) {
            const err = e as any
            isValid = false
            errors = err.errors
        } finally {
            dispatch({
                type: 'updateValidateFields',
                name,
                value: {
                    value,
                    isValid,
                    errors
                }
            })
        }  
    }

    interface ValidateFieldError {
        fields: Record<string, ValidateError[]>;
        errors: ValidateError[];
    }

    const validateAllFields = async () => {
        // var users = {
        //     'fred':    { 'user': 'fred',    'age': 40 },
        //     'pebbles': { 'user': 'pebbles', 'age': 1 }
        //   };
           
        //   _.mapValues(users, function(o) { return o.age; });
          // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
        // 处理fields 对象， 返回新的对象 {username: '123', password: 'wwww'}
        const newFields = mapValues(fields, (o) => {
            return o.value
        })
        const descriptor = mapValues(fields, (o) => transfromRules(o.rules))
        let errors: Record<string, ValidateError[]> = {}
        let isValid = true
        try {
            await new Schema(descriptor).validate(newFields)  
        } catch (e) {
            const err = e as ValidateFieldError
            isValid = false
            errors = err.fields 
        } finally {
            // 迭代数组或是对象
            each(fields, (value, key) => {
                const err = errors[key]
                if (err) {
                    dispatch({
                        type: 'updateValidateFields',
                        name: key,
                        value: {
                            isValid: false,
                            errors: err,
                            value: value.value,
                        }
                    })
                } else if (value.rules.length){
                    dispatch({
                        type: 'updateValidateFields',
                        name: key,
                        value: {
                            isValid: true,
                            value: value.value,
                            errors: []
                        }
                    })
                }
               
            })

            setForm({ isValid })
            return {
                isValid,
                errors,
                fields: newFields
            }
            
           
        } 
        


    }
    return {
        fields,
        dispatch,
        form,
        validateFields,
        validateAllFields,
    }
}
```

在 typescript 中，我们有时 给了defaultProp 中某些变量的默认值，但是还是会有undefined 提示，这时我们可以巧妙处理数据类型。

```tsx
interface FormItemProps {
    name: string;
    label?: string;
    children?: ReactNode
    valuePropName?: string; // 子元素取值
    trigger?: string; // 子元素触发的方法
    getValueFromEvent?: (...args: any[]) => any; // 触发事件取值
    validateTrigger?: string;
    rules?: CustomRule[];
}

FormItem.defaultProps = {
    valuePropName: 'value',
    getValueFromEvent: (e: any) => e.target.value,
    trigger:'onChange',
    validateTrigger: 'onBlur',
}

```

'getValueFromEvent' | 'trigger' | 'valuePropName' | 'validateTrigger'

```tsx
type SomeRequired<T, K keysof T> = Required<Pick<T,  K>> & Omit<T, k>
```

在类型断言中使用 SomeRequired

```tsx
const { label, children, name, valuePropName, trigger, getValueFromEvent, validateTrigger, rules } = props as SomeRequired<FormItemProps, 'getValueFromEvent' | 'trigger' | 'valuePropName' | 'validateTrigger'>
```

5.2 通过cloneElement 方法给（子组件）受控组件添加事件以及属性

```tsx
 // 得到对应 formItem name 对应的 fields值
    const fieldState = fields[name]

    
    // 手动创建一个children属性列表
    const controlProps: Record<string, any> = {
        [valuePropName!]: fieldState?.value || '',
    }
    controlProps['onChange'] = (e: any) => {
        // 这里typescript 需要判空处理该方法； 可以优化FormItemProps 接口，设置必选
        const value = getValueFromEvent(e)
        dispatch({
            type: 'updateField',
            name,
            value,
        })
    }

    if (rules) {
        controlProps[validateTrigger] = async () => {
            await validateFields(name)
        }
    }

   
    // 通过cloneElement 克隆 增加其他的属性到子元素
    const childList = React.Children.toArray(children)
    const child = childList[0] as React.ReactElement
    const formItemChildren = React.cloneElement(child,  {
        ...child.props,
        ...controlProps
    })
```

5.3 通过传递function(renderProp) 式渲染子组件。

eg:

```list.tsx
import { useState } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext.Provider
            key={item.id}
            value={isHighlighted}
          >
            {renderItem(item)}
          </HighlightContext.Provider>
        );
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}

```



```tsx
<List
  items={products}
  renderItem={product =>
    <Row title={product.title} />
  }
/>
```

在 form.tsx 组件内部，可以接受children 为一个 function。在Form封装组件的内部，可以将form 变量传递到子组件中。

```App.tsx
  <Form initialValue= { initValue } onFinishFailed={ finishForm }>
        {({isValid}) => (
          <><FormItem label="用户名" name="username" rules={rules}>
            <input />
          </FormItem><FormItem label="密码" name="password" rules={customRules}>
              <input type="password" />
            </FormItem><Button>{isValid ? 'ok': 'false'}</Button></>

        )}
        </Form>
```

```tsx
export const Form : FC<FormProps> = (props) => {
    const {children, onFinish, onFinishFailed } = props
    const { form, dispatch, fields, validateFields, validateAllFields } = useStore()
    console.log('fields: ', fields);
    
    const initContext: IFormContext = { dispatch, fields, initialValue: props.initialValue, rules: props.rules, validateFields}
    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.stopPropagation()
        e.preventDefault()
        const { isValid,errors,fields} = await validateAllFields()
        if(isValid){
            onFinish && onFinish(fields)
        } else {
            onFinishFailed && onFinishFailed(errors)
        }
    }

    // 利用 renderProp 对子节点等进行函数式渲染。
    let childrenNodes: React.ReactNode
   
    if(typeof children === 'function') {
        // 内部funcChildren 传递一个 form 对象，在使用组件时，children 可以接收该参数
        childrenNodes = children(form)
    } else {
        childrenNodes = children
    } 
    
    return (
        <form onSubmit={submitForm}>
            <FormContext.Provider value={initContext}>
                {childrenNodes}
            </FormContext.Provider>
            
        </form>
    )
}
Form.defaultProps = {
    mode: 'vertical'
}
```



5.4 [async-validator](https://github.com/yiminghe/async-validator) 异步验证器的改造使用。

异步验证器的使用

```tsx
import Schema from 'async-validator';
const descriptor = {
  name: {
    type: 'string',
    required: true,
    validator: (rule, value) => value === 'muji',
  },
  age: {
    type: 'number',
    asyncValidator: (rule, value) => {
      return new Promise((resolve, reject) => {
        if (value < 18) {
          reject('too young');  // reject with error message
        } else {
          resolve();
        }
      });
    },
  },
};
const validator = new Schema(descriptor);
validator.validate({ name: 'muji' }, (errors, fields) => {
  if (errors) {
    // validation failed, errors is an array of all errors
    // fields is an object keyed by field name with an array of
    // errors per field
    return handleErrors(errors, fields);
  }
  // validation passed
});

// PROMISE USAGE
validator.validate({ name: 'muji', age: 16 }).then(() => {
  // validation passed or without error message
}).catch(({ errors, fields }) => {
  return handleErrors(errors, fields);
});
```

在使用Form表单时，我们可能再 asyncValidator 方法中，使用到其他变量的值，可是自动接收的传参只有rules 和当前表单的value 值，简单的封装思路如下：我们可以考虑rules 中传递一个函数，该函数接收一个对象传参，其中有一个方法名为“xxx”, 这里为 getValueField, 我们在 Form 表单校验调用validateAllFields方法中处理，在该方法中，其实也是走的async-validator 三方件内部的校验方法，只是在外层包了一层函数，并将getValueFields 方法作为传参传递进去即可，形成闭包。

```tsx
    const transfromRules = (rules: CustomRule[]) => {
        return rules.map(rule => {
            if(typeof rule === 'function') {
                return rule({getValueField})
            }
            return rule
        })
    }
    
    const validateAllFields = async () => {
    const newFields = mapValues(fields, (o) => {
        return o.value
    })
    const descriptor = mapValues(fields, (o) => transfromRules(o.rules))
    let errors: Record<string, ValidateError[]> = {}
    let isValid = true
    try {
        await new Schema(descriptor).validate(newFields)  
    } catch (e) {
        const err = e as ValidateFieldError
        isValid = false
        errors = err.fields 
    } finally {
        // 迭代数组或是对象
        each(fields, (value, key) => {
            const err = errors[key]
            if (err) {
                dispatch({
                    type: 'updateValidateFields',
                    name: key,
                    value: {
                        isValid: false,
                        errors: err,
                        value: value.value,
                    }
                })
            } else if (value.rules.length){
                dispatch({
                    type: 'updateValidateFields',
                    name: key,
                    value: {
                        isValid: true,
                        value: value.value,
                        errors: []
                    }
                })
            }

        })

        setForm({ isValid })
        return {
            isValid,
            errors,
            fields: newFields
        }   
    } 
    }
```



实际中使用：

```App.tsx
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
    
     <Form initialValue= { initValue } onFinishFailed={ finishForm }>
        {({isValid}) => (
          <><FormItem label="用户名" name="username" rules={rules}>
            <input />
          </FormItem><FormItem label="密码" name="password" rules={customRules}>
              <input type="password" />
            </FormItem><Button>{isValid ? 'ok': 'false'}</Button></>

        )}
       </Form>
```
