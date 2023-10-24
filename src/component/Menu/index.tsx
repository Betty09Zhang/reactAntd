
import React, { FunctionComponentElement, useContext, useState } from "react";
import classNames from 'classnames';
import { createContext } from "react";

type SelectCallback = (index: number) => void
type MenuMode = 'horizontal' | 'vertical'

// 配置Menu 的激活项
interface MenuProps {
    activeIndex?: number;
    className?: string;
    onSelect?: SelectCallback;
    mode?: MenuMode;
    style?: React.CSSProperties;
    children?: React.ReactNode
}
interface IMenuContent {
    index: number;
    onSelect?: SelectCallback;

}
const MenuContext = createContext<IMenuContent>({
    index:0,
})


export const Menu: React.FC<MenuProps> = (props) => {
    const { activeIndex, onSelect, children, mode } = props
    const [currentActive, setActive] = useState(activeIndex)
    const handleClick = (index: number) => {
        setActive(index)
        if(onSelect) {
            onSelect(index)
        }
    }
    const valueContext: IMenuContent = {
        index: currentActive ? currentActive : 0,
        onSelect: (index) => handleClick(index)
    }
    return (
        <ul>
            <MenuContext.Provider value={valueContext}>
            { children }
            </MenuContext.Provider>
        </ul>               
    )
       
}
interface MenuItemProps {
    index: number;
    disabled?: boolean;
    children?: React.ReactNode;
    className?: String;
    style?: React.CSSProperties;
}
export const MenuItem = (props: MenuItemProps) => {
    const { index, disabled, children, className, style } = props
    const context = useContext(MenuContext)
    const classes = classNames('menu-item', {'is-disabled': disabled ? true : false },
        {'is-active':context.index === index })
    const handleClick = () => {
        if (context.onSelect && !disabled) {
            context.onSelect(index)
        }
    }
    return(
        <li className={classes} style={style} onClick={ handleClick }>
            {children}
        </li>
    )
}
/**
 * 
 * Menu
 *  MenuItem
 *  Menu.Sub
 *      MenuItem
 *      Menuitem
 * /Menu.Sub
 * /MenuItem
 * /Menu
 * @returns 
 */
interface SubMenuProps {
    index: number;
    title: string;
    className?: string;
    children?: React.ReactNode;
}
export const SubMenu: React.FC<SubMenuProps> = (props) => {
    const { title, children } = props
    const renderChildren = () => {
        const childrenComponent = React.Children.map(children, (child, i) => {
            const childElem = child as FunctionComponentElement<MenuItemProps>
            if (childElem.type.displayName === 'MenuItem') {
                return(
                    <MenuItem index={i}>
                    </MenuItem>
                )
            }
           
        })
        return (
            <ul>
                { childrenComponent }
            </ul>
        )
    }
    return (
        <li>
            <div>
                { title }
            </div>
            {renderChildren()}
        </li>
    )
}


