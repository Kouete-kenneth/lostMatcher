
import { Client, ID, Storage } from 'react-native-appwrite';
const appWriteConfig={
   endpoint:"https://cloud.appwrite.io/v1",
   platform:"com.findit",
   projectid:"665df1ef0031b59f137e",
   bucketid:"668a965e003a0df0cf74"
}


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appWriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appWriteConfig.projectid) // Your project ID
    .setPlatform(appWriteConfig.platform) // Your application ID or bundle ID.
;
const storage=new Storage(client)

const getFilePreview=async(fileid,type)=>{
    try {
        const fileUrl=storage.getFilePreview(appWriteConfig.bucketid,fileid,2000,2000,'top',100);

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
    if(!fileUrl){
        throw Error;
    }
    return fileUrl;
}

const uploadFile=async(file,type)=>{
    if(!file){
        return
    }
    const asset ={
        name: file.fileName,
        type: file.type,
        size: file.fileSize,
        uri: file.uri,
    };
    try {
        const uploadedFile = await storage.createFile(
            appWriteConfig.bucketid,
            ID.unique(),
            asset
        );
        console.log('PREVIEW:',uploadedFile)
        const fileUrl= await getFilePreview(uploadedFile.$id,type)
        return fileUrl;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }

}

export {
    uploadFile
}