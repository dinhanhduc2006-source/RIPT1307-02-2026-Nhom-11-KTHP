package com.lending.backend.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseResult<T> {
    private int code;
    private String message;
    private T data;

    public static <T> ResponseResult<T> success(T data) {
        return ResponseResult.<T>builder()
                .code(200)
                .message("Success")
                .data(data)
                .build();
    }

    public static <T> ResponseResult<T> success() {
        return success(null);
    }

    public static <T> ResponseResult<T> error(int code, String message) {
        return ResponseResult.<T>builder()
                .code(code)
                .message(message)
                .build();
    }
}
