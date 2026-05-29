package com.lending.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.core.convert.converter.Converter;
import org.springframework.core.convert.converter.ConverterFactory;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        // In Spring Boot 3.0+, trailing slash matching is disabled by default.
        // If needed, we can set it here, but it's deprecated. 
        // Better to ensure frontend matches exactly.
    }

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverterFactory(new StringToEnumConverterFactory());
    }

    private static class StringToEnumConverterFactory implements ConverterFactory<String, Enum> {
        @Override
        public <T extends Enum> Converter<String, T> getConverter(Class<T> targetType) {
            return new StringToEnumConverter<>(targetType);
        }
    }

    private static class StringToEnumConverter<T extends Enum> implements Converter<String, T> {
        private final Class<T> enumType;

        public StringToEnumConverter(Class<T> enumType) {
            this.enumType = enumType;
        }

        @Override
        public T convert(String source) {
            if (source.isEmpty()) {
                return null;
            }
            try {
                return (T) Enum.valueOf(enumType, source.trim());
            } catch (IllegalArgumentException e) {
                // Try case-insensitive
                for (T constant : enumType.getEnumConstants()) {
                    if (constant.name().equalsIgnoreCase(source.trim())) {
                        return constant;
                    }
                }
                throw e;
            }
        }
    }
}
