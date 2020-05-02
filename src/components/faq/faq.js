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
    body: (
      <>
        Set a Name and Summary for your visitor center, setting a Code is
        optional and can be updated later. Click "Create visitor center", then
        open your visitor center page.
      </>
    ),
  },
  {
    title: "Step 2",
    body: (
      <>
        On your visitor center page update your Code by clicking "Edit" in the
        Code section. Click "Open gates" to let visitors join the waiting list.
        You can now "Share" the link to your visitor center with your friends!.
      </>
    ),
  },
  {
    title: "Step 3",
    body: (
      <>
        Visitors who are first in the queue will get a notification prompting
        them to get the latest code. Once they arrive they can be removed from
        the queue by clicking "Done".
      </>
    ),
  },
];

const questionsAnswers = [
  {
    title: "I removed someone from the queue can they still use my code?",
    body:
      "Yes, visitors that are first in the queue will receive a notification to get the latest code. They can use this code until you change it. Removing them from the queue will not prevent them from using the code.",
  },
  {
    title: "How do I ban people from my visitor center?",
    body:
      "You cannot ban people from the visitor center. However, you could change your code before they move into the 1st, or 'Next', position in the queue, then update your visitor center page with the new code once they are no longer in the waiting list.",
  },
  {
    title: "Can people in the waiting list see my code?",
    body:
      "Only the first visitor in the queue can get your code. They must click the 'Get code' button to see it.",
  },
  {
    title: "How is the waiting list updated?",
    body:
      "The owner of the visitor center will remove each visitor from the waiting list. The person who is first in the queue will get a notification to get the latest code.",
  },
  {
    title: "Can I create multiple visitor centers?",
    body:
      "No, each user can only create a single visitor center. It is easy to update your visitor center by clicking the 'Edit' button next to each label on the visitor center page.",
  },
  {
    title: "What does 'Visitor center is closed' mean?",
    body:
      "It means the owner of the visitor center no longer has the visitor center page open in their browser. The visitor center will not operate correctly if the visitor center page is not open in their browser.",
  },
  {
    title: "What does 'Queue locked' mean?",
    body:
      "The owner of the visitor center has locked the queue to prevent more visitors joining the waiting list. Visitors already in the waiting list can still get the code and visit provided the visitor center is still open and the owner is managing the queue.",
  },
];

const Faq = (props) => {
  const classes = useStyles();

  return (
    <Paper elevation={0} variant="outlined" className={classes.paper}>
      <Box mb={2}>
        <Typography variant="h2">
          How to{" "}
          <span role="img" aria-label="books">
            📚
          </span>
        </Typography>
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
      <Typography variant="h2">
        F.A.Q{" "}
        <span role="img" aria-label="question mark">
          ❓
        </span>
      </Typography>
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
