package com.lending.backend.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Invalid message key", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User already exists", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "User does not exist", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    RESOURCE_NOT_FOUND(1009, "Resource not found", HttpStatus.NOT_FOUND),
    INSUFFICIENT_STOCK(1010, "Insufficient equipment stock", HttpStatus.BAD_REQUEST),
    INVALID_BORROW_DATE(1011, "Borrow date must be before return date", HttpStatus.BAD_REQUEST),
    USER_HAS_DEBT(1012, "User has unpaid penalties", HttpStatus.BAD_REQUEST),
    USER_HAS_OVERDUE(1013, "User has active overdue loan requests", HttpStatus.BAD_REQUEST),
    ;

    ErrorCode(int code, String message, HttpStatus statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatus statusCode;
}
