const devMode = 
  Number(import.meta.env.VITE_APP_DEV_MODE) === 1 
    ? true 
    : false;

export const serverUri = 
  devMode
    ? import.meta.env.VITE_APP_URI_DEV 
    : import.meta.env.VITE_APP_URI_PROD;

export const basename = 
  devMode 
    ? ''
    : import.meta.env.VITE_APP_BASENAME;
