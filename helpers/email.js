import nodemailer from 'nodemailer';

export const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  //informacion del mail
  const info = await transport.sendMail({
    from: '"Bienvenido" <correo@inacap.com',
    to: email,
    subject: "comprueba tu cuenta",
    text: "sigue estos pasos para la activación",
    html: ` <p>Hola: ${nombre} Comprueba tu cuenta</p>
        <p>Tu cuenta ya esta casi lista solo debbes comprobarla en el siguiente enlace:
        <a href="http://localhost:3000/confirmar/${token}">Comprobar cuenta</a>
        </p>
        
        `,
  });
};



export const emailOlvidePassword = async (datos) => {
  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  //informacion del mail
  const info = await transport.sendMail({
    from: '"Bienvenido" <correo@inacap.com',
    to: email,
    subject: "Reestable tu password",
    text: "sigue estos pasos para reestable tu password",
    html: ` <p>Hola: ${nombre} has solicitado reestablecer tu password</p>
      <p>Sigue el siguiente enlace para generar un nuevo password:
      <a href="http://localhost:3000/olvide-password/${token}">Reestablecer Password</a>
      </p>
      
      `,
  });
};