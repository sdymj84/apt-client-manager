export default {
  s3: {
    REGION: "us-east-2",
    BUCKET: "YOUR_S3_UPLOADS_BUCKET_NAME"
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://ps9ifgucu4.execute-api.us-east-2.amazonaws.com/dev"
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_Ebfy6fBko",
    APP_CLIENT_ID: "6c3klu9obknerstuvlq6evl2sn",
    IDENTITY_POOL_ID: "us-east-2:560d4916-d2e8-4ee2-bd33-282e6266af18"
  }
};


/*

* GET residents/{id}
apig-test \
--username='sdymj84@gmail.com' \
--password='Apt141246' \
--user-pool-id='us-east-2_DhrStIt3D' \
--app-client-id='8s72qccqdrvlekacimtuol1kl' \
--cognito-region='us-east-2' \
--identity-pool-id='us-east-2:560d4916-d2e8-4ee2-bd33-282e6266af18' \
--invoke-url='https://ps9ifgucu4.execute-api.us-east-2.amazonaws.com/dev' \
--api-gateway-region='us-east-2' \
--path-template='/residents/63c2799f-d78b-4c0b-b7d5-f362be3b2ae3' \
--method='GET' \

* GET aparts/{id}
apig-test \
--username='sdymj84@gmail.com' \
--password='Apt141246' \
--user-pool-id='us-east-2_DhrStIt3D' \
--app-client-id='8s72qccqdrvlekacimtuol1kl' \
--cognito-region='us-east-2' \
--identity-pool-id='us-east-2:560d4916-d2e8-4ee2-bd33-282e6266af18' \
--invoke-url='https://ps9ifgucu4.execute-api.us-east-2.amazonaws.com/dev' \
--api-gateway-region='us-east-2' \
--path-template='/aparts/2303' \
--method='GET' \


apig-test \
--username='sdymj84@gmail.com' \
--password='Roalcls1@' \
--user-pool-id='us-east-2_kMnUVBUvm' \
--app-client-id='7g1cnqq4dc0oe79pbfjfvovcq9' \
--cognito-region='us-east-2' \
--identity-pool-id='us-east-2:0b3630af-de38-46b3-9dfa-a8d4f92e7999' \
--invoke-url='https://5u96uya1p5.execute-api.us-east-2.amazonaws.com/prod' \
--api-gateway-region='us-east-2' \
--path-template='/notes/65e156e0-3b06-11e9-a2b8-7ba4af29b004' \
--method='GET' \
--params='{"requestContext":{"identity":{"cognitoIdentityId":"us-east-2:a659845c-60c7-4f2f-88ca-d86c430c3009"}}}' \
--body='{"pathParameters":{"residentId":"63c2799f-d78b-4c0b-b7d5-f362be3b2ae3"}}'

*/