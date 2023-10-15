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