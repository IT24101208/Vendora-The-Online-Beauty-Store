package com.vendora.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtUtil jwtUtil;

    public SecurityConfig(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/admin/categories", "/admin/categories/**").permitAll()
                .requestMatchers("/orders/payment-confirmed").permitAll()
                // Admin only
                .requestMatchers("/admin/**").hasRole("ADMIN")
                // Delivery agents
                .requestMatchers("/deliveryagent/**").hasRole("DELIVERY_PERSON")
                // Suppliers
                .requestMatchers("/supplier/**").hasRole("SUPPLIER")
                // Customers (cart, orders, deliveries, payments)
                .requestMatchers("/customer/**").hasRole("CUSTOMER")
                .requestMatchers("/payments/initiate").hasAnyRole("CUSTOMER", "ADMIN")
                // Any other request requires authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(new JwtAuthFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
