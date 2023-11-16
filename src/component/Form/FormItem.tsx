import React, { ReactNode, FC, useContext, useEffect } from "react";
import classNames from "classnames";
import  { CustomRule } from "./useStore";
import { FormContext } from "./index";
import { RuleItem } from "async-validator";
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

// 自定义异步校验。可以传入一个方法在方法中拿到其他field 值，进行自定义校验



type SomeRequired<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>

const FormItem :FC<FormItemProps> = (props) => {
    // 必填优化
    const { label, children, name, valuePropName, trigger, getValueFromEvent, validateTrigger, rules } = props as SomeRequired<FormItemProps, |'rules'| 'getValueFromEvent' | 'trigger' | 'valuePropName' | 'validateTrigger'>
    const formItemRow = classNames('formItem-row', {
        'not_label': !label
    })
    const  { fields, dispatch, initialValue, validateFields } = useContext(FormContext)

    const initValue = initialValue?.[name] || ''
    useEffect(() => {
        dispatch({
            type: 'addField',
            name,
            value: { label, name, value: initValue, isValid: true, rules },
        })
    }, [])

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

    const hasError = fieldState?.errors && fieldState.errors.length > 0


    return (
        <div className={formItemRow}>
            { label &&
                <div className="form-item-label">
                    <label title={label}>
                        {label}
                    </label>
                   
                </div>
            }
            { formItemChildren }
            { hasError &&
                <div className="form-item-error">
                    {fieldState.errors[0].message}
                </div>
            }
            
            
        </div>
    )
}

FormItem.defaultProps = {
    valuePropName: 'value',
    getValueFromEvent: (e: any) => e.target.value,
    trigger:'onChange',
    validateTrigger: 'onBlur',
}
export default FormItem