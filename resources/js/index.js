import React from "react";
import {render} from 'react-dom';
import App from './app';
import {BrowserRouter} from 'react-router-dom';

require('./bootstrap');

render((<BrowserRouter><App/></BrowserRouter>), document.querySelector("#root"));