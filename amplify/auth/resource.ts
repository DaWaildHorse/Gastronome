import { defineAuth, secret } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: "CODE",
      verificationEmailSubject: "Welcome to the AI-Powered Recipe Generator!",
      verificationEmailBody: (createCode) =>
        `Use this code to confirm your account: ${createCode()}`,
    },
    externalProviders :{
      google: {
        clientId: secret('869550831718-5rk9jufe6baqad8cit4lh7e4m909lkvf.apps.googleusercontent.com '),
        clientSecret: secret('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'),
               
        attributeMapping: {
          email: 'email'
        }
      },
      callbackUrls: [
        'http://localhost:3000/profile',
        'https://https://main.d1nryih3xi6rcm.amplifyapp.com/profile'
      ],
      logoutUrls: ['http://localhost:3000/', 'https://main.d1nryih3xi6rcm.amplifyapp.com'],
    }
    
  }
});

