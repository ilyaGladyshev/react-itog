const FullInput = ({type, placeholder, propsName, onChangeProps}) => {
	
	switch (type){
		case 'date':
			return(
				<>
				<input name={propsName} 
					   type='date' 
					   onChange={onChangeProps}/>
				</>
			);
		case 'password':
			return(
				<input name={propsName} type='password' 
				onChange={onChangeProps}
				className={'valid'} />
			);		
		case 'text-area':
			return(
				<input name={propsName} 
					   type='textarea' 
					   placeholder={placeholder}
					   onChange={onChangeProps} 
					   className='textarea' />
			);	
		default: return (
				<input name={propsName} 
					   type='textarea' 
					   placeholder={placeholder}
					   onChange={onChangeProps} 
					   className='textarea' />);	
		}
	};

export default FullInput;