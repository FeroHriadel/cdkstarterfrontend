/* 
GO TO BACKEND AND CDK DEPLOY
it will give you the follwoing output:
    CdkStarterStack.CdkStarterApiEndpointB31BC629 = https://eg3izp9k07.execute-api.us-east-1.amazonaws.com/prod/
    CdkStarterStack.IdentityPoolId = us-east-1:478b510b-7249-4cd2-9489-63f6206c0204
    CdkStarterStack.UserPoolClientId = 168sck2atlof55uiilgckgun4m
    CdkStarterStack.UserPoolId = us-east-1_xuz7mJB7s


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
    USER_POOL_ID: 'us-east-1_xuz7mJB7s',
    APP_CLIENT_ID: '168sck2atlof55uiilgckgun4m',
    IDENTITY_POOL_ID: 'us-east-1:478b510b-7249-4cd2-9489-63f6206c0204',
}