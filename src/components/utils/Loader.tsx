// src/components/utils/Loader.tsx
import { ProgressSpinner } from 'primereact/progressspinner';
import React from 'react';
import './Login.scss';

interface LoaderProps extends React.HTMLProps<HTMLDivElement> {
  message?: string; // Optional message prop
}

const Loader: React.FC<LoaderProps> = ({ message = '', ...props }) => (
  <div className='loader-container' {...props}>
    <p className='loader-message'>{message}</p>
    <div className='loader-spinner'>
      <ProgressSpinner />
    </div>
  </div>
);

export default Loader;
