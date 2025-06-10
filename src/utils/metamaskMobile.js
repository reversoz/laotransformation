const METAMASK_DEEPLINK_BASE = 'https://metamask.app.link/dapp/';

export const isMetaMaskMobile = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /metamask/i.test(userAgent);
};

export const isMetaMaskInstalled = () => {
  return window.ethereum && window.ethereum.isMetaMask;
};

export const getMetaMaskDeepLink = (url) => {
  const currentUrl = window.location.href;
  return `${METAMASK_DEEPLINK_BASE}${encodeURIComponent(currentUrl)}`;
};

export const handleMobileWalletConnection = async () => {
  if (isMetaMaskMobile()) {
    // Already in MetaMask mobile browser
    return true;
  }

  if (!isMetaMaskInstalled()) {
    // Open MetaMask mobile app
    window.location.href = getMetaMaskDeepLink();
    return false;
  }

  return true;
}; 