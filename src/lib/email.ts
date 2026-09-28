import nodemailer from "nodemailer";

/**
 * Configuración del Transporter SMTP (Banahosting / cPanel)
 */
export function getEmailTransporter() {
  const host = process.env.SMTP_HOST || "mail.fedardistribuidora.com.ar";
  const port = Number(process.env.SMTP_PORT) || 465;
  const isSecure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASSWORD || "";

  return nodemailer.createTransport({
    host,
    port,
    secure: isSecure, // true para 465 (SSL), false para 587 (TLS)
    auth: {
      user,
      pass,
    },
    tls: {
      // Evitar errores de certificados auto-firmados en servidores compartidos de cPanel/Banahosting
      rejectUnauthorized: false,
    },
  });
}

/**
 * Enviar correo con código de recuperación de contraseña
 */
export async function sendPasswordRecoveryEmail(toEmail: string, code: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const fromAddress = process.env.SMTP_FROM || `"FEDAR Distribuidora" <${process.env.SMTP_USER || "webmaster@fedardistribuidora.com.ar"}>`;
    const transporter = getEmailTransporter();

    // Plantilla HTML premium para el correo
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <title>Recuperación de Contraseña - FEDAR Distribuidora</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F1EA; margin: 0; padding: 24px; color: #1C2735; }
        .container { max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E2DCD0; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        .header { background-color: #0A1F36; padding: 28px 32px; text-align: center; border-bottom: 4px solid #E0A93B; }
        .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; }
        .header p { color: #C9D6E3; margin: 6px 0 0; font-size: 13px; font-weight: 500; }
        .body { padding: 32px; }
        .greeting { font-size: 16px; font-weight: 700; color: #0A1F36; margin-bottom: 12px; }
        .text { font-size: 14px; line-height: 1.6; color: #4A5568; margin-bottom: 24px; }
        .code-box { background: linear-gradient(135deg, #FAF8F5 0%, #F1ECE2 100%); border: 2px dashed #E0A93B; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px; }
        .code-title { font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; color: #8A7242; margin-bottom: 8px; }
        .code-number { font-size: 34px; font-weight: 800; color: #0A1F36; letter-spacing: 8px; font-family: monospace; }
        .code-expiration { font-size: 12px; color: #718096; margin-top: 8px; }
        .warning { background-color: #FFFDF0; border-left: 4px solid #E0A93B; padding: 12px 16px; font-size: 13px; color: #745A1A; border-radius: 0 8px 8px 0; margin-bottom: 24px; }
        .footer { background-color: #FAF8F5; padding: 20px 32px; text-align: center; border-top: 1px solid #EAE5DB; font-size: 12px; color: #8A96A5; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>FEDAR Distribuidora</h1>
          <p>Panel de Administración &bull; Seguridad</p>
        </div>
        <div class="body">
          <div class="greeting">Hola,</div>
          <div class="text">
            Recibimos una solicitud para restablecer la contraseña de acceso al Panel de Administración de <strong>FEDAR Distribuidora</strong> asociada a tu cuenta (${toEmail}).
          </div>

          <div class="code-box">
            <div class="code-title">Tu código de verificación</div>
            <div class="code-number">${code}</div>
            <div class="code-expiration">Válido por 15 minutos</div>
          </div>

          <div class="text">
            Ingresá este código en la ventana de recuperación del sitio web para definir tu nueva contraseña.
          </div>

          <div class="warning">
            <strong>¿No realizaste esta solicitud?</strong> Podés desestimar este mensaje de forma segura. Tu contraseña actual no se modificará sin este código.
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} FEDAR Distribuidora Mayorista &bull; Rosario, Santa Fe, Argentina<br>
          Este es un correo automático generado por el sistema, por favor no responder directamente.
        </div>
      </div>
    </body>
    </html>
    `;

    const textContent = `
FEDAR Distribuidora - Recuperación de Contraseña

Hola,

Recibimos una solicitud para restablecer la contraseña del panel de administración asociada a tu cuenta (${toEmail}).

Tu código de verificación es: ${code}
(Este código es válido por 15 minutos)

Ingresalo en la pantalla de recuperación para crear tu nueva contraseña.

Si no solicitaste este cambio, podés ignorar este correo.

FEDAR Distribuidora Mayorista
    `;

    const info = await transporter.sendMail({
      from: fromAddress,
      to: toEmail,
      subject: `Código de Recuperación: ${code} - FEDAR Distribuidora`,
      text: textContent,
      html: htmlContent,
    });

    console.log("Correo de recuperación enviado con éxito:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Error al enviar correo vía Banahosting SMTP:", error);
    return { success: false, error: error?.message || "Error al enviar el correo." };
  }
}
