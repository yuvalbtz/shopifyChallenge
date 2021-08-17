import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useParams } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));
function Layout({children}) {
   
    const classes = useStyles();
   const params = useParams()
    return (
        <div className={classes.root}>
        <AppBar position="relative">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
         {params.orderNumber ? 'Shopify Line Items Table' : 'Shopify Orders Table'}
            </Typography>
          </Toolbar>
        </AppBar>
      
      {children}
      
      
      </div>)
}

export default Layout
