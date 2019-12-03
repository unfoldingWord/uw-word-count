import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { wordCount } from '../../core';

function WordCountRepo({
  classes,
  url,
}) {


  return (
    <List className={classes.root}>
      {url}
    </List>
  );
};

WordCountRepo.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** The url to the repo. */
  url: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
  },
});

export default withStyles(styles)(WordCountRepo);
