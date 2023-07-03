import { UrlParser } from '../types';

class UrlParser {
  parseEndpoint(url: string, endpoint: string) {
    let remEndpoint = url.replace(endpoint, '');
    if (remEndpoint.startsWith('/')) remEndpoint = remEndpoint.slice(1);
    return remEndpoint;
  }
}

export default UrlParser;
