import AWS from 'aws-sdk';
import RNFS from 'react-native-fs';
import {Buffer} from 'buffer';
import {AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION} from '@env';

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
  region: AWS_REGION,
});

const ImageUploadtoS3 = async (uri: string, folder: string, name: string) => {
  return new Promise(async (resolve, reject) => {
    console.log('uri', uri);
    const fileData = await RNFS.readFile(uri, 'base64');

    const params = {
      Bucket: 'oywo',
      Key: `img/${name}`,
      Body: Buffer.from(fileData, 'base64'),
      ACL: 'public-read',
      ContentEncoding: 'base64',
      ContentType: 'image/jpg',
    };

    s3.upload(params, (err: any, data: any) => {
      if (err) {
        console.log('err', err);
        console.log(s3.config.accessKeyId);
        console.log(s3.config.secretAccessKey);
        console.log(s3.config.region);
        reject(err);
      } else {
        console.log('data', data);
        resolve(data);
      }
    });
  });
};

export default ImageUploadtoS3;
