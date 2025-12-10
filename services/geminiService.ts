
import { GoogleGenAI } from "@google/genai";

// Helper to safely get the API key
const getApiKey = (): string | undefined => {
  return process.env.API_KEY;
};

export const generateSEODescription = async (serviceName: string, keywords: string): Promise<string> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.warn("API Key not found.");
    return `Deskripsi layanan profesional untuk ${serviceName}. Hubungi kami untuk info lebih lanjut.`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Buatkan deskripsi layanan yang menarik dan SEO friendly untuk layanan jasa: "${serviceName}".
      Gunakan kata kunci berikut: ${keywords}.
      Buat dalam bahasa Indonesia yang profesional namun persuasif.
      Maksimal 1 paragraf (sekitar 30-50 kata).
      Langsung berikan deskripsinya tanpa pembuka atau penutup.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Gagal menghasilkan deskripsi.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Terjadi kesalahan saat menghubungi AI. Silakan coba lagi.";
  }
};

export const generateBlogArticle = async (title: string, keywords: string): Promise<{content: string, summary: string}> => {
    const apiKey = getApiKey();
    if (!apiKey) return { content: "<p>API Key Missing</p>", summary: "No API Key" };

    try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `
            Buatkan artikel blog SEO friendly dalam format HTML untuk judul: "${title}".
            Keywords: ${keywords}.
            
            Format JSON dengan structure:
            {
                "summary": "Ringkasan pendek max 2 kalimat untuk meta description",
                "content": "Isi artikel lengkap format HTML (gunakan tag <p>, <h2>, <ul>, <li>). Minimal 300 kata."
            }
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        
        const text = response.text;
        if (!text) throw new Error("No response");
        
        return JSON.parse(text);
    } catch (e) {
        console.error(e);
        return { 
            content: "<p>Gagal generate artikel.</p>", 
            summary: "Error generation" 
        };
    }
}

export const generateServiceFAQs = async (serviceTitle: string): Promise<Array<{question: string, answer: string}>> => {
    const apiKey = getApiKey();
    if (!apiKey) return [];

    try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `
            Buatkan 4 Pertanyaan Umum (FAQ) beserta jawabannya untuk layanan jasa: "${serviceTitle}".
            Fokus pada meyakinkan calon klien. Bahasa Indonesia.
            
            Format JSON Array:
            [
              { "question": "...", "answer": "..." },
              ...
            ]
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        
        const text = response.text;
        if (!text) throw new Error("No response");
        
        return JSON.parse(text);
    } catch (e) {
        console.error(e);
        return [];
    }
}
