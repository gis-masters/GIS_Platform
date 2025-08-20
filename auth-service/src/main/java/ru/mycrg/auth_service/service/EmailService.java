package ru.mycrg.auth_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service.entity.OrganizationIntent;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.exceptions.BadRequestException;

import javax.mail.Address;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.internet.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Objects;

import static java.lang.String.format;
import static java.util.Objects.nonNull;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final Address sender;
    private final JavaMailSender emailSender;

    public EmailService(JavaMailSender emailSender, Environment environment) throws AddressException {
        this.emailSender = emailSender;

        this.sender = new InternetAddress(environment.getRequiredProperty("spring.mail.username"));
    }

    public void sendEmailResetPassword(User receiver, String newToken, String originHost) {
        String fullName = nonNull(receiver.getMiddleName())
                ? format("%s %s", receiver.getName(), receiver.getMiddleName())
                : receiver.getName();

        String content = readFromFile("resetPassEmail.html");
        content = content.replace("{fullName}", fullName);
        content = content.replace("{baseSiteURL}", originHost);
        content = content.replace("{restoreLink}", format("%s/%s/%s", originHost, "password-reset", newToken));

        sendEmail(receiver.getEmail(), content, "Восстановление пароля");
    }

    public void sendIntent(OrganizationIntent intent,
                           String originHost,
                           String specializationTitle) {
        String content = readFromFile("organizationIntent.html");
        content = content.replace("{baseSiteURL}", originHost);
        content = content.replace("{specTitle}", specializationTitle);
        content = content.replace("{link}", format("%s/%s/%s", originHost, "register/intents", intent.getToken()));

        sendEmail(intent.getEmail(), content, "Регистрация организации");
    }

    private void sendEmail(String receiverEmail, String content, String subject) {
        try {
            MimeBodyPart mimeBodyPart = new MimeBodyPart();
            mimeBodyPart.setContent(content, "text/html; charset=utf-8");

            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(mimeBodyPart);

            MimeMessage message = emailSender.createMimeMessage();
            message.setFrom(sender);
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(receiverEmail));
            message.setSubject(subject);
            message.setContent(multipart);

            emailSender.send(message);
        } catch (MessagingException e) {
            String msg = "Не удалось отправить email " + subject;
            log.error("{} => {}", msg, e.getMessage(), e);

            throw new BadRequestException(msg);
        }
    }

    private String readFromFile(String filePath) {
        StringBuilder resultStringBuilder = new StringBuilder();
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(
                        Objects.requireNonNull(getClass().getClassLoader().getResourceAsStream(filePath))))) {
            String line;
            while ((line = br.readLine()) != null) {
                resultStringBuilder.append(line);
            }
        } catch (IOException e) {
            throw new BadRequestException(
                    format("Не удалось прочитать файл '%s' => %s", filePath, e.getMessage()));
        }

        return resultStringBuilder.toString();
    }
}
