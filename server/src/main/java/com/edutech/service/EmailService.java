package com.edutech.service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {

        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("OTP Verification - Let me Dine");

            String htmlContent = buildOtpEmailTemplate(otp);

            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }

    private String buildOtpEmailTemplate(String otp) {

        return String.format(
            "<html>" +
            "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
            "</head>" +

            "<body style='margin:0; padding:0; background-color:#111827; font-family:Arial, Helvetica, sans-serif;'>" +

                "<table width='100%%' cellpadding='0' cellspacing='0' style='background-color:#111827; padding:40px 0;'>" +
                    "<tr>" +
                        "<td align='center'>" +

                            "<table width='600' cellpadding='0' cellspacing='0' style='background-color:#1f2937; border-radius:14px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.35);'>" +

                                "<tr>" +
                                    "<td align='center' style='background:linear-gradient(135deg, #b91c1c, #f59e0b); padding:35px 20px;'>" +
                                        "<h1 style='margin:0; color:#111827; font-size:32px; font-weight:800;'>" +
                                            "🍽️ Let me Dine" +
                                        "</h1>" +
                                    "</td>" +
                                "</tr>" +

                                "<tr>" +
                                    "<td style='padding:45px 55px; color:#d1d5db;'>" +

                                        "<h2 style='margin:0 0 25px; color:#fca5a5; font-size:30px; font-weight:700;'>" +
                                            "Email Verification" +
                                        "</h2>" +

                                        "<p style='font-size:18px; line-height:1.6; margin:0 0 18px; color:#d1d5db;'>" +
                                            "Hello," +
                                        "</p>" +

                                        "<p style='font-size:18px; line-height:1.6; margin:0 0 30px; color:#d1d5db;'>" +
                                            "Your One-Time Password (OTP) for " +
                                            "<strong style='color:#ffffff;'>Let me Dine Restaurant registration</strong> is:" +
                                        "</p>" +

                                        "<div style='background-color:#292524; border:2px dashed #ca8a04; border-radius:12px; padding:28px 20px; text-align:center; margin:35px 0;'>" +
                                            "<span style='letter-spacing:12px; color:#fca5a5; font-size:42px; font-weight:800;'>" +
                                                "%s" +
                                            "</span>" +
                                        "</div>" +

                                        "<p style='font-size:17px; line-height:1.6; color:#9ca3af; margin:0 0 10px;'>" +
                                            "This OTP is valid for " +
                                            "<strong style='color:#ffffff;'>5 minutes</strong>." +
                                        "</p>" +

                                        "<p style='font-size:17px; line-height:1.6; color:#9ca3af; margin:0;'>" +
                                            "Do not share this code with anyone." +
                                        "</p>" +

                                        "<hr style='border:none; border-top:1px solid #374151; margin:35px 0;'>" +

                                        "<p style='font-size:14px; line-height:1.6; color:#6b7280; margin:0;'>" +
                                            "If you did not request this OTP, please ignore this email." +
                                        "</p>" +

                                    "</td>" +
                                "</tr>" +

                                "<tr>" +
                                    "<td align='center' style='background-color:#1f2937; padding:25px 20px;'>" +
                                        "<p style='margin:0; color:#6b7280; font-size:14px;'>" +
                                            "© 2026 Let me Dine. All rights reserved." +
                                        "</p>" +
                                    "</td>" +
                                "</tr>" +

                            "</table>" +

                        "</td>" +
                    "</tr>" +
                "</table>" +

            "</body>" +
            "</html>",
            otp
        );
    }

    // public void sendResetPasswordEmail(String toEmail, String resetLink) {
    //     SimpleMailMessage message = new SimpleMailMessage();
    //     message.setTo(toEmail);
    //     message.setSubject("Reset Your password");
    //     message.setText("Click the link below to reset your password:\n\n" +
    //             resetLink + "\n\nThis link will expire in 15 minutes" +
    //             "\n\nIf you did not request password reset, ignore this email" + "\n\n-Let me Dine"
    //     );
    //
    //     mailSender.send(message);
    // }
}
