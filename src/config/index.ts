export interface AppConfig {
  port: number;
  backendUrl: string;
  jwtSecret: string;
  uploadPath: string;
  billUploadPath: string;
}

export default (): AppConfig => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  backendUrl: process.env.BACKEND_URL || 'http://localhost:4000/api',
  jwtSecret: process.env.AUTH_SECRET_KEY,
  uploadPath: process.env.UPLOAD_DIR || './uploads',
  billUploadPath: process.env.UPLOAD_BILL_DIR || './uploads/bill',
});
