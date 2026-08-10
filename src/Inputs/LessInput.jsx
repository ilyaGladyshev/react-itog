import React from "react";

const LessInput = ({propsName, type, placeholder, label, classes, isData, onChangeProps}) => {
	return (
		<input name={propsName} type={type} placeholder={placeholder} className={classes} onChange={(e) => onChangeProps(e.target.value)} />
	)
};

export default LessInput;