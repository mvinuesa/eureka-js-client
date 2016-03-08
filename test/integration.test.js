import Eureka from '../src/index';
import { expect } from 'chai';

describe('Integration Test', () => {
  let client;
  let config;
  before((done) => {
    config = {
      instance: {
        app: 'jqservice',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        port: 8080,
        vipAddress: 'jq.test.something.com',
        dataCenterInfo: {
          name: 'MyOwn',
        },
      },
      eureka: {
        heartbeatInterval: 30000,
        registryFetchInterval: 5000,
        fetchRegistry: true,
        servicePath: '/eureka/v2/apps/',
        ssl: false,
        useDns: false,
        fetchMetadata: true,
        host: 'localhost',
        port: 8080,
      },
    };
    client = new Eureka(config);
    client.start(() => {
      console.log('Sleeping 60 seconds for registry to refresh...');
      setTimeout(done, 60000);
    });
  });

  it('should be able to get instance by the app id', () => {
    const instances = client.getInstancesByAppId(config.instance.app);
    expect(instances.length).to.equal(1);
  });

  it('should be able to get instance by the vipAddress', () => {
    const instances = client.getInstancesByVipAddress(config.instance.vipAddress);
    expect(instances.length).to.equal(1);
  });

  after((done) => {
    client.stop(done);
  });
});
