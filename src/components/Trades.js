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

    let currentBlockchain = require("../jsons/" + instance + ".json");
    let myPort = require("../jsons/myconfig.json");

    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    // const [trade, setTrade] = React.useState(false);

    const handleOpen = () => {
        setOpen(!open);
    };
    // const openTrade = () => {
    //     setTrade(!trade);
    // };

    // function onSendMessage() {
    //     let message;
    //     if (!message) message = "Hello World";
    //     axios.post("https://localhost:3001/request", { message: message }).then(
    //         res => {
    //             console.log("Res:" + res);
    //         },
    //         err => {
    //             console.log("Error: " + err);
    //         }
    //     );
    //     return console.log("sent");
    // }

    const handleTrade = (id, approval) => {
        axios
            .post("localhost:" + myPort.address + "/update", {
                isApproved: approval,
                transactionID: id,
                name: instance
            })
            .then(setOpen(open));
    };

    const pendingTradeUsers = Object.keys(currentBlockchain.ledger).map(
        transaction => {
            if (
                currentBlockchain.ledger[transaction].address2 ==
                    myPort.address &&
                currentBlockchain.ledger[transaction].isPending
            ) {
                return (
                    <div>
                        <ListItem button onClick={handleOpen}>
                            <ListItemIcon>
                                <SendIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    currentBlockchain.wallets[
                                        currentBlockchain.ledger[transaction]
                                            .address1
                                    ].name
                                }
                            />
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <div>
                                    <ListItem button className={classes.nested}>
                                        <ListItemIcon>
                                            <StarBorder />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                "Trade your " +
                                                currentBlockchain.ledger[
                                                    transaction
                                                ].user2_value +
                                                " for a " +
                                                currentBlockchain.ledger[
                                                    transaction
                                                ].user1_value +
                                                "!"
                                            }
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => {
                                                handleTrade(
                                                    currentBlockchain.ledger[
                                                        transaction
                                                    ].firstHash,
                                                    true
                                                );
                                            }}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => {
                                                handleTrade(
                                                    currentBlockchain.ledger[
                                                        transaction
                                                    ].firstHash,
                                                    false
                                                );
                                            }}
                                        >
                                            Reject
                                        </Button>
                                    </ListItem>
                                </div>
                            </List>
                        </Collapse>
                    </div>
                );
            } else if (Object.keys(currentBlockchain.ledger).isEmpty)
                return "None";
        }
    );

    return (
        <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    Pending Trades
                </ListSubheader>
            }
            className={classes.root}
        >
            {pendingTradeUsers}
        </List>
    );
}
