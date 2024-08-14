package ru.mycrg.auth_service.service;

import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service.entity.OrganizationIntent;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.exceptions.BadRequestException;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import static java.lang.String.format;
import static java.util.Objects.nonNull;

@Service
public class EmailService {

    private final JavaMailSender emailSender;

    private final Environment environment;

    public EmailService(JavaMailSender emailSender, Environment environment) {
        this.emailSender = emailSender;
        this.environment = environment;
    }

    public void sendEmailResetPassword(User receiver, String newToken, String originHost) {
        String fullName = nonNull(receiver.getMiddleName())
                ? format("%s %s", receiver.getName(), receiver.getMiddleName())
                : receiver.getName();
        String htmlBody = preparedMessageHtmlBody(fullName, newToken, originHost);

        String sender = environment.getRequiredProperty("spring.mail.username");

        try {
            MimeMessage message = emailSender.createMimeMessage();

            MimeBodyPart mimeBodyPart = new MimeBodyPart();
            mimeBodyPart.setContent(htmlBody, "text/html; charset=utf-8");

            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(mimeBodyPart);

            message.setFrom(new InternetAddress(sender));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(receiver.getEmail()));
            message.setSubject("Восстановление пароля");
            message.setContent(multipart);

            emailSender.send(message);
        } catch (MessagingException e) {
            throw new BadRequestException("Не удалось отправить email. " + e.getMessage());
        }
    }

    public void sendIntent(OrganizationIntent intent) {
        // TODO: in progress
    }

    private String preparedMessageHtmlBody(String fullName, String token, String originHost) {
        String restoreLink = format("%s/%s/%s", originHost, "password-reset", token);
        String resetPassEmailPath = "resetPassEmail.html";

        String content;
        try {
            content = readFromFile(resetPassEmailPath);
            content = content.replace("{fullname}", fullName);
            content = content.replace("{baseSiteURL}", originHost);
            content = content.replace("{restoreLink}", restoreLink);
        } catch (IOException e) {
            throw new BadRequestException(
                    format("Не удалось прочитать файл %s. %s", resetPassEmailPath, e.getMessage()));
        }

        return content;
    }

    private String readFromFile(String filePath) throws IOException {
        InputStream inputStream = getClass().getClassLoader().getResourceAsStream(filePath);

        StringBuilder resultStringBuilder = new StringBuilder();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            while ((line = br.readLine()) != null) {
                resultStringBuilder.append(line);
            }
        }

        return resultStringBuilder.toString();
    }
}
