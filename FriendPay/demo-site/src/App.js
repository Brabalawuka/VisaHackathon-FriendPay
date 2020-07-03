import React from 'react';
import NavBar from './NavBar/NavBar';
import Cart from './Cart/Cart';
import Status from './Status/Status';
import { Route, Switch } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div>
      <NavBar/>
      <Switch>
        <Route exact path="/" component={Cart} />
        <Route exact path="/status/:id" component={Status} />
      </Switch>
    </div>
  );
}

export default App;
