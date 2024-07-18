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
        supports,
        thumbnail
    } = gcodeDetails;

    return `
        A new file has been uploaded to the queue for Printer ${printer}.
        <br><br>
        Filament Cost: $${filamentCost}
        <br>
        Filament Used: ${filamentUsed}g
        <br>
        Support Material: ${supportMaterial}g
        <br>
        Colour: #${colour}
        <br>
        Filament Type: ${filamentType}
        <br>
        Estimated Printing Time: ${printingTime}
        <br>
        Infill: ${infill}
        <br>
        Settings: ${settings}
        <br>
        Supports: ${supports ? 'Yes' : 'No'}
        <br>
        <img src="data:image/png;base64,${thumbnail}" alt="Thumbnail"/>
        <br><br>
        <a href="http://localhost:5000/validate/${verificationCode}">Validate</a>
        <br>
        <a href="http://localhost:5000/invalidate/${verificationCode}">Invalidate</a>
    `;
};
