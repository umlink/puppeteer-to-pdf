module.exports = {
    apps : [{
        name: 'pdf',
        script: 'index.js',
        args: '',
        instances: 3,
        autorestart: true,
        watch: true,
        max_memory_restart: '800M',
    }]
};
