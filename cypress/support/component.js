/* eslint-disable no-undef */ 

import { mount } from 'cypress/react';
import '../../src/index.css'; // eller RegisterForm.css om du bara vill ha viss styling

Cypress.Commands.add('mount', mount);
