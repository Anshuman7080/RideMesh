module.exports = {
  apps: [
    {
      name: 'rabbitmq-internal',
      script: 'rabbitmq-server', 
      exec_mode: 'fork',
      interpreter: 'none',    
      autorestart: true,
      max_memory_restart: '250M',
      env: {
        RABBITMQ_MNESIA_BASE: '/tmp/rabbitmq/mnesia',
        RABBITMQ_LOG_BASE: '/tmp/rabbitmq/log',
        RABBITMQ_PID_FILE: '/tmp/rabbitmq/rabbit.pid'
      }
    },
    {
      name: 'api-gateway',
      script: './api-gateway/src/server.js',
      max_memory_restart: '200M', 
      env: {
        ...process.env,
        NODE_ENV: 'production',
        PORT: 5000
      }
    },
    {
      name: 'auth-service',
      script: './auth-service/src/server.js',
      max_memory_restart: '200M', 
      env: {
        ...process.env,
        NODE_ENV: 'production',
        PORT: 5001
      }
    },
    {
      name: 'user-service',
      script: './user-service/src/server.js',
      max_memory_restart: '200M', 
      env: {
        ...process.env,
        NODE_ENV: 'production',
        PORT: 5002
      }
    },
    {
      name: 'driver-service',
      script: './driver-service/src/server.js',
      max_memory_restart: '200M', 
      env: {
        ...process.env,
        NODE_ENV: 'production',
        PORT: 5003
      }
    },
    {
      name: 'ride-service',
      script: './ride-service/src/server.js',
      max_memory_restart: '200M', 
      env: {
        ...process.env,
        NODE_ENV: 'production',
        PORT: 5004
      }
    },
    {
      name: 'notification-service',
      script: './notification-service/src/server.js',
      max_memory_restart: '200M', 
      env: {
        ...process.env,
        NODE_ENV: 'production',
        PORT: 5005
      }
    }
  ]
};