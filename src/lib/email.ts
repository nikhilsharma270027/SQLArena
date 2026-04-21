// import {Resend} from "resend"

// const resend = new Resend(process.env.RESEND_API_KEY); // Needs RESEND_API_KEY in .env

interface SendEmailValues {
    to: string;
    subject: string;
    text: string
}

// Temporary mock implementation until Resend API key is configured
export async function sendEmail({to, subject, text} : SendEmailValues) {
    // For production, uncomment the following and add RESEND_API_KEY to your .env
    // await resend.emails.send({
    //     from: "noreply@yourdomain.com",
    //     to,
    //     subject,
    //     text
    // });
    
    // For development, just log the email
    console.log(`[EMAIL] To: ${to}, Subject: ${subject}, Content: ${text}`);
}