import React, { useRef, useState, useEffect } from 'react';
import { fabric } from 'fabric';
import './App.css';

const textPhrases = [
  'Higher',
  'Started aiming higher & it worked out',
  'Higher???',
  'Aim higher',
  'Good day to go higher',
  'Wanna go higher?',
  'We’re going higher one way or another',
  'I need to go higher',
  'We must aim higher',
  'Hello. Are you interested in going higher?',
  'Higher, you say???',
  'Whole team going higher',
  '*Embodies higher*',
  'You must aim even higher',
  'Higher is a way of life',
  'We’re going so much higher',
  'We should aim higher this time',
  'Is this what higher feels like?',
  '↑'
];

const ImageEditor = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [text, setText] = useState(null);
  const [selectedPhrase, setSelectedPhrase] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const initCanvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: '#fff',
    });
    setCanvas(initCanvas);

    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (f) => {
      const data = f.target.result;
      fabric.Image.fromURL(data, (img) => {
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();
        const imgWidth = img.width;
        const imgHeight = img.height;

        // Calculate the scale to fit the image within the canvas
        const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
        img.scale(scale);

        img.set({ selectable: false });
        canvas.add(img);
        canvas.centerObject(img);
        setImageLoaded(true);
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
  };

  const handlePhraseChange = (e) => {
    setSelectedPhrase(e.target.value);
  };

  const addTextToCanvas = () => {
    if (text) {
      canvas.remove(text);
    }
    const newText = new fabric.Text(selectedPhrase, {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: 'white',
      fontFamily: 'IBM Plex Mono',
    });
    setText(newText);
    canvas.add(newText);
    canvas.setActiveObject(newText);
  };

  const downloadImage = () => {
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1.0,
    });
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'edited-image.png';
    link.click();
  };

  return (
    <div className="App">
      <div className="canvas-container">
        <canvas ref={canvasRef} width={800} height={600} />
        {!imageLoaded && <div className="placeholder">Image here</div>}
      </div>
      <div className="controls">
        <div className="button-row">
          <label htmlFor="file-upload" className="custom-file-upload">
            Choose Image
          </label>
          <input id="file-upload" type="file" accept="image/*" onChange={handleImageUpload} />
          <button className="custom-button" onClick={addTextToCanvas}>Add Text</button>
          <button className="custom-button" onClick={downloadImage}>Download</button>
        </div>
        <select value={selectedPhrase} onChange={handlePhraseChange} className="text-select">
          <option value="">List of Text Phrases</option>
          {textPhrases.map((phrase, index) => (
            <option key={index} value={phrase}>
              {phrase}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ImageEditor;