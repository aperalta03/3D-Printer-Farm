import { db, query, collection, where, getDocs, addDoc, deleteDoc } from '../../3D-front-end/src/firebaseConfig.mjs';

export async function validatePrintJob(req, res) {
    const { verificationCode } = req.params;

    try {
        const q = query(collection(db, 'verificationQueue'), where('verificationCode', '==', verificationCode));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const data = doc.data();
            const { printer, fileURL, title, duration, timestamp } = data;

            const printerQueueRef = collection(db, `printers/printer${printer}/queue`);
            await addDoc(printerQueueRef, { fileURL, title, duration, timestamp });

            await deleteDoc(doc.ref);

            res.status(200).send('Print job validated and moved to printer queue.');
        } else {
            res.status(404).send('Verification code not found.');
        }
    } catch (error) {
        console.error('Error validating print job:', error);
        res.status(500).send('Internal server error.');
    }
}
