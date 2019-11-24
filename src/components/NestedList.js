import React from "react";
import pokemon from "../pokemon.json";
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

export default function NestedList() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    const handleTrade = () => {};

    const users = pokemon.people.map(user => {
        const pokeTemp = user.pokemon.map(poke => {
            return (
                <ListItem button className={classes.nested}>
                    <ListItemIcon>
                        <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary={poke} />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleTrade}
                    >
                        Trade
                    </Button>
                </ListItem>
            );
        });
        return (
            <div>
                <ListItem button onClick={handleClick}>
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
            {/* <ListItem button onClick={handleClick}>
                <ListItemIcon>
                    <SendIcon />
                </ListItemIcon>
                <ListItemText primary="User 1" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem button className={classes.nested}>
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="Starred" />
                    </ListItem>
                </List>
            </Collapse>
            <ListItem button onClick={handleClick}>
                <ListItemIcon>
                    <DraftsIcon />
                </ListItemIcon>
                <ListItemText primary="User 2" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem button className={classes.nested}>
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="Starred" />
                    </ListItem>
                </List>
            </Collapse>
            <ListItem button onClick={handleClick}>
                <ListItemIcon>
                    <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="User 3" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem button className={classes.nested}>
                        <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary="Starred" />
                    </ListItem>
                </List>
            </Collapse> */}
        </List>
    );
}
