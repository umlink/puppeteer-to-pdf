module.exports = {
    apps : [{
        name: 'pdf',
        script: 'index.js',
        args: '',
        instances: 2,
        autorestart: true,
        watch: false,
        max_memory_restart: '2G',
    }]
};