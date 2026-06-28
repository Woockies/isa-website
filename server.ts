import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const resend = new Resend(process.env.RESEND_API_KEY || "re_AXESaVPE_BiVoLFQQS76rZNQsV6dejDSq");

  // API Route for sending the audit email
  app.post("/api/send", async (req, res) => {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Email inválido" });
    }

    try {
      const { data, error } = await resend.emails.send({
        from: "Andrés Sotomayor <onboarding@resend.dev>",
        to: [email],
        subject: "Tu ISA | 3-Point Biomechanical Filter",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #1a1a1a;">Bienvenido a ISA.</h2>
            <p style="color: #333; line-height: 1.6;">
              Adjunto encontrarás tu protocolo de autoevaluación <strong>ISA | 3-Point Biomechanical Filter</strong>.
            </p>
            <p style="color: #333; line-height: 1.6;">
              Este documento contiene los 3 movimientos críticos que utilizo para filtrar atletas e identificar restricciones de movilidad y fugas de potencia.
            </p>
            <a href="https://drive.google.com/file/d/1GNoaLdTUHlya_aCSI-CFSN2seEQ6JMQ_/view?usp=sharing" 
               style="display: inline-block; background-color: #ffff00; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; margin-top: 10px;">
               Ver Descarga Alternativa
            </a>
            <p style="margin-top: 30px; color: #666; font-size: 0.9em;">
              Andrés Sotomayor<br>
              Founder of ISA | Integrated Strength Athletes
            </p>
          </div>
        `,
      });

      if (error) {
        console.error("Resend Error:", error);
        return res.status(500).json({ error: "Error al enviar el email" });
      }

      res.json({ success: true, data });
    } catch (err) {
      console.error("Server Error:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
