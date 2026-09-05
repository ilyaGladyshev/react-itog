import React from "react";

const ComboBox = ({selectedValue, listValues, props, placeholder, onChangeProps}) => {
    return (
        <select
            value={selectedValue}
            onChange={(e) => onChangeProps(e.target.value)}>
            {listValues.map((currentValue, index) => (
                <option key={index} value={currentValue}>
                    {currentValue}
                </option>
            ))}
            <option value="new_account">Создать новый аккаунт...</option>
        </select>
    )
}

export default ComboBox;