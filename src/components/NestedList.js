import React from "react";
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
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useParams } from "react-router-dom";
import axios from "axios";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        maxWidth: 720,
        backgroundColor: theme.palette.background.paper
    },
    nested: {
        paddingLeft: theme.spacing(4)
    }
}));

export default function Blockchain() {
    const { instance } = useParams();
    let blockchains = require("../jsons/" + instance + ".json");
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [trade, setTrade] = React.useState(false);

    const handleOpen = () => {
        setOpen(!open);
    };
    const openTrade = () => {
        setTrade(!trade);
    };

    function onSendMessage() {
        let message;
        if (!message) message = "Hello World";
        axios.post("https://localhost:3001/request", { message: message }).then(
            res => {
                console.log("Res:" + res);
            },
            err => {
                console.log("Error: " + err);
            }
        );
        return console.log("sent");
    }

    const handleTrade = () => {
        setTrade(!trade);
    };

    const users = blockchains.wallets.map(user => {
        const collectibles = user.collectibles.map(collectible => {
            return (
                <div>
                    <ListItem button className={classes.nested}>
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary={collectible} />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={openTrade}
                        >
                            Trade
                        </Button>
                        <Dialog
                            open={trade}
                            onClose={handleTrade}
                            aria-labelledby="form-dialog-title"
                        >
                            <DialogTitle id="form-dialog-title">
                                Trade
                            </DialogTitle>
                            <DialogContent>
                                Send a message along with your trade request!
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
                                <Button onClick={handleTrade} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={onSendMessage} color="primary">
                                    Send Request
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </ListItem>
                </div>
            );
        });
        return (
            <div>
                <ListItem button onClick={handleOpen}>
                    <ListItemIcon>
                        <SendIcon />
                    </ListItemIcon>
                    <ListItemText primary={user.name} />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {collectibles}
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
                    {instance} Blockchain
                </ListSubheader>
            }
            className={classes.root}
        >
            {users}
        </List>
    );
}
