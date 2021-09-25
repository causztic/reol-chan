const WHITELISTED_ROLES = [
  'red', 'green', 'blue', 'purple',
  'scandinavia', 'us central', 'us east', 'us west', 'uk', 'europe', 'germany',
  'sea', 'japan', 'australia', 'south america', 'india', 'south asia',
];

export const isWhiteListedRole = (roleName: string): boolean => 
  WHITELISTED_ROLES.find((role) => role === roleName.toLowerCase()) !== undefined;