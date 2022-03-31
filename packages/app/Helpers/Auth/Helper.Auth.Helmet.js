function getHelmetDirectives() {
  const self = `'self'`;
  const unsafeInline = `'unsafe-inline'`;
  const scripts = [
    `https://apis.google.com`,
    (req, res) => `'nonce-${res.locals.cspNonce}'`,
  ];
  const styles = [`https://fonts.googleapis.com/`];
  const fonts = [`https://fonts.gstatic.com/`];
  const frames = [`accounts.google.com`];
  const images = [`https:`, `data:`];
  return {
    defaultSrc: [self, unsafeInline, ...scripts],
    scriptSrc: [self, unsafeInline, ...scripts],
    styleSrc: [self, unsafeInline, ...styles],
    fontSrc: [self, ...fonts],
    frameSrc: [self, ...frames],
    imgSrc: [self, ...images],
    objectSrc: [`'none'`],
    formAction: [self],
    baseUri: [`'none'`],
    connectSrc: [self],
  };
}

module.exports = { getHelmetDirectives };
