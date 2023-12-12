export default () => {
  const { $apiClient } = useNuxtApp();

  return () => $apiClient;
};
