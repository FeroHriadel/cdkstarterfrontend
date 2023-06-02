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



export const pushImageToSignedUrl = async (imageFile: any, url: string) => {
    //remove search from signed url
    let objectUrl = url.split('?')[0]; //aws link where image will be. AWS calls it objectUrl hence the name

    //do some file-to-base64 magic to get blobData
    let binary = atob(imageFile.split(',')[1]); //removes the image/png from image file
    let array = [];
    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i)) //pushes imageFile characters into the array
    }
    let blobData = new Blob([new Uint8Array(array)], {type: 'image/png'});

    //push blobData to presigned link
    return fetch(url, {method: 'PUT', body: blobData}).then(res => {
        if (!res.ok) return {error: 'Pushing to signed url failed'}
        return {objectUrl}
    });
}