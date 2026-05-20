package com.lending.backend.exception;

import com.lending.backend.common.ResponseResult;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ResponseResult<Object>> handlingRuntimeException(RuntimeException exception) {
        ResponseResult<Object> responseResult = new ResponseResult<>();

        responseResult.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
        responseResult.setMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage());

        return ResponseEntity.badRequest().body(responseResult);
    }

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ResponseResult<Object>> handlingAppException(AppException exception) {
        ErrorCode errorCode = exception.getErrorCode();
        ResponseResult<Object> responseResult = new ResponseResult<>();

        responseResult.setCode(errorCode.getCode());
        responseResult.setMessage(errorCode.getMessage());

        return ResponseEntity.status(errorCode.getStatusCode()).body(responseResult);
    }
}
