import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {fetchWordCountRepo} from './helpers';
import * as util from '../../core/utilities';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import MaterialTable from 'material-table';
import { forwardRef } from 'react';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};


function WordCountRepo({
  url,
  classes,
  style,
}) 
{

  const [res, setVal] = useState("Waiting-WordCountRepo");
  useEffect( () => {
    const fetchData = async () => {
      let result;
      try {
        result = await fetchWordCountRepo({ url: url });
      } catch(error) {
        setVal(
          <div>
            {error.message}
          </div>
        )
        return;
      }
      //console.log(result)
      let keys = Array.from(Object.keys(result.grandTotals));

      // ok - we have results to show
      let mt = util.wf_to_mt(result.grandTotals.wordFrequency);
      let aw = util.aw_to_mt(result.grandTotals.allWords);
      setVal (
        <Paper className={classes.paper}>
          <Typography className={classes.root} style={style}>
            Total number of words: {result.grandTotals.total} <br/>
            Distinct number of words: {result.grandTotals.distinct} <br/> 
            Number of Markdown Level 1 Headings: {result.grandTotals.l1count}
          </Typography>
          <MaterialTable
            icons={tableIcons}
            title={mt.title}
            columns={mt.columns}
            data={mt.data}
            options={mt.options}
          />
        </Paper>
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

/*
      setVal(
        <div>
          {keys.sort().map( mkey => (
            <pre>{mkey}</pre>
          ))}
        </div>
      );  
  
  
  let mt = util.wf_to_mt(results.wordFrequency);
  let aw = util.aw_to_mt(results.allWords);

  return (
    <Paper className={classes.paper}>
      <Typography className={classes.root} style={style}>
        Total number of words: {results.total} <br/>
        Distinct number of words: {results.distinct} <br/> 
        Number of Markdown Level 1 Headings: {results.l1count}
      </Typography>
      <MaterialTable
        icons={tableIcons}
        title={aw.title}
        columns={aw.columns}
        data={aw.data}
        options={aw.options}
      />
      <MaterialTable
        icons={tableIcons}
        title={mt.title}
        columns={mt.columns}
        data={mt.data}
        options={mt.options}
      />
    </Paper>
  );

*/