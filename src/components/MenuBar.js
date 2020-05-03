import React, { useState, useContext } from "react";
import { Menu, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { AuthContext } from "./../context/auth";

function MenuBar(props) {
  const { user, logout } = useContext(AuthContext);
  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  }; //(e, { name }) => this.setState({ activeItem: name })

  return user
    ? <div>
        <Menu pointing secondary size="massive" color="teal">
          <Menu.Item
            name={user.username  + ' ' + 'dashboard'}
            active
            as={Link}
            to={"/"}
          />
          <Menu.Menu position="right">
            <Menu.Item name="logout" onClick={logout} />
            {/* <Menu.Item
              name={"Your Profile"}
              as={Link}
              to={"/user-profile"}
              active={activeItem === "Your Profile"}
              color="red"
              onClick={handleItemClick}
            /> */}
            <Menu.Item>
            <Button className="profile-button" size='tiny' basic color='teal' content='Teal' as={Link} to={"/user-profile"} >
                Your Profile
              </Button>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
    : <div>
        <Menu pointing secondary size="massive" color="teal">
          <Menu.Item
            name="home"
            active={activeItem === "home"}
            onClick={handleItemClick}
            as={Link}
            to={"/"}
          />
          <Menu.Menu position="right">
            <Menu.Item
              name="login"
              active={activeItem === "login"}
              onClick={handleItemClick}
              as={Link}
              to={"/login"}
            />
            <Menu.Item
              name="register"
              active={activeItem === "register"}
              onClick={handleItemClick}
              as={Link}
              to={"/register"}
            />
          </Menu.Menu>
        </Menu>
      </div>;
}

export default MenuBar;
