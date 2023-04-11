import React, { useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { firestore } from '../../firebase';
import style from './AdminPage.module.scss';
import RoleModal from '../role-modal/RoleModal';
import Notiflix from 'notiflix';

function AdminPage({ user }) {
  const [users, setUsers] = useState(null);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editRoleUserID, setEditRoleUserID] = useState(null);

  const cancelButtonHandler = () => {
    setRoleModalOpen(false);
    setEditRoleUserID(null);
  };

  const editRoleButtonHandler = id => {
    setEditRoleUserID(id);
    setRoleModalOpen(true);
  };

  const setUserRole = async role => {
    const docRef = doc(firestore, 'users', editRoleUserID);
    await updateDoc(docRef, { role: role })
      .then(res => {
        setRoleModalOpen(false);
        Notiflix.Notify.success('Role was changed success');
      })
      .catch(err => {
        Notiflix.Notify.failure(`${err.message}`);
      });
  };

  const getUserFromFirestore = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'users'));
    const usersInFirestoreArr = querySnapshot.docs.map(doc => ({
      data: doc.data(),
      id: doc.id,
    }));
    setUsers(usersInFirestoreArr);
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(firestore, 'users'), doc => {
      getUserFromFirestore();
    });
    return () => unsub();
  }, []);

  return (
    <div>
      {roleModalOpen && (
        <RoleModal setUserRole={setUserRole} cancel={cancelButtonHandler} />
      )}
      <h2>Admin page</h2>
      <div className={style.usersWrapper}>
        {users &&
          users.map(item => {
            const {
              displayName,
              email,
              phoneNumber,
              role,
              authID,
              authMethod,
            } = item.data;

            return (
              <ul key={item.id} className={style.user}>
                <li>
                  <span>
                    User name:
                    {displayName || <span> user has not entered data yet</span>}
                  </span>
                </li>
                <li>
                  <span>
                    User email:
                    {email || <span> user has not entered data yet</span>}
                  </span>
                </li>
                <li>
                  <span>
                    User phone:
                    {phoneNumber || <span> user has not entered data yet</span>}
                  </span>
                </li>
                <li>
                  <span>User role: {role || <span>Loading...</span>}</span>
                  {email !== 'rm.skl.test.task.2023@gmail.com' && (
                    <button
                      type="button"
                      onClick={() => editRoleButtonHandler(item.id)}
                    >
                      edit role
                    </button>
                  )}
                </li>
                <li>
                  <span>
                    User login from: {authMethod || <span>Loading...</span>}
                  </span>
                </li>
                <li>
                  <span>User id: {authID}</span>
                </li>
              </ul>
            );
          })}
      </div>
    </div>
  );
}

export default AdminPage;
