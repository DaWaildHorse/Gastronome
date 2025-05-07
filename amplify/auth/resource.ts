import { defineAuth, secret } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: "CODE",
      verificationEmailSubject: "Welcome to the AI-Powered Recipe Generator!",
      verificationEmailBody: (createCode) =>
        `Use this code to confirm your account: ${createCode()}`,
    },
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
        scopes: ['profile'],
        attributeMapping: {
        },
      },
      callbackUrls: [
        'http://localhost:3000/profile',
        'https://main.d1nryih3xi6rcm.amplifyapp.com/profile'
      ],
      logoutUrls: [
        'http://localhost:3000/',
        'https://main.d1nryih3xi6rcm.amplifyapp.com'
      ]
      },
  }
});
