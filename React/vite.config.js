import { fileURLToPath, URL } from 'node:url';
import plugin from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl'
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { defineConfig, loadEnv } from "vite";
import plugins from "./plugins";

const baseFolder =
    process.env.APPDATA !== undefined && process.env.APPDATA !== ''
        ? `${process.env.APPDATA}/ASP.NET/https`
        : `${process.env.HOME}/.aspnet/https`;

const certificateArg = process.argv.map(arg => arg.match(/--name=(?<value>.+)/i)).filter(Boolean)[0];
const certificateName = certificateArg ? certificateArg.groups.value : "reactaspnetcore.client";

if (!certificateName) {
    console.error('Invalid certificate name. Run this script in the context of an npm/yarn script or pass --name=<<app>> explicitly.')
    process.exit(-1);
} else {
    console.log('certificate found: ', certificateName)
}

const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit', }).status) {
        throw new Error("Could not create certificate.");
    }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());
    return {
            plugins: [plugins(mode), basicSsl()],
        build: {
            // lib: {
                // entry: path.resolve(__dirname, 'src/index.js'),
                // name: 'reactaspnetcore.client',
                // fileName: 'index.js'
            // },
            rollupOptions: {
                // make sure to externalize deps that shouldn't be bundled
                // into your library
                external: ['reactaspnetcore.client'],
                output: {
                    // Provide global variables to use in the UMD build
                    // for externalized deps
                    globals: {
                    }
                }
            }
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        base: "/",
        preview: {
            port: 5001,
            strictPort: true,
        },
        server: {
            port: 5001,
            strictPort: true,
            origin: "http://0.0.0.0:5001",
            host: true,
            proxy: {
                // '^/weatherforecast': {
                //     target: 'https://localhost:5001/',
                //     secure: true
                // }
            },
            https: {
                key: fs.readFileSync(keyFilePath),
                cert: fs.readFileSync(certFilePath),
            }
        }
    };
})
