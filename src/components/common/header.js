"use strict";var React = require('react');var Header = React.createClass({    render: function () {        return(            <nav className="navbar navbar-default">                <div className="container-fluid">                    <div className="navbar-header">                        <a href="/" className="navbar-brand">                            <img src="images/react-logo.png"/>                        </a>                    </div>                    <div>                        <ul className="nav nav-bar">                            <li><a href="/">Home</a></li>                            <li><a href="/#about">About</a></li>                        </ul>                    </div>                </div>            </nav>        );    }});module.exports = Header;