<?php
$phpDir = dirname(PHP_BINARY);
$possiblePaths = [
    $phpDir . '/extras/ssl/openssl.cnf',
    $phpDir . '/openssl.cnf',
    'C:/laragon/etc/ssl/openssl.cnf',
    'C:/xampp/php/extras/ssl/openssl.cnf',
    'C:/Program Files/Common Files/SSL/openssl.cnf',
];

$configPath = null;
foreach ($possiblePaths as $path) {
    if (file_exists($path)) {
        $configPath = $path;
        break;
    }
}

if ($configPath) {
    echo "Found openssl.cnf at: $configPath\n";
    putenv("OPENSSL_CONF=$configPath");
} else {
    echo "Could not find openssl.cnf. Trying default.\n";
}

$config = [
    "curve_name" => "prime256v1",
    "private_key_type" => OPENSSL_KEYTYPE_EC,
];

// If we found a config, we can also pass it in 'config' (sometimes required)
if ($configPath) {
    $config['config'] = $configPath;
}

$res = openssl_pkey_new($config);

if ($res === false) {
    echo "openssl_pkey_new FAILED\n";
    while ($msg = openssl_error_string()) {
        echo "Error: $msg\n";
    }
} else {
    echo "openssl_pkey_new SUCCESS\n";
    openssl_pkey_export($res, $privKey, null, $config);
    echo "Private Key generated successfully.\n";
}
