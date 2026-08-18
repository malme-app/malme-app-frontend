export const environment = {
  production: true,
  firebase: {
    apiKey: 'AIzaSyCO4R1CmJQzVUKfotcOqJCLbwNjrwMzRXc',
    authDomain: 'structuralen-395cf.firebaseapp.com',
    projectId: 'structuralen-395cf',
    storageBucket: 'structuralen-395cf.appspot.com',
    messagingSenderId: '861143356248',
    appId: '1:861143356248:web:b3236a57a09f7513040b2d',
    measurementId: 'G-Y61W803WE7'
  },
  apiBaseUrl: '/api/mypage',
  myURL: 'https://mypage.malme.app/',

  msalConfig: {
    auth: {
      clientId: '6e5dd750-94fb-48e0-a9a9-539973a902a9',
      redirectUri: 'https://mypage.malme.app/',
      postLogoutRedirectUri: 'https://mypage.malme.app/'
    }
  },
  apiConfig: {
    scopes: [
      'openid',
      'offline_access',
      'profile',
      'https://malmeapp.onmicrosoft.com/malmeapp/User.Read',
      'https://malmeapp.onmicrosoft.com/malmeapp/User.ReadWrite.All'
    ],
    uri: 'https://malmeapp.onmicrosoft.com/malmeapp'
  },
  b2cPolicies: {
    names: {
      signUpSignIn: 'B2C_1_malme_signin_prod',
      resetPassword: 'B2C_1_malme_resetpassword_prod',
      signUp: 'B2C_1_malme_signup_prod',
      editProfile: 'B2C_1_malmeapp_userinfo'
    },
    authorities: {
      signUpSignIn: {
        authority: 'https://malmeapp.b2clogin.com/malmeapp.onmicrosoft.com/B2C_1_malme_signin_prod'
      },
      resetPassword: {
        authority:
          'https://malmeapp.b2clogin.com/malmeapp.onmicrosoft.com/B2C_1_malme_resetpassword_prod'
      },
      signUp: {
        authority: 'https://malmeapp.b2clogin.com/malmeapp.onmicrosoft.com/B2C_1_malme_signup_prod'
      },
      editProfile: {
        authority: 'https://malmeapp.b2clogin.com/malmeapp.onmicrosoft.com/B2C_1_malmeapp_userinfo'
      }
    },
    authorityDomain: 'malmeapp.b2clogin.com'
  }
};
