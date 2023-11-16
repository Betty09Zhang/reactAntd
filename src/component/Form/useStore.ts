import { useReducer, useState } from "react";
import Schema, { RuleItem, ValidateError } from 'async-validator';

export interface FieldDetail {
    name: string;
    value: string;
    rules: CustomRule[];
    isValid: boolean;
    errors: any[];
}


type CustomValidateRule = ( argumentRule: Record<string, any> ) => RuleItem;

export type CustomRule = CustomValidateRule | RuleItem;

// Field store 结构
// store = {
//     username: { name: '', value: '', rules: [], isValid: false, errors: []}
// }
export interface FieldsState {
    [key: string]: FieldDetail;
}

export interface FormState {
    isValid: boolean
}
const initialState = {

}
export interface FormAction {
    type: 'addField' | 'removeField' | 'updateField' | 'updateValidateFields';
    name: string;
    value: any;
}
// 创建 store
function fieldsReducer(state: FieldsState, action: FormAction) {
    switch (action.type) {
        case 'addField': 
            return {
                ...state,
                [action.name]: {
                    ...action.value
                }
            }
        case 'updateField':
            return {
                ...state,
                [action.name]: {
                    ...state[action.name],
                    value: action.value
                }
            }
        case 'updateValidateFields':
            console.log('updateValidateFields', state[action.name])
            return {
                ...state,
                [action.name]: {
                    ...state[action.name],
                    isValid: action.value.isValid,
                    errors: action.value.errors,
                    value: action.value.value
                }
            }
        default: return state

    }
}

function useStore() {
    // 更新表单form 信息
    const [form, setForm] = useState<FormState>({ isValid: false})
    // 更新各个fields 信息
    const [fields, dispatch ] = useReducer(fieldsReducer, {})

    // const validator = new Schema(descriptor);
    // validator.validate({ name: 'muji' }, (errors, fields) => {
    //     if (errors) {
    //         return handleErrors(errors, fields);
    //     }
    // // validation passed
    // });
    let isValid = true
    let errors: ValidateError[] = []
    const getValueField = (name: string) => {
        return fields[name].value
    }
    const transfromRules = (rules: CustomRule[]) => {
        return rules.map(rule => {
            if(typeof rule === 'function') {
                return rule({getValueField})
            }
            return rule
        })
    }
    const validateFields = async (name: string) => {
        debugger
        const {value, rules} = fields[name]
        const descriptorRules = transfromRules(rules)
        const validator = new Schema({[name]: descriptorRules[0]})
        try {
            await validator.validate({[name]: value}) 
        } catch (e) {
            const err = e as any
            isValid = false
            errors = err.errors
        } finally {
            dispatch({
                type: 'updateValidateFields',
                name,
                value: {
                    isValid,
                    errors
                }
            })
        }
        
    }
    return {
        fields,
        dispatch,
        form,
        validateFields
    }
}
export default useStore;

