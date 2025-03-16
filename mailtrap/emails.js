import {
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    VERIFICATION_EMAIL_TEMPLATE
} from "./emailTemplates.js"
import { mailtrapClient, sender } from "./mailtrap.config.js"

export const sendVerficationEmail = async (email, verificationToken) => {
    const recipient = [{ email }]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "verify youe email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verifiaction"
        })
        console.log("email sent successfully", response)
    } catch (error) {
        console.log(`Error sending verification ${error}`)
        throw new Error(`Error sending verification email:${error}`)
    }
}

export const sendWelcomeMail = async (email, name) => {
    const recipient = [{ email }]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "583681b4-7b24-44b3-8521-07cb6a5fabff",
            template_variables: {
                company_info_name: "TechBeas",
                name: name
            }
        })
        console.log("welcome email sent successfully", response)

    } catch (error) {
        console.log(`Error sending welcome mail, ${error}`)
        throw new Error(`Error sending welcome email:${error}`)
    }
}

export const sendPasswordResetEmail = async (email, resetUrl) => {
    const recipient = [{ email }]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
            category: "Password Reset"
        })
        console.log("email sent successfully", response)
    } catch (error) {
        console.log(`Error sending password reset ${error}`)
        throw new Error(`Error sending password reset email:${error}`)
    }
}

export const sendResetSuccess = async (email) => {
    const recipient = [{ email }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password reset Successfully",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset Successfully"
        })
        console.log("email sent successfully", response)
    } catch (error) {
        console.log(`Error sending password update ${error}`)
        throw new Error(`Error sending password update email:${error}`)
    }
}