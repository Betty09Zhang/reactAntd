
import React, { FunctionComponentElement, MouseEventHandler, useContext, useState } from "react";
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
    mode?: MenuMode;

}
const MenuContext = createContext<IMenuContent>({
    index:0,
    mode: 'horizontal',
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
    const classes = classNames('menu',   mode === 'vertical' ? 'menu-vertical' : 'menu-horizontal')
    const valueContext: IMenuContent = {
        index: currentActive ? currentActive : 0,
        onSelect: (index) => handleClick(index),
        mode: props.mode,
    }
    return (
        <ul className={classes}>
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
MenuItem.displayName = 'MenuItem'
/**
 * 
 * Menu
 *  MenuItem
 *  Menu.Sub
 *      MenuItem
 *      /Menuitem
 *      MenuSub
 *      /MenuSub
 * /Menu.Sub
 * /MenuItem
 * /Menu
 * @returns 
 */
interface SubMenuProps {
    index: number;
    title?: string;
    className?: string;
    children?: React.ReactNode;
}
export const SubMenu: React.FC<SubMenuProps> = (props) => {
    const [ menuOpen, setOpen ] = useState(false)

    const { title, children, index } = props
    const context = useContext(MenuContext)
    const classes = classNames('menu-item', 'submenu-item', {
        'is-active': context.index === index,
        'menu-opened': menuOpen
    })
    
    const renderChildren = () => {
        const classes = classNames('menu-submenu', {
            'menu-opened': menuOpen
        })
        const childrenComponent = React.Children.map(children, (child, i) => {
            const childElem = child as FunctionComponentElement<MenuItemProps>
            if (childElem.type.displayName === 'MenuItem' || childElem.type.displayName === 'SubMenu' ) {
                // return(
                //     <MenuItem index={i}>
                //     </MenuItem>
                // )
                return React.cloneElement(childElem, {
                    index: i,
                })
            }
            //  else if(childElem.type.displayName === 'SubMenu'){
            //     return(
            //         <SubMenu index={i}>{childElem}</SubMenu>
            //     )
            // }   
           
        })
        return (
            <ul className={classes}>
                { childrenComponent }
            </ul>
        )
    }
   
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        if (context.onSelect) {
            context.onSelect(index)
        }
        setOpen(!menuOpen)
    }
    const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
        e.preventDefault()
        setOpen(toggle)

    }
    const hoverEvents = context.mode === 'horizontal' ? {
        onMouseEnter: (e: React.MouseEvent) => {handleMouse(e, true)},
        onMouseLeave: (e: React.MouseEvent) => {handleMouse(e, false)},
    } : {}

    const clickEvents = context.mode === 'vertical' ?{
        onClick: (e: React.MouseEvent) => { handleClick(e)}
    } : {}
    return (
        <li key={index} className={classes} {...hoverEvents}>
            <div className="submenu-title" {...clickEvents}>
                { title }
            </div>
            {renderChildren()}
        </li>
    )
}

SubMenu.displayName = 'SubMenu'


