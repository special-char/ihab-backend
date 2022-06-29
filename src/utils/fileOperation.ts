import { extname } from 'path';
import { Request } from 'express';

export const editFileName = (
  req: Request,
  file: Express.Multer.File,
  callback,
) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const fileMapper = (file: Express.Multer.File, req: Request) => {
  const image_url = `${req.protocol}://${req.headers.host}/${file.path}`;
  return image_url;
};
