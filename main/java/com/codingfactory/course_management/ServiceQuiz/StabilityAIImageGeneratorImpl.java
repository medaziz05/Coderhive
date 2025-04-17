package com.codingfactory.course_management.ServiceQuiz;

import com.codingfactory.course_management.exception.AIServiceException;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.image.ImageClient;
import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;
import org.springframework.ai.stabilityai.api.StabilityAiImageOptions;
import org.springframework.stereotype.Service;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class StabilityAIImageGeneratorImpl implements AIImageGeneratorService {
    private final ImageClient stabilityImageClient;

    @Override
    public byte[] generateImage(String prompt, int width, int height) {
        try {
            StabilityAiImageOptions options = StabilityAiImageOptions.builder()
                    .withWidth(width)
                    .withHeight(height)
                    .withResponseFormat("b64_json")
                    .build();

            ImageResponse response = stabilityImageClient.call(
                    new ImagePrompt(prompt, options)
            );

            return Base64.getDecoder().decode(
                    response.getResult().getOutput().getB64Json()
            );
        } catch (Exception e) {
            throw new AIServiceException("Image generation failed: " + e.getMessage(), e);        }
    }
}