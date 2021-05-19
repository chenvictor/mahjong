export const openSocket = (url: string, name: string): Promise<WebSocket> => {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url, name);
    socket.onopen = () => resolve(socket);
    socket.onclose = () => reject();
  });
}
