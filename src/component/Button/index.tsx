import classNames from "classnames";

export enum BtnSize {
    Large = 'large',
    Small = 'small',
}

export enum ButtonType {
    Primary = 'primary',
    Default = 'default',
    Success = 'success',
    Danger = 'danger',
    Link = 'link',
}

interface BaseButtonGroup {
    className?: string;
    disabled?: boolean;
    size?: BtnSize;
    btnType?: ButtonType;
    children: React.ReactNode;
    href?: string;
}

type NativeButtonProps = BaseButtonGroup & React.ButtonHTMLAttributes<HTMLElement>
export type AnchorButtonProps = BaseButtonGroup & React.AnchorHTMLAttributes<HTMLElement>
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>
// 设置属性可选

export const Button: React.FC<ButtonProps> = (props) => {
    const { disabled, size, btnType, children, href, className, ...resetProps } = props
    const classes = classNames('btn', className, {
        [`btn-${btnType}`]: btnType,
        [`btn-${size}`]:  size,
        disabled: disabled,
    })
    if(btnType === ButtonType.Link && href) {
        return (
            <a className={classes} href={href}  {...resetProps }>
                {children}
               
            </a>
        )
    } else {
        return (
            <button className={classes} disabled={disabled} {...resetProps }>
                {children}
            </button>
        )
    }

}
Button.defaultProps = {
    disabled: false,
    btnType: ButtonType.Default,
    size: BtnSize.Large
}