import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import style from './Layout.module.scss';
import { signOut } from 'firebase/auth';
import { auth } from '../../helpers/getAuth';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Icon from '@mdi/react';
import { mdiMenu } from '@mdi/js';
import Notiflix from 'notiflix';

function Layout({ user }) {
	const adminEmail = 'rm.skl.test.task.2023@gmail.com';
	const [anchorEl, setAnchorEl] = useState(null);
	const navigate = useNavigate();

	const loginButtonHandler = () => navigate('/login');
	const signUpButtonHandler = () => navigate('/signup');
	const profilePageButtonHandler = () => navigate('/profile');
	const tripsPageButtonHandler = () => navigate('/trips');
	const adminPageButtonHandler = () => navigate('/admin');
	const homePageButtonHandler = () => navigate('/');

	function logoutHandler() {
		signOut(auth)
			.then(() => {
				Notiflix.Notify.success('Logout success');
			})
			.catch(error => {
				Notiflix.Notify.failure(`${error.message}`);
			});
		setAnchorEl(null);
	}
	const open = Boolean(anchorEl);
	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	return (
		<div className={style.appContainer}>
			<div className={style.navigationBar}>
				{user && (
					<div>
						<Icon
							path={mdiMenu}
							title="User Profile"
							size={2}
							horizontal
							vertical
							color="black"
							id="basic-button"
							aria-controls={open ? 'basic-menu' : undefined}
							aria-haspopup="true"
							aria-expanded={open ? 'true' : undefined}
							onClick={handleClick}
						/>
						<Menu
							id="basic-menu"
							anchorEl={anchorEl}
							open={open}
							onClose={handleClose}
							MenuListProps={{
								'aria-labelledby': 'basic-button',
							}}
						>
							<MenuItem onClick={homePageButtonHandler}>Home</MenuItem>
							<MenuItem onClick={profilePageButtonHandler}>Profile</MenuItem>
							<MenuItem onClick={tripsPageButtonHandler}>Trips</MenuItem>
							<MenuItem onClick={logoutHandler}>Logout</MenuItem>
							{adminEmail === user.email && (
								<MenuItem onClick={adminPageButtonHandler}>Admin page</MenuItem>
							)}
						</Menu>
					</div>
				)}
				{!user && (
					<div>
						<Icon
							path={mdiMenu}
							title="User Profile"
							size={2}
							horizontal
							vertical
							color="black"
							id="basic-button"
							aria-controls={open ? 'basic-menu' : undefined}
							aria-haspopup="true"
							aria-expanded={open ? 'true' : undefined}
							onClick={handleClick}
						/>
						<Menu
							id="basic-menu"
							anchorEl={anchorEl}
							open={open}
							onClose={handleClose}
							MenuListProps={{
								'aria-labelledby': 'basic-button',
							}}
						>
							<MenuItem onClick={signUpButtonHandler}>REGISTRATION</MenuItem>
							<MenuItem onClick={loginButtonHandler}>LOGIN</MenuItem>
						</Menu>
					</div>
				)}
			</div>
			<div className={style.mainContainer}>
				{user && (
					<div>
						<span className={style.welcomeText}>
							Welcome @{user.displayName || user.email || user.phoneNumber}
						</span>
					</div>
				)}
				<Outlet />
			</div>
		</div>
	);
}

export default Layout;
