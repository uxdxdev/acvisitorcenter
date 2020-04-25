import React from "react";
import { Homepage } from "./homepage";
import { VisitorCenter } from "./visitor-center";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Homepage />
        </Route>
        <Route path="/center/:id">
          <VisitorCenter />
        </Route>
      </Switch>
    </Router>
  );
};

export default Routes;
