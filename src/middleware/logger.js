const AWS = require("aws-sdk")



const s3 = new AWS.S3()
const BUCKET_NAME = "s3-bucket-final-project-logs-antoniszczekot"

const logger = async (req, res, next) => {
    const dateObj = new Date()
    const formattedDate = dateObj.toISOString().slice(0,10)
    const server_name = process.env.SERVER_NAME || 'Other Server';

    const logEntry = `${new Date().toISOString()} - ${server_name} - ${req.ip} - ${req.method}, ${req.originalUrl}\n`;
    const key = `logs/${formattedDate}-requests.log`
    console.log(req.method, req.originalUrl)


    try {
        let existingLogs = ''
        try {
            const data = await s3.getObject({ 
                Bucket: BUCKET_NAME,
                Key: key
            }).promise()
            existingLogs = data.Body.toString()
        } catch (err) {
            if (err.code !== 'NoSuchKey') {
                throw err
            }
        }
    
        const updatedLogContent = existingLogs + logEntry
    
        await s3.upload({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: updatedLogContent
        }).promise()
      } catch (err) {
        console.log('Failed to upload log entry to S3:', err)
      }
    


    next()
}

module.exports = logger 