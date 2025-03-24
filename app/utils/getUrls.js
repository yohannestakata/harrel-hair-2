export const getServerSideURL = () => {
  const url = process.env.SERVER_SIDE_URL;

  return url || '';
};
