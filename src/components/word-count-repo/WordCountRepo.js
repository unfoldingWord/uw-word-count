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
      console.log(result)
      let keys = Array.from(Object.keys(result));
      if ( keys.length === 0 ) {
        setVal(
          <div>
            No matching files found!
          </div>
        )
        return
      }
      setVal(
        <div>
          {keys.sort().map( mkey => (
            <pre>{mkey}</pre>
          ))}
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
  /** The URL to a repo, folder, or file for word gounts. */
  url: PropTypes.string.isRequired,
   /** The overriding CSS for this component */
  style: PropTypes.object,
};

const styles = theme => ({
  root: {
  },
});

export default withStyles(styles)(WordCountRepo);

