import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import { greetName } from '../../core';

function HelloName({
  classes,
  name,
  style,
}) {
  const greeting = greetName({name});
  return (
    <Typography className={classes.root} style={style}>
      {greeting}
    </Typography>
  );
};

HelloName.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The name of the person to say hello to. */
  name: PropTypes.string.isRequired,
  /** The overriding CSS for this component */
  style: PropTypes.object,
};

const styles = theme => ({
  root: {
  },
});

export default withStyles(styles)(HelloName);
