import { createClient } from '@base44/sdk';

export const base44 = createClient({
  appId: "6a3275e1ba274d08cab626cd",

  headers: {
    api_key: "7cb455c071554ed1a591bba9600f953e"
  },

  appBaseUrl: "https://reclo-couture-rental.base44.app",

  requiresAuth: false
});