package com.vendora.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/")
    public String home(){
        return "forward:/html/index.html";
    }

    @GetMapping("/shop")
    public String shop(){
        return "forward:/html/shop.html";
    }

    @GetMapping("/about")
    public String about(){
        return "forward:/html/about.html";
    }

    @GetMapping("/learn")
    public String learn(){
        return "forward:/html/service.html";
    }

}