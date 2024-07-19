import React, { useState, useEffect } from 'react';
import styles from './color.module.css';
import { db, doc, getDoc, setDoc } from '../../../firebaseConfig.mjs'; // Adjust the path as needed

const ColorPalette = ({ printerNumber }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#ffffff');

  const colors = ['#FFA500', '#FF0000', '#00FF00', '#800080', '#000000'];

  useEffect(() => {
    const fetchColor = async () => {
      try {
        const docRef = doc(db, 'printers', `printer${printerNumber}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSelectedColor(docSnap.data().selectedColor || '#ffffff');
        }
      } catch (error) {
        console.error('Error fetching color:', error);
      }
    };

    fetchColor();
  }, [printerNumber]);

  const handleColorClick = async (color) => {
    setSelectedColor(color);
    setIsExpanded(false);
    try {
      const docRef = doc(db, 'printers', `printer${printerNumber}`);
      await setDoc(docRef, { selectedColor: color }, { merge: true });
    } catch (error) {
      console.error('Error saving color:', error);
    }
  };

  return (
    <div className={styles.paletteContainer}>
      <div 
        className={styles.selectedColor} 
        style={{ backgroundColor: selectedColor }} 
        onClick={() => setIsExpanded(!isExpanded)}
      />
      {isExpanded && (
        <div className={styles.colorOptions}>
          {colors.map((color, index) => (
            <div 
              key={index} 
              className={styles.colorOption} 
              style={{ backgroundColor: color }} 
              onClick={() => handleColorClick(color)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPalette;
