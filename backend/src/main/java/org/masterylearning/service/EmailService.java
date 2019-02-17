package org.masterylearning.service;

import org.springframework.core.env.Environment;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;

import javax.inject.Inject;

/**
 *
 */
@Service
public class EmailService {

    @Inject Environment environment;
    @Inject MailSender mailSender;

    public void sendEmail (String to, String subject, String body) {

        String from = environment.getProperty ("email.from");

        sendEmail (from, to, subject, body);
    }

    public void sendEmail (String from, String to, String subject, String body) {

        SimpleMailMessage email = new SimpleMailMessage();

        email.setFrom (from);
        email.setTo(to);
        email.setSubject(subject);
        email.setText(body);

        mailSender.send (email);

    }
}
