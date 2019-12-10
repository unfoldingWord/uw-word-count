import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';


function WordCountRepo({
  url,
  classes,
  style,
}) 
{

  const [res, setVal] = useState("Waiting-WordCountRepo");
  useEffect( () => {
    const fetchData = async () => {
      const result = await fetchWordCountRepo(
        {username: 'unfoldingword', languageId:'en', url: url}
      );
      setVal(
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Translation Questions for "{bookId.toUpperCase()}" 
            and Chapters {chlist}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Total Number of Questions: {result.l1count}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Total Word Count {result.total}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Unique Words {result.distinct}
          </Typography>
        </Paper>
      );  
    };
    fetchData();
  }, []); 
  // the parameter [] allows the effect to skip if value unchanged
  // an empty [] will only update on mount of component

  return (
    <div className={classes.root}>
      {_tq}
    </div>
  );
};


WordCountRepo.propTypes = {
  /** @ignore */
  classes: PropTypes.object,
  /** The Book ID to package. */
  url: PropTypes.string.isRequired,
   /** The overriding CSS for this component */
  style: PropTypes.object,
};

const styles = theme => ({
  root: {
  },
});

export default withStyles(styles)(WordCountRepo);

