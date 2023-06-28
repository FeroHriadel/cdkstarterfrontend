const api = process.env.REACT_APP_API;



export const getS3Object = async (imageUrl: string) => {
    return fetch(`${api}/gets3object`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({image: imageUrl})
    })
    .then(res => {
        let parsed = res.json();
        return parsed;
    })
    .catch(err => {
        console.log(err);
        return {error: 'Failed to get image'}
    })
}


