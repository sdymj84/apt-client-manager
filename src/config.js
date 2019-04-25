// DEV Config

export default {
  s3: {
    REGION: "us-east-2",
    BUCKET: "apt-api-dev-attachmentsbucket-11ysd3am6wave"
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://6en81fg4h9.execute-api.us-east-2.amazonaws.com/dev"
  },
  cognito: {
    REGION: "us-east-2",
    IDENTITY_POOL_ID: "us-east-2:03f204f8-1f4d-461a-857d-88e110ffbe7c"
  },
  cognitoManager: {
    USER_POOL_ID: "us-east-2_Ebfy6fBko",
    APP_CLIENT_ID: "6c3klu9obknerstuvlq6evl2sn",
  },
  cognitoResident: {
    USER_POOL_ID: "us-east-2_UcFdGv0rm",
    APP_CLIENT_ID: "74ufhb658q602501n8srm2v5qe",
  }
};


// PROD Config

/* export default {
  s3: {
    REGION: "us-east-2",
    BUCKET: "apt-api-prod-attachmentsbucket-h3z6n8i852ao"
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://1vdwkm5guj.execute-api.us-east-2.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-2",
    IDENTITY_POOL_ID: "us-east-2:582d606b-c983-4b55-a574-4cee498fa0cf"
  },
  cognitoManager: {
    USER_POOL_ID: "us-east-2_cw4SUcS2N",
    APP_CLIENT_ID: "4nkds9ekbmmg0gkjp2tbr50l8v",
  },
  cognitoResident: {
    USER_POOL_ID: "us-east-2_4C9kJL3r2",
    APP_CLIENT_ID: "63k43t2e3dd1fklgel21ia2epr",
  }
}; */





