import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Download, Loader2, Palette, Wand2, Droplet } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';

export default function RemoveBackground() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bgColor, setBgColor] = useState<string>('transparent');
  const [removalMode, setRemovalMode] = useState<'ai' | 'color'>('ai');
  const [colorToRemove, setColorToRemove] = useState<string>('#ffffff');
  const [tolerance, setTolerance] = useState<number>(30);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && (selected.type.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(selected.name))) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selected);
      setProcessedImage(null);
      setFinalImage(null);
      setBgColor('transparent');
    }
  };

  const removeBg = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const blob = await removeBackground(file, {
        output: {
          format: 'image/png',
          quality: 1.0
        }
      });
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
      setFinalImage(url);
    } catch (error) {
      console.error('Error removing background:', error);
      alert('An error occurred while removing the background. Please try again with a different image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const removeColor = () => {
    if (!preview || !canvasRef.current) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current!;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        const hex = colorToRemove.replace('#', '');
        const rToRemove = parseInt(hex.substring(0, 2), 16);
        const gToRemove = parseInt(hex.substring(2, 4), 16);
        const bToRemove = parseInt(hex.substring(4, 6), 16);
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          const distance = Math.sqrt(
            Math.pow(r - rToRemove, 2) + 
            Math.pow(g - gToRemove, 2) + 
            Math.pow(b - bToRemove, 2)
          );
          
          if (distance <= tolerance) {
            data[i + 3] = 0;
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        const url = canvas.toDataURL('image/png', 1.0);
        setProcessedImage(url);
        setFinalImage(url);
        setIsProcessing(false);
      };
      img.src = preview;
    }, 100);
  };

  useEffect(() => {
    if (!processedImage || !canvasRef.current) return;

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (bgColor !== 'transparent') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);
      
      const type = bgColor === 'transparent' ? 'image/png' : 'image/jpeg';
      setFinalImage(canvas.toDataURL(type, 1.0));
    };
    img.src = processedImage;
  }, [bgColor, processedImage]);

  const presetColors = ['transparent', '#ffffff', '#000000', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {!file ? (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <Upload className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('common.upload')}</h3>
          <p className="text-gray-500">{t("common.supported-images", "JPG, PNG, WebP up to 10MB")}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                <img src={preview!} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-medium text-gray-900 truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
              </div>
            </div>
            <button 
              onClick={() => { setFile(null); setPreview(null); setProcessedImage(null); setFinalImage(null); }}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
              disabled={isProcessing}
            >
              {t('common.clear')}
            </button>
          </div>

          {!processedImage && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
              
              <div className="flex gap-4 p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setRemovalMode('ai')}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${removalMode === 'ai' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Wand2 className="w-4 h-4" />
                  {t('tools.remove-background.mode-ai', 'AI Auto Removal')}
                </button>
                <button
                  onClick={() => setRemovalMode('color')}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${removalMode === 'color' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Droplet className="w-4 h-4" />
                  {t('tools.remove-background.mode-color', 'Remove Specific Color')}
                </button>
              </div>

              {removalMode === 'color' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('tools.remove-background.color-to-remove', 'Color to Remove')}
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg border border-gray-300 overflow-hidden cursor-pointer shadow-sm">
                        <input
                          type="color"
                          value={colorToRemove}
                          onChange={(e) => setColorToRemove(e.target.value)}
                          className="absolute inset-[-10px] w-[60px] h-[60px] cursor-pointer"
                        />
                      </div>
                      <span className="text-sm font-mono text-gray-600 uppercase bg-white px-2 py-1 rounded border border-gray-200">{colorToRemove}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        {t('tools.remove-background.tolerance', 'Tolerance')}
                      </label>
                      <span className="text-sm font-bold text-emerald-600">{tolerance}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={tolerance}
                      onChange={(e) => setTolerance(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={removalMode === 'ai' ? removeBg : removeColor}
                disabled={isProcessing}
                className="w-full py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('common.processing')}
                  </>
                ) : (
                  t('tools.remove-background.title')
                )}
              </button>
            </div>
          )}

          {processedImage && finalImage && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-emerald-600" />
                <h4 className="font-medium text-gray-900">{t('tools.remove-background.bg-color')}</h4>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setBgColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${
                      bgColor === color ? 'border-emerald-500 scale-110' : 'border-gray-200'
                    } ${color === 'transparent' ? "bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYNgvwMDwn4GBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYEBABaMAQG7y1+eAAAAAElFTkSuQmCC')]" : ""}`}
                    style={color !== 'transparent' ? { backgroundColor: color } : {}}
                    title={color === 'transparent' ? 'Transparent' : color}
                  />
                ))}
                <div className="relative w-10 h-10 rounded-full border-2 border-gray-200 overflow-hidden cursor-pointer">
                  <input
                    type="color"
                    value={bgColor === 'transparent' ? '#ffffff' : bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="absolute inset-[-10px] w-[60px] h-[60px] cursor-pointer"
                    title="Custom Color"
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 flex justify-center overflow-hidden border border-gray-200">
                <div className={`relative w-full max-w-md mx-auto aspect-square rounded-lg overflow-hidden ${bgColor === 'transparent' ? "bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYNgvwMDwn4GBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYEBABaMAQG7y1+eAAAAAElFTkSuQmCC')]" : ""}`} style={bgColor !== 'transparent' ? { backgroundColor: bgColor } : {}}>
                  <img src={processedImage} alt="Processed" className="w-full h-full object-contain" />
                </div>
              </div>
              
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="flex justify-center pt-4">
                <a
                  href={finalImage}
                  download={`nobg_${file.name.split('.')[0]}.${bgColor === 'transparent' ? 'png' : 'jpg'}`}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors w-full justify-center"
                >
                  <Download className="w-5 h-5" />
                  {t('common.download')}
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
