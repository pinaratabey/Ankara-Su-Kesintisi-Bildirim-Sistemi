package com.askitracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AskiNotificationApplication {

    public static void main(String[] args) {
        SpringApplication.run(AskiNotificationApplication.class, args);
    }
}
