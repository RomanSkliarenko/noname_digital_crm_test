import { useFormik } from 'formik';
import style from './AuthorizationForm.module.scss';
import SharedButton from '../../commons/shared-button/SharedButton';
import React, { useState } from 'react';
import {
	createUserWithEmailAndPassword,
	RecaptchaVerifier,
	signInWithEmailAndPassword,
	signInWithPhoneNumber,
	signInWithPopup,
} from 'firebase/auth';
import {
	facebookAuthProvider,
	firestore,
	googleAuthProvider,
} from '../../firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { auth } from '../../helpers/getAuth';
import {
	FacebookLoginButton,
	GoogleLoginButton,
} from 'react-social-login-buttons';
import { useLocation, useNavigate } from 'react-router-dom';
import Notiflix from 'notiflix';

const AuthorizationForm = ({ type, user }) => {
	const [authorizationMethod, setAuthorizationMethod] = useState('email');
	const formType = { SIGNUP: 'signup', LOGIN: 'login' };
	const { pathname } = useLocation();
	const navigate = useNavigate();

	const loginButtonHandler = () => navigate('/login');
	const signUpButtonHandler = () => navigate('/signup');
	const emailButtonHandler = () => setAuthorizationMethod('email');
	const phoneButtonHandler = () => setAuthorizationMethod('phone');
	const googleAuthHandler = () => {
		signInWithPopup(auth, googleAuthProvider)
			.then(async res => {
				const querySnapshot = await getDocs(collection(firestore, 'users'));
				const usersInFirestoreArr = querySnapshot.docs.map(doc => ({
					data: doc.data(),
					id: doc.id,
				}));
				const userInFirebase = usersInFirestoreArr.find(
					user => user.data.authID === res.user.uid
				);
				if (!userInFirebase) {
					addDoc(collection(firestore, 'users'), {
						authMethod: res.user.providerData[0].providerId,
						authID: res.user.uid,
						phoneNumber: res.user.phoneNumber,
						email: res.user.email,
					})
						.then(() => {
							Notiflix.Notify.success('User created success');
						})
						.catch(error => {
							Notiflix.Notify.failure(`${error.message}`);
						});
				} else {
					Notiflix.Notify.success('Login success');
				}
			})
			.catch(error => {
				Notiflix.Notify.failure(`${error.message}`);
			});
	};
	const emailAuthHandler = ({ email, password }) => {
		switch (type) {
			case formType.LOGIN:
				signInWithEmailAndPassword(auth, email, password)
					.then(userCredential => {
						Notiflix.Notify.success('Login success');
					})
					.catch(error => {
						Notiflix.Notify.failure(`${error.message}`);
					});
				break;
			case formType.SIGNUP:
				if (email !== '' && password !== '') {
					createUserWithEmailAndPassword(auth, email, password)
						.then(async res => {
							const querySnapshot = await getDocs(
								collection(firestore, 'users')
							);
							const usersInFirestoreArr = querySnapshot.docs.map(doc => ({
								data: doc.data(),
								id: doc.id,
							}));
							const userInFirebase = usersInFirestoreArr.find(
								user => user.data.authID === res.user.uid
							);
							if (!userInFirebase) {
								addDoc(collection(firestore, 'users'), {
									authMethod: res.user.providerData[0].providerId,
									authID: res.user.uid,
									phoneNumber: res.user.phoneNumber,
									email: res.user.email,
								})
									.then(() => {
										Notiflix.Notify.success('User created success');
									})
									.catch(error => {
										Notiflix.Notify.failure(`${error.message}`);
									});
							}
						})
						.catch(error => {
							Notiflix.Notify.failure(`${error.message}`);
						});
				}
				break;
			default:
				return null;
		}
	};
	const facebookAuthHandler = () => {
		signInWithPopup(auth, facebookAuthProvider)
			.then(async res => {
				const querySnapshot = await getDocs(collection(firestore, 'users'));
				const usersInFirestoreArr = querySnapshot.docs.map(doc => ({
					data: doc.data(),
					id: doc.id,
				}));
				const userInFirebase = usersInFirestoreArr.find(
					user => user.data.authID === res.user.uid
				);
				if (!userInFirebase) {
					addDoc(collection(firestore, 'users'), {
						authMethod: res.user.providerData[0].providerId,
						authID: res.user.uid,
						email: res.user.email,
					})
						.then(() => {
							Notiflix.Notify.success('User created success');
						})
						.catch(error => {
							Notiflix.Notify.failure(`${error.message}`);
						});
				} else {
					Notiflix.Notify.success('Login success');
				}
			})
			.catch(error => {
				Notiflix.Notify.failure(`${error.message}`);
			});
	};
	const onCaptchaVerify = () => {
		if (!window.recaptchaVerifier) {
			window.recaptchaVerifier = new RecaptchaVerifier(
				'sign-in-button',
				{
					size: 'invisible',
					callback: response => {},
					'expired-callback': () => {},
				},
				auth
			);
		}
	};
	function signUp() {
		onCaptchaVerify();
		const phoneNumber = formik.values.phone;
		const appVerifier = window.recaptchaVerifier;
		signInWithPhoneNumber(auth, phoneNumber, appVerifier)
			.then(confirmationResult => {
				const code = prompt('set OTP code');
				window.confirmationResult = confirmationResult;
				window.confirmationResult.confirm(code).then(async res => {
					const querySnapshot = await getDocs(collection(firestore, 'users'));
					const usersInFirestoreArr = querySnapshot.docs.map(doc => ({
						data: doc.data(),
						id: doc.id,
					}));
					const userInFirebase = usersInFirestoreArr.find(
						user => user.data.authID === res.user.uid
					);
					if (!userInFirebase) {
						addDoc(collection(firestore, 'users'), {
							authMethod: res.user.providerData[0].providerId,
							authID: res.user.uid,
							phoneNumber: res.user.phoneNumber,
						})
							.then(() => {
								Notiflix.Notify.success('User created success');
							})
							.catch(err => {
								Notiflix.Notify.failure(`${err.message}`);
							});
					} else {
						Notiflix.Notify.success('Login success');
					}
				});
			})
			.catch(error => {
				Notiflix.Notify.failure(`${error.message}`);
			});
	}

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
			phone: '',
		},
		onSubmit: values => {
			if (authorizationMethod === 'email') {
				emailAuthHandler(values);
			}
			if (authorizationMethod === 'phone') {
				signUp();
			}
		},
	});
	return (
		<div className={style.authFormWrapper}>
			<div className={style.authNavButtonWrapper}>
				<SharedButton
					onClick={loginButtonHandler}
					active={pathname === '/login'}
				>
					login
				</SharedButton>
				<SharedButton
					onClick={signUpButtonHandler}
					active={pathname === '/signup'}
				>
					registration
				</SharedButton>
			</div>
			{type === formType.LOGIN && (
				<div className={style.loginWithGoogleWrapper}>
					<span className={style.authFormSubText}>
						You can log in with your Google Account or Facebook:
					</span>
					<div className={style.authFormSocialButton}>
						<FacebookLoginButton
							className={style.socialButton}
							onClick={facebookAuthHandler}
							size={40}
						/>
						<GoogleLoginButton
							className={style.socialButton}
							onClick={googleAuthHandler}
							size={40}
						/>
					</div>
					<span className={style.authFormSubText}>
						Or log in using an email and password
					</span>
				</div>
			)}
			{type === formType.SIGNUP && (
				<span className={style.authFormSubText}>
					You can also use email or phone
				</span>
			)}
			<div className={style.authMethodChoiceButton}>
				<SharedButton
					onClick={emailButtonHandler}
					active={authorizationMethod === 'email'}
				>
					EMAIL
				</SharedButton>
				<SharedButton
					onClick={phoneButtonHandler}
					active={authorizationMethod === 'phone'}
				>
					PHONE
				</SharedButton>
			</div>
			{authorizationMethod === 'email' && (
				<form className={style.authForm} onSubmit={formik.handleSubmit}>
					<label htmlFor="email">
						<span>*</span>Email:
					</label>
					<input
						onBlur={formik.handleBlur}
						className={style.authInput}
						placeholder="Your@email.com"
						id="email"
						name="email"
						type="email"
						onChange={formik.handleChange}
						value={formik.values.email}
					/>
					{formik.touched.email && formik.errors.email && (
						<p className={style.requiredText}>{formik.errors.email}</p>
					)}
					<label htmlFor="password">
						<span>*</span>Password
					</label>
					<input
						onBlur={formik.handleBlur}
						className={style.authInput}
						placeholder="Password"
						id="password"
						name="password"
						type="password"
						onChange={formik.handleChange}
						value={formik.values.password}
					/>
					{formik.touched.password && formik.errors.password && (
						<p className={style.requiredText}>{formik.errors.password}</p>
					)}
					<SharedButton
						disabled={user}
						className={style.authFormSubmitButton}
						type="submit"
						active={true}
					>
						{type === formType.LOGIN ? 'LOGIN' : 'JOIN'}
					</SharedButton>
				</form>
			)}
			{authorizationMethod === 'phone' && (
				<form className={style.authForm} onSubmit={formik.handleSubmit}>
					<label htmlFor="phone">
						<span>*</span>Phone:
					</label>
					<input
						onBlur={formik.handleBlur}
						className={style.authInput}
						placeholder="+3 (066) 871 52 59"
						id="phone"
						name="phone"
						type="phone"
						onChange={formik.handleChange}
						value={formik.values.phone}
					/>
					{formik.touched.email && formik.errors.email && (
						<p className={style.requiredText}>{formik.errors.email}</p>
					)}
					<SharedButton
						id="sign-in-button"
						disabled={user}
						className={style.authFormSubmitButton}
						type="submit"
						active={true}
					>
						{type === formType.LOGIN ? 'LOGIN' : 'JOIN'}
					</SharedButton>
				</form>
			)}
			<div id="recaptcha-container"></div>
		</div>
	);
};

export default AuthorizationForm;
