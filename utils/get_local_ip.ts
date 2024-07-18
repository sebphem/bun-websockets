import os from 'os';

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
