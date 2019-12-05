import React from "react";
import blockchains from "../jsons/Manager.json";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/Inbox";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import NestedList from "./NestedList.js";
import Trades from "./Trades.js";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        maxWidth: 720,
        backgroundColor: theme.palette.background.paper
    }
}));
//Insert a prop "isAll" to make the list of blockchains = genesis or = myWallet
export default function SimpleList() {
    const classes = useStyles();

    const listOfBlockchains = blockchains.wallets[
        blockchains.genesis_block
    ].collectibles.map(instance => {
        return (
            <ListItem button component={Link} to={`/chain/${instance.name}`}>
                <ListItemIcon>
                    <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={instance.name} />
            </ListItem>
        );
    });

    return (
        <div className={classes.root}>
            <Router>
                <List component="nav" aria-label="main mailbox folders">
                    {listOfBlockchains}
                </List>
                <Switch>
                    <Route exact path="/chain/:instance">
                        <Trades />
                        <NestedList />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}
