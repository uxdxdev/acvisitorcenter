import React from "react";
import { Typography, Paper, Box, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  buttonMarginRight: {
    marginRight: theme.spacing(1),
  },
  paper: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
  },
}));

const steps = [
  {
    title: "Step 1",
    body:
      "Set a Name and Summary for your visitor center, Code is optional and can be updated later, click 'Create visitor center' button, and open your visitor center page.",
  },
  {
    title: "Step 2",
    body:
      "On your visitor center page update your Code, click 'Open gates' to let visitors join the waiting list, then share the link to your visitor center with your friends!.",
  },
  {
    title: "Step 3",
    body:
      "Manage the waiting list by removing visitors from the queue when they have arrived or left your island. You must keep the visitor center page open in your browser for the visitor center to operate correctly.",
  },
];

const questionsAnswers = [
  {
    title: "Can people in the waiting list see my code?",
    body:
      "No, the code is only available to the first person in the waiting list. They must click the 'Get code' button to see it.",
  },
  {
    title: "How is the waiting list updated?",
    body:
      "The owner of the visitor center will remove each visitor from the waiting list. The person who is first in the queue can then get the code.",
  },
  {
    title: "Can I create multiple visitor centers?",
    body:
      "No, each user can only create a single visitor center. It is easy to update your visitor center by clicking the 'Edit' button next to each label on the visitor center page.",
  },
  {
    title: "What does 'Visitor center gates are closed' mean?",
    body:
      "It means the owner of the visitor center has either closed the visitor center page or has closed the gates to the visitor center to prevent people joining the queue. Visitors in the queue may still be able to visit the owners island so stay in the queue!",
  },
];
const Faq = (props) => {
  const classes = useStyles();

  return (
    <Paper elevation={0} variant="outlined" className={classes.paper}>
      <Box mb={2}>
        <Typography variant="h2">How to</Typography>
        <Grid container>
          {steps.map((data, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box p={2}>
                <Typography variant="h6">{data.title}</Typography>
                <Typography>{data.body}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Typography variant="h2">F.A.Q</Typography>
      <Grid container>
        {questionsAnswers.map((data, index) => (
          <Grid item xs={12} key={index}>
            <Box p={2}>
              <Typography variant="h6">{data.title}</Typography>
              <Typography>{data.body}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default Faq;
