
import React from "react";
type MenuMode = 'horizontal' | 'vertical'
interface MenuProps {
    activeIndex?: number;
    className?: string;
    onSelect?: (index: number) => void;
    mode?: MenuMode;
    style?: React.CSSProperties;
    children: React.ReactNode
}
export const Menu: React.FC<MenuProps> = (props) => {
    const { activeIndex, onSelect, children, defaultIndex } = props
    return (
       <ul>
           { children }
       </ul>             
    )
       
}
interface MenuItemProps {
    index: number,
    disabled: boolean,
    children: React.ReactNode
}
const MenuItem = (props: MenuItemProps) => {
    const children = props.children 
    return(
        <li>
            {children}
        </li>
    )
}

