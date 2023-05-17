import { amplifyConfig } from "../amplifyConfig";
import { Amplify, Auth } from 'aws-amplify';
import { CognitoUser } from "@aws-amplify/auth";



Amplify.configure({
    Auth: {
        mandatorySignIn: false,
        region: amplifyConfig.REGION,
        userPoolId: amplifyConfig.USER_POOL_ID,
        userPoolWebClientId: amplifyConfig.APP_CLIENT_ID,
        authenticationFlowType: 'USER_PASSWORD_AUTH'
    }
});



export const signup =  async (name: string, email: string, password: string): Promise<any> => {
    try {
        const result = await Auth.signUp({username: name, password: password, attributes: {email: email}});
        if (result.user) return {user: result.user};
        else return {error: result}
    } catch (error) {
        console.log(error);
        return {error}
    }
};



export const resendConfirmationCode = async (username: string): Promise<any> => {
    try {
        let result = await Auth.resendSignUp(username);
        if (result.CodeDeliveryDetails) return result.CodeDeliveryDetails;
        else return {error: 'Something went wrong'}
    } catch (error) {
        console.log(error)
        return {error}
    }
}



export const confirmSignup = async (username: string, code: string): Promise<any> => {
    try {
        const result = await Auth.confirmSignUp(username, code);
        return result;
    } catch (error) {
        console.log(error);
        return {error};
    }
}



export const login = async (username: string, password: string) => {
    try {
        const result = await Auth.signIn(username, password);
        if (!result.username) return {error: result};
        return result;     
    } catch (error) {
        return {error};
    }
}



export const sendPasswordResetEmail = async (username: string): Promise<any> => {
    try {
        let result = await Auth.forgotPassword(username);
        if (!result.CodeDeliveryDetails) return {error: result}
        else return result
        
    } catch (error) {
        console.log(error);
        return {error}
    }
}



export const sendCodeAndNewPassword = async (username: string, code: string, newPassword: string): Promise<any> => {
    try {
        const result = await Auth.forgotPasswordSubmit(username, code, newPassword);
        return result;
    } catch (error) {
        console.log(error);
        return {error};
    }
}



export const logout = async () => {
    try {
        await Auth.signOut();
    } catch (error) {
        console.log(error);
    }
}



export const refreshIdToken = async () => {
    try {
        const session = await Auth.currentSession(); //this should refresh the idToken
        return {token: session.getIdToken().getJwtToken()};
    } catch (error) {
        console.log('Unable to refresh token', error);
        return { error }
    }
}