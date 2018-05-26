package org.masterylearning.web.advice;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.NoSuchElementException;

/**
 */
@ControllerAdvice
public class ExceptionAdvice {

    @ExceptionHandler ({NoSuchElementException.class})
    public void handleNoSuchElementException (NoSuchElementException exception,
                                              HttpServletResponse response) throws IOException
    {
        response.sendError (HttpStatus.BAD_REQUEST.value (),
                            exception.getMessage ());
    }
}
