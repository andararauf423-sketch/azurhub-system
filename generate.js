const Groq = require("groq-sdk");

// Inisialisasi Groq pake API Key yang nanti lo pasang di Netlify
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.handler = async (event) => {
    // Cuma izinin metode POST (biar gak sembarang orang akses)
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { prompt } = JSON.parse(event.body);

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: "Anda adalah Web Developer Expert. Tugas Anda adalah membuat kode HTML, CSS (Tailwind), dan JavaScript berdasarkan permintaan user. Balas HANYA dengan kode lengkap di dalam satu file. JANGAN memberikan penjelasan, teks tambahan, atau tanda ``` di awal dan akhir." 
                },
                { role: "user", content: prompt }
            ],
            model: "llama3-8b-8192", 
        });

        const htmlResult = chatCompletion.choices[0].message.content;

        return {
            statusCode: 200,
            body: JSON.stringify({ html: htmlResult }),
        };
    } catch (error) {
        console.error("Error AI:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Gagal merakit kode: " + error.message }),
        };
    }
};

