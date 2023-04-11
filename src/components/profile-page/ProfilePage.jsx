import React, { useEffect, useState } from 'react';
import { collection, doc, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';

export const ProfilePage = ({ user }) => {
  const [userRole, setUserRole] = useState('');
  const [authMethod, setAuthMethod] = useState('');
  const getUserFromFirestore = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'users'));
    const usersInFirestoreArr = querySnapshot.docs.map(doc => ({
      data: doc.data(),
      id: doc.id,
    }));
    const userInFirebase = usersInFirestoreArr.find(
      item => item.data.authID === user.uid
    );

    setUserRole(userInFirebase.data.role);
    setAuthMethod(userInFirebase.data.authMethod);
  };
  useEffect(() => {
    getUserFromFirestore();
  }, []);
  const { displayName, email, phoneNumber, uid } = user;
  return (
    <div>
      <h2>PROFILE PAGE</h2>
      <span>USER INFO</span>
      <ul>
        <li>
          <span>
            User name:
            {displayName || <span> user has not entered data yet</span>}
          </span>
        </li>
        <li>
          <span>
            User email: {email || <span> user has not entered data yet</span>}
          </span>
        </li>
        <li>
          <span>
            User phone:
            {phoneNumber || <span> user has not entered data yet</span>}
          </span>
        </li>
        <li>
          <span>User role: {userRole || <span>Loading...</span>}</span>
        </li>
        <li>
          <span>User login from: {authMethod || <span>Loading...</span>}</span>
        </li>
        <li>
          <span>User id: {uid}</span>
        </li>
      </ul>
    </div>
  );
};
