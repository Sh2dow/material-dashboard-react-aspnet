import basicSsl from '@vitejs/plugin-basic-ssl'

export default {
    server: {
        host: true,
        port: 5001
    },
    plugins: [
        basicSsl()
    ]
}