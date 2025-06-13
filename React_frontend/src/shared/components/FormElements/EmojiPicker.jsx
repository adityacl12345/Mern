import React, { useRef, useEffect } from "react";
import "emoji-picker-element";

export default function EmojiPickerComponent({ onEmojiClick }) {
  const pickerRef = useRef(null);

  useEffect(() => {
    const picker = pickerRef.current;
    if (!picker) return;

    const handler = (evt) => {
      const emoji = evt.detail.unicode;
      onEmojiClick({ emoji });
    };
    picker.addEventListener("emoji-click", handler);

    return () => picker.removeEventListener("emoji-click", handler);
  }, [onEmojiClick]);

  return <emoji-picker 
    ref={pickerRef} 
    style={{
        height: '200px',
        overflow: 'hidden',
        display: 'block',
        '--max-height': '140px',
        '--emoji-size': '1.3rem',
        '--category-emoji-size': '1.1rem',
        '--num-columns': '8'
    }}>

    </emoji-picker>;
}
