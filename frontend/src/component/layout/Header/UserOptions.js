import React, { Fragment, useState } from 'react'
import "./Header.css"
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import Backdrop from "@material-ui/core/Backdrop";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import ListAltIcon from "@material-ui/icons/ListAlt";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"
import Home from "@material-ui/icons/Home"
import { useAlert } from "react-alert";
import { logout } from "../../../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
const UserOptions = ({ user }) => {
    const { cartItems } = useSelector((state) => state.cart)
    const [open, setOpen] = useState(false);
    const alert = useAlert();
    const dispatch = useDispatch();
    const history = useHistory();
    const options = [
        { icon: <Home />, name: "Home", func: home },
        { icon: <ListAltIcon />, name: "Orders", func: orders },
        { icon: <PersonIcon />, name: "Profile", func: account },
        { icon: <ShoppingCartIcon style={{ color: cartItems.length > 0 ? "red" : "unset" }} />, name: `Cart(${cartItems.length})`, func: cart },
        { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
    ]
    if (user.roles === "admin") {
        options.unshift({
            icon: <DashboardIcon />,
            name: "Dashboard",
            func: dashboard,
        });
    }
    function home() {
        history.push("/");
    }
    function dashboard() {
        history.push("/admin/dashboard");
    }
    function orders() {
        history.push("/orders");
    }
    function account() {
        history.push("/account")
    }
    function cart() {
        history.push("/cart")
    }
    function logoutUser() {
        dispatch(logout());
        alert.success("Logout SuccessFully");
    }

    return (
        <Fragment>
            <Backdrop open={open} style={{ zIndex: "10" }} />
            <SpeedDial
                ariaLabel='SpeedDial tooltip example'
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                style={{ zIndex: "11" }}
                open={open}
                direction="down"
                className='speedDial'
                icon={
                    <img
                        className='speedDialIcon'
                        src={user.avatar.url ? user.avatar.url : "/Profile.png"}
                        alt="Profile" />

                }
            >
                {options.map((item) => (
                    <SpeedDialAction
                        key={item.name}
                        icon={item.icon}
                        tooltipTitle={item.name}
                        onClick={item.func}
                        tooltipOpen={window.innerWidth <= 600 ? true : false}
                    />
                ))}

            </SpeedDial>
        </Fragment>
    )
}

export default UserOptions
