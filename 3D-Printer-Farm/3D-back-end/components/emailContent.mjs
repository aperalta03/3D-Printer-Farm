export const generateEmailContent = (printer, gcodeDetails, verificationCode) => {
    const {
        filamentCost,
        filamentUsed,
        supportMaterial,
        colour,
        filamentType,
        printingTime,
        infill,
        settings,
        supports
    } = gcodeDetails;

    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2>A new file has been uploaded to the queue for Printer ${printer}</h2>
            <ul style="list-style: none; padding: 0;">
                <li><strong>Filament Cost:</strong> $${filamentCost}</li>
                <li><strong>Filament Used:</strong> ${filamentUsed}g</li>
                <li><strong>Support Material:</strong> ${supportMaterial}g</li>
                <li><strong>Colour:</strong> #${colour}</li>
                <li><strong>Filament Type:</strong> ${filamentType}</li>
                <li><strong>Estimated Printing Time:</strong> ${printingTime}</li>
                <li><strong>Infill:</strong> ${infill}</li>
                <li><strong>Settings:</strong> ${settings}</li>
                <li><strong>Supports:</strong> ${supports ? 'Yes' : 'No'}</li>
            </ul>
            <img src="cid:thumbnail" alt="Thumbnail" 
                style=" display: block; 
                        margin: 20px auto; 
                        width: 200px; 
                        height: auto;
                        border-radius: 10px;" />
            <div style="text-align: center; margin-top: 20px;">
                <a href="http://localhost:5000/validate/${verificationCode}" 
                    style=" display: inline-block; 
                            padding: 10px 20px; 
                            background-color: #4CAF50; 
                            color: white; 
                            text-decoration: none; 
                            border-radius: 5px; 
                            margin-right: 10px;">
                ACCEPT</a>
                <a href="http://localhost:5000/invalidate/${verificationCode}" 
                    style=" display: inline-block; 
                            padding: 10px 20px; background-color: #f44336; 
                            color: white; 
                            text-decoration: none; 
                            border-radius: 5px;">
                DENY</a>
            </div>
        </div>
    `;
};

export const generateAcceptanceEmailContent = (title) => {
    return `Your print job "${title}" has been accepted and moved to the printer queue.`;
};

export const generateDenialEmailContent = (title) => {
    return `Your print job "${title}" was denied. Please verify with the head engineer and re-send the print.`;
};
