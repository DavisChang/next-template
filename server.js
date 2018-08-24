// Polyfill Node with `Intl` that has data for all locales.
// See: https://formatjs.io/guides/runtime-environments/#server
const IntlPolyfill = require('intl')
Intl.NumberFormat = IntlPolyfill.NumberFormat
Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat

const { createServer } = require('http')
const { readFileSync } = require('fs')
const { basename } = require('path')
const { parse } = require('url')
const next = require('next')
const accepts = require('accepts')
const glob = require('glob')

const dev = process.env.NODE_ENV !== 'production'
const port = (process.env.PORT || 4000);
const app = next({ dev })
const handle = app.getRequestHandler()

// Get the supported languages by looking for translations in the `lang/` dir.
const languages = glob.sync('./lang/*.json').map((f) => basename(f, '.json'))
// We need to expose React Intl's locale data on the request for the user's
// locale. This function will also cache the scripts by lang in memory.
const localeDataCache = new Map()
const getLocaleDataScript = (locale) => {
  const lang = locale.split('-')[0]
  if (!localeDataCache.has(lang)) {
    const localeDataFile = require.resolve(`react-intl/locale-data/${lang}`)
    const localeDataScript = readFileSync(localeDataFile, 'utf8')
    localeDataCache.set(lang, localeDataScript)
  }
  return localeDataCache.get(lang)
}

// We need to load and expose the translations on the request for the user's
// locale. These will only be used in production, in dev the `defaultMessage` in
// each message description in the source code will be used.
const getMessages = (locale) => {
  return require(`./lang/${locale}.json`)
}


console.log('languages:', languages);

app.prepare().then(() => {
  createServer((req, res) => {
    const accept = accepts(req)
    const locale = accept.language(languages)
    console.log('locale:', locale);
    req.locale = locale
    req.localeDataScript = getLocaleDataScript(locale)
    req.messages = getMessages(locale)

    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl
    handle(req, res, parsedUrl)
  }).listen(port, err => {
    if (err) throw err
    console.log('> Ready on http://localhost:' + port)
  })
})
