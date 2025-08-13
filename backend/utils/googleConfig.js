import {google} from 'googleapis'
import { config } from 'dotenv'
config()

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

// google oauth2 clint which verifies the recieved code and fetches auth token from google
// export const oauth2client = new google.auth.OAuth2(
//     {
//         clientId: GOOGLE_CLIENT_ID
//     }
// )
export const oauth2client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    'postmessage'
)
