import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import { wordCount } from '../../core';

function WordCountBasic({
  classes,
  text,
  style,
}) {

  let results = wordCount(text);
  return (
    <Typography className={classes.root} style={style}>
      {results}
    </Typography>
  );
};

WordCountBasic.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The name of the person to say hello to. */
  text: PropTypes.string.isRequired,
  /** The overriding CSS for this component */
  style: PropTypes.object,
};

const styles = theme => ({
  root: {
  },
});

export default withStyles(styles)(WordCountBasic);
