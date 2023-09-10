import useConnectMetaMask from "./hooks/useConnectMetamask";

const App = () => {
  
  const {
    address,
    balance,
    connected,
    connectMetaMask,
    disconnectMetaMask
  } = useConnectMetaMask();

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
        </>
      )}
    </div>
  );
};

export default App;
