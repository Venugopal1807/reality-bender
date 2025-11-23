"use client";
import { useState } from 'react';
import axios from 'axios';
import { Upload, Wand2, Download, Image as ImageIcon, AlertCircle, CheckCircle2, Terminal, MonitorPlay, Sun, Moon } from 'lucide-react';

export default function Home() {
  // State Management
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // CONFIGURATION
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true); // keeping dark mode as default

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResultImage(null);
      setError(null);
    }
  };

  // Main Generation Logic
  const handleGenerate = async () => {
    if (!selectedFile && !isDemoMode) {
      setError("Please upload an image first.");
      return;
    }
    if (!prompt && !isDemoMode) {
      setError("Please describe what you want to change.");
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      if (isDemoMode) {
        // --- DEMO MODE for showcasing ---
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResultImage("https://replicate.delivery/pbxt/KzC55f2eL35CDdKq8qV120f18d692262-8e9a-4c87-8962-832774358463/out.png");
      } else {
        // --- REAL BACKEND MODE ---
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('prompt', prompt);

        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/edit-image';

        const response = await axios.post(backendUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }).catch(() => {
            throw new Error("CONNECTION_REFUSED");
        });

        if (response.data.success) {
          setResultImage(response.data.imageUrl);
        } else {
          throw new Error(response.data.error || "Failed to generate image");
        }
      }
    } catch (err) {
      console.error(err);
      if (err.message === "CONNECTION_REFUSED" || err.message.includes("Network Error")) {
        setError(
            <div className="flex flex-col gap-1 text-left">
                <span className="font-bold">Backend Not Detected</span>
                <span className="text-xs opacity-80">To use Real AI, run the FastAPI server locally.</span>
                <span className="text-xs opacity-80">Switching to Simulation Mode is recommended for showcasing.</span>
            </div>
        );
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Theme Classes Helpers
  const bgMain = isDarkMode ? "bg-neutral-950" : "bg-gray-50";
  const textMain = isDarkMode ? "text-white" : "text-gray-900";
  const cardBg = isDarkMode ? "bg-neutral-900/50 border-neutral-800" : "bg-white border-gray-200 shadow-xl";
  const inputBg = isDarkMode ? "bg-neutral-950 border-neutral-800 placeholder:text-neutral-600" : "bg-gray-50 border-gray-200 placeholder:text-gray-400";
  
  return (
    <main className={`min-h-screen font-sans selection:bg-indigo-500/30 transition-colors duration-300 ${bgMain} ${textMain}`}>
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 relative">
        
        {/* Theme Toggle Button (Top Right) */}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`absolute top-6 right-6 p-3 rounded-full transition-all duration-300 ${isDarkMode ? 'bg-neutral-800 hover:bg-neutral-700 text-yellow-400' : 'bg-white shadow-md hover:bg-gray-100 text-indigo-600'}`}
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Header Section */}
        <header className="text-center mb-12 space-y-4 pt-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-indigo-400 to-purple-600 pb-2">
            Reality Bender
          </h1>
          
          {/* Mode Toggle */}
          <div className="flex items-center justify-center mt-8 flex-col gap-3">
            <div className={`p-1 rounded-xl border inline-flex items-center gap-1 shadow-sm transition-colors ${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-gray-100 border-gray-200'}`}>
              <button
                onClick={() => setIsDemoMode(true)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${isDemoMode ? (isDarkMode ? 'bg-neutral-800 text-white shadow-md' : 'bg-white text-black shadow-sm') : 'text-gray-500 hover:text-gray-400'}`}
              >
                <MonitorPlay className="w-4 h-4" />
                Showcase Mode
              </button>
              <button
                onClick={() => setIsDemoMode(false)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${!isDemoMode ? (isDarkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-700') : 'text-gray-500 hover:text-gray-400'}`}
              >
                <Terminal className="w-4 h-4" />
                Live Backend
              </button>
            </div>
            
            {isDemoMode ? (
                <p className="text-xs text-gray-500">
                    Running in <strong>Portfolio Mode</strong>. No API keys or local server required.
                </p>
            ) : (
                <span className={`text-xs font-mono flex items-center gap-2 px-3 py-1 rounded-full ${isDarkMode ? 'bg-indigo-900/10 text-indigo-400/80' : 'bg-indigo-50 text-indigo-600'}`}>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    Connecting to http://127.0.0.1:8000...
                </span>
            )}
          </div>
        </header>

        {/* Main Interface Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Input Controls */}
          <div className="space-y-6">
            
            {/* 1. Upload Area */}
            <div className={`border rounded-3xl p-6 backdrop-blur-sm shadow-xl transition-all duration-300 ${cardBg}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDarkMode ? 'text-neutral-200' : 'text-gray-800'}`}>
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs ${isDarkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-gray-200 text-gray-600'}`}>1</span>
                  Source Image
                </h2>
                {preview && (
                  <button 
                    onClick={() => {setPreview(null); setSelectedFile(null);}}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className={`relative group border-2 border-dashed rounded-2xl transition-all duration-300 h-64 flex flex-col items-center justify-center overflow-hidden
                  ${preview ? (isDarkMode ? 'border-indigo-500/30 bg-neutral-950' : 'border-indigo-300 bg-gray-50') : (isDarkMode ? 'border-neutral-700 hover:border-neutral-500 bg-neutral-800/30' : 'border-gray-300 hover:border-gray-400 bg-gray-50')}`}>
                  
                  <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  
                  {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-contain z-10" />
                  ) : (
                      <div className="text-center p-6 pointer-events-none">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110 border ${isDarkMode ? 'bg-neutral-800 border-neutral-700 text-neutral-400' : 'bg-white border-gray-200 text-gray-400'}`}>
                            <ImageIcon className="w-7 h-7" />
                          </div>
                          <p className={`font-medium ${isDarkMode ? 'text-neutral-300' : 'text-gray-700'}`}>Upload source file</p>
                          <p className="text-gray-500 text-xs mt-2">Any JPG/PNG</p>
                      </div>
                  )}
              </div>
            </div>

            {/* 2. Prompt Area */}
            <div className={`border rounded-3xl p-6 backdrop-blur-sm shadow-xl transition-all duration-300 ${cardBg}`}>
               <h2 className={`text-xl font-semibold flex items-center gap-2 mb-4 ${isDarkMode ? 'text-neutral-200' : 'text-gray-800'}`}>
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs ${isDarkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-gray-200 text-gray-600'}`}>2</span>
                  AI Instructions
                </h2>
                <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={isDemoMode ? "Example: 'Turn the day into night', 'Make it snowy'..." : "Describe your transformation..."}
                    className={`w-full border rounded-xl p-4 text-lg outline-none transition-all resize-none focus:ring-2 focus:ring-indigo-500/50 ${inputBg} ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    rows="3"
                />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 text-red-500 text-sm animate-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            {/* Generate Button */}
            <button 
                onClick={handleGenerate}
                disabled={loading}
                className={`w-full py-5 rounded-2xl font-bold text-lg tracking-wide transition-all transform
                ${loading 
                    ? 'bg-neutral-800 text-neutral-500 cursor-wait' 
                    : `${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-neutral-800'} hover:shadow-xl hover:-translate-y-0.5`
                }`}
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-3">
                        <div className={`w-5 h-5 border-2 rounded-full animate-spin ${isDarkMode ? 'border-black/30 border-t-black' : 'border-white/30 border-t-white'}`} />
                        {isDemoMode ? "Simulating Pipeline..." : "Processing on GPU..."}
                    </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Wand2 className="w-5 h-5" />
                    Execute Transformation
                  </span>
                )}
            </button>

          </div>

          {/* RIGHT COLUMN: Results */}
          <div className={`border rounded-3xl p-8 backdrop-blur-sm shadow-2xl flex flex-col items-center justify-center min-h-[600px] lg:h-full transition-all duration-500 ${cardBg} 
            ${resultImage ? (isDarkMode ? 'border-indigo-500/30 shadow-[0_0_50px_-12px_rgba(99,102,241,0.2)]' : 'border-indigo-500/30 shadow-[0_0_50px_-12px_rgba(99,102,241,0.1)]') : ''}`}>
             
             {resultImage ? (
                 <div className="w-full text-center animate-in fade-in zoom-in duration-500">
                     <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-bold tracking-wider uppercase mb-6">
                        <CheckCircle2 className="w-4 h-4" />
                        {isDemoMode ? "Simulation Complete" : "Generation Successful"}
                     </div>
                     
                     <div className={`relative rounded-xl overflow-hidden shadow-2xl border group ${isDarkMode ? 'border-neutral-700' : 'border-gray-200'}`}>
                        <img src={resultImage} alt="AI Result" className="w-full h-auto object-contain max-h-[600px]" />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <a 
                              href={resultImage} 
                              download 
                              target="_blank" 
                              rel="noreferrer" 
                              className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
                            >
                                <Download className="w-4 h-4" />
                                Download Output
                            </a>
                        </div>
                     </div>
                     
                     {isDemoMode && (
                        <p className="mt-6 text-gray-500 text-sm max-w-md mx-auto">
                            <strong>Note for Reviewers:</strong> This is a pre-rendered sample to demonstrate the UI flow without incurring API costs or requiring local backend setup.
                        </p>
                     )}
                 </div>
             ) : (
                 <div className="text-center p-10 max-w-sm">
                     <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border ${isDarkMode ? 'bg-neutral-800/50 border-neutral-800' : 'bg-gray-100 border-gray-200'}`}>
                        <Wand2 className="w-10 h-10 opacity-20 text-gray-500" />
                     </div>
                     <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-neutral-500' : 'text-gray-400'}`}>Ready to Start</h3>
                     <p className="text-gray-500">
                       Upload an image and describe your vision to see the AI magic happen.
                     </p>
                 </div>
             )}
          </div>

        </div>
      </div>
    </main>
  );
}