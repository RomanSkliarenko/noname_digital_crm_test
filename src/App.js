import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { getAuth } from 'firebase/auth';
import { app } from './firebase';
import { useEffect, useState } from 'react';
import AuthorizationForm from './components/auth-form/AuthorizationForm';
import PublicRoute from './components/public-route/PublicRoute';
import PrivateRoute from './components/private-route/PrivateRoute';
import HomePage from './components/home-page/HomePage';
import { ProfilePage } from './components/profile-page/ProfilePage';
import { TripsPage } from './components/trips-page/TripsPage';
import AdminPage from './components/admin-page/AdminPage';

function App() {
  const auth = getAuth(app);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    return auth.onAuthStateChanged(authUser => {
      if (authUser) {
        return setUser(authUser);
      }
      return setUser(null);
    });
  }, [auth]);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout user={user} />}>
          {!user && (
            <Route
              path="/"
              element={
                <PublicRoute
                  user={user}
                  component={<AuthorizationForm user={user} type={'login'} />}
                />
              }
            />
          )}
          <Route
            path="/"
            element={
              <PrivateRoute user={user} component={<HomePage user={user} />} />
            }
          />
          <Route
            path="profile"
            element={
              <PrivateRoute
                user={user}
                component={<ProfilePage user={user} />}
              />
            }
          />
          <Route
            path="trips"
            element={
              <PrivateRoute user={user} component={<TripsPage user={user} />} />
            }
          />
          <Route
            path="admin"
            element={
              <PrivateRoute user={user} component={<AdminPage user={user} />} />
            }
          />
          <Route
            path="login"
            element={
              <PublicRoute
                user={user}
                component={<AuthorizationForm user={user} type={'login'} />}
              />
            }
          />
          <Route
            path="signup"
            element={
              <PublicRoute
                user={user}
                component={<AuthorizationForm user={user} type={'signup'} />}
              />
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
