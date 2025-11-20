// Nigerian mobile network prefixes
const networkPrefixes = {
  mtn: ['0803', '0806', '0703', '0706', '0813', '0816', '0810', '0814', '0903', '0906', '0913', '0916'],
  airtel: ['0802', '0808', '0708', '0812', '0701', '0902', '0907', '0901', '0912'],
  glo: ['0805', '0807', '0705', '0815', '0811', '0905', '0915'],
  '9mobile': ['0809', '0818', '0817', '0909', '0908']
};

export const detectNetwork = (phoneNumber: string): string | null => {
  // Remove any spaces or special characters
  const cleanedNumber = phoneNumber.replace(/\s+/g, '').replace(/\D/g, '');
  
  // Check if number is long enough to have a prefix
  if (cleanedNumber.length < 4) return null;
  
  // Get first 4 digits
  const prefix = cleanedNumber.substring(0, 4);
  
  // Check against all network prefixes
  for (const [network, prefixes] of Object.entries(networkPrefixes)) {
    if (prefixes.includes(prefix)) {
      return network;
    }
  }
  
  return null;
};
