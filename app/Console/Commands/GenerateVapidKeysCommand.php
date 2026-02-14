<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class GenerateVapidKeysCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'webpush:vapid {--show} {--force : Overwrite existing keys}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate VAPID keys for Web Push Notifications';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            $vapid = $this->generateKeysUsingNpx();

            if ($this->option('show')) {
                $this->displayKeys($vapid);
            } else {
                $this->updateEnvFile($vapid);
                $this->components->info('VAPID keys generated (via npx) and updated in .env file.');
                $this->displayKeys($vapid);
            }

            return 0;
        } catch (\Exception $e) {
            $this->error('Error generating VAPID keys: ' . $e->getMessage());
            return 1;
        }
    }

    /**
     * Generate VAPID keys using npx web-push.
     * 
     * @return array
     * @throws \RuntimeException
     */
    protected function generateKeysUsingNpx()
    {
        $this->components->info('Generating VAPID keys using npx web-push...');

        $process = new Process(['npx', 'web-push', 'generate-vapid-keys']);
        $process->run();

        if (!$process->isSuccessful()) {
            throw new \RuntimeException($process->getErrorOutput());
        }

        $output = $process->getOutput();

        // Parse the output
        $publicKey = null;
        $privateKey = null;

        if (preg_match('/Public Key:\s*(\S+)/', $output, $matches)) {
            $publicKey = trim($matches[1]);
        }

        if (preg_match('/Private Key:\s*(\S+)/', $output, $matches)) {
            $privateKey = trim($matches[1]);
        }

        if (!$publicKey || !$privateKey) {
            throw new \RuntimeException('Failed to parse VAPID keys from npx output.');
        }

        return [
            'publicKey' => $publicKey,
            'privateKey' => $privateKey,
        ];
    }

    /**
     * Display the generated keys.
     *
     * @param array $vapid
     * @return void
     */
    protected function displayKeys(array $vapid)
    {
        $this->info('VAPID Keys:');
        $this->line('');
        $this->line('Public Key:');
        $this->line($vapid['publicKey']);
        $this->line('');
        $this->line('Private Key:');
        $this->line($vapid['privateKey']);
        $this->line('');
        $this->comment('Ensure these are in your .env file:');
        $this->line('VAPID_PUBLIC_KEY=' . $vapid['publicKey']);
        $this->line('VAPID_PRIVATE_KEY=' . $vapid['privateKey']);
        $this->line('VITE_VAPID_PUBLIC_KEY=' . $vapid['publicKey']);
    }

    /**
     * Update the .env file with the generated keys.
     *
     * @param array $vapid
     * @return void
     */
    protected function updateEnvFile(array $vapid)
    {
        $envFile = base_path('.env');

        if (!file_exists($envFile)) {
            $this->error('.env file not found.');
            return;
        }

        $content = file_get_contents($envFile);

        $keys = [
            'VAPID_PUBLIC_KEY' => $vapid['publicKey'],
            'VAPID_PRIVATE_KEY' => $vapid['privateKey'],
            'VITE_VAPID_PUBLIC_KEY' => $vapid['publicKey'],
        ];

        foreach ($keys as $key => $value) {
            // Check if key exists
            if (strpos($content, "{$key}=") !== false) {
                if ($this->option('force') || $this->confirm("The key {$key} already exists. Do you want to overwrite it?")) {
                    // Replace existing key
                    $content = preg_replace("/^{$key}=.*/m", "{$key}={$value}", $content);
                }
            } else {
                // Append new key
                $content .= PHP_EOL . "{$key}={$value}";
            }
        }

        file_put_contents($envFile, $content);
    }
}
