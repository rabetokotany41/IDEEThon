import React, { useRef, useState } from 'react';
import { Button } from '../common/Button';
interface UploadPhotoProps {
  onUpload: (file: File) => Promise<string>;
  currentImageUrl?: string;
  label?: string;
}

export const UploadPhoto: React.FC<UploadPhotoProps> = ({ onUpload, currentImageUrl, label = "Photo" }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview locale
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    setUploading(true);
    try {
      const url = await onUpload(file);
      setPreview(url);
    } catch (error) {
      console.error("Upload failed", error);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center gap-4">
        {preview && (
          <img src={preview} alt="Aperçu" className="w-20 h-20 object-cover rounded-lg border" />
        )}
        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Chargement...' : preview ? 'Changer' : 'Ajouter une photo'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};