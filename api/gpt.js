export default async function handler(req, res) {
  const prompt = req.query.prompt || "Hola";

  try {
    const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await gptResponse.json();

    // Validar respuesta
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Respuesta inesperada de OpenAI:", data);
      return res.status(500).send("Error: Respuesta inesperada de OpenAI. Revisa logs para más detalles.");
    }

    // Enviar respuesta de GPT
    res.status(200).send(data.choices[0].message.content);

  } catch (error) {
    console.error("Error llamando a OpenAI:", error);
    res.status(500).send("Error interno del servidor al llamar a OpenAI");
  }
}
