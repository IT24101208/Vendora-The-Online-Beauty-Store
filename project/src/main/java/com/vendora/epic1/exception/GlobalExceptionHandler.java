package com.vendora.epic1.exception;

import com.vendora.common.ApiErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleResourceNotFound(ResourceNotFoundException ex, WebRequest request) {
        return new ResponseEntity<>(new ApiErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Object> handleBadRequest(BadRequestException ex, WebRequest request) {
        return new ResponseEntity<>(new ApiErrorResponse(ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<Object> handleDuplicateResource(DuplicateResourceException ex, WebRequest request) {
        return new ResponseEntity<>(new ApiErrorResponse(ex.getMessage()), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Object> handleUnauthorized(UnauthorizedException ex, WebRequest request) {
        return new ResponseEntity<>(new ApiErrorResponse(ex.getMessage()), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<Object> handleForbidden(ForbiddenException ex, WebRequest request) {
        return new ResponseEntity<>(new ApiErrorResponse(ex.getMessage()), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Object> handleInvalidCredentials(InvalidCredentialsException ex, WebRequest request) {
        return new ResponseEntity<>(new ApiErrorResponse(ex.getMessage()), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<Object> handleInvalidToken(InvalidTokenException ex, WebRequest request) {
        return new ResponseEntity<>(new ApiErrorResponse(ex.getMessage()), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AccountNotVerifiedException.class)
    public ResponseEntity<Object> handleAccountNotVerified(AccountNotVerifiedException ex, WebRequest request) {
        return new ResponseEntity<>(new ApiErrorResponse(ex.getMessage()), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(AccountDisabledException.class)
    public ResponseEntity<Object> handleAccountDisabled(AccountDisabledException ex, WebRequest request) {
        return new ResponseEntity<>(new ApiErrorResponse(ex.getMessage()), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGenericException(Exception ex, WebRequest request) {
        return new ResponseEntity<>(new ApiErrorResponse("Internal Server Error"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}