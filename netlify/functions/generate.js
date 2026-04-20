const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

    try {
        const { prompt } = JSON.parse(event.body);
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "Anda adalah Web Developer Expert. Balas HANYA dengan kode HTML, CSS (Tailwind), dan JS lengkap dalam satu file tanpa penjelasan." },
                { role: "user", content: prompt }
            ],
            model: "llama3-8b-8192",
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ html: completion.choices[0].message.content }),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};

