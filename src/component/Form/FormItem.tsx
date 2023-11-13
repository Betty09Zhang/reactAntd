import { ReactNode, FC } from "react";
import classNames from "classnames";
interface FormItemProps {
    label?: string;
    children?: ReactNode
}

const FormItem :FC<FormItemProps> = (props) => {
    const { label, children } = props
    const formItemRow = classNames('formItem-row')
    
    return (
        <div className={formItemRow}>
            { label &&
                <div className="form-item-label">
                    <label title={label}>
                        {label}
                    </label>
                </div>
            }
            { children }
        </div>
    )
}
export default FormItem