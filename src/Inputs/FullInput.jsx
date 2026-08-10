import React, {useState} from "react";

const FullInput = ({type, placeholder, propsName}) => {
	
	const [isValid, setIsValid] = useState(false);
	const [disabled, setDisabled] = useState(false);
	
	const isValidDate = (date) => {
		setDisabled(date.split('-')[0] > 2007);
	}
	
	switch (type){
		case 'date':
			return(
				<>
				{disabled && <label>Вы младше 18 лет, задача для вас недоступна</label>}
				<input name={propsName} type='date' calssName={isValid ? 'is-not-valid' : 'valid'} onChange={(e) => isValidDate(e.target.value)}/>
				</>
			);
		case 'password':
			return(
				<input name={propsName} type='password' calssName={isValid ? 'is-not-valid' : 'valid'} />
			);		
		case 'text-area':
			return(
				<input name={propsName} type='textarea' placeholder={placeholder} calssName='textarea' />
			);		
		}
	
	};

export default FullInput;