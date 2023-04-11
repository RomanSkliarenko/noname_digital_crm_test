import style from './TripModal.module.scss';
import SharedButton from '../../commons/shared-button/SharedButton';
import React from 'react';
import { useFormik } from 'formik';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import Notiflix from 'notiflix';

function ModalHeader({ createTrip, cancel, user }) {
	const formik = useFormik({
		initialValues: {
			driver: '',
			client: '',
			managerName: '',
			baggage: '',
			from: '',
			to: '',
			date: '',
		},
		onSubmit: async values => {
			await addDoc(collection(firestore, 'trips'), {
				...values,
				createdBy: user.uid,
			})
				.then(() => {
					Notiflix.Notify.success('Trip created success');
					cancel();
				})
				.catch(err => {
					Notiflix.Notify.failure(`${err.message}`);
				});
		},
	});
	return (
		<div className={style.backdrop}>
			<div className={style.modal}>
				<form className={style.createTripForm} onSubmit={formik.handleSubmit}>
					<p>CREATE NEW TRIP</p>
					<div>
						<label htmlFor="driver">
							<span>*</span>Driver:
						</label>
						<input
							onBlur={formik.handleBlur}
							placeholder="Driver name"
							id="driver"
							name="driver"
							type="text"
							onChange={formik.handleChange}
							value={formik.values.driver}
						/>
						{formik.touched.driver && formik.errors.driver && (
							<p className={style.requiredText}>{formik.errors.driver}</p>
						)}
					</div>

					<div>
						<label htmlFor="client">
							<span>*</span>Client
						</label>
						<input
							onBlur={formik.handleBlur}
							placeholder="Client name"
							id="client"
							name="client"
							type="text"
							onChange={formik.handleChange}
							value={formik.values.client}
						/>
						{formik.touched.client && formik.errors.client && (
							<p className={style.requiredText}>{formik.errors.client}</p>
						)}
					</div>

					<div>
						<label htmlFor="managerName">
							<span>*</span>Manager name:
						</label>
						<input
							onBlur={formik.handleBlur}
							placeholder="Manager name"
							id="managerName"
							name="managerName"
							type="text"
							onChange={formik.handleChange}
							value={formik.values.managerName}
						/>
						{formik.touched.managerName && formik.errors.managerName && (
							<p className={style.requiredText}>{formik.errors.managerName}</p>
						)}
					</div>

					<div>
						<label htmlFor="baggage">
							<span>*</span>Baggage:
						</label>
						<input
							onBlur={formik.handleBlur}
							placeholder="Baggage"
							id="baggage"
							name="baggage"
							type="text"
							onChange={formik.handleChange}
							value={formik.values.baggage}
						/>
						{formik.touched.baggage && formik.errors.baggage && (
							<p className={style.requiredText}>{formik.errors.baggage}</p>
						)}
					</div>

					<div>
						<label htmlFor="from">
							<span>*</span>From:
						</label>
						<input
							onBlur={formik.handleBlur}
							placeholder="From"
							id="from"
							name="from"
							type="text"
							onChange={formik.handleChange}
							value={formik.values.from}
						/>
						{formik.touched.from && formik.errors.from && (
							<p className={style.requiredText}>{formik.errors.from}</p>
						)}
					</div>

					<div>
						<label htmlFor="to">
							<span>*</span>To:
						</label>
						<input
							onBlur={formik.handleBlur}
							placeholder="To"
							id="to"
							name="to"
							type="text"
							onChange={formik.handleChange}
							value={formik.values.to}
						/>
						{formik.touched.to && formik.errors.to && (
							<p className={style.requiredText}>{formik.errors.to}</p>
						)}
					</div>

					<div>
						<label htmlFor="date">
							<span>*</span>Date:
						</label>
						<input
							onBlur={formik.handleBlur}
							placeholder="Date"
							id="date"
							name="date"
							type="text"
							onChange={formik.handleChange}
							value={formik.values.date}
						/>
						{formik.touched.date && formik.errors.date && (
							<p className={style.requiredText}>{formik.errors.date}</p>
						)}
					</div>

					<div className={style.modalButtonWrapper}>
						<SharedButton type="submit" active={true}>
							CREATE
						</SharedButton>
						<SharedButton type="button" onClick={cancel}>
							Cancel
						</SharedButton>
					</div>
				</form>
			</div>
		</div>
	);
}

export default ModalHeader;
