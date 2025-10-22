import React, { useRef, useEffect, useState } from 'react';

interface SignaturePadProps {
  onSignatureChange: (dataUrl: string | null) => void;
  height?: number;
  width?: number;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSignatureChange, width = 400, height = 200 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d');
  };

  useEffect(() => {
    const ctx = getCanvasContext();
    if (ctx) {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, []);
  
  const getCoords = (event: MouseEvent | TouchEvent): { x: number, y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const ctx = getCanvasContext();
    if (!ctx) return;
    const { x, y } = getCoords(event.nativeEvent);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setIsEmpty(false);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = getCanvasContext();
    if (!ctx) return;
    const { x, y } = getCoords(event.nativeEvent);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const ctx = getCanvasContext();
    if (ctx) {
      ctx.closePath();
    }
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    if (canvas) {
        onSignatureChange(canvas.toDataURL('image/png'));
    }
  };

  const clearSignature = () => {
    const ctx = getCanvasContext();
    const canvas = canvasRef.current;
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setIsEmpty(true);
      onSignatureChange(null);
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="border border-gray-300 rounded-md bg-white cursor-crosshair touch-none"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <button
        type="button"
        onClick={clearSignature}
        className="mt-2 text-sm text-brand-primary hover:underline disabled:text-gray-400"
        disabled={isEmpty}
      >
        Clear Signature
      </button>
    </div>
  );
};

export default SignaturePad;