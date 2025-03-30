'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageTargetLanguage, setImageTargetLanguage] = useState('es');
  const [translatedImageText, setTranslatedImageText] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('text');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'mr', name: 'Marathi' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'ur', name: 'Urdu' },
    { code: 'or', name: 'Odia' },
    { code: 'as', name: 'Assamese' },
    { code: 'sa', name: 'Sanskrit' },
    { code: 'ne', name: 'Nepali' },
    { code: 'si', name: 'Sinhala' },
    { code: 'my', name: 'Burmese' },
    { code: 'km', name: 'Khmer' },
    { code: 'th', name: 'Thai' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'id', name: 'Indonesian' },
    { code: 'ms', name: 'Malay' },
    { code: 'tl', name: 'Tagalog' }
  ];

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          targetLanguage,
        }),
      });
      
      const data = await response.json();
      setTranslatedText(data.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageTranslate = async () => {
    if (!selectedImage) return;
    
    setIsImageLoading(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imagePreview,
          targetLanguage: imageTargetLanguage,
        }),
      });
      
      const data = await response.json();
      setTranslatedImageText(data.translatedText);
    } catch (error) {
      console.error('Image translation error:', error);
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden z-0">
        {[...Array(20)].map((_, i) => {
          const randomOpacity = Math.random() < 0.5 ? 'opacity-20' : 'opacity-30';
          const animationDuration = `${Math.random() * 8 + 2}s`;
          const animationDelay = `${Math.random() * 5}s`;
          const top = `${Math.random() * 100}%`;
          const left = `${Math.random() * 100}%`;
          
          return (
            <div 
              key={i}
              className={`absolute w-1 h-1 bg-white rounded-full ${randomOpacity} animate-pulse`}
              style={{
                top,
                left,
                animationDuration,
                animationDelay
              }}
            />
          );
        })}
      </div>
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-[30rem] h-[30rem] bg-purple-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-[25rem] h-[25rem] bg-blue-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-pink-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="absolute inset-0 backdrop-blur-[2px] bg-black/5 z-0"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-30 animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4 animate-fade-in">
            Universal Translator
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto animate-fade-in animation-delay-200">
            Translate text and images into multiple languages with AI-powered accuracy
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 shadow-[0_0_50px_rgba(124,58,237,0.15)] border border-gray-800 overflow-hidden relative">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl"></div>
            
            <div className="flex mb-8 bg-gray-800/50 rounded-xl p-1.5 max-w-xs mx-auto">
              <button 
                onClick={() => setActiveTab('text')}
                className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                  activeTab === 'text' 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span>Text</span>
              </button>
              <button 
                onClick={() => setActiveTab('image')}
                className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                  activeTab === 'image' 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Image</span>
              </button>
            </div>

            <div className={`transition-all duration-500 ${activeTab === 'text' ? 'opacity-100' : 'opacity-0 absolute -z-10 -translate-x-full'}`}>
              <div className="space-y-6">
                <div className="flex justify-end">
                  <div className="relative">
                    <select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="appearance-none bg-gray-800/70 text-white rounded-xl px-5 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-gray-700/50 hover:border-purple-500/30 transition-colors"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-300"></div>
                  <div className="relative">
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Enter text to translate..."
                      className="w-full h-40 bg-gray-800/70 text-white rounded-xl p-5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-gray-700/50 hover:border-purple-500/30 transition-colors resize-none"
                    />
                    <div className="absolute bottom-3 right-3 text-gray-400 text-xs">
                      {inputText.length}/1000
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleTranslate}
                  disabled={isLoading || !inputText.trim()}
                  className="w-full relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-200 group-disabled:opacity-40"></div>
                  <div className="relative px-6 py-3.5 bg-gray-900 rounded-xl leading-none flex items-center justify-center gap-2 group-hover:bg-gray-800 transition duration-200">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="font-medium text-white">Translating...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                        <span className="font-medium text-white">Translate Text</span>
                      </>
                    )}
                  </div>
                </button>

                {translatedText && (
                  <div className="mt-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-md rounded-xl border border-gray-700/50 overflow-hidden animate-fade-in">
                    <div className="px-5 py-3 border-b border-gray-700/50 flex items-center justify-between">
                      <h3 className="text-sm font-medium text-white flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Translation Complete
                      </h3>
                      <div className="flex gap-2">
                        <button className="text-gray-400 hover:text-white transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button className="text-gray-400 hover:text-white transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-white">{translatedText}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={`transition-all duration-500 ${activeTab === 'image' ? 'opacity-100' : 'opacity-0 absolute -z-10 translate-x-full'}`}>
              <div className="space-y-6">
                <div className="flex justify-end">
                  <div className="relative">
                    <select
                      value={imageTargetLanguage}
                      onChange={(e) => setImageTargetLanguage(e.target.value)}
                      className="appearance-none bg-gray-800/70 text-white rounded-xl px-5 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-gray-700/50 hover:border-purple-500/30 transition-colors"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center w-full">
                  <label className="w-full relative group cursor-pointer">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-300"></div>
                    <div className="relative flex flex-col items-center px-6 py-8 bg-gray-800/70 text-white rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-colors">
                      <svg className="w-12 h-12 mb-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="font-medium">Drop your image here or click to browse</p>
                      <p className="text-sm text-gray-400 mt-1">Supports JPG, PNG and GIF</p>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </div>
                  </label>
                </div>

                {imagePreview && (
                  <div className="relative rounded-xl overflow-hidden border border-gray-700/50 animate-fade-in">
                    <div className="relative w-full h-64">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-3 right-3 bg-black/60 p-1.5 rounded-full hover:bg-black/80 transition-colors"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                <button
                  onClick={handleImageTranslate}
                  disabled={isImageLoading || !selectedImage}
                  className="w-full relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-200 group-disabled:opacity-40"></div>
                  <div className="relative px-6 py-3.5 bg-gray-900 rounded-xl leading-none flex items-center justify-center gap-2 group-hover:bg-gray-800 transition duration-200">
                    {isImageLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="font-medium text-white">Translating...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                        <span className="font-medium text-white">Translate Image</span>
                      </>
                    )}
                  </div>
                </button>

                {translatedImageText && (
                  <div className="mt-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-md rounded-xl border border-gray-700/50 overflow-hidden animate-fade-in">
                    <div className="px-5 py-3 border-b border-gray-700/50 flex items-center justify-between">
                      <h3 className="text-sm font-medium text-white flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Translation Complete
                      </h3>
                      <div className="flex gap-2">
                        <button className="text-gray-400 hover:text-white transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button className="text-gray-400 hover:text-white transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-white">{translatedImageText}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">© 2024 Universal Translator</p>
          </div>
        </div>
      </div>
    </main>
  );
}
