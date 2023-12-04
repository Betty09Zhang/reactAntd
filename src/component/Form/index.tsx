import React, { FC, createContext } from "react";
import useStore, {FormState} from "./useStore";
import { RuleItem, ValidateError } from "async-validator";

type modeType = 'horizonal' | 'vertical'
// 定义的FuncChildren 接收一个参数
type FuncChildren = (values: FormState) => React.ReactNode;
interface FormProps {
    children?: React.ReactNode | FuncChildren;
    mode?: modeType;
    initialValue?: Record<string, any>; // 增加form 初始赋值
    rules?: RuleItem[];
    onFinish?: (values: Record<string, any>) => void;
    onFinishFailed?: (errors: Record<string, ValidateError[]>) => void;
}
// 根据需要设置 FormContext 类型
type IFormContext = Pick<ReturnType<typeof useStore>, 'dispatch' | 'fields' | 'validateFields'> & Pick<FormProps, 'initialValue' | 'rules'>
// 类型断言
export const FormContext = createContext<IFormContext>({} as IFormContext)

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
