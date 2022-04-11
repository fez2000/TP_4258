module.exports = {
  apps : [{
    name: 'JesusKing',
    script: './app/',
    cwd: 'npm run prod:server',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
//    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
//    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'huarloro236',
      host : '41.202.207.4',
      ref  : 'origin/fez2000',
      repo : 'git@github.com:fez2000/TP_4258.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
