package com.vendora.epic1.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CustomerViewConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/html/index.html");
        registry.addViewController("/customer/login").setViewName("customer-management/html/login");
        registry.addViewController("/customer/signup").setViewName("customer-management/html/signup");
        registry.addViewController("/customer/profile").setViewName("customer-management/html/profile");
    }
}
