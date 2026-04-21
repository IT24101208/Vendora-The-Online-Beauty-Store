package com.vendora.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileUploadService {
    @Value("${file.upload-dir}")
    private String uploadDir;

    public String saveImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);
        Path filePath = uploadPath.resolve(filename);
        Files.write(filePath, file.getBytes());
        return "/uploads/" + filename;
    }
}