
import React from "react";
type MenuMode = 'horizontal' | 'vertical'
interface MenuProps {
    activeIndex?: number;
    className?: string;
    onSelect?: (index: number) => void;
    mode?: MenuMode;
    style?: React.CSSProperties;
    children?: React.ReactNode
}
export const Menu: React.FC<MenuProps> = (props) => {
    const { activeIndex, onSelect, children } = props
    return (
       <ul>
           { children }
       </ul>             
    )
       
}
interface MenuItemProps {
    index: number,
    disabled?: boolean,
    children?: React.ReactNode
}
export const MenuItem = (props: MenuItemProps) => {
    const children = props.children 
    return(
        <li>
            {children}
        </li>
    )
}
export const SubMenu = (props:MenuProps) => {
    const data = [{ title: '123'}, { title: '456'}, { title: '789'}]
    const WrapperCom = data.map((item, index) => {
        return (
            <MenuItem index={index}   >{item.title}</MenuItem>
        )
    })
    return (
        <Menu>
            {WrapperCom}
        </Menu>
    )
}


