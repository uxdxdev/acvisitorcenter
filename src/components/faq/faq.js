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
        optional and can be updated later, click "Create visitor center", then
        open your visitor center page.
      </>
    ),
  },
  {
    title: "Step 2",
    body: (
      <>
        On your visitor center page update your Code by clicking "Edit" in the
        Code section. Then click "Open gates" to let visitors join the waiting
        list. You can now "Share" the link to your visitor center with your
        friends!.
      </>
    ),
  },
  {
    title: "Step 3",
    body: (
      <>
        Visitors who are first in the queue will get a notification prompting
        them to get the latest code. Once they have the code they can be removed
        from the queue by clicking "Done".
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
    title: "How do I remove/ban people from my visitor center?",
    body:
      "You cannot remove or ban people from the visitor center. You must change your code after removing them from the queue.",
  },
  {
    title: "Can people in the waiting list see my code?",
    body:
      "No, the code is only available to the first person in the waiting list. They must click the 'Get code' button to see it.",
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
    title: "What does 'Visitor center gates are closed' mean?",
    body:
      "It means the owner of the visitor center has either closed the visitor center page or has closed the gates to the visitor center to prevent people joining the queue. The visitor center may still be open if the gates are closed, so stay in the queue!",
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
