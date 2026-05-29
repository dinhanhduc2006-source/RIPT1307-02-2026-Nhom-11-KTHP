package com.lending.backend.exception;

import com.lending.backend.common.ResponseResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.converter.HttpMessageNotReadableException;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ResponseResult<Object>> handlingRuntimeException(Exception exception) {
        exception.printStackTrace(); // FORCE PRINT STACK TRACE TO STDERR
        log.error("Exception: ", exception);
        ErrorCode errorCode = ErrorCode.UNCATEGORIZED_EXCEPTION;
        return ResponseEntity.status(errorCode.getStatusCode()).body(
                ResponseResult.error(errorCode.getCode(), errorCode.getMessage() + ": " + exception.getMessage())
        );
    }

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ResponseResult<Object>> handlingAppException(AppException exception) {
        ErrorCode errorCode = exception.getErrorCode();
        return ResponseEntity.status(errorCode.getStatusCode()).body(
                ResponseResult.error(errorCode.getCode(), errorCode.getMessage())
        );
    }

    @ExceptionHandler(value = DataIntegrityViolationException.class)
    ResponseEntity<ResponseResult<Object>> handlingDataIntegrityViolationException(DataIntegrityViolationException exception) {
        log.warn("Data Integrity Violation: {}", exception.getMessage());
        return ResponseEntity.badRequest().body(
                ResponseResult.error(1002, "Data constraint violation. Possibly a duplicate entry or missing required field.")
        );
    }

    @ExceptionHandler(value = HttpMessageNotReadableException.class)
    ResponseEntity<ResponseResult<Object>> handlingHttpMessageNotReadableException(HttpMessageNotReadableException exception) {
        log.warn("HttpMessageNotReadable: {}", exception.getMessage());
        return ResponseEntity.badRequest().body(
                ResponseResult.error(1003, "Invalid request format: " + exception.getMostSpecificCause().getMessage())
        );
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ResponseResult<Object>> handlingAccessDeniedException(AccessDeniedException exception) {
        ErrorCode errorCode = ErrorCode.UNAUTHORIZED;
        return ResponseEntity.status(errorCode.getStatusCode()).body(
                ResponseResult.error(errorCode.getCode(), errorCode.getMessage())
        );
    }

    @ExceptionHandler(value = AuthenticationException.class)
    ResponseEntity<ResponseResult<Object>> handlingAuthenticationException(AuthenticationException exception) {
        ErrorCode errorCode = ErrorCode.UNAUTHENTICATED;
        return ResponseEntity.status(errorCode.getStatusCode()).body(
                ResponseResult.error(errorCode.getCode(), errorCode.getMessage())
        );
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ResponseResult<Object>> handlingValidation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldError().getDefaultMessage();
        return ResponseEntity.badRequest().body(
                ResponseResult.error(1001, message)
        );
    }
}
