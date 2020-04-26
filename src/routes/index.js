import React from "react";
import { LandingPage } from "./landing-page";
import { VisitorCenter } from "./visitor-center";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Link } from "react-router-dom";

const Routes = () => {
  return (
    <Router>
      <Link to={`/`}>
        <h1>AC Visitor Center</h1>
      </Link>
      <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route path="/center/:id">
          <VisitorCenter />
        </Route>
      </Switch>
    </Router>
  );
};

export default Routes;
