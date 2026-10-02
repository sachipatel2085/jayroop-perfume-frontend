import React, { useState, useRef } from 'react';
import { UploadCloud, X, Check, Link as LinkIcon, Loader2, Image as ImageIcon, Film } from 'lucide-react';
import { adminService } from '../../services/adminService.js';

export const ImageDropzone = ({
  value = '',
  onChange,
  folder = 'general',
  label = 'Media Asset',
  hint = 'PNG, JPG, WebP up to 10MB',
  accept = 'image/*',
  isVideo = false,
  required = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('dropzone'); // 'dropzone' | 'url'
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError(null);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processAndUploadFile(files[0]);
    }
  };

  const handleFileSelect = async (e) => {
    setError(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      await processAndUploadFile(files[0]);
    }
  };

  const processAndUploadFile = async (file) => {
    // 1. Validate file size (15MB max)
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File exceeds maximum size of 15MB');
      return;
    }

    // 2. Validate file type
    if (!isVideo && !file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WebP)');
      return;
    }
    if (isVideo && !file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setError('Please upload a valid image or MP4 video file');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Perform upload via adminService
      const res = await adminService.uploadMedia(file, folder);
      const uploadedUrl = res?.url || res?.data?.url;
      const uploadedPublicId = res?.publicId || res?.data?.publicId || '';

      if (uploadedUrl) {
        onChange(uploadedUrl, uploadedPublicId);
      } else {
        throw new Error(res?.message || 'Upload failed');
      }
    } catch (err) {
      console.error('File upload error:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to upload media to cloud');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange('', '');
    setError(null);
  };

  const isVideoUrl =
    isVideo && (value.endsWith('.mp4') || value.endsWith('.webm') || value.includes('/video/'));

  return (
    <div className="space-y-1.5 text-xs">
      <div className="flex items-center justify-between">
        <label className="block text-zinc-400 uppercase tracking-wider text-[10px]">
          {label} {required && <span className="text-gold">*</span>}
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode(mode === 'dropzone' ? 'url' : 'dropzone')}
            className="text-[10px] text-gold/80 hover:text-gold transition-colors flex items-center gap-1"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{mode === 'dropzone' ? 'Or Paste Direct URL' : 'Use Drag & Drop'}</span>
          </button>
        </div>
      </div>

      {mode === 'url' ? (
        <div className="space-y-2">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value, '')}
            placeholder="https://res.cloudinary.com/... or https://..."
            className="w-full bg-noir border border-zinc-800 p-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold text-xs"
          />
          {value && (
            <div className="relative w-28 h-28 border border-gold/30 bg-black overflow-hidden rounded-none group">
              {isVideoUrl ? (
                <video src={value} className="w-full h-full object-cover" muted />
              ) : (
                <img src={value} alt="Preview" className="w-full h-full object-cover" />
              )}
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-1 right-1 p-1 bg-black/80 text-red-400 hover:text-red-300 rounded-full"
                title="Remove"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Active Preview Display */}
          {value ? (
            <div className="relative border border-gold/40 bg-noir-card p-3 flex items-center justify-between gap-4 group">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black border border-gold/20 flex-shrink-0 overflow-hidden relative">
                  {isVideoUrl ? (
                    <video src={value} className="w-full h-full object-cover" muted playsInline />
                  ) : (
                    <img src={value} alt="Uploaded preview" className="w-full h-full object-cover" />
                  )}
                  <div className="absolute bottom-0 right-0 p-0.5 bg-gold text-black">
                    {isVideoUrl ? <Film className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                  </div>
                </div>

                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-gold/20 text-gold text-[9px] uppercase px-1.5 py-0.5 font-bold border border-gold/30">
                      Cloud Asset Ready
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300 truncate mt-1 max-w-[200px] sm:max-w-xs">
                    {value}
                  </p>
                  <p className="text-[9px] text-zinc-500 mt-0.5">
                    Click "Replace" to drop a new photo
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="btn-outline-gold text-[10px] py-1.5 px-3"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-1.5 text-zinc-400 hover:text-red-400 transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Drag and Drop Zone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed transition-all duration-200 p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer ${
                isDragging
                  ? 'border-gold bg-gold/10 shadow-gold-glow scale-[1.01]'
                  : 'border-zinc-800 hover:border-gold/60 bg-noir hover:bg-white/2'
              }`}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-3 py-2">
                  <Loader2 className="w-8 h-8 text-gold animate-spin" />
                  <p className="font-serif text-xs uppercase tracking-wider text-gold font-semibold">
                    Uploading Asset to Cloudinary...
                  </p>
                  <p className="text-[10px] text-zinc-400">Optimizing resolution & streaming to CDN</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full border border-gold/30 bg-noir-card flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                    {isVideo ? <UploadCloud className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
                  </div>

                  <div className="mt-1">
                    <p className="text-xs text-zinc-200 font-medium">
                      <span className="text-gold font-semibold underline underline-offset-2">
                        Click to upload
                      </span>{' '}
                      or drag & drop
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-1">{hint}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
          <X className="w-3.5 h-3.5" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
