import style from './RoleModal.module.scss';
import SharedButton from '../../commons/shared-button/SharedButton';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

function RoleModal({ setUserRole, changeAccount, cancel }) {
  const [role, setRole] = useState('client');
  const { pathname } = useLocation();
  function handleOptionChange(event) {
    setRole(event.target.value);
  }
  return (
    <div className={style.backdrop}>
      <div className={style.modal}>
        <p>Select your role in CRM or login in account with role</p>
        <select name="select" value={role} onChange={handleOptionChange}>
          <option value="driver">driver</option>
          <option value="manager">manager</option>
          <option value="client">client</option>
        </select>

        <div className={style.modalButtonWrapper}>
          <SharedButton onClick={() => setUserRole(role)} active={true}>
            confirm role
          </SharedButton>
          {pathname !== '/admin' && (
            <SharedButton type="button" onClick={changeAccount}>
              change account
            </SharedButton>
          )}
          {pathname === '/admin' && (
            <SharedButton type="button" onClick={cancel}>
              Cancel
            </SharedButton>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoleModal;
