import { NavigateOptions, useNavigate } from 'react-router-dom';

const useCustomNavigate = () => {
  const navigate = useNavigate();
  
  return (path: string, options?: NavigateOptions) => {
    // Use the path directly since Router basename handles the base path
    navigate(path, options);
  };
};

export default useCustomNavigate;
