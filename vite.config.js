import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [vue()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        define: {
            'import.meta.env.API_BASE_URL': JSON.stringify('http://localhost:8080/rrhhFrontBack/rrhhback/public/api/v1')
        }
    };
});
/*
 //'import.meta.env.API_BASE_URL': JSON.stringify('http://192.168.43.198/rrhhback/public/api/v1'),
            'import.meta.env.API_BASE_URL': JSON.stringify('http://asist.facebolsrl.com/public/api/v1')
           // 'import.meta.env.API_BASE_URL': JSON.stringify('http://192.168.0.30/rrhhback/public/api/v1'),
        
*/
