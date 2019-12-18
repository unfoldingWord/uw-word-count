import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
//import Paper from '@material-ui/core/Paper';
//import Typography from '@material-ui/core/Typography';
import {fetchWordCountRepo} from './helpers';


function WordCountRepo({
  url,
  classes,
  style,
}) 
{

  const [res, setVal] = useState("Waiting-WordCountRepo");
  useEffect( () => {
    const fetchData = async () => {
      const result = await fetchWordCountRepo({ url: url });
      setVal(
        <div>
          <pre>{result}</pre>
        </div>
      );  
    };
    fetchData();
  }, []); 
  // the parameter [] allows the effect to skip if value unchanged
  // an empty [] will only update on mount of component

  return (
    <div className={classes.root}>
      {res}
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

