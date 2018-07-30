
import React from 'react';
import { UserInfoContext } from "../context";

export default function UserBox(props) {
    return (
      <UserInfoContext.Consumer>
        { userInfo => (<p>{userInfo.name}</p>) }
      </UserInfoContext.Consumer>
    );
}






