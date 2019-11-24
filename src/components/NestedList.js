  
import React from "react";
// import "./NestedList.css";
import pokemon from "./pokemon.json";
import { makeStyles } from "@material-ui/core/styles";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import SendIcon from "@material-ui/icons/Send";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper
    },
    nested: {
        paddingLeft: theme.spacing(4)
    }
}));

export default function Blockchain() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [trade, setTrade] = React.useState(false);

    const handleOpen = () => {
        setOpen(!open);
    };
    const openTrade = () => {
        setOpenTrade(!openTrade);
      };

    function onSendMessage(message) {
        if (!message)
          return
    
        this.props.onSendMessage(message, (err) => {
          if (err)
            return console.error(err)
    
        //   return setMessage({ message: '' })
        })
    }

    const handleTrade = () => {};

    const users = pokemon.people.map(user => {
        const pokeTemp = user.pokemon.map(poke => {
            return (
                <div>
                <ListItem button className={classes.nested}>
                    <ListItemIcon>
                        <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary={poke} />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={openTrade}
                    >
                        Trade
                    </Button>
                </ListItem>
                <Dialog open={open} onClose={openTrade} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Trade</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Send a message along with your trade request
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        fullWidth
                    />
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleCloseTrade} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleCloseTrade} color="primary">
                        Send Request FIX THE FUNC
                    </Button>
                    </DialogActions>
                </Dialog>
                </div>
            );
        });
        return (
            <div>
                <ListItem button onClick={handleOpenTrade}>
                    <ListItemIcon>
                        <SendIcon />
                    </ListItemIcon>
                    <ListItemText primary={user.name + " " + user.lastname} />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {pokeTemp}
                    </List>
                </Collapse>
            </div>
        );
    });

    return (
        <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    Pokemon Blockchain
                </ListSubheader>
            }
            className={classes.root}
        >
            {users}
        </List>
    );
}