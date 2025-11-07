import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  GeminiResponse: a.customType({
    body: a.string(),
    error: a.string(),
  }),

  askBedrock: a
    .query()
    .arguments({ ingredients: a.string().array() })
    .returns(a.ref("GeminiResponse"))
    .authorization(allow => allow.publicApiKey())
    .handler(a.handler.custom({ entry: "./gemini.js" })),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,

  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
