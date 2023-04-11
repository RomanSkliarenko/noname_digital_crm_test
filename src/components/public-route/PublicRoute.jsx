import { Navigate } from 'react-router-dom';

const PublicRoute = ({ component, user }) => {
	return user ? <Navigate to={'/'} /> : component;
};

export default PublicRoute;
