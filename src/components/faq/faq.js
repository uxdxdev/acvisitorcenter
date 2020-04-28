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
const questionsAnswers = [
  {
    question: "Can people in the waiting list see my code?",
    answer:
      "No the code is only available to the first person in the waiting. They must click the 'Get code' button to see it.",
  },
  {
    question: "How is the waiting list updated?",
    answer:
      "The owner of the visitor center must open have the visitor center page open in their browser. They will then remove each visitor from the waiting list when they have left the island. The person who is first in the queue can then see the code.",
  },
  {
    question: "Can I create multiple visitor centers?",
    answer:
      "No each user can only create a single visitor center. It is easy to update your visitor center by clicking the 'Edit' button next to each label.",
  },
  {
    question: "How many waiting lists can I join?",
    answer: "You can join as many waiting lists as you want!",
  },
];
const WaitiingList = (props) => {
  const classes = useStyles();

  return (
    <Paper elevation={0} variant="outlined" className={classes.paper}>
      <Typography variant="h2">F.A.Q</Typography>
      <Grid container>
        {questionsAnswers.map((data) => (
          <Grid item xs={12} sm={6} md={4}>
            <Box p={2}>
              <Typography variant="h6">{data.question}</Typography>
              <Typography>{data.answer}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default WaitiingList;
