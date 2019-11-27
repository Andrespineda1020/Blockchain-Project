import React from "react";
import blockchains from "../jsons/blockchains.json";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/Inbox";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import NestedList from "./NestedList.js";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        maxWidth: 720,
        backgroundColor: theme.palette.background.paper
    }
}));

export default function SimpleList() {
    const classes = useStyles();

    let blockName = "Pokemon";

    const listOfBlockchains = blockchains.blockchainNames.map(instance => {
        return (
            <ListItem
                button
                component={Link}
                to={`/chain/${instance.name}`}
            >
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
                        <NestedList blockchain={blockName} />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}
