dotenv.config();
// configChecker: REMOVED during rollback
// Previously provided Cloudinary configuration checks. Left as a stub to avoid import errors.

export const checkCloudinaryConfig = () => {
  console.log('configChecker disabled - removed during rollback');
  return false;
};

export const testCloudinaryConnection = async () => {
  console.log('testCloudinaryConnection disabled - removed during rollback');
  return false;
};