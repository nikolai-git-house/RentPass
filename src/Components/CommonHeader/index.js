import React, { Component } from 'react'
import "./index.css";

export default class CommonHeader extends React.Component {
    render() {
        return (
            <div id="top-menu">
                <ul>
                    <li>
                        <a onClick={() => { window.location = "/community/" }}>Community</a>
                    </li>
                    <li>
                        <a onClick={() => { window.location = "/concierge/" }}>Concierge</a>
                    </li>
                    <li className="active">
                        <a onClick={() => { window.location = "/myhome/" }}>My Home</a>
                    </li>
                </ul>
            </div>
        )
    }
}