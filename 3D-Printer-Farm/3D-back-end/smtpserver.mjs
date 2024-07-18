import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { validatePrintJob } from './components/validate.mjs';
import { invalidatePrintJob } from './components/invalidate.mjs';
import gcodeHandler from './components/gcodeHandler.mjs';

dotenv.config();  // Ensure this is called to load environment variables

const app = express();
app.use(bodyParser.json());
app.use(cors());

console.log('Email Password:', process.env.EMAIL_PASS);  // You can remove this if it's not needed

app.get('/validate/:verificationCode', validatePrintJob);
app.get('/invalidate/:verificationCode', invalidatePrintJob);
app.use('/api', gcodeHandler); // Use the new router for GCode handling

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`SMTP server is listening on port ${PORT}`);
});
