import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';


export const base44 = createClient({

  appId: appParams.appId,

  headers:{
    "api_key":"7cb455c071554ed1a591bba9600f953e"
  },

  serverUrl:"",

  requiresAuth:false,

  appBaseUrl: appParams.appBaseUrl

});