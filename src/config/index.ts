export default () => ({
  port: process.env.PORT || 4000,
  urlBackendApi: process.env.BACKEND_URL || 'localhost:4000/api',
  jwtSecertKey: process.env.AUTH_SECRET_KEY,
  pathMountDirUpload: process.env.pathMountDirUpload || './uploads',
  pathMountDirUploadBill:
    process.env.pathMountDirUploadBill || './uploads/bill',
});
