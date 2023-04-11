import {Navigate} from 'react-router-dom';

const PrivateRoute = ({ component, user }) => {
    return user ? component : <Navigate to={'/login'} />;
};

export default PrivateRoute;