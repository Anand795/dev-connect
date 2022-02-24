import { Fragment } from 'react';
import './App.css';
import { Navbar } from './components/layout/Navbar';
import { Landing } from './components/Landing';

const  App = () => (
<Fragment>
  <Navbar />
  <Landing />
</Fragment>
);

export default App;
