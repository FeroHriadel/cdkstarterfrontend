/* 
GO TO BACKEND AND CDK DEPLOY
it will give you the follwoing output:
    CdkStarterStack.CdkStarterApiEndpointB31BC629 = https://bn60jk4vyc.execute-api.us-east-1.amazonaws.com/prod/
    CdkStarterStack.IdentityPoolId = us-east-1:2c157788-5edb-45c5-8155-817de9d0d9e2
    CdkStarterStack.UserPoolClientId = 6lmure4kp3773snladapgm9ftl
    CdkStarterStack.UserPoolId = us-east-1_KJOzeaNHh


GO TO AWS CONSOLE
aws console/Cognito/TestUserPool/Create user:
    email address: ferdinand.hriadel@gmail.com + mark email address as verified
    name: fero
    choose: generate a password
    the user will be in `force change password` state therefore:
    $ aws cognito-idp admin-set-user-password --user-pool-id us-east-1_sthbWQPgT --username fero --password "?9Znejakeheslo$" --permanent
*/


export const amplifyConfig = {
    REGION: 'us-east-1',
    USER_POOL_ID: 'us-east-1_RgLKCTXRN',
    APP_CLIENT_ID: '6lupoc4mc4hv4jl166o5ltdtig',
    IDENTITY_POOL_ID: 'us-east-1:86d64038-105c-4376-b108-ea6bbcb8362f',
}