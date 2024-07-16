//Color Palette
import React, { useState } from 'react';
import styles from './color.module.css';

export const ColorPalette = ({ colors, onColorSelect }) => {
    const [selectedColor, setSelectedColor] = useState(null);

    const handleColorClick = (color) => {
        setSelectedColor(color);
        if (onColorSelect) {
            onColorSelect(color);
        }
    };

    return (
        <div className={styles.paletteContainer}>
            {colors.map((color, index) => (
                <div
                    key={index}
                    className={`${styles.colorBlock} ${selectedColor === color ? styles.selected : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorClick(color)}
                />
            ))}
        </div>
    );
};
