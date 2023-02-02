// pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'nestjs-full-scaffold', // pm2 start ecosystem.config.js --only "nestjs-full-scaffold"
      error_file: '/tmp/pm2_nestjs-full-scaffold_err.log', // error file path (default to $HOME/.pm2/logs/XXXerr.log)
      out_file: '/tmp/pm2_nestjs-full-scaffold_out.log', // output file path (default to $HOME/.pm2/logs/XXXout.log)
      instances: 'max', // use 'max' or 1 2 3 4 ...
      exec_mode: 'cluster',
      script: './dist/apps/nestjs-full-scaffold/main.js',
      // cwd: "/var/www/",
      max_memory_restart: '2G', // your app will be restarted if it exceeds the amount of memory specified. human-friendly format : it can be “10M”, “100K”, “2G” and so on…
      //interpreter: "/usr/bin/python",
      watch: false,
      ignore_watch: ['[/\\]./', 'node_modules'],
      //env_production: { // pm2 restart process.json --env development
      //NODE_ENV: "production"
      //},
      //env: {
      //NODE_ENV: "development",
      //ID: 42,
      //}
      instance_var: 'INSTANCE_ID', // if you want to run a cronjob only on one cluster, you can check if (process.env.INSTANCE_ID === '0') {}
      kill_timeout: 1600 * 100, // By default, pm2 waits 1600ms before sending SIGKILL signal if the applications doesn’t exit itself. You can change this value, in ms
      wait_ready: true, // First, enable the ready signal in pm2 in your ecosystem.config.js:
      listen_timeout: 3000 * 100, // By default, after 3000ms, pm2 will consider your app ready. Change this value with the listen_timeout value.
      //pid_file: "", // pid file path (default to $HOME/.pm2/pid/app-pm_id.pid)
    },
  ],
};
