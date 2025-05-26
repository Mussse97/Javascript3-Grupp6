/* eslint-disable no-undef */

/// <reference types="cypress" />

// Importerar Cypress och React-komponenter som ska testas 
import React from 'react';
import { Link } from 'react-router-dom';

// Mockade komponenter för att användas i tester
export const Startsida = () => <div>Mocked Startsida</div>;
export const Explore = () => <div>Mocked Explore</div>;
export const SinglePost = () => <div>Mocked SinglePost</div>;
export const CreatePost = () => <div>Mocked CreatePost</div>;
export const ProfilesList = () => <div>Mocked ProfilesList</div>;
export const ProfilePage = () => <div>Mocked ProfilePage</div>;
export const RegisterForm = () => <div>Mocked RegisterForm</div>;

// Mockade komponenter för Header och Footer 
export const Header = ({ toggleTheme }) => (
  <header>
    <button onClick={toggleTheme}>Toggle Theme</button>
    <nav>
      <Link to="/explore">Explore</Link>
    </nav>
  </header>
);

export const Footer = () => <footer>Mocked Footer</footer>;
