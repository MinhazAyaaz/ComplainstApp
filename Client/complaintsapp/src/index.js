import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import reportWebVitals from './reportWebVitals';
import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import App from './App';
import FileUpload from './components/FileUpload';
import SignUp from './routes/signup';
import SignIn from './routes/SignIn';
import Login from './routes/Login';
import Profile from './routes/profile';
import EditPage from './routes/EditPage';
import Dashboard from './routes/dashboard';
import CreateComplaint from './routes/CreateComplaint';
import PrivateRoute from './routes/PrivateRoute';
import Admin from './routes/Admin';
import OCR from './routes/OCR';
import SignUp2 from './routes/SignUp2'
import SignUpOcr from './routes/signup-with-ocr';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<SignIn />}/>
      <Route path="/fileupload" element={<FileUpload />}/>
      <Route path="signup" element={<SignUp2 />}/>
      <Route path="login" element={<Login />}/>
      <Route path="dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      }/>
      <Route path="profile" element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      }/>
      <Route path="signup-with-ocr" element={<SignUpOcr />}/>
      <Route path="createcomplaint" element={<CreateComplaint />}/>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
