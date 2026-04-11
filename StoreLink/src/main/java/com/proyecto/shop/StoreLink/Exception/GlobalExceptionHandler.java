package com.proyecto.shop.StoreLink.Exception;

import java.sql.SQLIntegrityConstraintViolationException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import io.swagger.v3.oas.annotations.Hidden;
import jakarta.validation.ConstraintViolationException;

/*
 * DON'T REMOVE @Hidden and @RestControllerAdvice
 * Otherwise Swagger API docs breaks and gives fetch API error
 */
@Hidden
@RestControllerAdvice
@ControllerAdvice
public class GlobalExceptionHandler {

	public static final Logger LOG = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /*
     * Handle malformed JSON errors
     * Triggered when incoming JSON request cannot be parsed (syntax error, missing fields, etc.)
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleJsonParseError(HttpMessageNotReadableException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Malformed JSON request! Check your input format!");
        error.put("details", ex.getMostSpecificCause().getMessage());
        return ResponseEntity.badRequest().body(error);
    }

    /*
     * Handle validation errors from @Valid or @Validated annotations
     * Triggered when field-level constraints (like @NotBlank, @Size) fail
     */
	@ExceptionHandler(value = MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, Object>> handleMethodArgumentNotValid(MethodArgumentNotValidException me){
		LOG.error("Validation error: {}", me.getMessage());
		Map<String, Object> responseData = new HashMap<>();
		Map<String, String> allErrors = new HashMap<>();
		me
			.getBindingResult()
			.getFieldErrors()
			.stream()
			.forEach((eachError) -> allErrors.put(eachError.getField(), eachError.getDefaultMessage()));
		responseData.put("datetime", LocalDateTime.now());
		responseData.put("errors", allErrors);
		return new ResponseEntity<Map<String, Object>>(responseData, HttpStatus.BAD_REQUEST);
	}
	
    /*
     * Handle parameter type mismatches
     * Example: sending /customers/abc instead of /customers/123 (expects int, got String)
     */
	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<Map<String, Object>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
	    Map<String, Object> errorDetails = new HashMap<>();
	    errorDetails.put("timestamp", LocalDateTime.now());
	    errorDetails.put("parameter", ex.getName());
	    errorDetails.put("invalidValue", ex.getValue());
	    errorDetails.put("expectedType", ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "Unknown");
	    errorDetails.put("message", "Invalid value for parameter '" + ex.getName() + "'. Expected type: " + errorDetails.get("expectedType"));

	    return ResponseEntity.badRequest().body(errorDetails);
	}
	
    /*
     * Handle database constraint violations
     * Example: unique constraint violated, or invalid foreign key
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        LOG.error("Database error: {}", ex.getMessage());

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("datetime", LocalDateTime.now());

        // Try to extract the root cause message (Example: ORA-01438)
        String dbMessage = ex.getRootCause() != null ? ex.getRootCause().getMessage() : ex.getMessage();
        responseData.put("errors", dbMessage);

        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }
    
    /*
     * Handle SQL-level integrity constraint violations
     * Example: Duplicate key or primary key violation
     */
    @ExceptionHandler(SQLIntegrityConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleSQLConstraintViolation(SQLIntegrityConstraintViolationException ex) {
        LOG.error("SQL constraint violation: {}", ex.getMessage());

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("datetime", LocalDateTime.now());
        responseData.put("errors", ex.getMessage());

        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }
    

    /*
     * Handle transaction-level exceptions
     * Example: failure during commit/flush due to constraint violation
     */
    @ExceptionHandler(TransactionSystemException.class)
    public ResponseEntity<Map<String, Object>> handleTransactionException(TransactionSystemException ex) {
        LOG.error("Transaction error: {}", ex.getMessage());

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("datetime", LocalDateTime.now());
        responseData.put("errors", ex.getRootCause() != null ? ex.getRootCause().getMessage() : ex.getMessage());

        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }
    
    /*
     * Handle Hibernate constraint violations
     * Triggered when a JPA validation or constraint at the DB level fails
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleHibernateConstraintViolation(ConstraintViolationException ex) {
    	LOG.error("Transaction error: {}", ex.getMessage());

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("datetime", LocalDateTime.now());
        responseData.put("errors", ex.getCause() != null ? ex.getCause().getMessage() : ex.getMessage());

        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }

    /*
     * Handle resource not found errors (my custom exception)
     * Example: trying to get a customer or order that doesn't exist
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
    
    // Handle invalid input errors (my custom exception)
    @ExceptionHandler(InvalidInputException.class)
    public ResponseEntity<String> handleInvalidInputException(InvalidInputException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
    
}
