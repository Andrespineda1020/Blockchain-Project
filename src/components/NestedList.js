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
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useParams } from "react-router-dom";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import axios from "axios";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        maxWidth: 720,
        backgroundColor: theme.palette.background.paper
    },
    nested: {
        paddingLeft: theme.spacing(4)
    },
    collectibleButtons: {
        padding: theme.spacing(2)
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 160
    },
    selectEmpty: {
        marginTop: theme.spacing(2)
    }
}));

export default function Blockchain() {
    const { instance } = useParams();
    let blockchains = require("../jsons/" + instance + ".json");
    let myPort = require("../jsons/myconfig.json").address;
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [trade, setTrade] = React.useState(false);
    const [tradingForPokemon, setTradingForPokemon] = React.useState("");
    const [myTradePokemon, setMyTradePokemon] = React.useState("");
    const [tradeUser, setTradeUser] = React.useState("");

    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);

    const handleSelection = event => {
        setMyTradePokemon(event.target.value);
    };

    const handleOpen = () => {
        setOpen(!open);
    };
    const openTrade = (collectible, user) => {
        setTrade(!trade);
        setTradingForPokemon(collectible);
        setTradeUser(user);
    };

    function onSendMessage() {
        if (myTradePokemon != "") handleTrade();
        axios
            .post("http://localhost:" + myPort + "/create", {
                name: instance,
                transaction: {
                    address1: myPort,
                    address2: tradeUser,
                    public_key1: blockchains.wallets[myPort].public_key,
                    public_key2: blockchains.wallets[tradeUser].public_key,
                    user1_value: myTradePokemon,
                    ranking:
                        blockchains.wallets.length -
                        (blockchains.wallets[myPort].ranking +
                            blockchains.wallets[tradeUser].ranking),
                    current_rank: 0,
                    user2_value: tradingForPokemon,
                    isPending: true,
                    isComplete: false
                }
            })
            .then(
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

    const myCollectibles = blockchains.wallets[myPort].collectibles.map(
        collectible => {
            return <MenuItem value={collectible}>{collectible}</MenuItem>;
        }
    );

    const users = Object.keys(blockchains.wallets).map(user => {
        const collectibles = blockchains.wallets[user].collectibles.map(
            collectible => {
                return (
                    <div>
                        <ListItem button className={classes.nested}>
                            <ListItemIcon>
                                <StarBorder />
                            </ListItemIcon>
                            <ListItemText primary={collectible} />
                            {user != myPort ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        openTrade(collectible, user);
                                    }}
                                >
                                    Trade
                                </Button>
                            ) : (
                                <></>
                            )}
                            <Dialog
                                open={trade}
                                onClose={handleTrade}
                                aria-labelledby="form-dialog-title"
                            >
                                <DialogTitle id="form-dialog-title">
                                    Trade
                                </DialogTitle>
                                <DialogContent>
                                    Select which of your collectibles you want
                                    to trade for !
                                    <div className={classes.collectibleButtons}>
                                        <FormControl
                                            variant="outlined"
                                            className={classes.formControl}
                                        >
                                            <InputLabel
                                                ref={inputLabel}
                                                id="demo-simple-select-outlined-label"
                                            >
                                                My Collectibles
                                            </InputLabel>
                                            <Select
                                                labelId="demo-simple-select-outlined-label"
                                                id="demo-simple-select-outlined"
                                                value={myTradePokemon}
                                                onChange={handleSelection}
                                                labelWidth={labelWidth}
                                            >
                                                {myCollectibles}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        onClick={handleTrade}
                                        color="primary"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={onSendMessage}
                                        color="primary"
                                    >
                                        Send Request
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </ListItem>
                    </div>
                );
            }
        );
        return (
            <div>
                <ListItem button onClick={handleOpen}>
                    <ListItemIcon>
                        <SendIcon />
                    </ListItemIcon>
                    <ListItemText primary={blockchains.wallets[user].name} />
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
