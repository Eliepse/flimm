import React from "react";
import {render} from 'react-dom';
import App from './app';
import {BrowserRouter} from 'react-router-dom';
import {AuthProvider} from './lib/auth/authProvider';

require('./bootstrap');

render((<AuthProvider><BrowserRouter><App/></BrowserRouter></AuthProvider>), document.querySelector("#root"));