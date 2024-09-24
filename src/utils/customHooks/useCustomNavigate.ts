import { NavigateOptions, useNavigate } from 'react-router-dom';

const useCustomNavigate = () => {
  const navigate = useNavigate();
  const basePath = '/childadmin/admin';  // Set your base path here

  return (path: string, options?: NavigateOptions) => {
    // Prepend base path if it's not already included in the path
    const finalPath = path.startsWith(basePath) ? path : `${basePath}${path}`;
    navigate(finalPath, options);
  };
};

export default useCustomNavigate;
