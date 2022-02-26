import "./App.css";
import { Navbar } from "./components/layout/Navbar";
import { Landing } from "./components/Landing";
import { Login } from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from "./components/layout/Alert";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Redux
import { Provider } from "react-redux";
import store from "./store";

const App = () => (
  <Provider store={store}>
    <Router>
      <Navbar />
      <Alert />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/profiles" element={<Profiles />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
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

export default App;
