import React, { FC, createContext } from "react";
import useStore from "./useStore";
import { RuleItem } from "async-validator";
type modeType = 'horizonal' | 'vertical'
interface FormProps {
    children?: React.ReactNode;
    mode?: modeType;
    name?: string;
    initialValue: Record<string, any>; // 增加form 初始赋值
    rules: RuleItem[];
}
// 根据需要设置 FormContext 类型
type IFormContext = Pick<ReturnType<typeof useStore>, 'dispatch' | 'fields' | 'validateFields'> & Pick<FormProps, 'initialValue' | 'rules'>
// 类型断言
export const FormContext = createContext<IFormContext>({} as IFormContext)

export const Form : FC<FormProps> = (props) => {
    const { name, children } = props
    const { form, dispatch, fields, validateFields } = useStore()
    const initContext = { dispatch, fields: {}, initialValue: props.initialValue, rules: props.rules, validateFields}
    return (
        <form name={name}>
            <FormContext.Provider value={initContext}>
                {children}
            </FormContext.Provider>
            
        </form>
    )
}
Form.defaultProps = {
    name: 'www',
    mode: 'vertical'
}
