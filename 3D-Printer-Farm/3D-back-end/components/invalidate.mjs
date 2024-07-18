import { db, query, collection, where, getDocs, deleteDoc } from '../../3D-front-end/src/firebaseConfig.mjs';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.openhub.be',
    port: 587,
    secure: false,
    auth: {
        user: '3dprinters@openhub.be',
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    },
});

export async function invalidatePrintJob(req, res) {
    const { verificationCode } = req.params;

    try {
        const q = query(collection(db, 'verificationQueue'), where('verificationCode', '==', verificationCode));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const data = doc.data();
            const { userEmail, title } = data;

            await deleteDoc(doc.ref);

            const mailOptions = {
                from: '3dprinters@openhub.be',
                to: userEmail,
                subject: 'Print Job Denied',
                text: `Your print job "${title}" was denied. Please verify with the head engineer and re-send the print.`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error sending denial email:', error);
                } else {
                    console.log('Denial email sent:', info.response);
                }
            });

            res.status(200).send('Print job denied and user notified.');
        } else {
            res.status(404).send('Verification code not found.');
        }
    } catch (error) {
        console.error('Error invalidating print job:', error);
        res.status(500).send('Internal server error.');
    }
}
