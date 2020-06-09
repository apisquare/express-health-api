const chai = require('chai');
const expect = chai.expect;
const { systemInfo } = require('../src/utils/imports');
const { collectSystemInformation, memoryCache } = require('../src/collectSystemInformation');

describe("should collect system information provide accurate system metrics", () => {

  describe("should return accurate results if there is no errors", () => {
    beforeEach(() => {
      // clear memoryCache
      memoryCache.osInfo = null
      memoryCache.cpuInfo = null
      memoryCache.cpuSpeed = null
      memoryCache.totalMemory = null
      
      // Mock systemInformation methods to test with mock responses
      systemInfo.time = () => ({ uptime: 1000 });
      systemInfo.osInfo = () => ({ 
        platform: "Linux", 
        distro: "Ubuntu", 
        release: "18", 
        arch: "64" 
      })
      systemInfo.cpu = () => ({ 
        cores: 2, 
        physicalCores: 1, 
        processors: 1, 
        speedmin: 0.5, 
        speedmax: 1.5
      })
      systemInfo.cpuCurrentspeed = () => ({ 
        avg: 1.12, 
        cores: [0.9, 1.3]
      })
      systemInfo.mem = () => ({
        total: 1073741824,
        active: 734003200
      })
      systemInfo.services = (commaSepServices) => {
        const res = []
        const serviceNames = commaSepServices.split(",");
        serviceNames.forEach(name => {
          res.push({
            name,
            running: true,
            pids: [1],
            pcpu: 1.23456,
            pmem: 0.7896
          })
        });
        return res;
      }    
    })

    it("should return accurate common information", async () => {
      const res = await collectSystemInformation({ common: true })
      expect(res).haveOwnProperty('common')
      expect(res.common).haveOwnProperty('upTime')
      expect(res.common.upTime).to.equal(1000)
      expect(res.common.upTimeUnit).to.equal('s')
      expect(res.common).haveOwnProperty('os')
      expect(typeof res.common.os).equal("object")
      expect(res.common.os.platform).to.equal("Linux")
      expect(res.common.os.distro).to.equal("Ubuntu")
      expect(res.common.os.release).to.equal("18")
      expect(res.common.os.arch).to.equal("64")

      expect(res).not.haveOwnProperty('cpu')
      expect(res).not.haveOwnProperty('memory')
      expect(res).not.haveOwnProperty('services')
    })

    it("should return accurate cpu information", async () => {
      const res = await collectSystemInformation({ cpu: true })
      expect(res).haveOwnProperty('cpu')
      expect(res.cpu.cores).to.equal(2)
      expect(res.cpu.physicalCores).to.equal(1)
      expect(res.cpu.processors).to.equal(1)
      expect(res.cpu).haveOwnProperty('speed')
      expect(typeof res.cpu.speed).equal("object")
      expect(res.cpu.speed.min).to.equal(0.5)
      expect(res.cpu.speed.max).to.equal(1.5)
      expect(res.cpu.speed.avg).to.equal(1.12)
      expect(Array.isArray(res.cpu.coresSpeed)).true
      expect(res.cpu.coresSpeed[0]).to.equal(0.9)
      expect(res.cpu.coresSpeed[1]).to.equal(1.3)

      expect(res).not.haveOwnProperty('common')
      expect(res).not.haveOwnProperty('memory')
      expect(res).not.haveOwnProperty('services')
    })

    it("should return accurate memory information", async () => {
      const res = await collectSystemInformation({ memory: true })
      expect(res).haveOwnProperty('memory')
      expect(res.memory.unit).to.equal("GB")
      expect(res.memory.total).to.equal(1)
      expect(res.memory.active).to.equal(0.68)
    
      expect(res).not.haveOwnProperty('common')
      expect(res).not.haveOwnProperty('cpu')
      expect(res).not.haveOwnProperty('services')
    })

    it("should return accurate services information", async () => {
      const res = await collectSystemInformation({ services: "abc,cde" })
      console.log(res)
      expect(res).haveOwnProperty('services')
      expect(res.services).haveOwnProperty("abc")
      expect(res.services.abc.running).equal(true)
      expect(res.services.abc.totalProcesses).equal(1)
      expect(res.services.abc.cpu).equal(1.23)
      expect(res.services.abc.memory).equal(0.79)
      expect(res.services).haveOwnProperty("cde")

      expect(res).not.haveOwnProperty('common')
      expect(res).not.haveOwnProperty('cpu')
      expect(res).not.haveOwnProperty('memory')
    })
  })

  describe("should return error details if the metrics encountered any errors", () => {
    const testError = new Error('Test error')
    beforeEach(() => {
      // clear memoryCache
      memoryCache.osInfo = null
      memoryCache.cpuInfo = null
      memoryCache.cpuSpeed = null
      memoryCache.totalMemory = null

      // Mock systemInformation methods to throw errors
      systemInfo.osInfo = () => { throw testError }
      systemInfo.cpu = () => { throw testError }
      systemInfo.mem = () => { throw testError }
      systemInfo.services = () => { throw testError }
    })
    it("should return proper error details if common metrics collection failed", async () => {
      const res = await collectSystemInformation({ common: true })
      expect(res).haveOwnProperty('common')
      expect(res.common.upTime).to.be.undefined;
      expect(res.common.upTimeUnit).to.be.undefined;
      expect(res.common.os).to.be.undefined;
      expect(res.common).haveOwnProperty('error')
      expect(res.common.error).to.equal(testError);
    
      expect(res).not.haveOwnProperty('cpu')
      expect(res).not.haveOwnProperty('memory')
      expect(res).not.haveOwnProperty('services')
    })

    it("should return proper error details if cpu metrics collection failed", async () => {
      const res = await collectSystemInformation({ cpu: true })
      expect(res).haveOwnProperty('cpu')
      expect(res.cpu.cores).to.be.undefined;
      expect(res.cpu.physicalCores).to.be.undefined;
      expect(res.cpu.cpuSpeed).to.be.undefined;
      expect(res.cpu).haveOwnProperty('error')
      expect(res.cpu.error).to.equal(testError);
    
      expect(res).not.haveOwnProperty('common')
      expect(res).not.haveOwnProperty('memory')
      expect(res).not.haveOwnProperty('services')
    })

    it("should return proper error details if memory metrics collection failed", async () => {
      const res = await collectSystemInformation({ memory: true })
      expect(res).haveOwnProperty('memory')
      expect(res.memory.unit).to.be.undefined;
      expect(res.memory.total).to.be.undefined;
      expect(res.memory.active).to.be.undefined;
      expect(res.memory).haveOwnProperty('error')
      expect(res.memory.error).to.equal(testError);
    
      expect(res).not.haveOwnProperty('common')
      expect(res).not.haveOwnProperty('cpu')
      expect(res).not.haveOwnProperty('services')
    })

    it("should return proper error details if service metrics collection failed", async () => {
      const res = await collectSystemInformation({ services: "abc,cde" })
      expect(res).haveOwnProperty('services')
      expect(res.services.abc).to.be.undefined;
      expect(res.services.cde).to.be.undefined;
      expect(res.services).haveOwnProperty('error')
      expect(res.services.error).to.equal(testError);
    
      expect(res).not.haveOwnProperty('common')
      expect(res).not.haveOwnProperty('cpu')
      expect(res).not.haveOwnProperty('memory')
    })
  })
});


