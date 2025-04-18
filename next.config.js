/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    auth_enabled: process.env.AUTH_ENABLED,
    secret: process.env.NEXTAUTH_SECRET,
    nextauth: {
      client_name: process.env.CLIENT_NAME,
      client_nameid: process.env.CLIENT_NAME_ID,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      client_authorization_url: process.env.CLIENT_AUTHORIZATION_URL,
      client_token_url: process.env.CLIENT_TOKEN_URL,
      client_userinfo_url: process.env.CLIENT_USERINFO_URL,
    },
    orc: {
      url: process.env.ORC_API_URL,
      token: process.env.ORC_API_TOKEN,
    },
  },
  publicRuntimeConfig: {
    vm_enabled: process.env.VM_ENABLED,
    url: process.env.URL,
  },
  //output: "standalone",
};

module.exports = nextConfig;
