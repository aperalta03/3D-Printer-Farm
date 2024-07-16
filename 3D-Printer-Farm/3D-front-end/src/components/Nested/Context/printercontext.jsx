import React, { createContext, useState } from 'react';

const PrinterContext = createContext();

export const PrinterProvider = ({ children }) => {
    const [selectedPrinter, setSelectedPrinter] = useState(null);

    const handleSelectPrinter = (printer) => {
        setSelectedPrinter(printer);
    };

    return (
        <PrinterContext.Provider value={{ selectedPrinter, handleSelectPrinter }}>
            {children}
        </PrinterContext.Provider>
    );
};

export default PrinterContext;