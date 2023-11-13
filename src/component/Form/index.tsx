import React, { FC } from "react";
type modeType = 'horizonal' | 'vertical'
interface FormProps {
    children?: React.ReactNode;
    mode: modeType;
    name?: string;
}
const Form : FC<FormProps> = (props) => {
    const { name, children } = props
    return (
        <form name={name}>
            {children}
        </form>
    )
}
Form.defaultProps = {
    name: 'www'
}

export default Form