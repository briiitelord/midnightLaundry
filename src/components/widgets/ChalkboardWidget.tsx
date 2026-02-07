import { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Eraser, Eye, EyeOff, Download, Check, MousePointer2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type Scribble = {
  id: string;
  title: string;
  description: string | null;
  pdf_url: string;
  display_date: string;
};

export default function ChalkboardWidget() {
  const [isExpanded, setIsExpanded] = useState(true); // Start expanded
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPdfVisible, setIsPdfVisible] = useState(true);
  const [activeScribble, setActiveScribble] = useState<Scribble | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chalkColor, setChalkColor] = useState('#ffffff');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isGlideMode, setIsGlideMode] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchActiveScribble();
  }, []);

  const fetchActiveScribble = async () => {
    try {
      const { data, error } = await supabase
        .from('scribbles')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching active scribble:', error);
        return;
      }

      setActiveScribble(data || null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Draw chalkboard background
    ctx.fillStyle = '#1a2e1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add texture
    for (let i = 0; i < 5000; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.03})`;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
    }
  }, [isExpanded]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const startDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    drawTouch(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // In glide mode, draw on any movement. In normal mode, only draw when mouse is pressed
    if (!isGlideMode && !isDrawing && e.type !== 'mousedown') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = chalkColor;
    ctx.globalAlpha = 0.6;

    // Add chalk texture effect
    const spread = 2;
    for (let i = 0; i < 3; i++) {
      const offsetX = (Math.random() - 0.5) * spread;
      const offsetY = (Math.random() - 0.5) * spread;
      ctx.lineTo(x + offsetX, y + offsetY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + offsetX, y + offsetY);
    }
  };

  const drawTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    // In glide mode, draw on any movement. In normal mode, only draw when touch is active
    if (!isGlideMode && !isDrawing && e.type !== 'touchstart') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const touch = e.touches[0];
    if (!touch) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;

    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = chalkColor;
    ctx.globalAlpha = 0.6;

    // Add chalk texture effect
    const spread = 2;
    for (let i = 0; i < 3; i++) {
      const offsetX = (Math.random() - 0.5) * spread;
      const offsetY = (Math.random() - 0.5) * spread;
      ctx.lineTo(x + offsetX, y + offsetY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + offsetX, y + offsetY);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Redraw background
    ctx.fillStyle = '#1a2e1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add texture
    for (let i = 0; i < 5000; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.03})`;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
    }
  };

  const handleSaveAndDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsSaving(true);
    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/png');
      });

      // Generate filename with user name if provided
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const namePrefix = userName.trim() ? userName.trim().replace(/[^a-zA-Z0-9]/g, '-') : 'anonymous';
      const filename = `scribble-by-${namePrefix}-${timestamp}.png`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('scribbles')
        .upload(filename, blob, {
          contentType: 'image/png',
          cacheControl: '3600',
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert('Failed to save scribble. Please try again.');
        setIsSaving(false);
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('scribbles')
        .getPublicUrl(filename);

      // Save to database
      const scribbleTitle = userName.trim() 
        ? `Scribbled by ${userName.trim()} - ${new Date().toLocaleDateString()}`
        : `User Scribble - ${new Date().toLocaleDateString()}`;
      
      const { error: dbError } = await supabase
        .from('scribbles')
        .insert([{
          title: scribbleTitle,
          description: `Created by ${userName.trim() || 'anonymous user'} via chalkboard widget`,
          pdf_url: urlData.publicUrl,
          is_active: false,
          display_date: new Date().toISOString().split('T')[0],
        }]);

      if (dbError) {
        console.error('Database error:', dbError);
        alert('Failed to save scribble record. Please try again.');
        setIsSaving(false);
        return;
      }

      // Download the image
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Show success
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving scribble:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative w-full">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -left-4 top-4 bg-forest-800 hover:bg-forest-900 text-white p-2 rounded-lg transition-colors z-10 border-2 border-forest bg-cover shadow-lg"
        title={isExpanded ? 'Hide Chalkboard' : 'Show Chalkboard'}
      >
        {isExpanded ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Main Container */}
      <div
        className={`overflow-hidden transition-all duration-500 border-4 border-forest bg-cover rounded-lg ${
          isExpanded ? 'w-full opacity-100' : 'w-0 opacity-0'
        }`}
      >
        {isExpanded && (
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-8 shadow-sm h-full">
            {/* PDF View - Hidden State */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-forest-900 mb-4">Scribble of the Day</h3>
              
              {/* Chalkboard */}
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseUp={stopDrawing}
                  onMouseMove={draw}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawingTouch}
                  onTouchEnd={stopDrawing}
                  onTouchMove={drawTouch}
                  className="w-full h-[400px] rounded-lg shadow-inner cursor-crosshair border-8 border-[#8B7355]"
                  style={{ 
                    backgroundColor: '#1a2e1a',
                    cursor: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" fill="${encodeURIComponent(chalkColor)}"/><line x1="12" y1="4" x2="12" y2="20" stroke="${encodeURIComponent(chalkColor)}" stroke-width="1"/><line x1="4" y1="12" x2="20" y2="12" stroke="${encodeURIComponent(chalkColor)}" stroke-width="1"/></svg>') 12 12, crosshair`
                  }}
                />

                {/* Name Input */}
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-forest-900 mb-2">
                    Scribbled by:
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Your name (optional)"
                    maxLength={50}
                    className="w-full px-3 py-2 border-2 border-forest-700 rounded-lg focus:outline-none focus:border-forest-900 bg-white/90"
                  />
                </div>

                {/* Chalk Color Palette */}
                <div className="flex gap-2 mt-4 items-center flex-wrap">
                  <span className="text-sm text-forest-900 font-semibold">Chalk:</span>
                  {['#ffffff', '#ffeb3b', '#ff5722', '#2196f3', '#4caf50', '#ff4081'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setChalkColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        chalkColor === color 
                          ? 'border-forest-900 scale-110' 
                          : 'border-gray-400 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      title={`Select ${color} chalk`}
                    />
                  ))}
                  
                  {/* Glide Mode Toggle */}
                  <button
                    onClick={() => setIsGlideMode(!isGlideMode)}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      isGlideMode
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                    title={isGlideMode ? 'Glide mode ON - Draw on any movement (mobile-friendly)' : 'Glide mode OFF - Press to draw'}
                  >
                    <MousePointer2 className="w-4 h-4" />
                    {isGlideMode ? 'Glide: ON' : 'Glide: OFF'}
                  </button>
                  
                  <button
                    onClick={clearCanvas}
                    className="bg-forest-800 hover:bg-forest-900 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    title="Clear chalkboard"
                  >
                    <Eraser className="w-4 h-4" />
                    Clear
                  </button>
                  <button
                    onClick={handleSaveAndDownload}
                    disabled={isSaving}
                    className={`ml-auto px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      savedSuccess
                        ? 'bg-green-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title="Save and download your scribble"
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Done'}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Scrollable PDF Section */}
              <div className="mt-6 border-t-2 border-forest-300 pt-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-forest-900">
                    {activeScribble ? activeScribble.title : 'Scribble of the Day'}
                  </h4>
                  <button
                    onClick={() => setIsPdfVisible(!isPdfVisible)}
                    className="flex items-center gap-2 text-sm bg-forest-800 hover:bg-forest-900 text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {isPdfVisible ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Hide PDF
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Show PDF
                      </>
                    )}
                  </button>
                </div>

                {isPdfVisible && (
                  <div className="bg-amber-50 rounded-lg p-6 max-h-[600px] overflow-y-auto border-2 border-amber-200">
                    {activeScribble ? (
                      <div className="space-y-4">
                        {activeScribble.description && (
                          <p className="text-sm text-amber-800 italic mb-4">
                            {activeScribble.description}
                          </p>
                        )}
                        
                        {/* PDF Embed */}
                        <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                          <iframe
                            src={activeScribble.pdf_url}
                            className="w-full h-[500px] border-0"
                            title={activeScribble.title}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-amber-700 pt-2">
                          <span>
                            Date: {new Date(activeScribble.display_date).toLocaleDateString()}
                          </span>
                          <a
                            href={activeScribble.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-forest-700 hover:text-forest-900 underline"
                          >
                            Open in new tab →
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 text-sm text-amber-800">
                        <p>No active scribble today.</p>
                        <p className="italic">
                          "The chalkboard is your canvas—express yourself freely!"
                        </p>
                        <div className="bg-white/70 rounded p-4 mt-4">
                          <p className="text-xs text-gray-600">
                            Daily scribbles will appear here when uploaded by the admin.
                            Check back soon for new creative content!
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
