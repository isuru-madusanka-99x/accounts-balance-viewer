export const authConfig = {
  domain: 'dev-zzck4hyetzrswokv.us.auth0.com', // Replace with your Auth0 domain
  clientId: 'aQz576JTToIR690WGVLwxcnqmTeLLB4U', // Replace with your Auth0 client ID
  authorizationParams: {
    redirect_uri: window.location.origin,
    scope: 'openid profile email',
    audience: 'https://accounts-balance-viewer-api.azurewebsites.net/' // Replace with your API identifier if you have one
  }
};
