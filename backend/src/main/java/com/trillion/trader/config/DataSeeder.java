package com.trillion.trader.config;

import com.trillion.trader.model.User;
import com.trillion.trader.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Seed default Admin User if not exists
        String adminEmail = "admin@trilliontraders.com";
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            log.info("Seeding default admin user...");
            User admin = User.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode("Admin123!"))
                    .firstName("Super")
                    .lastName("Admin")
                    .roles(Set.of("ADMIN", "USER"))
                    .active(true)
                    .build();
            userRepository.save(admin);
            log.info("Default admin user seeded successfully.");
        }
    }
}
