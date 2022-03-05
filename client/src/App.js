import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import { Landing } from "./components/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from "./components/layout/Alert";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./components/routing/PrivateRoute";
import "./App.css";

// Redux
import { Provider } from "react-redux";
import store from "./store";
import setAuthToken from "./utils/setAuthToken";
import { loadUser } from "./actions/authActions";

const App = () => {
  useEffect(() => {
    // check for token in LS when app first runs
    if (localStorage.token) {
      // if there is a token set axios headers for all requests
      setAuthToken(localStorage.token);
    }
    // try to fetch a user, if no token or invalid token we
    // will get a 401 response from our API
    if (localStorage.token) store.dispatch(loadUser());
    // store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Alert />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="dashboard"
            element={<PrivateRoute component={Dashboard} />}
          />
          {/* <Route path="/profiles" element={<Profiles />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/create-profile" element={<ProfileForm />} />
        <Route path="/edit-profile" element={<ProfileForm />} />
        <Route path="/add-experience" element={<AddExperience />} />
        <Route path="/add-education" elemtn={<AddEducation />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:id" element={<Post />} />
        <Route element={<NotFound />} /> */}
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
