export const openSocket = (url: string, name: string): Promise<WebSocket> => {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url, name);
    socket.onopen = () => resolve(socket);
    socket.onclose = () => {
      if (socket.readyState === WebSocket.OPEN) {
        reject('Connection closed');
      } else {
        reject('Error connecting');
      }
    };
  });
}
