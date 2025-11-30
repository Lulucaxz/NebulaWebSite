import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./getCroppedImg";

interface CropImageModalProps {
  imageSrc: string;
  onCancel: () => void;
  onCropComplete: (croppedBlob: Blob) => void;
}

export const CropImageModal: React.FC<CropImageModalProps> = ({ imageSrc, onCancel, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropCompleteCb = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    if (!croppedAreaPixels) return;
    const croppedBlob = await getCroppedImg(
      imageSrc,
      crop,
      zoom,
      1,
      croppedAreaPixels
    );
    if (croppedBlob) onCropComplete(croppedBlob);
  };

  return (
    <div className="crop-modal-backdrop">
      <div className="crop-modal-content">
        <div style={{ width: '300px', height: '300px', position: 'relative' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteCb}
            cropShape="round"
            showGrid={false}
          />
        </div>
        <div style={{ width: '100%', margin: '16px 0' }}>
          <label style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>Zoom:</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            style={{ width: '80%', marginLeft: 8 }}
          />
        </div>
        <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: 8 }}>
          Arraste a imagem para enquadrar e ajuste o zoom.
        </div>
        <div className="crop-modal-actions">
          <button onClick={onCancel}>Cancelar</button>
          <button onClick={handleDone}>Salvar recorte</button>
        </div>
      </div>
    </div>
  );
};
