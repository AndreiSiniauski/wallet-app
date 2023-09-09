import { useState } from "react";
import Web3 from "web3";
import { abi } from "./utils/contract/abiUSDT";
import { contract } from "./utils/contract/contractUSDT";
import { formatAddress } from "./utils/formatAddress";
import WalletConnectProvider from "@walletconnect/web3-provider";

const App = () => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [connected, setConnected] = useState(false);

  const connectMetaMask = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
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
            3
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

  const connectWalletConnect = async () => {
    try {
      const provider = new WalletConnectProvider({
        rpc: {
          56: "https://bsc-dataseed.binance.org/",
        },
      });

      await provider.enable();

      const web3 = new Web3(provider);

      const accounts = await web3.eth.getAccounts();

      await provider.disconnect();

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
        const formattedUsdtBalance = web3.utils.fromWei(usdtBalance, "ether");
        const roundedUsdtBalance = parseFloat(formattedUsdtBalance).toFixed(3);

        setBalance(roundedUsdtBalance);
        setConnected(true);
      } else {
        console.error("Не удалось подключить WalletConnect");
      }
    } catch (error) {
      console.error(error);
    }
    
  };

  return (
    <div className="modal-content">
      {connected ? (
        <div className="content">
          <p>Адрес кошелька: {address}</p>
          <p>Баланс: {balance} USDT</p>
          <button onClick={disconnectMetaMask}>Отключить MetaMask</button>
        </div>
      ) : (
        <>
          <button onClick={connectMetaMask}>Подключить MetaMask</button>
          <button onClick={connectWalletConnect}>Подключить WalletConnect</button>
        </>
      )}
    </div>
  );
};

export default App;
