module.exports = {
    apps : [{
        name: 'pdf',
        script: 'src/index.js',
        args: '',
        instances: 3,
        autorestart: true,
        watch: true,
        max_memory_restart: '800M',
    }]
};
