import { changeMessage } from "../slices/messageSlice";
import { ItemModel } from "../models/models";
import { getItems, updateItems, removeItem } from "../slices/itemsSlice";
import { getSignedUrl, pushImageToSignedUrl } from "./imagesActions";



const api = process.env.REACT_APP_API;

const objectIntoQuery = (query: {[key: string]: string}) => {
    console.log(query)
    let result = '?';
    Object.keys(query).forEach((key, idx) => {
        result = result + key + '=' + query[key];
        if (idx < Object.keys(query).length - 1) {
            result = result + '&'
        }
    })
    return result
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



export const getItemById = async (itemId: string) => {
    try {
        const res = await fetch(`${api}/items?item=${itemId}`);
        const data = await res.json();
        if (data && data.error) throw new Error(`${data.error}`);
        return data;
    } catch (error) {
        console.log(error);
        return {error};
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
        let data = await getSignedUrl(mainImageData.fileName, token);
        if (data.error || !data.url) {
            dispatch(changeMessage('Error: Main Image Upload Failed'));
            setTimeout(() => {dispatch(changeMessage(''))}, 2000);
            return

        //push mainImage to signedUrl
        } else {
            let result = await pushImageToSignedUrl(mainImageData.imageFile, data.url);
            if (result.objectUrl) {
                item.mainImage = result.objectUrl;
                dispatch(changeMessage('Main Image saved...'));

                //after mainImage saved, save additional images if any...

                if (imagesData && imagesData.length > 0) {
                    //...get signed urls for each img...
                    dispatch(changeMessage('Saving additional images'));
                    let presignedUrls: string[] = [];
                    Promise.all(imagesData.map(async img => { return await getSignedUrl(img.fileName, token)}))
                    .then(values => {
                        values.forEach(value => presignedUrls.push(value.url));
                        if (presignedUrls.length !== imagesData.length) {
                            dispatch(changeMessage('Error: Images Upload Failed'));
                            setTimeout(() => {dispatch(changeMessage(''))}, 2000);
                            return
                        };
                        presignedUrls.forEach(link => {
                            if (typeof link !== 'string' || !link.includes('https')) {
                                dispatch(changeMessage('Error: Images Upload Failed'));
                                setTimeout(() => {dispatch(changeMessage(''))}, 2000);
                                return
                            }
                        });
                        
                        //...push to signed urls...
                        Promise.all(imagesData.map(async (imag, idx) => { 
                            return await pushImageToSignedUrl(imag.imageFile, presignedUrls[idx])
                        }))
                        .then(vals => {
                            vals.forEach(val => {
                                if (!val.objectUrl) {
                                    dispatch(changeMessage('Error: Images Upload Failed'));
                                    setTimeout(() => {dispatch(changeMessage(''))}, 2000);
                                    return
                                }
                            });

                            //...save item with main image and additional images
                            vals.forEach(vlue => item.images?.push(vlue.objectUrl!));
                            dispatch(changeMessage(`Saving item with multiple images...`));
                            fetch(`${api}/items`, {
                                method: 'POST',
                                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                                body: JSON.stringify(item)
                            })
                            .then(resp => resp.json())
                            .then(respData => {
                                if (respData?.error) {
                                    console.log(respData.error);
                                    dispatch(changeMessage(`Saving Item failed`)); 
                                    setTimeout(() => {dispatch(changeMessage(``))}, 2000); 
                                    return; 
                                }
                                else {
                                    dispatch(changeMessage(`Item saved`));
                                    setTimeout(() => {dispatch(changeMessage(''))}, 2000);
                                }
                            })
                            .catch(error => {
                                console.log(error);
                                dispatch(changeMessage(`Saving Item failed`)); 
                                setTimeout(() => {dispatch(changeMessage(``))}, 2000); 
                                return; 
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            dispatch(changeMessage('Error: Images Upload Failed'));
                            setTimeout(() => {dispatch(changeMessage(''))}, 2000);
                            return
                        })
                    })
                    .catch(error => {
                        console.log(error);
                        dispatch(changeMessage('Error: Images Upload Failed'));
                        setTimeout(() => {dispatch(changeMessage(''))}, 2000);
                        return
                    })
                }
                
                //save item ==> only mainImage, no additional images
                else {
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
                            setTimeout(() => {dispatch(changeMessage(''))}, 2000);
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

            //if mainImage upload failed
            else {
                dispatch(changeMessage('Error: Main Image Upload Failed'));
                setTimeout(() => {dispatch(changeMessage(''))}, 2000);
                return
            }
        }
    } 
    
    //save item without main image
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
                setTimeout(() => {dispatch(changeMessage(''))}, 2000);
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