import React, { useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../firebase';
import style from './TripsPage.module.scss';
import SharedButton from '../../commons/shared-button/SharedButton';
import TripModal from '../create-trip-modal/TripModal';

export const TripsPage = ({ user }) => {
  const [trips, setTrips] = useState(null);
  const [currentUserTrips, setCurrentUserTrips] = useState(null);
  const [tripsToShow, setTripsToShow] = useState('trips');
  const [createTripModal, setCreateTripModal] = useState(false);
  const createTripButtonHandler = () => setCreateTripModal(true);
  const cancelCreateTripButtonHandler = () => setCreateTripModal(false);
  const showAllTripsButtonHandler = () => setTripsToShow('trips');
  const showMyTripsButtonHandler = () => setTripsToShow('currentUserTrips');
  const getTripsFromFirestore = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'trips'));
    const tripsInFirestoreArr = querySnapshot.docs.map(doc => ({
      data: doc.data(),
      id: doc.id,
    }));
    setTrips(tripsInFirestoreArr);
    setCurrentUserTrips(
      tripsInFirestoreArr.filter(item => item.data.createdBy === user.uid)
    );
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(firestore, 'trips'), doc => {
      getTripsFromFirestore();
    });
    return () => unsub();
  }, []);
  return (
    <div>
      {createTripModal && (
        <TripModal
          createTrip={() => {}}
          cancel={cancelCreateTripButtonHandler}
          user={user}
        />
      )}
      <h2>TRIPS PAGE</h2>
      <div className={style.tripsMenuButtonWrapper}>
        <SharedButton onClick={createTripButtonHandler} active={true}>
          Create Trip
        </SharedButton>
        <SharedButton onClick={showMyTripsButtonHandler} active={true}>
          show my trips
        </SharedButton>
        <SharedButton onClick={showAllTripsButtonHandler} active={true}>
          show all trips
        </SharedButton>
      </div>

      <div className={style.tripsWrapper}>
        {trips &&
          tripsToShow === 'trips' &&
          trips.map(trip => {
            const {
              baggage,
              client,
              createdBy,
              date,
              managerName,
              from,
              to,
              driver,
            } = trip.data;
            return (
              <div key={trip.id} className={style.tripData}>
                <span>TRIP DATA</span>
                <ul>
                  <li>
                    <span>Driver: {driver}</span>
                  </li>
                  <li>
                    <span>Client: {client}</span>
                  </li>
                  <li>
                    <span>ManagerName: {managerName}</span>
                  </li>
                  <li>
                    <span>Date: {date}</span>
                  </li>
                  <li>
                    <span>Baggage: {baggage}</span>
                  </li>
                  <li>
                    <span>From: {from}</span>
                  </li>
                  <li>
                    <span>To: {to}</span>
                  </li>
                  <li>
                    <span>CreatedBy: {createdBy}</span>
                  </li>
                </ul>
              </div>
            );
          })}

        {currentUserTrips &&
          tripsToShow === 'currentUserTrips' &&
          currentUserTrips.map(trip => {
            const {
              baggage,
              client,
              createdBy,
              date,
              managerName,
              from,
              to,
              driver,
            } = trip.data;
            return (
              <div key={trip.id} className={style.tripData}>
                <span>TRIP DATA</span>
                <ul>
                  <li>
                    <span>Driver: {driver}</span>
                  </li>
                  <li>
                    <span>Client: {client}</span>
                  </li>
                  <li>
                    <span>ManagerName: {managerName}</span>
                  </li>
                  <li>
                    <span>Date: {date}</span>
                  </li>
                  <li>
                    <span>Baggage: {baggage}</span>
                  </li>
                  <li>
                    <span>From: {from}</span>
                  </li>
                  <li>
                    <span>To: {to}</span>
                  </li>
                  <li>
                    <span>CreatedBy: {createdBy}</span>
                  </li>
                </ul>
              </div>
            );
          })}
      </div>
    </div>
  );
};
