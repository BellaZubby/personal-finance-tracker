import { gmail } from '../config/smtp';
import { EMAIL_USER } from '../config/dotenv';

export const sendEmail = async (
  to: string,
  subject: string,
  htmlBody: string
) => {
  const messageParts = [
    `From: Akulyst <${EMAIL_USER}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/html; charset=UTF-8',
    '',
    htmlBody,
  ];

  const rawMessage = Buffer.from(messageParts.join('\n'))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: rawMessage,
    },
  });
};