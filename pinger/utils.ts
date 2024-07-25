import os from 'os';

function getIpsWithOpenPort(port:number) : string[]{
    return [`10.0.0.30:${port}`]
}

function getHostNameFromIP(ip: string) :string{
    return 'seb-zenbook'
}

function getIpsandHostName(port: number): Record<string, string> {
    const ip_host_name: Record<string, string> = {}
    getIpsWithOpenPort(port).forEach((ip) => {
        ip_host_name[ip] = getHostNameFromIP(ip)
    })
    return ip_host_name;
}


function getMachineCidr(){
  const interfaces = os.networkInterfaces();
  if ('Wi-Fi' in interfaces && interfaces['Wi-Fi'] !== undefined){
      for (const net_info of interfaces['Wi-Fi']){
        if(net_info.family== "IPv4"){
          return net_info.cidr;
        }
      }
  }
  return null;
}

console.log(getMachineCidr());

export default getMachineCidr;


export { getIpsWithOpenPort, getHostNameFromIP, getMachineCidr, getIpsandHostName}