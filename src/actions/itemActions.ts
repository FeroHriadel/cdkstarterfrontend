import { changeMessage } from "../slices/messageSlice";
import { ItemModel } from "../models/models";
import { getItems, updateItems, removeItem } from "../slices/itemsSlice";
import { getSignedUrl, pushImageToSignedUrl } from "./imagesActions";



const api = process.env.REACT_APP_API;

const objectIntoQuery = (query: {[key: string]: string}) => {
    let result = '?';
    Object.keys(query).forEach((key, idx) => {
        result = result + key + '=' + query[key];
        if (idx < Object.keys(query).length - 1) {
            result = result + '&'
        }
    })
}



export const fetchItems = (query: {[key: string]: string} | null) => async (dispatch: any) => {
    try {
        dispatch(changeMessage('Getting items...'));
        const res = await fetch(`${api}/items${query ? objectIntoQuery(query) : ''}`);
        if (!res.ok) throw new Error('Failed to get response (`/items`)');
        const data = await res.json();
        if (data && data.error) throw new Error(`${data.error}`);
        dispatch(getItems(data));
        dispatch(changeMessage(''));
    } catch (error) {
        console.log(error);
        dispatch(changeMessage(JSON.stringify(error)));
        setTimeout(() => { dispatch(changeMessage('')) }, 2000);
    }
}



export const saveItem = (
    item: ItemModel, 
    mainImageData: {fileName: string, imageFile: any} | null, 
    imagesData: {fileName: string, imageFile: any}[] | null,
    token: string
) => async (dispatch: any) => {
    
    //additional images not possible if no main image
    dispatch(changeMessage('Saving Item...'));
    if (!mainImageData?.fileName && imagesData && imagesData.length > 0) {
        dispatch(changeMessage(`Cannot save additional images if there's no main image`));
        setTimeout(() => { dispatch(changeMessage('Saving main image...')); }, 2000);
        return
    } 

    //if main image ==> get url for mainImage
    if (mainImageData?.fileName) {
        dispatch(changeMessage('Saving main image...'));
        getSignedUrl(mainImageData.fileName, token).then(data => {
            if (data.error || !data.url) {
                dispatch(changeMessage('Error: Main Image Upload Failed'));
                setTimeout(() => {dispatch(changeMessage(''))}, 2000);
                return
            
            //push mainImage to signedUrl
            } else {
                pushImageToSignedUrl(mainImageData.imageFile, data.url).then(result => {
                    if (result.objectUrl) {
                        item.mainImage = result.objectUrl;
                        dispatch(changeMessage('Main Image saved...'));

                        //after mainImage saved, save additional images...
                        if (imagesData && imagesData.length > 0) {
                            //...forEach additional image...
                            imagesData.forEach((img, idx) => {
                                //...get signed url...
                                dispatch(changeMessage(`Saving additional image ${idx + 1}...`));
                                getSignedUrl(img.fileName, token).then(dta => {
                                    if (dta.error || !dta.url) {
                                        dispatch(changeMessage(`Error: Image ${idx + 1}  upload failed`));
                                        setTimeout(() => {dispatch(changeMessage(''))}, 2000);
                                        return
                                    } else {
                                        //...and push file to the url
                                        pushImageToSignedUrl(img.imageFile, dta.url).then(rslt => {
                                            if (rslt.objectUrl) {
                                                item.images?.push(rslt.objectUrl)
                                                dispatch(changeMessage(`Image ${idx + 1} saved...`));

                                            } else {
                                                dispatch(changeMessage(`Error: Image ${idx + 1} Upload Failed`));
                                                setTimeout(() => {dispatch(changeMessage(''))}, 2000);
                                                return
                                            }
                                        })
                                    }
                                })
                            });

                            //save item with main image and additional images
                            dispatch(changeMessage('Saving Item with main and additional images...'));
                            fetch(`${api}/items`, {
                                method: 'POST',
                                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                                body: JSON.stringify(item)
                            }).then(resp => resp.json())
                            .then(respData => {
                                if (respData?.error) {
                                    console.log(respData.error);
                                    dispatch(changeMessage(`Saving Item failed`)); 
                                    setTimeout(() => {dispatch(changeMessage(``))}, 2000); 
                                    return; 
                                }
                                else {
                                    dispatch(changeMessage(`Item saved`));
                                }
                            })
                            .catch(error => {
                                console.log(error);
                                dispatch(changeMessage(`Saving Item failed`)); 
                                setTimeout(() => {dispatch(changeMessage(``))}, 2000); 
                                return; 
                            })


                        //save item with mainImage, no additionalImages
                        } else {
                            dispatch(changeMessage(`Saving item and main image...`));
                            fetch(`${api}/items`, {
                                method: 'POST',
                                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                                body: JSON.stringify(item)
                            }).then(resp => resp.json())
                            .then(respData => {
                                if (respData?.error) {
                                    console.log(respData.error);
                                    dispatch(changeMessage(`Saving Item failed`)); 
                                    setTimeout(() => {dispatch(changeMessage(``))}, 2000); 
                                    return; 
                                }
                                else {
                                    dispatch(changeMessage(`Item saved`));
                                }
                            })
                            .catch(error => {
                                console.log(error);
                                dispatch(changeMessage(`Saving Item failed`)); 
                                setTimeout(() => {dispatch(changeMessage(``))}, 2000); 
                                return; 
                            })
                        }

                    //saving main image failed
                    } else {
                        dispatch(changeMessage('Error: Main Image Upload Failed'));
                        setTimeout(() => {dispatch(changeMessage(''))}, 2000);
                        return
                    }
                })
            }
        })
    }

    else {
        //save item without main image
        dispatch(changeMessage('Saving Item without images...'));
        fetch(`${api}/items`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        }).then(resp => resp.json())
        .then(respData => {
            if (respData?.error) {
                console.log(respData.error);
                dispatch(changeMessage(`Saving Item failed`)); 
                setTimeout(() => {dispatch(changeMessage(``))}, 2000); 
                return; 
            }
            else {
                dispatch(changeMessage(`Item saved`));
            }
        })
        .catch(error => {
            console.log(error);
            dispatch(changeMessage(`Saving Item failed`)); 
            setTimeout(() => {dispatch(changeMessage(``))}, 2000); 
            return; 
        })

    }
}