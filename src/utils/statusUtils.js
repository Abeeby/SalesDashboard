export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'error';
    case 'pending':
      return 'warning';
    default:
      return 'default';
  }
};

export const getStatusLabel = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
}; 