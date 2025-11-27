export default function handler(req: any, res: any) {
  const hasMongoUri = !!process.env.MONGODB_URI;
  const mongoUriSample = process.env.MONGODB_URI
    ? process.env.MONGODB_URI.slice(0, 60) + '...'
    : null;

  res.status(200).json({
    hasMongoUri,
    mongoUriSample,
  });
}


