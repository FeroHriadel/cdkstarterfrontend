const api = process.env.REACT_APP_API;




export const getSignedUrl = async (fileName: string, token: string) => {
        return fetch(`${api}/getsignedurl`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
            body: JSON.stringify({fileName})
        })
        .then(res => {return res.json()})
        .catch(error => {
            console.log(error);
            return {error: JSON.stringify(error)}
        });
}