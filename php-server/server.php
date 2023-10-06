<?php
// Start the output buffer
ob_start();

// Custom Error Handler
function customErrorHandler($errno, $errstr, $errfile, $errline) {
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
}

// Register the custom error handler
set_error_handler("customErrorHandler");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// Register a function to be executed upon script shutdown
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== NULL) {
        // Handle fatal error
        ob_end_clean(); // Clean the output buffer
        echo json_encode(array('error' => $error['message']));
    }
});

try {
    // Read the PHP code from the POST request
    $code = $_POST['code'];

    // Use eval() to execute the PHP code
    eval($code);

    // Get the output from the buffer and clean it
    $output = ob_get_contents();
    ob_end_clean();

    // Send the output back as the response
    echo json_encode(array('result' => $output));
} catch (Exception $e) {
    // Clean the output buffer
    ob_end_clean();

    // Return error as response
    echo json_encode(array('error' => $e->getMessage()));
}
?>
