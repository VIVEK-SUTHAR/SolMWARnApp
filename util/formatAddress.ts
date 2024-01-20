function formatAddress(fullAddress: string) {
  // Keep the first 4 and last 4 characters, and insert "..." in the middle
  if (!fullAddress) {
    return "No address";
  }
  return (
    fullAddress.substring(0, 8) +
    '...' +
    fullAddress.substring(fullAddress.length - 8)
  );
}
export default formatAddress;
