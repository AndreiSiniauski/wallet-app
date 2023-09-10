import { useState } from "react";
import Web3 from "web3";
import { formatAddress } from "../utils/formatAddress";
import { abi } from "../utils/contract/abiUSDT";
import { contract } from "../utils/contract/contractUSDT";

export default function useConnectMetaMask() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [connected, setConnected] = useState(false);

  const connectMetaMask = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        await checkNetwork();

        const web3 = new Web3("https://bsc-dataseed.binance.org/");

        const accounts = await window.ethereum
          .request({
            method: "wallet_requestPermissions",
            params: [
              {
                eth_accounts: {},
              },
            ],
          })
          .then(() =>
            window.ethereum.request({
              method: "eth_requestAccounts",
            })
          );

        if (
          Array.isArray(accounts) &&
          accounts.length > 0 &&
          typeof accounts[0] === "string"
        ) {
          const selectedAddress = accounts[0];
          setAddress(formatAddress(selectedAddress));

          const usdtContract = new web3.eth.Contract(abi, contract);
          const usdtBalance = await usdtContract.methods
            .balanceOf(selectedAddress)
            .call();
          const formattedUsdtBalance = web3.utils.fromWei(
            usdtBalance,
            "ether"
          );
          const roundedUsdtBalance = parseFloat(formattedUsdtBalance).toFixed(
            2
          );

          setBalance(roundedUsdtBalance);
          setConnected(true);
        } else {
          console.error("MetaMask не предоставил действительный адрес");
        }
      } else {
        console.error("MetaMask не доступен");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const disconnectMetaMask = async () => {
    setConnected(false);
  };

  const requestSwitchToBscNetwork = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const chainId = "0x38";
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }],
        });

      } else {
        console.error("MetaMask не доступен");
      }
    } catch (error) {
      console.error("Ошибка при запросе смены сети:", error);
    }
  };

  const checkNetwork = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        if (chainId !== "0x38") {
          await requestSwitchToBscNetwork();
        }
      } else {
        console.error("MetaMask не доступен");
      }
    } catch (error) {
      console.error("Ошибка при проверке сети:", error);
    }
  };


  return { address, balance, connected, connectMetaMask, disconnectMetaMask };
}
