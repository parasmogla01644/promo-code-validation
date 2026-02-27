import React from "react";
import style from "./index.module.css";

const Input = ({ placeholder, value, onChange, error }) => {
    return (
        <div className={style.inputWrapper}>
            <input
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            {!!error && <p>{error}</p>}
        </div>
    );
};

export default Input;
