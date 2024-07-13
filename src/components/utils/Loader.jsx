// src/components/utils/Loader.js
import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import '../Login.scss';

const Loader = () => (
  <div className="loader">
    <ProgressSpinner />
  </div>
);

export default Loader;
