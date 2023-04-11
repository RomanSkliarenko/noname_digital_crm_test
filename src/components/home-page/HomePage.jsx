import React, { useCallback, useEffect, useState } from 'react';
import { firestore } from '../../firebase';
import { collection, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import RoleModal from '../role-modal/RoleModal';
import { signOut } from 'firebase/auth';
import { auth } from '../../helpers/getAuth';
import style from './HomePage.module.scss';
import Notiflix from 'notiflix';

function HomePage({ user }) {
	const [roleModalOpen, setRoleModalOpen] = useState(false);
	const [firestoreUserID, setFirestoreUserID] = useState(null);

	const setUserRole = useCallback(
		async role => {
			const docRef = doc(firestore, 'users', firestoreUserID);
			await updateDoc(docRef, { role: role })
				.then(res => {
					setRoleModalOpen(false);
					Notiflix.Notify.success('Role was changed success');
				})
				.catch(err => {
					Notiflix.Notify.failure(`${err.message}`);
				});
		},
		[firestoreUserID]
	);

	const changeAccount = () => {
		signOut(auth)
			.then(() => {
				Notiflix.Notify.success('Logout success');
				setRoleModalOpen(false);
			})
			.catch(error => {
				Notiflix.Notify.failure(`${error.message}`);
			});
	};

	useEffect(() => {
		const unsub = onSnapshot(collection(firestore, 'users'), doc => {
			const data = doc.docs.map(item => {
				return { user: item.data(), id: item.id };
			});
			const currentUser = data.find(item => item.user.authID === user.uid);
			if (currentUser) {
				setFirestoreUserID(currentUser.id);
				if (!currentUser.user.hasOwnProperty('role')) {
					setRoleModalOpen(true);
					unsub();
				}
			}
		});
		return () => unsub();
	}, []);

	return (
		<div className={style.homePage}>
			{roleModalOpen && (
				<RoleModal setUserRole={setUserRole} changeAccount={changeAccount} />
			)}
			<h2 className={style.pageTitle}>HOME PAGE</h2>
		</div>
	);
}

export default HomePage;
