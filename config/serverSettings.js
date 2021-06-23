/**
 *
 *            Server specific settings
 *
 * *************************************************
 * * WARNING! Secrets should be read from env-vars *
 * *************************************************
 *
 */
const {
  getEnv,
  devDefaults,
  unpackKOPPSConfig,
  unpackRedisConfig,
  unpackNodeApiConfig
} = require('kth-node-configuration')
const { typeConversion } = require('kth-node-configuration/lib/utils')
const { safeGet } = require('safe-utils')

// DEFAULT SETTINGS used for dev, if you want to override these for you local environment, use env-vars in .env
const devPort = devDefaults(3000)
const devSsl = devDefaults(false)
const devUrl = devDefaults('http://localhost:' + devPort)
const devInnovationApi = devDefaults('http://localhost:3001/api/kursinfo?defaultTimeout=10000') // required=true&
const devKursplanApi = devDefaults('http://localhost:3001/api/kursplan?defaultTimeout=10000')
const devKoppsApi = devDefaults('https://api-r.referens.sys.kth.se/api/kopps/v2/?defaultTimeout=10000')
const devKursPmDataApi = devDefaults('http://localhost:3001/api/kurs-pm-data?defaultTimeout=10000')
const devSessionKey = devDefaults('kursinfo-web.sid')
const devSessionUseRedis = devDefaults(true)
const devRedis = devDefaults('redis://localhost:6379/')
const devRedisUG = devDefaults(
  'team-studam-ref-redis-193.redis.cache.windows.net:6380,password=password,ssl=True,abortConnect=False'
)
const devSsoBaseURL = devDefaults('https://login-r.referens.sys.kth.se')
// END DEFAULT SETTINGS

module.exports = {
  hostUrl: getEnv('SERVER_HOST_URL', devUrl),
  useSsl: safeGet(() => getEnv('SERVER_SSL', devSsl + '').toLowerCase() === 'true'),
  port: getEnv('SERVER_PORT', devPort),
  ssl: {
    // In development we don't have SSL feature enabled
    pfx: getEnv('SERVER_CERT_FILE', ''),
    passphrase: getEnv('SERVER_CERT_PASSPHRASE', '')
  },

  // API keys
  apiKey: {
    kursinfoApi: getEnv('API_KEY', devDefaults('123489')),
    kursplanApi: getEnv('KURSPLAN_API_KEY', devDefaults('5678')),
    kursPmDataApi: getEnv('KURS_PM_DATA_API_KEY', devDefaults('9876'))
    // koppsApi: unpackKOPPSConfig('KOPPS_URI', devKoppsApi)
  },

  nodeApi: {
    kursinfoApi: unpackNodeApiConfig('API_URI', devInnovationApi),
    kursplanApi: unpackNodeApiConfig('KURSPLAN_API_URI', devKursplanApi),
    kursPmDataApi: unpackNodeApiConfig('KURS_PM_DATA_API_URI', devKursPmDataApi)
  },

  koppsApi: unpackKOPPSConfig('KOPPS_URI', devKoppsApi),

  // Cortina
  blockApi: {
    blockUrl: getEnv('CM_HOST_URL', devDefaults('https://www-r.referens.sys.kth.se/cm/')) // Block API base URL
  },

  // Logging
  logging: {
    log: {
      level: getEnv('LOGGING_LEVEL', 'debug')
    },
    accessLog: {
      useAccessLog: getEnv('LOGGING_ACCESS_LOG', true)
    }
  },
  clientLogging: {
    level: 'debug'
  },
  cache: {
    koppsApi: {
      redis: unpackRedisConfig('REDIS_URI', devRedis),
      expireTime: getEnv('KOPPS_API_CACHE_EXPIRE_TIME', 60 * 60) // 60 minuteS
    },
    kursinfoApi: {
      redis: unpackRedisConfig('REDIS_URI', devRedis),
      expireTime: getEnv('KURSINFO_API_CACHE_EXPIRE_TIME', 2 * 60) // 2 * 60 s = 2 MINUTES
    },
    kursPmDataApi: {
      redis: unpackRedisConfig('REDIS_URI', devRedis),
      expireTime: getEnv('KURSPM_API_CACHE_EXPIRE_TIME', 2 * 60) // 2 * 60 s = 2 MINUTES
    },
    kursplanApi: {
      redis: unpackRedisConfig('REDIS_URI', devRedis),
      expireTime: getEnv('KURSPLAN_API_CACHE_EXPIRE_TIME', 60 * 60) // 60 minutes
    },
    cortinaBlock: {
      redis: unpackRedisConfig('REDIS_URI', devRedis)
    },
    ugRedis: {
      redis: unpackRedisConfig('UG_REDIS_URI', devRedisUG)
    }
  },
  redisServer: unpackRedisConfig('REDIS_URI', devRedis),

  // Session
  sessionSecret: getEnv('SESSION_SECRET', devDefaults('1234567890')),
  session: {
    key: getEnv('SESSION_KEY', devSessionKey),
    useRedis: safeGet(() => getEnv('SESSION_USE_REDIS', devSessionUseRedis) === 'true'),
    sessionOptions: {
      // do not set session secret here!!
      cookie: {
        secure: safeGet(() => getEnv('SESSION_SECURE_COOKIE', false) === 'true'),
        path: getEnv('SERVICE_PUBLISH', '/student/kurser/kurs'),
        sameSite: getEnv('SESSION_SAME_SITE_COOKIE', 'Lax')
      },
      proxy: safeGet(() => getEnv('SESSION_TRUST_PROXY', true) === 'true')
    },
    redisOptions: unpackRedisConfig('REDIS_URI', devRedis)
  },

  appInsights: {
    instrumentationKey: getEnv('APPINSIGHTS_INSTRUMENTATIONKEY')
  }
}
