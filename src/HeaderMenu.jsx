import React from 'react';
import {Link} from 'react-router-dom';

export const HeaderMenu(props) => {
	return (
		<div className='header-menu-container'>
			<nav className='header-menu-container__nav-menu'>
				<Link to='/main'>Главная страница</Link>	
			</nav>
		</div>
	)
}