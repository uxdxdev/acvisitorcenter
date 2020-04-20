import React from "react";
import { Homepage } from "./homepage";
import { Queue } from "./queue";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Homepage />
        </Route>
        <Route path="/queue/:id">
          <Queue />
        </Route>
      </Switch>
    </Router>
  );
};

export default Routes;
